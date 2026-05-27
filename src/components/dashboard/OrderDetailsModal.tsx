import { AnimatePresence, motion } from "motion/react";
import {
  X,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  Truck,
  AlertTriangle,
  CalendarClock,
  PackageCheck,
  PackageOpen,
  History,
  Flag,
} from "lucide-react";
import { useState } from "react";
import type { DrumUnit, OrderData, OrderEvent, OrderEventType } from "./ActiveOrderCard";
import { PhotoChecklistModal } from "./PhotoChecklistModal";
import { DriverTrackingModal } from "./DriverTrackingModal";
import { getMaterialIcon, getOrderTitle } from "@/lib/materials";

interface Props {
  open: boolean;
  onClose: () => void;
  order?: OrderData;
}

export function OrderDetailsModal({ open, onClose, order }: Props) {
  const [activeDrum, setActiveDrum] = useState<DrumUnit | null>(null);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);

  if (!order) return null;
  const avg = Math.round(order.drums.reduce((a, d) => a + d.occupancy, 0) / order.drums.length);
  const pending = order.drums.filter((d) => !d.photoToday).length;

  function openVistoria(d: DrumUnit) {
    setActiveDrum(d);
    setPhotoOpen(true);
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-[55] bg-black/65 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-x-0 bottom-0 z-[55] bg-surface rounded-t-[32px] shadow-elegant max-h-[94vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-surface pt-2.5 pb-1 z-10">
                <div className="mx-auto h-1.5 w-10 rounded-full bg-border" />
              </div>

              <div className="px-5 pt-3 pb-3 flex items-start justify-between">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-11 w-11 rounded-2xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    {(() => {
                      const Icon = getMaterialIcon(order.material);
                      return <Icon className="h-5 w-5" strokeWidth={2.2} />;
                    })()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      Pedido #{order.id}
                    </p>
                    <h2 className="text-[19px] font-semibold text-foreground mt-0.5 leading-tight">
                      {getOrderTitle(order.material, order.drums.length)}
                    </h2>
                    <div className="mt-1 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{order.address}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-95 shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-5 pb-7 space-y-5">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <Stat label="Restam" value={`${order.daysLeft}d`} />
                  <Stat label="Ocupação" value={`${avg}%`} />
                  <Stat label="Pendentes" value={`${pending}`} accent={pending > 0} />
                </div>

                {/* Driver */}
                {order.driver && order.status !== "completed" && (
                  <button
                    onClick={() => setTrackOpen(true)}
                    className="w-full rounded-3xl bg-muted/40 border border-border p-4 flex items-center gap-3 hover:border-primary/40 transition-colors text-left"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-foreground truncate">
                        {order.driver.name} · {order.driver.vehicle}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        ETA {order.driver.etaMin} min · toque para rastrear ao vivo
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}

                {/* Histórico de eventos */}
                <EventHistory events={order.events ?? []} />

                {/* Drums list */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Tambores
                    </p>
                    {pending > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-destructive font-semibold">
                        <AlertTriangle className="h-3 w-3" />
                        {pending} sem foto hoje
                      </span>
                    )}
                  </div>
                  <ul className="rounded-3xl border border-border overflow-hidden divide-y divide-border bg-background/30">
                    {order.drums.map((d, i) => (
                      <li key={d.id}>
                        <button
                          onClick={() => openVistoria(d)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors text-left active:scale-[0.99]"
                        >
                          <div className="h-12 w-12 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                            {d.photoUrl ? (
                              <img src={d.photoUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full text-[11px] font-bold text-foreground flex items-center justify-center">
                                {String(i + 1).padStart(2, "0")}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-foreground">
                              Tambor {d.id}
                            </p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${d.occupancy}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-muted-foreground tabular-nums w-8 text-right">
                                {d.occupancy}%
                              </span>
                            </div>
                          </div>
                          {d.photoToday ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-success font-semibold shrink-0">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              OK
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-[10px] font-bold shrink-0">
                              <Camera className="h-3 w-3" />
                              Vistoria
                            </span>
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-muted/30 border border-border p-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  Prazo total: <strong className="text-foreground font-semibold">{order.totalDays} dias</strong> · solicite a retirada antes do vencimento para evitar cobrança extra da Garantia Tambor.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <PhotoChecklistModal
        open={photoOpen}
        onClose={() => setPhotoOpen(false)}
        drum={activeDrum}
        orderId={order.id}
      />
      <DriverTrackingModal
        open={trackOpen}
        onClose={() => setTrackOpen(false)}
        order={order}
      />
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl bg-muted/40 border border-border px-3 py-3">
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </p>
      <p
        className={`mt-1 text-[18px] font-bold tabular-nums leading-none ${
          accent ? "text-destructive" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

const eventIcon: Record<OrderEventType, typeof Truck> = {
  scheduled: CalendarClock,
  preparing: PackageOpen,
  enroute: Truck,
  delivery: PackageCheck,
  in_use: Clock,
  inspection: Camera,
  alert: AlertTriangle,
  pickup: PackageOpen,
  completed: Flag,
};

const eventTone: Record<OrderEventType, string> = {
  scheduled: "text-muted-foreground bg-muted",
  preparing: "text-info bg-info/15",
  enroute: "text-info bg-info/15",
  delivery: "text-success bg-success/15",
  in_use: "text-primary bg-primary-soft",
  inspection: "text-primary bg-primary-soft",
  alert: "text-destructive bg-destructive/15",
  pickup: "text-warning bg-warning/15",
  completed: "text-success bg-success/15",
};

function formatEventDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EventHistory({ events }: { events: OrderEvent[] }) {
  if (!events.length) return null;
  const sorted = [...events].sort((a, b) => +new Date(b.at) - +new Date(a.at));
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold inline-flex items-center gap-1.5">
          <History className="h-3 w-3" /> Histórico do pedido
        </p>
        <span className="text-[10px] text-muted-foreground">{sorted.length} eventos</span>
      </div>
      <ol className="rounded-3xl border border-border bg-background/30 overflow-hidden divide-y divide-border">
        {sorted.map((e) => {
          const Icon = eventIcon[e.type] ?? Clock;
          return (
            <li key={e.id} className="px-4 py-3 flex items-start gap-3">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${eventTone[e.type] ?? "bg-muted text-foreground"}`}>
                <Icon className="h-4 w-4" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-semibold text-foreground truncate">{e.label}</p>
                  <span className="text-[10.5px] text-muted-foreground tabular-nums shrink-0">
                    {formatEventDate(e.at)}
                  </span>
                </div>
                {e.note && (
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{e.note}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

