import { ArrowRight, Truck, Camera, MapPin, CheckCircle2, Brush, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { OrderData } from "./ActiveOrderCard";
import { DriverTrackingModal } from "./DriverTrackingModal";
import { CleanupModal } from "./CleanupModal";

interface Props {
  onRequest: () => void;
  onPhoto?: () => void;
  order?: OrderData;
}

export function HeroScroller({ onRequest, onPhoto, order }: Props) {
  const [trackOpen, setTrackOpen] = useState(false);
  const [cleanupOpen, setCleanupOpen] = useState(false);
  const occupancy = order?.drums[0]?.occupancy ?? 65;
  const pending = order?.drums.filter((d) => !d.photoToday).length ?? 0;

  return (
    <>
      <section className="mt-2">
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2 snap-x snap-mandatory">
          {/* Hero card */}
          <motion.article
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="snap-start shrink-0 w-[88%] rounded-4xl hero-gradient grain overflow-hidden relative shadow-elegant"
          >
            <div className="relative p-6 pb-6 text-white">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Logística inteligente
              </span>
              <h1 className="mt-4 text-[24px] font-semibold leading-[1.15] tracking-tight">
                Descarte inteligente<br />para pequenas obras
              </h1>
              <p className="mt-2 text-[12.5px] text-white/70 leading-relaxed max-w-[240px]">
                Solicite tambores, acompanhe retiradas e organize sua obra em minutos.
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onRequest}
                className="mt-5 w-full inline-flex items-center justify-between gap-2 bg-white text-primary rounded-2xl px-5 py-3.5 font-semibold text-[14px] shadow-glow"
              >
                <span className="flex items-center gap-2.5">
                  <Truck className="h-4 w-4" strokeWidth={2.25} />
                  Solicitar tambor agora
                </span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
            <div className="absolute -right-8 -top-6 h-32 w-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="absolute right-4 top-4 h-20 w-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm pointer-events-none rotate-12">
              <div className="absolute inset-x-2 top-3 h-0.5 bg-white/20 rounded-full" />
              <div className="absolute inset-x-2 top-6 h-0.5 bg-white/20 rounded-full" />
              <div className="absolute inset-x-2 bottom-3 h-0.5 bg-white/20 rounded-full" />
            </div>
          </motion.article>

          {/* Cleanup service */}
          <motion.button
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCleanupOpen(true)}
            className="snap-start shrink-0 w-[82%] text-left rounded-4xl border border-success/30 bg-gradient-to-br from-success/20 via-surface to-surface p-5 shadow-soft relative overflow-hidden"
          >
            <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-success/20 blur-3xl pointer-events-none" />
            <div className="absolute right-5 top-5 h-14 w-14 rounded-2xl border border-success/20 bg-success/10 backdrop-blur-sm pointer-events-none rotate-12 flex items-center justify-center">
              <Brush className="h-6 w-6 text-success" strokeWidth={2} />
            </div>
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 text-success border border-success/25 px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase">
                <Sparkles className="h-2.5 w-2.5" />
                Serviço novo
              </span>
              <h2 className="mt-3 text-[19px] font-semibold leading-[1.15] tracking-tight text-foreground max-w-[210px]">
                Limpeza de entulho<br />& faxina pós-obra
              </h2>
              <p className="mt-1.5 text-[11.5px] text-muted-foreground leading-relaxed max-w-[230px]">
                Nossa equipe retira resíduos e faz a faxina fina do local.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-success text-white rounded-2xl px-4 py-2.5 font-semibold text-[12.5px] shadow-glow">
                <Brush className="h-3.5 w-3.5" strokeWidth={2.4} />
                Contratar limpeza
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </motion.button>

          {/* Vistoria diária */}
          <motion.button
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.98 }}
            onClick={onPhoto}
            className="snap-start shrink-0 w-[78%] text-left rounded-4xl border border-border bg-secondary p-5 shadow-soft relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-primary/25 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft/60 text-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Acontecendo
              </span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Vistoria</span>
            </div>
            <p className="relative mt-3 text-[17px] font-semibold text-foreground leading-tight">
              Foto do dia
            </p>
            <p className="relative text-[11.5px] text-muted-foreground mt-0.5">
              {pending > 0 ? `${pending} tambor(es) sem foto hoje` : "Tudo em dia hoje ✓"}
            </p>
            <div className="relative mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-muted-foreground">Ocupação</span>
                <span className="text-[12px] font-bold text-foreground tabular-nums">{occupancy}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${occupancy}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-success"
                />
              </div>
            </div>
            <div className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-2 text-[11px] font-bold">
              <Camera className="h-3 w-3" /> Enviar foto agora
            </div>
          </motion.button>

          {/* Driver tracking */}
          <motion.button
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTrackOpen(true)}
            className="snap-start shrink-0 w-[78%] text-left rounded-4xl border border-border bg-surface p-5 shadow-soft relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-30">
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
                <g stroke="oklch(1 0 0 / 0.05)" strokeWidth="0.6">
                  <path d="M0 60 H200" /><path d="M0 120 H200" />
                  <path d="M70 0 V200" /><path d="M140 0 V200" />
                </g>
                <path d="M20 160 Q60 140 100 110 T180 40" stroke="oklch(0.78 0.18 158)" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div className="relative flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-info/15 text-info px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                <Truck className="h-2.5 w-2.5" /> Motorista
              </span>
              <span className="text-[9px] text-success uppercase tracking-wider font-semibold">
                Ao vivo
              </span>
            </div>
            <p className="relative mt-3 text-[17px] font-semibold text-foreground leading-tight">
              {order?.driver?.name ?? "Alocando..."}
            </p>
            <p className="relative text-[11.5px] text-muted-foreground mt-0.5 truncate">
              {order?.driver?.vehicle ?? "Buscando veículo"}
            </p>
            <div className="relative mt-4 flex items-end justify-between">
              <div>
                <p className="text-[28px] font-bold text-primary tabular-nums leading-none">
                  {order?.driver?.etaMin ?? 22}
                  <span className="text-[12px] text-muted-foreground font-medium ml-1">min</span>
                </p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-1">
                  Chegada estimada
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1 text-[10px] text-success font-semibold">
                  <CheckCircle2 className="h-3 w-3" /> No prazo
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">14:00 – 16:00</p>
              </div>
            </div>
            <div className="relative mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{order?.address ?? "—"}</span>
            </div>
          </motion.button>
        </div>
      </section>

      <DriverTrackingModal open={trackOpen} onClose={() => setTrackOpen(false)} order={order} />
    </>
  );
}
