import { motion } from "motion/react";
import { Brush, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { CleanupModal } from "./CleanupModal";

export function CleanupServiceCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="px-5 mt-4">
        <motion.button
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpen(true)}
          className="w-full text-left rounded-4xl border border-success/30 bg-gradient-to-br from-success/20 via-surface to-surface p-5 shadow-soft relative overflow-hidden"
        >
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-success/20 blur-3xl pointer-events-none" />
          <div className="absolute right-6 top-6 h-14 w-14 rounded-2xl border border-success/20 bg-success/10 backdrop-blur-sm pointer-events-none rotate-12 flex items-center justify-center">
            <Brush className="h-6 w-6 text-success" strokeWidth={2} />
          </div>

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 text-success border border-success/25 px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase">
              <Sparkles className="h-2.5 w-2.5" />
              Serviço novo
            </span>
            <h2 className="mt-3 text-[20px] font-semibold leading-[1.15] tracking-tight text-foreground max-w-[220px]">
              Limpeza de entulho<br />& faxina pós-obra
            </h2>
            <p className="mt-1.5 text-[12px] text-muted-foreground leading-relaxed max-w-[240px]">
              Nossa equipe retira os resíduos brutos e ainda faz a faxina fina do local.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 bg-success text-white rounded-2xl px-4 py-2.5 font-semibold text-[12.5px] shadow-glow">
              <Brush className="h-3.5 w-3.5" strokeWidth={2.4} />
              Contratar limpeza
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </motion.button>
      </section>

      <CleanupModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
