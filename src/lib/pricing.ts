import { workTypes, type WorkTypeId } from "./work-types";
import { getMaterialMultiplier } from "./materials";

const DAILY_BASE = 80;
const FREIGHT_BASE = 60;
const FREIGHT_EXTRA_PER_UNIT = 15;
const GARANTIA_PER_UNIT = 100;
/** Taxa de manuseio para locações curtas (1–3 dias), por tambor */
const SHORT_HANDLING_FEE_PER_UNIT = 35;
const PIX_DISCOUNT = 0.2;

export interface PricingInput {
  qty: number;
  days: number;
  workType?: WorkTypeId | null;
  /** Material descartado — afeta a diária */
  material?: string;
}

export interface PricingResult {
  daily: number;
  subtotal: number;
  logistics: number;
  handlingFee: number;
  /** Garantia Tambor (antes "caução") */
  garantia: number;
  /** Garantia é cobrada no ato? (não se for grande volume) */
  garantiaChargedNow: boolean;
  total: number;
  /** Total com 20% off PIX — aplicável também a grandes volumes */
  pixTotal: number;
  /** Valor pago antecipado como Garantia ao escolher pagamento presencial.
   *  Este valor é abatido do total no ato da entrega. */
  inPersonReserve: number;
  /** Desconto progressivo de conjunto */
  conjuntoDiscount: number;
  /** Desconto semanal (>=7 dias) */
  weeklyDiscount: number;
  /** Multiplicador do material aplicado */
  materialMultiplier: number;
}

export function calcPricing({ qty, days, workType, material }: PricingInput): PricingResult {
  const wt = workType ? workTypes[workType] : null;
  const workMultiplier = wt?.dailyMultiplier ?? 1;
  const logisticsDiscount = wt?.logisticsDiscount ?? 0;
  const garantiaFreeFromQty = wt?.garantiaFreeFromQty ?? 6;
  const materialMultiplier = material ? getMaterialMultiplier(material) : 1;

  const daily = Math.round(DAILY_BASE * workMultiplier * materialMultiplier);

  // Desconto progressivo para conjuntos
  let conjuntoDiscount = 0;
  if (qty >= 5) conjuntoDiscount = 0.15;
  else if (qty >= 3) conjuntoDiscount = 0.1;
  else if (qty >= 2) conjuntoDiscount = 0.05;

  // Desconto semanal (a partir de 7 dias)
  let weeklyDiscount = 0;
  if (days >= 14) weeklyDiscount = 0.12;
  else if (days >= 7) weeklyDiscount = 0.08;

  const rawSubtotal = daily * days * qty;
  const subtotal = Math.round(rawSubtotal * (1 - conjuntoDiscount) * (1 - weeklyDiscount));

  const rawLogistics = FREIGHT_BASE + Math.max(0, qty - 1) * FREIGHT_EXTRA_PER_UNIT;
  const logistics = Math.round(rawLogistics * (1 - logisticsDiscount));

  // Taxa para 1–3 dias mesmo em conjunto
  const handlingFee = days <= 3 ? SHORT_HANDLING_FEE_PER_UNIT * qty : 0;

  const garantia = GARANTIA_PER_UNIT * qty;
  const garantiaChargedNow = qty < garantiaFreeFromQty;

  const totalBeforeGarantia = subtotal + logistics + handlingFee;
  const total = totalBeforeGarantia + (garantiaChargedNow ? garantia : 0);
  // PIX à vista: 20% off do total — válido inclusive para grandes volumes
  const pixTotal = Math.round(total * (1 - PIX_DISCOUNT));
  // No pagamento presencial, a Garantia Tambor é cobrada via PIX como reserva
  // e abatida do total no ato. Para grandes volumes (sem garantia) cai pra zero.
  const inPersonReserve = garantiaChargedNow ? garantia : 0;

  return {
    daily,
    subtotal,
    logistics,
    handlingFee,
    garantia,
    garantiaChargedNow,
    total,
    pixTotal,
    inPersonReserve,
    conjuntoDiscount,
    weeklyDiscount,
    materialMultiplier,
  };
}

export const PRICING_CONSTANTS = {
  PIX_DISCOUNT,
  SHORT_HANDLING_FEE_PER_UNIT,
  GARANTIA_PER_UNIT,
};

/** Nome de marca da nossa garantia — substitui o termo "caução". */
export const GARANTIA_BRAND = "Garantia Tambor";
