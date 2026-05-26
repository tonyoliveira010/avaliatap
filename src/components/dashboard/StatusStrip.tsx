import { motion } from "motion/react";
import { Camera, CheckCircle2, Clock, MapPin, Truck, ChevronRight } from "lucide-react";
import type { OrderData } from "./ActiveOrderCard";

interface Props {
  order?: OrderData;
  onPhoto?: () => void;
}

export function StatusStrip({ order, onPhoto }: Props) {
  return (
    <section className="mt-5">
      <div className="flex items-center justify-between mb-3 px-5">
        <h3 className="text-[15px] font-semibold text-foreground">Acontecendo agora</h3>
        <button className="text-[11px] text-muted-foreground font-medium">Ver tudo</button>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-1 snap-x snap-mandatory">
        <DrumControlMini order={order} onPhoto={onPhoto} />
        <DriverEtaMini order={order} />
      </div>
    </section>
  );
}

function DrumControlMini({ order, onPhoto }: Props) {
  const occupancy = order?.drums[0]?.occupancy ?? 65;
  const pending = order?.drums.filter((d) => !d.photoToday).length ?? 0;
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onPhoto}
      className="snap-start shrink-0 w-[78%] text-left rounded-[26px] border border-border bg-secondary p-4 shadow-soft relative overflow-hidden"
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft/60 text-primary px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider">
            <Camera className="h-2.5 w-2.5" /> Controle
          </span>
          <p className="mt-2 text-[15px] font-semibold text-foreground leading-tight">
            Vistoria diária
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {pending > 0 ? `${pending} tambor(es) sem foto hoje` : "Tudo em dia ✓"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[22px] font-semibold text-foreground tabular-nums leading-none">
            {occupancy}%
          </p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-1">Ocup.</p>
        </div>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${occupancy}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-success"
        />
      </div>
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-[11px] font-semibold">
        <Camera className="h-3 w-3" /> Enviar foto
      </div>
    </motion.button>
  );
}

function DriverEtaMini({ order }: { order?: OrderData }) {
  const driver = order?.driver;
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="snap-start shrink-0 w-[78%] rounded-[26px] border border-border bg-surface p-4 shadow-soft relative overflow-hidden"
    >
      <div className="absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-info/15 blur-2xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-info/15 text-info px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider">
            <Truck className="h-2.5 w-2.5" /> Motorista
          </span>
          <p className="mt-2 text-[15px] font-semibold text-foreground leading-tight">
            {driver?.name ?? "Alocando..."}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[160px]">
            {driver?.vehicle ?? "Buscando veículo próximo"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[22px] font-semibold text-primary tabular-nums leading-none">
            {driver?.etaMin ?? "—"}
            <span className="text-[11px] text-muted-foreground font-medium ml-0.5">min</span>
          </p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-1">ETA</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground min-w-0">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{order?.address ?? "—"}</span>
        </div>
        <button className="inline-flex items-center gap-1 text-[11px] text-primary font-semibold">
          Rastrear <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
        <Clock className="h-3 w-3" />
        Janela 14:00 – 16:00 · <CheckCircle2 className="h-3 w-3 text-success" /> confirmada
      </div>
    </motion.div>
  );
}
