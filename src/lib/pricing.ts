import { workTypes, type WorkTypeId } from "./work-types";

const DAILY_BASE = 80;
const FREIGHT_BASE = 60;
const FREIGHT_EXTRA_PER_UNIT = 15;
const CAUCAO_PER_UNIT = 100;
/** Taxa de manuseio para locações curtas (1–3 dias), por tambor */
const SHORT_HANDLING_FEE_PER_UNIT = 35;
const PIX_DISCOUNT = 0.2;
const IN_PERSON_FREIGHT_RESERVE = 0.4;

export interface PricingInput {
  qty: number;
  days: number;
  workType?: WorkTypeId | null;
}

export interface PricingResult {
  daily: number;
  subtotal: number;
  logistics: number;
  handlingFee: number;
  caucao: number;
  /** Caução é cobrada no ato? (não se for grande volume) */
  caucaoChargedNow: boolean;
  total: number;
  /** Total com 20% off PIX */
  pixTotal: number;
  /** Valor antecipado da reserva quando é pagamento presencial */
  inPersonFreightReserve: number;
  /** Se desconto progressivo de conjunto se aplica */
  conjuntoDiscount: number;
  /** Se desconto semanal (>=7 dias) se aplica */
  weeklyDiscount: number;
}

export function calcPricing({ qty, days, workType }: PricingInput): PricingResult {
  const wt = workType ? workTypes[workType] : null;
  const dailyMultiplier = wt?.dailyMultiplier ?? 1;
  const logisticsDiscount = wt?.logisticsDiscount ?? 0;
  const cauçaoFreeFromQty = wt?.cauçaoFreeFromQty ?? 6;

  const daily = Math.round(DAILY_BASE * dailyMultiplier);

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

  const caucao = CAUCAO_PER_UNIT * qty;
  const caucaoChargedNow = qty < cauçaoFreeFromQty;

  const totalBeforeCaucao = subtotal + logistics + handlingFee;
  const total = totalBeforeCaucao + (caucaoChargedNow ? caucao : 0);
  const pixTotal = Math.round(total * (1 - PIX_DISCOUNT));
  const inPersonFreightReserve = Math.round(logistics * IN_PERSON_FREIGHT_RESERVE);

  return {
    daily,
    subtotal,
    logistics,
    handlingFee,
    caucao,
    caucaoChargedNow,
    total,
    pixTotal,
    inPersonFreightReserve,
    conjuntoDiscount,
    weeklyDiscount,
  };
}

export const PRICING_CONSTANTS = {
  PIX_DISCOUNT,
  IN_PERSON_FREIGHT_RESERVE,
  SHORT_HANDLING_FEE_PER_UNIT,
};
