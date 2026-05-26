import { Hammer, Paintbrush2, Building2, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ServiceRequestModal } from "./ServiceRequestModal";

const items: { icon: LucideIcon; label: string; color: string }[] = [
  { icon: Hammer, label: "Reforma", color: "text-primary" },
  { icon: Paintbrush2, label: "Pintura", color: "text-info" },
  { icon: Building2, label: "Construção", color: "text-accent-foreground" },
  { icon: Sparkles, label: "Limpeza", color: "text-warning" },
];

export function QuickCategories() {
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState<(typeof items)[number] | undefined>();

  return (
    <>
      <section className="px-5 mt-7">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-semibold text-foreground">Tipos de obra</h3>
          <button className="text-[12px] text-muted-foreground font-medium">Ver tudo</button>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {items.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 * i, duration: 0.4 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                setCat(item);
                setOpen(true);
              }}
              className="aspect-square rounded-2xl bg-surface border border-border flex flex-col items-center justify-center gap-1.5 shadow-soft hover:border-primary/30 transition-all"
            >
              <item.icon className={`h-5 w-5 ${item.color}`} strokeWidth={2} />
              <span className="text-[11px] font-medium text-foreground/80">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      <ServiceRequestModal open={open} onClose={() => setOpen(false)} category={cat} />
    </>
  );
}
