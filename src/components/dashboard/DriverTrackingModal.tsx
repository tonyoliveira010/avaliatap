import { AnimatePresence, motion } from "motion/react";
import { X, MapPin, Truck, Phone, MessageCircle, Navigation, CheckCircle2, Clock, Star } from "lucide-react";
import type { OrderData } from "./ActiveOrderCard";

interface Props {
  open: boolean;
  onClose: () => void;
  order?: OrderData;
}

const stages = [
  { id: "accepted", label: "Pedido aceito", time: "13:42" },
  { id: "preparing", label: "Carregando veículo", time: "13:58" },
  { id: "enroute", label: "A caminho", time: "14:12", active: true },
  { id: "arrived", label: "No local", time: "—" },
];

export function DriverTrackingModal({ open, onClose, order }: Props) {
  const driver = order?.driver;
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[80] bg-surface rounded-t-[32px] shadow-elegant max-h-[96vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-surface pt-2.5 pb-1 z-10">
              <div className="mx-auto h-1.5 w-10 rounded-full bg-border" />
            </div>

            {/* Large map */}
            <div className="relative h-[280px] mx-4 mt-2 rounded-3xl overflow-hidden border border-border">
              <BigMap />
              <button
                onClick={onClose}
                className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-success/95 text-primary-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                Ao vivo
              </div>
              <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 px-3.5 py-2.5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider">Distância</p>
                  <p className="text-[15px] font-semibold text-white">3,2 km</p>
                </div>
                <div className="h-7 w-px bg-white/15" />
                <div className="text-center">
                  <p className="text-[10px] text-white/60 uppercase tracking-wider">Chegada</p>
                  <p className="text-[15px] font-semibold text-white tabular-nums">
                    {driver?.etaMin ?? 22} min
                  </p>
                </div>
                <div className="h-7 w-px bg-white/15" />
                <div>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider">Velocidade</p>
                  <p className="text-[15px] font-semibold text-white">42 km/h</p>
                </div>
              </div>
            </div>

            <div className="px-5 pt-4 pb-7 space-y-5">
              {/* Driver card */}
              <div className="rounded-3xl bg-muted/40 border border-border p-4 flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-primary-soft text-primary text-[16px] font-bold flex items-center justify-center">
                  {(driver?.name ?? "—")
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-foreground truncate">
                    {driver?.name ?? "Alocando..."}
                  </p>
                  <p className="text-[12px] text-muted-foreground truncate">
                    {driver?.vehicle ?? "—"}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-foreground/80">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="font-medium">{driver?.rating?.toFixed(1) ?? "—"}</span>
                    <span className="text-muted-foreground">· 1.842 entregas</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center active:scale-95">
                    <MessageCircle className="h-4 w-4 text-foreground" />
                  </button>
                  <button className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center active:scale-95 shadow-glow">
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                  Status detalhado
                </p>
                <ol className="relative space-y-4 pl-6">
                  <span className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-border" />
                  {stages.map((s, i) => {
                    const done = i < 2;
                    const active = s.active;
                    return (
                      <li key={s.id} className="relative">
                        <span
                          className={`absolute -left-[22px] top-0.5 h-[14px] w-[14px] rounded-full ring-4 ${
                            done
                              ? "bg-primary ring-primary/20"
                              : active
                                ? "bg-primary ring-primary/30 animate-pulse"
                                : "bg-border ring-transparent"
                          }`}
                        />
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-[13px] font-medium ${
                              done || active ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {s.label}
                          </p>
                          <span className="text-[11px] text-muted-foreground tabular-nums">
                            {s.time}
                          </span>
                        </div>
                        {active && (
                          <p className="mt-0.5 text-[11px] text-primary">
                            Motorista se aproximando · ETA atualizada
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Address strip */}
              <div className="rounded-2xl bg-surface border border-border p-3.5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Endereço de entrega
                  </p>
                  <p className="text-[13px] font-medium text-foreground truncate">
                    {order?.address ?? "—"}
                  </p>
                </div>
                <button className="inline-flex items-center gap-1 text-[11px] text-primary font-semibold">
                  <Navigation className="h-3 w-3" /> Rotas
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                Janela contratada: 14:00 – 16:00
                <CheckCircle2 className="h-3 w-3 text-success ml-auto" />
                <span className="text-success font-medium">No prazo</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function BigMap() {
  return (
    <svg viewBox="0 0 320 280" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="bg-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.22 0.03 162)" />
          <stop offset="100%" stopColor="oklch(0.1 0.015 160)" />
        </linearGradient>
        <radialGradient id="pulse" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="oklch(0.78 0.18 158 / 0.7)" />
          <stop offset="100%" stopColor="oklch(0.78 0.18 158 / 0)" />
        </radialGradient>
      </defs>
      <rect width="320" height="280" fill="url(#bg-bg)" />
      {/* streets */}
      <g stroke="oklch(1 0 0 / 0.06)" strokeWidth="1">
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={`h-${i}`} d={`M0 ${i * 36} H320`} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <path key={`v-${i}`} d={`M${i * 36} 0 V280`} />
        ))}
      </g>
      {/* main arteries */}
      <g stroke="oklch(1 0 0 / 0.13)" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M0 180 Q120 170 200 140 T320 60" />
        <path d="M40 0 Q60 100 140 160 T280 280" />
      </g>
      {/* route */}
      <path
        d="M40 230 Q90 220 140 180 T260 80"
        stroke="oklch(0.78 0.18 158)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="0"
        fill="none"
      />
      <path
        d="M40 230 Q90 220 140 180"
        stroke="oklch(1 0 0 / 0.8)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* origin */}
      <circle cx="260" cy="80" r="22" fill="url(#pulse)" />
      <circle cx="260" cy="80" r="6" fill="oklch(0.78 0.18 158)" stroke="white" strokeWidth="2" />
      {/* truck */}
      <g transform="translate(140 180)">
        <circle r="20" fill="url(#pulse)" />
        <circle r="11" fill="white" />
        <path
          d="M-5 -3 H3 V1 H5 L7 3 V5 H-7 V-3 Z"
          fill="oklch(0.78 0.18 158)"
        />
      </g>
      {/* destination flag */}
      <g transform="translate(40 230)">
        <circle r="7" fill="white" stroke="oklch(0.78 0.18 158)" strokeWidth="2" />
        <circle r="3" fill="oklch(0.78 0.18 158)" />
      </g>
    </svg>
  );
}
