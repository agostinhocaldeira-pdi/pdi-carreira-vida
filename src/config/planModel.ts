/**
 * Plan Model Configuration
 * 
 * Controls the active business model for the application.
 * 
 * - 'vip2026': Promotional model (until Dec 2026)
 *   → Free registration (no credit card required)
 *   → Full access to all tools (no trial expiration)
 *   → PDI Smart (Jornada) is free
 *   → AI usage costs R$4.99 per use (instead of R$10)
 *   → Desafio 30 Dias is accessible to all
 * 
 * - 'paid': Standard paid model
 *   → Requires payment before signup (R$67/year)
 *   → 30-day trial for new users, then locks
 *   → PDI Smart costs R$47
 *   → AI usage costs R$10 per use
 *   → Desafio 30 Dias requires Black plan (R$297/year)
 * 
 * To revert to paid model, change this value to 'paid'.
 * Command: "retomar modelo de cobrança"
 */
export const PLAN_MODEL = 'vip2026' as 'vip2026' | 'paid';
export type PlanModel = typeof PLAN_MODEL;

// AI usage price per model
export const AI_USAGE_PRICE = PLAN_MODEL === 'vip2026' ? 'R$ 4,99' : 'R$ 10,00';
export const AI_USAGE_PRICE_CENTS = PLAN_MODEL === 'vip2026' ? 499 : 1000;

// Stripe price IDs for AI usage
export const AI_USAGE_STRIPE_PRICE_ID = PLAN_MODEL === 'vip2026' 
  ? 'price_1T6sA73aJLvyiewRDhtqH2Zf'  // R$4.99 VIP2026
  : 'price_1Sjocq3aJLvyiewR9a35YpM8';  // R$10.00 original

// SMART AI Stripe price ID (used in create-smart-payment)
export const SMART_AI_STRIPE_PRICE_ID = PLAN_MODEL === 'vip2026'
  ? 'price_1T6sA73aJLvyiewRDhtqH2Zf'  // R$4.99 VIP2026
  : 'price_1Sjlb2KNmFxHHoXqs9HDqJmO';  // R$1.00 original

// Whether trial expiration should block access
export const TRIAL_BLOCKS_ACCESS = PLAN_MODEL === 'paid';

// Whether PDI Smart requires payment
export const PDISMART_REQUIRES_PAYMENT = PLAN_MODEL === 'paid';

// Whether Desafio 30 Dias requires Black plan
export const DESAFIO_REQUIRES_BLACK = PLAN_MODEL === 'paid';

// Plan name displayed to users
export const FREE_PLAN_NAME = PLAN_MODEL === 'vip2026' ? 'VIP 2026' : 'Teste Gratuito';
