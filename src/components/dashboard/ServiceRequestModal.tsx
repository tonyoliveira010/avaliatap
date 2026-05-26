import { AnimatePresence, motion } from "motion/react";
import { X, ChevronRight, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { RequestModal } from "./RequestModal";

interface Props {
  open: boolean;
  onClose: () => void;
  category?: { label: string; icon: LucideIcon; color: string };
}

const offersByCategory: Record<string, { title: string; desc: string; tag?: string }[]> = {
  Reforma: [
    { title: "Tambor 240L · Entulho leve", desc: "Ideal para demolição parcial", tag: "Mais pedido" },
    { title: "Conjunto 3 tambores", desc: "Para obra de até 60m²" },
    { title: "Caçamba estacionária 4m³", desc: "Para grandes volumes" },
  ],
  Pintura: [
    { title: "Tambor 100L · Resíduo químico", desc: "Latas, panos e solventes", tag: "Especial" },
    { title: "Coleta semanal recorrente", desc: "Equipe semanal automatizada" },
  ],
  Construção: [
    { title: "Conjunto 5 tambores", desc: "Logística reforçada", tag: "Premium" },
    { title: "Caçamba 5m³ + tambor extra", desc: "Pico de demolição" },
    { title: "Plano mensal de obra", desc: "Faturamento mensal" },
  ],
  Limpeza: [
    { title: "Tambor 200L · Recicláveis", desc: "Separação inteligente" },
    { title: "Pós-obra completa", desc: "Equipe + 2 tambores + coleta" },
  ],
};

export function ServiceRequestModal({ open, onClose, category }: Props) {
  const [requestOpen, setRequestOpen] = useState(false);
  const items = category ? offersByCategory[category.label] ?? [] : [];
  const Icon = category?.icon;

  return (
    <>
      <AnimatePresence>
        {open && category && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-x-0 bottom-0 z-[60] bg-surface rounded-t-[32px] shadow-elegant max-h-[88vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-surface pt-2.5 pb-1 z-10">
                <div className="mx-auto h-1.5 w-10 rounded-full bg-border" />
              </div>

              <div className="px-5 pt-3 pb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-primary-soft flex items-center justify-center">
                    {Icon && <Icon className={`h-5 w-5 ${category.color}`} strokeWidth={2.2} />}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      Serviço sugerido
                    </p>
                    <h2 className="text-[19px] font-semibold text-foreground">
                      Obra de {category.label}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-95"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-5 pb-7 space-y-4">
                <p className="text-[12.5px] text-muted-foreground">
                  Selecione um plano ou customize seu pedido conforme a sua obra.
                </p>

                <ul className="space-y-2.5">
                  {items.map((item, i) => (
                    <motion.li
                      key={item.title}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * i }}
                    >
                      <button
                        onClick={() => {
                          onClose();
                          setTimeout(() => setRequestOpen(true), 200);
                        }}
                        className="w-full rounded-2xl bg-background/60 border border-border p-3.5 flex items-center gap-3 hover:border-primary/40 transition-colors text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-[14px] font-semibold text-foreground">
                              {item.title}
                            </p>
                            {item.tag && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft text-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                                <Sparkles className="h-2.5 w-2.5" /> {item.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[11.5px] text-muted-foreground mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </button>
                    </motion.li>
                  ))}
                </ul>

                <div className="rounded-2xl bg-muted/40 border border-border p-4">
                  <p className="text-[12px] font-medium text-foreground">
                    Precisa de algo diferente?
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Configure manualmente material, prazo e janela de entrega.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      setTimeout(() => setRequestOpen(true), 200);
                    }}
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-3 font-semibold text-[13px] shadow-glow active:scale-[0.98] transition-transform"
                  >
                    Personalizar pedido
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <RequestModal open={requestOpen} onClose={() => setRequestOpen(false)} />
    </>
  );
}
