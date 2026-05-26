import { ArrowRight, Truck } from "lucide-react";
import { motion } from "motion/react";

interface HeroCardProps {
  onRequest: () => void;
}

export function HeroCard({ onRequest }: HeroCardProps) {
  return (
    <motion.section
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-5 mt-2 rounded-4xl hero-gradient grain overflow-hidden relative shadow-elegant"
    >
      <div className="relative p-6 pb-7 text-white">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Logística inteligente
        </span>

        <h1 className="mt-4 text-[26px] font-semibold leading-[1.15] tracking-tight">
          Descarte inteligente<br />para pequenas obras
        </h1>
        <p className="mt-2 text-[13px] text-white/70 leading-relaxed max-w-[260px]">
          Solicite tambores, acompanhe retiradas e organize sua obra em minutos.
        </p>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onRequest}
          className="mt-6 w-full inline-flex items-center justify-between gap-2 bg-white text-primary rounded-2xl px-5 py-4 font-semibold text-[15px] shadow-glow transition-all hover:bg-white/95"
        >
          <span className="flex items-center gap-2.5">
            <Truck className="h-4.5 w-4.5" strokeWidth={2.25} />
            Solicitar tambor agora
          </span>
          <ArrowRight className="h-4.5 w-4.5" />
        </motion.button>
      </div>

      {/* decorative drum */}
      <div className="absolute -right-8 -top-6 h-32 w-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute right-4 top-4 h-20 w-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm pointer-events-none rotate-12">
        <div className="absolute inset-x-2 top-3 h-0.5 bg-white/20 rounded-full" />
        <div className="absolute inset-x-2 top-6 h-0.5 bg-white/20 rounded-full" />
        <div className="absolute inset-x-2 bottom-3 h-0.5 bg-white/20 rounded-full" />
      </div>
    </motion.section>
  );
}
