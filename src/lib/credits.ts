// Saldo mock de créditos do usuário. Em produção viria do backend.
export const userCredits = {
  balance: 240,
};

export interface CreditPackage {
  id: string;
  credits: number;
  /** Crédito bônus dado de brinde */
  bonus: number;
  /** Preço em R$ */
  price: number;
  /** % de desconto aplicado em contratações ao pagar com créditos */
  discount: number;
  highlight?: string;
  tag?: string;
}

export const creditPackages: CreditPackage[] = [
  { id: "c100", credits: 100, bonus: 0, price: 89, discount: 0.05 },
  { id: "c300", credits: 300, bonus: 30, price: 249, discount: 0.08, highlight: "+10% bônus" },
  {
    id: "c600",
    credits: 600,
    bonus: 90,
    price: 469,
    discount: 0.12,
    highlight: "+15% bônus",
    tag: "Mais vendido",
  },
  {
    id: "c1500",
    credits: 1500,
    bonus: 300,
    price: 1099,
    discount: 0.18,
    highlight: "+20% bônus",
    tag: "Melhor valor",
  },
];

/** Desconto aplicado quando o usuário paga com créditos (incentivo) */
export const CREDITS_DISCOUNT = 0.1;

export function priceInCredits(totalReais: number): number {
  // 1 crédito = R$ 1 (com 10% off por usar créditos)
  return Math.round(totalReais * (1 - CREDITS_DISCOUNT));
}
