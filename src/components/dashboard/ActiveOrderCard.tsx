import { useState } from "react";
import { motion } from "motion/react";
import {
  Clock,
  MapPin,
  Image as ImageIcon,
  Layers,
  Camera,
  CheckCircle2,
  Truck,
  PackageOpen,
  Recycle,
  Flag,
} from "lucide-react";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { PhotoChecklistModal } from "./PhotoChecklistModal";
import { getMaterialIcon, getOrderTitle } from "@/lib/materials";

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

const steps = [
  { label: "Entrega", icon: Truck },
  { label: "Em uso", icon: PackageOpen },
  { label: "Retirada", icon: Recycle },
  { label: "Finalizado", icon: Flag },
] as const;

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

export type OrderEventType =
  | "scheduled"
  | "preparing"
  | "enroute"
  | "delivery"
  | "in_use"
  | "inspection"
  | "alert"
  | "pickup"
  | "completed";

export interface OrderEvent {
  id: string;
  type: OrderEventType;
  label: string;
  /** ISO date string */
  at: string;
  note?: string;
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
  events?: OrderEvent[];
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
  const MaterialIcon = getMaterialIcon(order.material);
  const title = getOrderTitle(order.material, order.drums.length);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setDetailsOpen(true)}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        whileTap={{ scale: 0.99 }}
        className="w-full text-left bg-surface rounded-[28px] border border-border shadow-soft overflow-hidden hover:border-primary/30 transition-colors relative"
      >
        {isGroup && (
          <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2 py-1 text-[10px] font-bold shadow-glow">
            <Layers className="h-3 w-3" />
            {order.drums.length} conj.
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
                {title}
              </h4>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-foreground/80">
                  <MaterialIcon className="h-3 w-3 text-primary" strokeWidth={2.2} />
                  {order.material}
                </span>
                {isGroup && (
                  <span className="inline-flex items-center gap-1 text-foreground/70">
                    <Layers className="h-3 w-3" />
                    {order.drums.length} tambores
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{order.address}</span>
              </div>
            </div>
          </div>

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

          <div className="mt-4">
            <div className="flex items-center">
              {steps.map((step, i) => {
                const done = i < order.progress;
                const current = i === order.progress;
                const reached = i <= order.progress;
                const StepIcon = current ? step.icon : done ? CheckCircle2 : step.icon;
                return (
                  <div key={step.label} className="flex-1 flex items-center">
                    <div className="relative flex flex-col items-center flex-1">
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center ring-4 transition-colors ${
                          current
                            ? "bg-primary text-primary-foreground ring-primary/20"
                            : done
                              ? "bg-primary/15 text-primary ring-transparent"
                              : "bg-muted text-muted-foreground ring-transparent"
                        }`}
                      >
                        <StepIcon className="h-3.5 w-3.5" strokeWidth={2.4} />
                      </div>
                      <span
                        className={`mt-1.5 text-[9px] font-medium ${
                          reached ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 -translate-y-3.5 ${
                          i < order.progress ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
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
