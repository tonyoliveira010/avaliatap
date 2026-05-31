// ============================================================================
// Preço padrão por tambor (não depende mais do tipo de material)
// 1–2 tambores  → R$ 80 / diária cada
// 3–4 tambores  → R$ 50 / diária cada
// 5+  tambores  → R$ 25 / diária cada
// ============================================================================
const DAILY_TIER_1 = 80; // 1–2 tambores
const DAILY_TIER_3 = 50; // a partir de 3
const DAILY_TIER_5 = 25; // acima de 4

// Frete por distância: R$ 90 num raio de até 20 km (cobre retirada + descarte),
// e R$ 5 por km adicional além do raio.
const FREIGHT_BASE = 90;
const FREIGHT_RADIUS_KM = 20;
const FREIGHT_PER_KM = 5;

/** Taxa de manuseio rápido — locações de 1 a 3 dias (logística ágil). */
const RAPID_HANDLING_FEE = 105;

const PIX_DISCOUNT = 0.2;
/** Desconto de fidelidade para clientes recorrentes. */
const LOYALTY_DISCOUNT = 0.05;

export interface PricingInput {
  qty: number;
  days: number;
  /** Distância estimada em km até a obra (mock por enquanto). */
  distanceKm?: number;
  /** Cliente fidelizado/recorrente ganha desconto extra. */
  loyalty?: boolean;
}

export interface PricingResult {
  /** Diária por tambor já no tier de volume atual */
  daily: number;
  /** Diária do próximo tier (incentivo) ou null se já no melhor */
  nextTierDaily: number | null;
  /** Quantos tambores faltam para o próximo tier ou null */
  drumsToNextTier: number | null;
  subtotal: number;
  logistics: number;
  /** Distância usada no cálculo do frete */
  distanceKm: number;
  handlingFee: number;
  /** Desconto semanal (>=7 dias) */
  weeklyDiscount: number;
  /** Valor do desconto de fidelidade em R$ */
  loyaltyDiscountValue: number;
  total: number;
  /** Total com 20% off PIX */
  pixTotal: number;
}

/** Diária por tambor conforme o volume contratado. */
export function dailyPerDrum(qty: number): number {
  if (qty >= 5) return DAILY_TIER_5;
  if (qty >= 3) return DAILY_TIER_3;
  return DAILY_TIER_1;
}

/** Frete baseado na distância: base no raio + adicional por km. */
export function calcFreight(distanceKm: number): number {
  const extra = Math.max(0, distanceKm - FREIGHT_RADIUS_KM);
  return Math.round(FREIGHT_BASE + extra * FREIGHT_PER_KM);
}

export function calcPricing({ qty, days, distanceKm = 12, loyalty = false }: PricingInput): PricingResult {
  const daily = dailyPerDrum(qty);

  // Próximo tier (incentivo a contratar mais)
  let nextTierDaily: number | null = null;
  let drumsToNextTier: number | null = null;
  if (qty < 3) {
    nextTierDaily = DAILY_TIER_3;
    drumsToNextTier = 3 - qty;
  } else if (qty < 5) {
    nextTierDaily = DAILY_TIER_5;
    drumsToNextTier = 5 - qty;
  }

  // Desconto semanal (a partir de 7 dias)
  let weeklyDiscount = 0;
  if (days >= 14) weeklyDiscount = 0.12;
  else if (days >= 7) weeklyDiscount = 0.08;

  const rawSubtotal = daily * days * qty;
  const subtotal = Math.round(rawSubtotal * (1 - weeklyDiscount));

  const logistics = calcFreight(distanceKm);

  // Taxa de manuseio rápido para 1–3 dias
  const handlingFee = days <= 3 ? RAPID_HANDLING_FEE : 0;

  const beforeLoyalty = subtotal + logistics + handlingFee;
  const loyaltyDiscountValue = loyalty ? Math.round(beforeLoyalty * LOYALTY_DISCOUNT) : 0;
  const total = beforeLoyalty - loyaltyDiscountValue;
  const pixTotal = Math.round(total * (1 - PIX_DISCOUNT));

  return {
    daily,
    nextTierDaily,
    drumsToNextTier,
    subtotal,
    logistics,
    distanceKm,
    handlingFee,
    weeklyDiscount,
    loyaltyDiscountValue,
    total,
    pixTotal,
  };
}

export const PRICING_CONSTANTS = {
  DAILY_TIER_1,
  DAILY_TIER_3,
  DAILY_TIER_5,
  FREIGHT_BASE,
  FREIGHT_RADIUS_KM,
  FREIGHT_PER_KM,
  RAPID_HANDLING_FEE,
  PIX_DISCOUNT,
  LOYALTY_DISCOUNT,
};
