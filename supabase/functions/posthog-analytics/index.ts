import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check - admin only
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const userId = claimsData.claims.sub;

    // Check admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders });
    }

    const POSTHOG_API_KEY = Deno.env.get('POSTHOG_PERSONAL_API_KEY');
    const POSTHOG_PROJECT_KEY = Deno.env.get('POSTHOG_PROJECT_API_KEY');
    if (!POSTHOG_API_KEY) {
      return new Response(JSON.stringify({ error: 'PostHog API key not configured' }), { status: 500, headers: corsHeaders });
    }

    const POSTHOG_HOST = 'https://us.i.posthog.com';
    
    // We need the project_id from PostHog. We'll get it from the /api/projects endpoint.
    const projectsRes = await fetch(`${POSTHOG_HOST}/api/projects/`, {
      headers: { Authorization: `Bearer ${POSTHOG_API_KEY}` },
    });
    const projectsData = await projectsRes.json();
    
    if (!projectsRes.ok || !projectsData.results?.length) {
      return new Response(JSON.stringify({ error: 'Could not fetch PostHog projects', details: projectsData }), { 
        status: 500, headers: corsHeaders 
      });
    }

    const projectId = projectsData.results[0].id;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch multiple insights in parallel
    const [
      uniqueUsersRes,
      pageviewsRes,
      topPagesRes,
      dailyActiveRes,
      topEventsRes,
      topCountriesRes,
      topBrowsersRes,
      topDevicesRes,
      topReferrersRes,
    ] = await Promise.all([
      // 1. Unique users last 30 days
      queryPostHog(POSTHOG_HOST, projectId, POSTHOG_API_KEY, {
        insight: 'TRENDS',
        events: [{ id: '$pageview', math: 'dau' }],
        date_from: '-30d',
        date_to: 'now',
      }),
      // 2. Total pageviews last 30 days
      queryPostHog(POSTHOG_HOST, projectId, POSTHOG_API_KEY, {
        insight: 'TRENDS',
        events: [{ id: '$pageview', math: 'total' }],
        date_from: '-30d',
        date_to: 'now',
      }),
      // 3. Top pages (breakdown by $current_url)
      queryPostHog(POSTHOG_HOST, projectId, POSTHOG_API_KEY, {
        insight: 'TRENDS',
        events: [{ id: '$pageview', math: 'total' }],
        breakdown: '$current_url',
        breakdown_type: 'event',
        date_from: '-30d',
        date_to: 'now',
      }),
      // 4. Daily active users trend
      queryPostHog(POSTHOG_HOST, projectId, POSTHOG_API_KEY, {
        insight: 'TRENDS',
        events: [{ id: '$pageview', math: 'dau' }],
        date_from: '-30d',
        date_to: 'now',
        interval: 'day',
      }),
      // 5. Top events (autocapture + custom)
      queryPostHog(POSTHOG_HOST, projectId, POSTHOG_API_KEY, {
        insight: 'TRENDS',
        events: [
          { id: '$pageview', math: 'total' },
          { id: '$autocapture', math: 'total' },
          { id: '$pageleave', math: 'total' },
        ],
        date_from: '-30d',
        date_to: 'now',
      }),
      // 6. Top countries
      queryPostHog(POSTHOG_HOST, projectId, POSTHOG_API_KEY, {
        insight: 'TRENDS',
        events: [{ id: '$pageview', math: 'dau' }],
        breakdown: '$geoip_country_name',
        breakdown_type: 'person',
        date_from: '-30d',
        date_to: 'now',
      }),
      // 7. Top browsers
      queryPostHog(POSTHOG_HOST, projectId, POSTHOG_API_KEY, {
        insight: 'TRENDS',
        events: [{ id: '$pageview', math: 'dau' }],
        breakdown: '$browser',
        breakdown_type: 'person',
        date_from: '-30d',
        date_to: 'now',
      }),
      // 8. Top devices
      queryPostHog(POSTHOG_HOST, projectId, POSTHOG_API_KEY, {
        insight: 'TRENDS',
        events: [{ id: '$pageview', math: 'dau' }],
        breakdown: '$device_type',
        breakdown_type: 'person',
        date_from: '-30d',
        date_to: 'now',
      }),
      // 9. Top referrers
      queryPostHog(POSTHOG_HOST, projectId, POSTHOG_API_KEY, {
        insight: 'TRENDS',
        events: [{ id: '$pageview', math: 'total' }],
        breakdown: '$referring_domain',
        breakdown_type: 'event',
        date_from: '-30d',
        date_to: 'now',
      }),
    ]);

    // Process results
    const uniqueUsersTrend = extractTrendData(uniqueUsersRes);
    const pageviewsTrend = extractTrendData(pageviewsRes);
    const dailyActiveTrend = extractDailyTrend(dailyActiveRes);
    
    const topPages = extractBreakdownTop(topPagesRes, 10);
    const topCountries = extractBreakdownTop(topCountriesRes, 10);
    const topBrowsers = extractBreakdownTop(topBrowsersRes, 10);
    const topDevices = extractBreakdownTop(topDevicesRes, 10);
    const topReferrers = extractBreakdownTop(topReferrersRes, 10).filter(r => r.label && r.label !== '$direct');

    // Event totals
    const eventTotals = (topEventsRes?.results || []).map((r: any) => ({
      event: r.label || r.action?.id || 'unknown',
      count: (r.data || []).reduce((s: number, v: number) => s + v, 0),
    }));

    const totalUniqueUsers = uniqueUsersTrend.total;
    const totalPageviews = pageviewsTrend.total;

    const response = {
      summary: {
        uniqueUsers30d: totalUniqueUsers,
        totalPageviews30d: totalPageviews,
        avgPageviewsPerUser: totalUniqueUsers > 0 ? Math.round(totalPageviews / totalUniqueUsers) : 0,
      },
      dailyActiveUsers: dailyActiveTrend,
      topPages,
      topCountries,
      topBrowsers,
      topDevices,
      topReferrers,
      eventTotals,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('PostHog analytics error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

async function queryPostHog(host: string, projectId: number, apiKey: string, query: any) {
  const url = `${host}/api/projects/${projectId}/insights/trend/`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`PostHog query failed [${res.status}]:`, text);
    return { results: [] };
  }
  return await res.json();
}

function extractTrendData(data: any) {
  const results = data?.results || [];
  if (results.length === 0) return { total: 0, data: [] };
  const series = results[0];
  const total = (series.data || []).reduce((s: number, v: number) => s + v, 0);
  return { total, data: series.data || [] };
}

function extractDailyTrend(data: any) {
  const results = data?.results || [];
  if (results.length === 0) return [];
  const series = results[0];
  const labels = series.labels || series.days || [];
  const values = series.data || [];
  return labels.map((label: string, i: number) => ({
    date: label,
    value: values[i] || 0,
  }));
}

function extractBreakdownTop(data: any, limit: number) {
  const results = data?.results || [];
  const items = results.map((r: any) => ({
    label: r.breakdown_value || r.label || 'unknown',
    count: (r.data || []).reduce((s: number, v: number) => s + v, 0),
  }));
  items.sort((a: any, b: any) => b.count - a.count);
  return items.slice(0, limit);
}
