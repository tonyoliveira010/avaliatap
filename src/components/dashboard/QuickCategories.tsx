import { Hammer, Bomb, Sparkles, CalendarRange } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ServiceRequestModal } from "./ServiceRequestModal";
import { workTypes, type WorkTypeId } from "@/lib/work-types";

interface Item {
  id: WorkTypeId;
  icon: LucideIcon;
  label: string;
  color: string;
}

const items: Item[] = [
  { id: "reforma", icon: Hammer, label: workTypes.reforma.label, color: "text-primary" },
  { id: "demolicao", icon: Bomb, label: workTypes.demolicao.label, color: "text-warning" },
  { id: "limpeza", icon: Sparkles, label: workTypes.limpeza.label, color: "text-success" },
  { id: "planos", icon: CalendarRange, label: workTypes.planos.label, color: "text-info" },
];

export function QuickCategories() {
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState<Item | undefined>();

  return (
    <>
      <section className="px-5 mt-7">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-semibold text-foreground">Tipos de obra</h3>
          <button className="text-[12px] text-muted-foreground font-medium">Ver tudo</button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {items.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 * i, duration: 0.4 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                setCat(item);
                setOpen(true);
              }}
              className="aspect-[1/1.05] rounded-2xl bg-surface border border-border flex flex-col items-center justify-center gap-1.5 shadow-soft hover:border-primary/30 transition-all px-1.5"
            >
              <item.icon className={`h-5 w-5 ${item.color}`} strokeWidth={2} />
              <span className="text-[10.5px] font-medium text-foreground/80 text-center leading-tight">
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      <ServiceRequestModal
        open={open}
        onClose={() => setOpen(false)}
        category={
          cat
            ? { id: cat.id, label: cat.label, icon: cat.icon, color: cat.color }
            : undefined
        }
      />
    </>
  );
}
