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
    if (!POSTHOG_API_KEY) {
      return new Response(JSON.stringify({ error: 'PostHog API key not configured' }), { status: 500, headers: corsHeaders });
    }

    const POSTHOG_HOST = 'https://us.i.posthog.com';

    // Get project ID
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

    // Use HogQL query API instead of legacy insights
    const [
      uniqueUsersRes,
      pageviewsRes,
      topPagesRes,
      dailyActiveRes,
      topCountriesRes,
      topBrowsersRes,
      topDevicesRes,
      topReferrersRes,
    ] = await Promise.all([
      // Unique users last 30 days
      hogqlQuery(POSTHOG_HOST, projectId, POSTHOG_API_KEY,
        `SELECT count(DISTINCT person_id) as cnt FROM events WHERE event = '$pageview' AND timestamp > now() - interval 30 day`
      ),
      // Total pageviews last 30 days
      hogqlQuery(POSTHOG_HOST, projectId, POSTHOG_API_KEY,
        `SELECT count() as cnt FROM events WHERE event = '$pageview' AND timestamp > now() - interval 30 day`
      ),
      // Top pages
      hogqlQuery(POSTHOG_HOST, projectId, POSTHOG_API_KEY,
        `SELECT properties.$current_url as url, count() as cnt FROM events WHERE event = '$pageview' AND timestamp > now() - interval 30 day GROUP BY url ORDER BY cnt DESC LIMIT 10`
      ),
      // Daily active users
      hogqlQuery(POSTHOG_HOST, projectId, POSTHOG_API_KEY,
        `SELECT toDate(timestamp) as day, count(DISTINCT person_id) as cnt FROM events WHERE event = '$pageview' AND timestamp > now() - interval 30 day GROUP BY day ORDER BY day`
      ),
      // Top countries
      hogqlQuery(POSTHOG_HOST, projectId, POSTHOG_API_KEY,
        `SELECT properties.$geoip_country_name as country, count(DISTINCT person_id) as cnt FROM events WHERE event = '$pageview' AND timestamp > now() - interval 30 day AND country != '' GROUP BY country ORDER BY cnt DESC LIMIT 10`
      ),
      // Top browsers
      hogqlQuery(POSTHOG_HOST, projectId, POSTHOG_API_KEY,
        `SELECT properties.$browser as browser, count(DISTINCT person_id) as cnt FROM events WHERE event = '$pageview' AND timestamp > now() - interval 30 day AND browser != '' GROUP BY browser ORDER BY cnt DESC LIMIT 10`
      ),
      // Top devices
      hogqlQuery(POSTHOG_HOST, projectId, POSTHOG_API_KEY,
        `SELECT properties.$device_type as device, count(DISTINCT person_id) as cnt FROM events WHERE event = '$pageview' AND timestamp > now() - interval 30 day AND device != '' GROUP BY device ORDER BY cnt DESC LIMIT 10`
      ),
      // Top referrers
      hogqlQuery(POSTHOG_HOST, projectId, POSTHOG_API_KEY,
        `SELECT properties.$referring_domain as ref, count() as cnt FROM events WHERE event = '$pageview' AND timestamp > now() - interval 30 day AND ref != '' AND ref != '$direct' GROUP BY ref ORDER BY cnt DESC LIMIT 10`
      ),
    ]);

    // Extract scalar values
    const totalUniqueUsers = extractScalar(uniqueUsersRes);
    const totalPageviews = extractScalar(pageviewsRes);

    // Extract lists
    const topPages = extractPairs(topPagesRes);
    const dailyActiveUsers = extractDayValues(dailyActiveRes);
    const topCountries = extractPairs(topCountriesRes);
    const topBrowsers = extractPairs(topBrowsersRes);
    const topDevices = extractPairs(topDevicesRes);
    const topReferrers = extractPairs(topReferrersRes);

    const response = {
      summary: {
        uniqueUsers30d: totalUniqueUsers,
        totalPageviews30d: totalPageviews,
        avgPageviewsPerUser: totalUniqueUsers > 0 ? Math.round(totalPageviews / totalUniqueUsers) : 0,
      },
      dailyActiveUsers,
      topPages,
      topCountries,
      topBrowsers,
      topDevices,
      topReferrers,
      eventTotals: [],
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

async function hogqlQuery(host: string, projectId: number, apiKey: string, query: string) {
  const url = `${host}/api/projects/${projectId}/query/`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {
        kind: 'HogQLQuery',
        query,
      },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`HogQL query failed [${res.status}]:`, text);
    return { results: [], columns: [] };
  }
  return await res.json();
}

function extractScalar(data: any): number {
  const results = data?.results || [];
  if (results.length === 0) return 0;
  return Number(results[0][0]) || 0;
}

function extractPairs(data: any): { label: string; count: number }[] {
  const results = data?.results || [];
  return results.map((row: any[]) => ({
    label: String(row[0] || 'unknown'),
    count: Number(row[1]) || 0,
  }));
}

function extractDayValues(data: any): { date: string; value: number }[] {
  const results = data?.results || [];
  return results.map((row: any[]) => ({
    date: String(row[0]),
    value: Number(row[1]) || 0,
  }));
}
