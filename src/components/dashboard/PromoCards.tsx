import { Sparkles, Percent, Gift } from "lucide-react";
import { motion } from "motion/react";

const promos = [
  {
    icon: Percent,
    title: "20% OFF",
    subtitle: "Primeira locação semanal",
    bg: "linear-gradient(135deg, oklch(0.42 0.14 158), oklch(0.28 0.08 160))",
  },
  {
    icon: Gift,
    title: "Frete grátis",
    subtitle: "Pedidos com 3+ tambores",
    bg: "linear-gradient(135deg, oklch(0.38 0.1 230), oklch(0.24 0.06 240))",
  },
  {
    icon: Sparkles,
    title: "Indique e ganhe",
    subtitle: "R$ 50 em créditos",
    bg: "linear-gradient(135deg, oklch(0.5 0.16 75), oklch(0.32 0.1 60))",
  },
];

export function PromoCards() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[12px] font-medium text-foreground/80">Promoções para você</p>
        <span className="text-[11px] text-muted-foreground">{promos.length} ofertas</span>
      </div>
      <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-1 no-scrollbar">
        {promos.map((p, i) => (
          <motion.button
            key={p.title}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            whileTap={{ scale: 0.97 }}
            className="shrink-0 w-[200px] rounded-2xl p-4 text-left text-white relative overflow-hidden border border-white/10"
            style={{ background: p.bg }}
          >
            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
            <p.icon className="h-5 w-5 mb-3" strokeWidth={2.2} />
            <p className="text-[18px] font-semibold leading-tight">{p.title}</p>
            <p className="text-[11px] text-white/70 mt-1 leading-snug">{p.subtitle}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
