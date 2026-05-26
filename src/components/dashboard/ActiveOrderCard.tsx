import { useState } from "react";
import { motion } from "motion/react";
import { Clock, MapPin, Image as ImageIcon, Layers, Camera, CheckCircle2 } from "lucide-react";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { PhotoChecklistModal } from "./PhotoChecklistModal";

export type OrderStatus =
  | "active"
  | "in_delivery"
  | "near_expiration"
  | "pickup_requested"
  | "completed";

const statusMap: Record<OrderStatus, { label: string; dot: string; pill: string }> = {
  active: { label: "Em uso", dot: "bg-success", pill: "bg-success/15 text-success" },
  in_delivery: { label: "Em entrega", dot: "bg-info", pill: "bg-info/15 text-info" },
  near_expiration: { label: "Vencendo", dot: "bg-destructive", pill: "bg-destructive/15 text-destructive" },
  pickup_requested: { label: "Coleta solicitada", dot: "bg-warning", pill: "bg-warning/15 text-warning" },
  completed: { label: "Finalizado", dot: "bg-muted-foreground", pill: "bg-muted text-muted-foreground" },
};

const steps = ["Entrega", "Em uso", "Retirada", "Finalizado"] as const;

export interface DrumUnit {
  id: string;
  occupancy: number;
  photoToday: boolean;
  lastPhotoAt?: string;
  photoUrl?: string;
}

export interface DriverInfo {
  name: string;
  vehicle: string;
  etaMin: number;
  rating: number;
}

export interface OrderData {
  id: string;
  status: OrderStatus;
  material: string;
  address: string;
  daysLeft: number;
  totalDays: number;
  progress: number;
  drums: DrumUnit[];
  driver?: DriverInfo;
}

export function ActiveOrderCard({ order }: { order: OrderData }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const isGroup = order.drums.length >= 2;
  const s = statusMap[order.status];
  const pendingPhotos = order.drums.filter((d) => !d.photoToday).length;
  const avgOccupancy = Math.round(
    order.drums.reduce((a, d) => a + d.occupancy, 0) / order.drums.length,
  );
  const heroDrum = order.drums.find((d) => d.photoUrl) ?? order.drums[0];

  function handleClick() {
    if (isGroup) {
      setDetailsOpen(true);
    } else {
      // Single drum: open details with inspection right away
      setDetailsOpen(true);
    }
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={handleClick}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        whileTap={{ scale: 0.99 }}
        className="w-full text-left bg-surface rounded-[28px] border border-border shadow-soft overflow-hidden hover:border-primary/30 transition-colors relative"
      >
        {/* Group badge top-right */}
        {isGroup && (
          <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2 py-1 text-[10px] font-bold shadow-glow">
            <Layers className="h-3 w-3" />
            {order.drums.length}
          </span>
        )}

        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="relative h-[68px] w-[68px] shrink-0 rounded-2xl overflow-hidden bg-muted border border-border">
              {heroDrum.photoUrl ? (
                <img
                  src={heroDrum.photoUrl}
                  alt={`Tambor ${heroDrum.id}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-5 w-5" />
                </div>
              )}
              {pendingPhotos > 0 && (
                <span className="absolute bottom-1 left-1 right-1 inline-flex items-center justify-center gap-0.5 rounded-md bg-black/70 text-white text-[9px] font-bold py-0.5">
                  <Camera className="h-2.5 w-2.5" />
                  {pendingPhotos}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0 pr-12">
              <p className="text-[10px] text-muted-foreground font-mono tracking-wider">
                #{order.id}
              </p>
              <h4 className="mt-0.5 text-[15px] font-semibold text-foreground leading-tight">
                {isGroup
                  ? `Conjunto · ${order.drums.length} tambores`
                  : `1 tambor · ${order.material}`}
              </h4>
              {isGroup && (
                <p className="text-[11px] text-muted-foreground mt-0.5">{order.material}</p>
              )}
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{order.address}</span>
              </div>
            </div>
          </div>

          {/* Status pill row */}
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${s.pill}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {order.daysLeft}d · {avgOccupancy}% ocup.
            </span>
            {pendingPhotos === 0 && order.status !== "completed" && (
              <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-success font-semibold">
                <CheckCircle2 className="h-3 w-3" /> Em dia
              </span>
            )}
          </div>

          {/* Timeline */}
          <div className="mt-4">
            <div className="flex items-center">
              {steps.map((step, i) => (
                <div key={step} className="flex-1 flex items-center">
                  <div className="relative flex flex-col items-center flex-1">
                    <div
                      className={`h-2 w-2 rounded-full ring-4 transition-colors ${
                        i <= order.progress
                          ? "bg-primary ring-primary/20"
                          : "bg-border ring-transparent"
                      }`}
                    />
                    <span
                      className={`mt-1.5 text-[9px] font-medium ${
                        i <= order.progress ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 -translate-y-2 ${
                        i < order.progress ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.button>

      <OrderDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        order={order}
      />
      <PhotoChecklistModal
        open={photoOpen}
        onClose={() => setPhotoOpen(false)}
        drum={heroDrum}
        orderId={order.id}
      />
    </>
  );
}
