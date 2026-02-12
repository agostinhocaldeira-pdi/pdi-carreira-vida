import posthog from 'posthog-js';

// PostHog Project API Key is public (like Stripe publishable key)
// It's safe to include in client-side code
const POSTHOG_KEY = 'phc_Bp44Cu5h1uLDiOP0YQbkBmPdxDm6qqq6MjfaX4jL2kv';
const POSTHOG_HOST = 'https://us.i.posthog.com';

let initialized = false;

export const initPostHog = () => {
  if (initialized || !POSTHOG_KEY) return;
  
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    persistence: 'localStorage+cookie',
    disable_session_recording: true, // free plan
  });
  
  initialized = true;
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (!initialized) return;
  posthog.identify(userId, properties);
};

export const resetPostHog = () => {
  if (!initialized) return;
  posthog.reset();
};

export { posthog };
