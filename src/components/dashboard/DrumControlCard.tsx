import { Camera, CheckCircle2, Upload } from "lucide-react";
import { motion } from "motion/react";

export function DrumControlCard() {
  const occupancy = 65;
  return (
    <motion.section
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-5 mt-4 rounded-4xl bg-secondary text-white p-5 shadow-elegant overflow-hidden relative"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/50 font-medium">
            Controle do tambor
          </p>
          <h3 className="mt-1 text-[18px] font-semibold">Vistoria diária</h3>
          <p className="mt-1 text-[12px] text-white/60">Envie a foto de hoje até 18h</p>
        </div>
        <div className="text-right">
          <p className="text-[28px] font-semibold leading-none">2d</p>
          <p className="text-[11px] text-white/50 mt-1">restantes</p>
        </div>
      </div>

      {/* Occupancy bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[11px] mb-2">
          <span className="text-white/70">Ocupação estimada</span>
          <span className="font-semibold">{occupancy}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${occupancy}%` }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            className="h-full bg-gradient-to-r from-primary to-success rounded-full"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-secondary px-4 py-3 text-[13px] font-semibold"
        >
          <Camera className="h-4 w-4" />
          Enviar foto de hoje
        </motion.button>
        <button className="h-11 w-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/15 transition-colors">
          <Upload className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-white/60">
        <CheckCircle2 className="h-3 w-3 text-success" />
        Última vistoria validada ontem · 14:32
      </div>
    </motion.section>
  );
}
