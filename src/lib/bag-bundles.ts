export interface BagBundle {
  id: string;
  size: string;
  qty: number;
  price: number;
  perBag: number;
  highlight?: string;
}

export const bagBundles: BagBundle[] = [
  { id: "p10", size: "100L reforçado", qty: 10, price: 39, perBag: 3.9 },
  { id: "p25", size: "100L reforçado", qty: 25, price: 79, perBag: 3.16, highlight: "Economia 19%" },
  { id: "p50", size: "200L industrial", qty: 50, price: 169, perBag: 3.38, highlight: "Mais vendido" },
  { id: "p100", size: "200L industrial", qty: 100, price: 299, perBag: 2.99, highlight: "Melhor R$/saco" },
];
