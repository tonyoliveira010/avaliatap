import { AnimatePresence, motion } from "motion/react";
import { X, ChevronRight, Sparkles, Star, HardHat, Wrench, Truck, Paintbrush, Scissors } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { RequestModal } from "./RequestModal";
import { workTypes, type WorkTypeId } from "@/lib/work-types";

interface Category {
  id: WorkTypeId;
  label: string;
  icon: LucideIcon;
  color: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  category?: Category;
}

interface Offer {
  title: string;
  desc: string;
  tag?: string;
}

const offersByType: Record<WorkTypeId, Offer[]> = {
  reforma: [
    { title: "Tambor 240L · Entulho leve", desc: "Ideal para reforma parcial em apartamentos", tag: "Mais pedido" },
    { title: "Conjunto 2 tambores · 5 dias", desc: "Combo para obra de até 40m² com 5% off" },
    { title: "Plano fim de semana", desc: "Entrega sexta · retirada segunda" },
  ],
  demolicao: [
    { title: "Conjunto 3 tambores · expresso", desc: "Trocas em até 4h · 10% off no conjunto", tag: "Premium" },
    { title: "Conjunto 5 tambores · 1 semana", desc: "Logística reforçada + Garantia Tambor isenta" },
    { title: "Caçamba 5m³ + 2 tambores", desc: "Pico de demolição estrutural" },
  ],
  limpeza: [
    { title: "Tambor + faxina pós-obra", desc: "Equipe limpa o local e retira os tambores", tag: "Combo" },
    { title: "Conjunto 2 tambores · jardim", desc: "Poda, terra e folhagem · sacos inclusos" },
    { title: "Retirada bruta no mesmo dia", desc: "Para volumes menores em até 6h" },
  ],
  planos: [
    { title: "Plano mensal de obra", desc: "Faturamento na nota · gestor exclusivo", tag: "B2B" },
    { title: "Conjunto recorrente · sem garantia", desc: "Volume corporativo isenta a Garantia Tambor" },
    { title: "Coleta recorrente semanal", desc: "Equipe semanal automatizada · ‑12% logística" },
  ],
};

interface Professional {
  name: string;
  role: string;
  rating: number;
  jobs: number;
  icon: LucideIcon;
  hourly: number;
}

const professionals: Professional[] = [
  { name: "Equipe Pedreiro+", role: "Pedreiro", rating: 4.9, jobs: 312, icon: HardHat, hourly: 65 },
  { name: "Hidro Pro", role: "Encanador", rating: 4.8, jobs: 184, icon: Wrench, hourly: 85 },
  { name: "Frete Rápido SP", role: "Transporte", rating: 4.9, jobs: 950, icon: Truck, hourly: 70 },
  { name: "Studio Cor", role: "Pintor", rating: 5.0, jobs: 220, icon: Paintbrush, hourly: 75 },
  { name: "Demolidores BR", role: "Demolição", rating: 4.7, jobs: 130, icon: Scissors, hourly: 95 },
];

export function ServiceRequestModal({ open, onClose, category }: Props) {
  const [requestOpen, setRequestOpen] = useState(false);
  const wt = category ? workTypes[category.id] : null;
  const items = category ? offersByType[category.id] ?? [] : [];
  const Icon = category?.icon;

  return (
    <>
      <AnimatePresence>
        {open && category && wt && (
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
              className="fixed inset-x-0 bottom-0 z-[60] bg-surface rounded-t-[32px] shadow-elegant max-h-[92vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-surface pt-2.5 pb-1 z-10">
                <div className="mx-auto h-1.5 w-10 rounded-full bg-border" />
              </div>

              <div className="px-5 pt-3 pb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-primary-soft flex items-center justify-center">
                    {Icon && <Icon className={`h-5 w-5 ${category.color}`} strokeWidth={2.2} />}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      Serviço sugerido
                    </p>
                    <h2 className="text-[19px] font-semibold text-foreground">
                      {category.label}
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

              {/* Banner profissionais — scroll horizontal */}
              <div className="px-5 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12px] font-semibold text-foreground inline-flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Profissionais especializados
                  </p>
                  <button className="text-[11px] text-primary font-medium">Ver todos</button>
                </div>
                <div className="flex gap-2.5 overflow-x-auto -mx-5 px-5 pb-2 no-scrollbar snap-x snap-mandatory">
                  {professionals.map((p) => (
                    <div
                      key={p.name}
                      className="snap-start shrink-0 w-[210px] rounded-2xl border border-border bg-gradient-to-br from-primary-soft/30 to-surface p-3 flex items-center gap-3"
                    >
                      <div className="h-11 w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-glow">
                        <p.icon className="h-5 w-5" strokeWidth={2.2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] font-semibold text-foreground truncate">
                          {p.name}
                        </p>
                        <p className="text-[10.5px] text-muted-foreground truncate">{p.role}</p>
                        <div className="mt-0.5 flex items-center gap-1 text-[10px]">
                          <Star className="h-2.5 w-2.5 fill-warning text-warning" />
                          <span className="font-semibold text-foreground">{p.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">· {p.jobs}</span>
                          <span className="ml-auto text-primary font-semibold">R${p.hourly}/h</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-5 pb-7 space-y-4">
                <p className="text-[12.5px] text-muted-foreground">
                  Selecione um plano ou customize seu pedido conforme a sua obra. Você terá benefícios específicos para <strong className="text-foreground">{category.label.toLowerCase()}</strong>.
                </p>

                {/* Benefits chips */}
                <div className="flex flex-wrap gap-1.5">
                  {wt.benefits.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1 rounded-full bg-primary-soft/60 text-foreground text-[10.5px] font-medium px-2.5 py-1"
                    >
                      <Sparkles className="h-2.5 w-2.5 text-primary" />
                      {b}
                    </span>
                  ))}
                </div>

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
                    Customize material, prazo, datas e janela de entrega.
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

      <RequestModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        workType={category?.id}
      />
    </>
  );
}
