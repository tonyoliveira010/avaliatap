import type { OrderData } from "@/components/dashboard/ActiveOrderCard";

// Helper to build a deterministic photo URL per drum
const photo = (seed: string) =>
  `https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=320&q=70&auto=format&fit=crop&ixid=${seed}`;

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
  },
];

// Real availability mock — booked dates over next 60 days
export const unavailableDates: Set<string> = new Set(
  (() => {
    const out: string[] = [];
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    // Make some days fully booked: +3, +4, +9, +10, +16, +22, +28
    [3, 4, 9, 10, 16, 22, 28, 35, 41].forEach((d) => {
      const x = new Date(base);
      x.setDate(x.getDate() + d);
      out.push(x.toDateString());
    });
    return out;
  })(),
);

export function getSlotsForDate(date: Date): { label: string; available: boolean }[] {
  // Deterministic mock slots
  const day = date.getDate();
  return [
    { label: "08:00 – 10:00", available: day % 2 === 0 },
    { label: "10:00 – 12:00", available: day % 3 !== 0 },
    { label: "13:00 – 15:00", available: true },
    { label: "15:00 – 17:00", available: day % 4 !== 0 },
  ];
}
