import { Percent, Coins, Truck, Clock, ShieldOff, Package2 } from "lucide-react";
import { motion } from "motion/react";

interface Promo {
  icon: typeof Percent;
  title: string;
  subtitle: string;
  bg: string;
}

// Cards de regras e benefícios para o cliente.
const promos: Promo[] = [
  {
    icon: Package2,
    title: "Quanto mais, mais barato",
    subtitle: "1–2: R$80 · 3+: R$50 · 5+: R$25 a diária por tambor",
    bg: "linear-gradient(135deg, oklch(0.42 0.14 158), oklch(0.28 0.08 160))",
  },
  {
    icon: Percent,
    title: "20% OFF no PIX",
    subtitle: "Pagando à vista via PIX em qualquer volume",
    bg: "linear-gradient(135deg, oklch(0.38 0.1 230), oklch(0.24 0.06 240))",
  },
  {
    icon: Truck,
    title: "Frete por distância",
    subtitle: "R$90 até 20km (retirada + descarte) · R$5/km extra",
    bg: "linear-gradient(135deg, oklch(0.5 0.16 75), oklch(0.32 0.1 60))",
  },
  {
    icon: Coins,
    title: "Fidelidade rende",
    subtitle: "Clientes recorrentes ganham desconto automático",
    bg: "linear-gradient(135deg, oklch(0.46 0.13 300), oklch(0.28 0.08 300))",
  },
  {
    icon: Clock,
    title: "Reserva por 24h",
    subtitle: "Garantimos seu tambor por até 24h após a reserva",
    bg: "linear-gradient(135deg, oklch(0.44 0.12 25), oklch(0.28 0.08 25))",
  },
  {
    icon: ShieldOff,
    title: "Sem caução",
    subtitle: "Não cobramos garantia do tambor — só o que você usa",
    bg: "linear-gradient(135deg, oklch(0.4 0.1 195), oklch(0.26 0.06 200))",
  },
];

export function PromoCards() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[12px] font-medium text-foreground/80">Regras e benefícios</p>
        <span className="text-[11px] text-muted-foreground">{promos.length} vantagens</span>
      </div>
      <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-1 no-scrollbar">
        {promos.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="shrink-0 w-[210px] rounded-2xl p-4 text-left text-white relative overflow-hidden border border-white/10"
            style={{ background: p.bg }}
          >
            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
            <p.icon className="h-5 w-5 mb-3" strokeWidth={2.2} />
            <p className="text-[15px] font-semibold leading-tight">{p.title}</p>
            <p className="text-[11px] text-white/75 mt-1 leading-snug">{p.subtitle}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
