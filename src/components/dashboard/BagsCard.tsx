import { motion } from "motion/react";
import { ShoppingBag, Plus, Minus, Check, Truck } from "lucide-react";
import { useMemo, useState } from "react";

interface Bundle {
  id: string;
  size: string;
  qty: number;
  price: number;
  perBag: number;
  highlight?: string;
}

const bundles: Bundle[] = [
  { id: "p10", size: "100L reforçado", qty: 10, price: 39, perBag: 3.9 },
  { id: "p25", size: "100L reforçado", qty: 25, price: 79, perBag: 3.16, highlight: "Economia 19%" },
  { id: "p50", size: "200L industrial", qty: 50, price: 169, perBag: 3.38, highlight: "Mais vendido" },
  { id: "p100", size: "200L industrial", qty: 100, price: 299, perBag: 2.99, highlight: "Melhor R$/saco" },
];

export function BagsCard() {
  const [selected, setSelected] = useState<string>("p50");
  const [units, setUnits] = useState(1);

  const bundle = useMemo(() => bundles.find((b) => b.id === selected)!, [selected]);
  const total = bundle.price * units;

  return (
    <section className="px-5 mt-7">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground">Compre sacos de entulho</h3>
          <p className="text-[11px] text-muted-foreground">Economize comprando em pacote · entrega junto ao tambor</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft text-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
          Economia
        </span>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-4 shadow-soft">
        <div className="flex gap-2.5 overflow-x-auto -mx-1 px-1 pb-2 no-scrollbar snap-x snap-mandatory">
          {bundles.map((b) => {
            const active = selected === b.id;
            return (
              <motion.button
                key={b.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(b.id)}
                className={`snap-start shrink-0 w-[148px] rounded-2xl border p-3 text-left transition-all ${
                  active
                    ? "border-primary bg-primary-soft/40"
                    : "border-border bg-background/40 hover:border-primary/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  {active && (
                    <span className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[15px] font-semibold text-foreground tabular-nums">
                  {b.qty} <span className="text-[11px] font-medium text-muted-foreground">sacos</span>
                </p>
                <p className="text-[10.5px] text-muted-foreground">{b.size}</p>
                <p className="mt-1.5 text-[14px] font-bold text-foreground tabular-nums">
                  R$ {b.price}
                </p>
                <p className="text-[10px] text-muted-foreground tabular-nums">
                  R$ {b.perBag.toFixed(2).replace(".", ",")}/saco
                </p>
                {b.highlight && (
                  <span className="mt-1.5 inline-flex items-center rounded-full bg-success/15 text-success px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                    {b.highlight}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-2xl bg-background/60 border border-border p-1">
            <button
              onClick={() => setUnits(Math.max(1, units - 1))}
              className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center active:scale-95"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-[14px] font-semibold tabular-nums w-6 text-center">{units}</span>
            <button
              onClick={() => setUnits(Math.min(10, units + 1))}
              className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              Total
            </p>
            <p className="text-[18px] font-semibold text-foreground tabular-nums leading-none">
              R$ {total}
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-primary text-primary-foreground px-3.5 py-2.5 font-semibold text-[12px] shadow-glow"
          >
            <Truck className="h-3.5 w-3.5" />
            Adicionar
          </motion.button>
        </div>
      </div>
    </section>
  );
}
