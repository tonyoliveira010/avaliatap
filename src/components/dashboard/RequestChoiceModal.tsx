import { AnimatePresence, motion } from "motion/react";
import { X, Package2, Brush, ChevronRight, Sparkles, Trash2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelectTambor: () => void;
  onSelectCleanup: () => void;
}

const options = [
  {
    id: "tambor" as const,
    icon: Package2,
    title: "Solicitar tambor",
    desc: "Aluguel de tambores para descarte de entulho na sua obra.",
    accent: "from-primary/15 to-primary-soft/30",
    iconBg: "bg-primary text-primary-foreground",
  },
  {
    id: "cleanup" as const,
    icon: Brush,
    title: "Solicitar faxina",
    desc: "Limpeza de entulho bruta e faxina pós-obra com equipe especializada.",
    accent: "from-warning/15 to-warning/5",
    iconBg: "bg-warning text-background",
  },
];

export function RequestChoiceModal({ open, onClose, onSelectTambor, onSelectCleanup }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-surface rounded-t-4xl shadow-elegant max-h-[94vh] overflow-y-auto max-w-md mx-auto"
          >
            <div className="sticky top-0 bg-surface pt-2.5 pb-1 z-10">
              <div className="mx-auto h-1.5 w-10 rounded-full bg-border" />
            </div>

            <div className="px-5 pt-3 pb-2 flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  Novo pedido
                </p>
                <h2 className="text-[20px] font-semibold text-foreground mt-0.5">
                  O que você precisa?
                </h2>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 pb-7 pt-2 space-y-3">
              {options.map((o) => (
                <motion.button
                  key={o.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => (o.id === "tambor" ? onSelectTambor() : onSelectCleanup())}
                  className={`w-full text-left rounded-3xl border border-border bg-gradient-to-br ${o.accent} p-4 flex items-center gap-4 hover:border-primary/40 transition-colors`}
                >
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${o.iconBg} shadow-soft`}>
                    <o.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-foreground">{o.title}</p>
                    <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">
                      {o.desc}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </motion.button>
              ))}

              <div className="rounded-2xl bg-muted/40 border border-border px-4 py-3 flex items-start gap-2.5">
                <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-[11.5px] text-muted-foreground leading-snug">
                  Precisa de <Trash2 className="inline h-3 w-3 -mt-0.5" /> retirada de resíduos brutos{" "}
                  <strong className="text-foreground">e</strong> faxina fina? Escolha{" "}
                  <strong className="text-foreground">Solicitar faxina</strong> — fazemos os dois.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
