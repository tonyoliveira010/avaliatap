import type { OrderData } from "@/components/dashboard/ActiveOrderCard";

// Helper to build a deterministic photo URL per drum
const photo = (seed: string) =>
  `https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=320&q=70&auto=format&fit=crop&ixid=${seed}`;

const today = new Date();
const at = (offsetDays: number, hh: number, mm: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hh, mm, 0, 0);
  return d.toISOString();
};

export const mockOrders: OrderData[] = [
  {
    id: "TMB-2841",
    status: "active",
    material: "Entulho",
    address: "R. Aspicuelta, 350 - V. Madalena",
    daysLeft: 2,
    totalDays: 3,
    progress: 1,
    driver: { name: "Carlos M.", vehicle: "Iveco · ABC-2841", etaMin: 22, rating: 4.9 },
    drums: [
      { id: "D-1041", occupancy: 65, photoToday: false, lastPhotoAt: "ontem · 17:42", photoUrl: photo("1") },
      { id: "D-1042", occupancy: 40, photoToday: true, lastPhotoAt: "hoje · 09:11", photoUrl: photo("2") },
      { id: "D-1043", occupancy: 78, photoToday: false, lastPhotoAt: "ontem · 18:02", photoUrl: photo("3") },
    ],
    events: [
      { id: "e1", type: "delivery", label: "Tambores entregues", at: at(-1, 9, 12), note: "Recebido por João" },
      { id: "e2", type: "in_use", label: "Em uso", at: at(-1, 9, 30) },
      { id: "e3", type: "inspection", label: "Vistoria fotográfica registrada", at: at(0, 9, 11) },
    ],
  },
  {
    id: "TMB-2839",
    status: "in_delivery",
    material: "Madeira",
    address: "Av. Faria Lima, 1200",
    daysLeft: 3,
    totalDays: 3,
    progress: 0,
    driver: { name: "Rafael S.", vehicle: "Ford Cargo · DEF-2270", etaMin: 8, rating: 4.8 },
    drums: [{ id: "D-1037", occupancy: 0, photoToday: true, photoUrl: photo("4") }],
    events: [
      { id: "e1", type: "scheduled", label: "Pedido confirmado", at: at(0, 13, 42) },
      { id: "e2", type: "preparing", label: "Veículo carregado", at: at(0, 13, 58) },
      { id: "e3", type: "enroute", label: "Motorista a caminho", at: at(0, 14, 12) },
    ],
  },
  {
    id: "TMB-2820",
    status: "near_expiration",
    material: "Gesso",
    address: "R. Augusta, 901",
    daysLeft: 1,
    totalDays: 7,
    progress: 1,
    driver: { name: "Marina T.", vehicle: "VW Delivery · GHI-1180", etaMin: 45, rating: 5.0 },
    drums: [
      { id: "D-1020", occupancy: 88, photoToday: false, lastPhotoAt: "ontem · 16:20", photoUrl: photo("5") },
      { id: "D-1021", occupancy: 92, photoToday: false, lastPhotoAt: "ontem · 16:21", photoUrl: photo("6") },
    ],
    events: [
      { id: "e1", type: "delivery", label: "Tambores entregues", at: at(-6, 10, 5) },
      { id: "e2", type: "in_use", label: "Em uso", at: at(-6, 10, 20) },
      { id: "e3", type: "alert", label: "Aviso: 1 dia para vencer", at: at(0, 8, 0), note: "Solicite a retirada" },
    ],
  },
  {
    id: "TMB-2799",
    status: "completed",
    material: "Recicláveis",
    address: "R. Oscar Freire, 422",
    daysLeft: 0,
    totalDays: 3,
    progress: 3,
    drums: [{ id: "D-0998", occupancy: 100, photoToday: true, photoUrl: photo("7") }],
    events: [
      { id: "e1", type: "delivery", label: "Tambor entregue", at: at(-4, 8, 30) },
      { id: "e2", type: "in_use", label: "Em uso", at: at(-4, 8, 45) },
      { id: "e3", type: "pickup", label: "Retirada realizada", at: at(-1, 17, 10) },
      { id: "e4", type: "completed", label: "Pedido finalizado", at: at(-1, 17, 40), note: "Resíduo destinado corretamente" },
    ],
  },
];

// Real availability mock — booked dates over next 60 days
export const unavailableDates: Set<string> = new Set(
  (() => {
    const out: string[] = [];
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    [3, 4, 9, 10, 16, 22, 28, 35, 41].forEach((d) => {
      const x = new Date(base);
      x.setDate(x.getDate() + d);
      out.push(x.toDateString());
    });
    return out;
  })(),
);

export function getSlotsForDate(date: Date): { label: string; available: boolean }[] {
  const day = date.getDate();
  return [
    { label: "08:00 – 10:00", available: day % 2 === 0 },
    { label: "10:00 – 12:00", available: day % 3 !== 0 },
    { label: "13:00 – 15:00", available: true },
    { label: "15:00 – 17:00", available: day % 4 !== 0 },
  ];
}
