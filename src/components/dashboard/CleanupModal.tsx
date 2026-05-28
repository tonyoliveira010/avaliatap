import { AnimatePresence, motion } from "motion/react";
import { X, Sparkles, Check, ChevronRight, Users, Trash2, Brush, Hammer } from "lucide-react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  basePrice: number;
  /** Prazo base em horas para 2 profissionais */
  baseHours: number;
  bullets: string[];
  badge?: string;
}

const services: Service[] = [
  {
    id: "bruta",
    icon: Trash2,
    title: "Limpeza bruta de entulho",
    desc: "Removemos resíduos pesados da obra (gesso, madeira, restos de alvenaria).",
    basePrice: 280,
    baseHours: 4,
    bullets: ["Equipe com EPI", "Sacos reforçados inclusos", "Retirada no mesmo dia"],
    badge: "Mais pedido",
  },
  {
    id: "pos_obra",
    icon: Brush,
    title: "Faxina pós-obra",
    desc: "Limpeza fina após a obra: poeira, manchas de tinta, vidros e pisos.",
    basePrice: 360,
    baseHours: 5,
    bullets: ["Produtos profissionais", "2 diaristas + supervisor", "Janelas e rodapés"],
  },
  {
    id: "demolicao",
    icon: Hammer,
    title: "Pequenas demolições + limpeza",
    desc: "Quebra de parede ou piso pontual com retirada do material no mesmo serviço.",
    basePrice: 540,
    baseHours: 8,
    bullets: ["Cobertura para risco", "Inclui 1 tambor 240L", "Orçamento sem compromisso"],
  },
  {
    id: "jardim",
    icon: Sparkles,
    title: "Limpeza de jardim e quintal",
    desc: "Poda leve, terra, folhas e galhos retirados com sacos próprios.",
    basePrice: 220,
    baseHours: 3,
    bullets: ["Sacos biodegradáveis", "Ideal pré-mudança", "Equipe enxuta"],
  },
];

export function CleanupModal({ open, onClose }: Props) {
  const [selected, setSelected] = useState<string>("bruta");
  const [crew, setCrew] = useState(2);

  return (
    <AnimatePresence>
      {open && (
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
            className="fixed inset-x-0 bottom-0 z-[60] bg-surface rounded-t-[32px] shadow-elegant max-h-[94vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-surface pt-2.5 pb-1 z-10">
              <div className="mx-auto h-1.5 w-10 rounded-full bg-border" />
            </div>

            <div className="px-5 pt-3 pb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-success/15 flex items-center justify-center">
                  <Brush className="h-5 w-5 text-success" strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Serviço Tambor
                  </p>
                  <h2 className="text-[19px] font-semibold text-foreground">
                    Limpeza de entulho & faxina
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

            <div className="px-5 pb-3">
              <p className="text-[12.5px] text-muted-foreground">
                Contrate nossa equipe para retirar os resíduos brutos da obra ou deixar o
                local impecável. Você pode combinar com seus tambores.
              </p>
            </div>

            <div className="px-5 pb-5 space-y-2.5">
              {services.map((s) => {
                const active = selected === s.id;
                return (
                  <motion.button
                    key={s.id}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelected(s.id)}
                    className={`w-full text-left rounded-2xl border p-3.5 flex gap-3 transition-all ${
                      active
                        ? "border-success bg-success/10"
                        : "border-border bg-background/40 hover:border-success/40"
                    }`}
                  >
                    <div
                      className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                        active ? "bg-success text-white" : "bg-muted text-foreground"
                      }`}
                    >
                      <s.icon className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[14px] font-semibold text-foreground">{s.title}</p>
                        {s.badge && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-success text-white px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                            {s.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11.5px] text-muted-foreground mt-0.5 leading-snug">
                        {s.desc}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {s.bullets.slice(0, 2).map((b) => (
                            <span
                              key={b}
                              className="inline-flex items-center gap-1 text-[10px] text-foreground/70"
                            >
                              <Check className="h-2.5 w-2.5 text-success" /> {b}
                            </span>
                          ))}
                        </div>
                        <p className="text-[12px] font-bold text-foreground tabular-nums">
                          a partir de R$ {s.basePrice}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="px-5 pb-5">
              <p className="text-[12px] font-medium text-foreground/80 mb-2">Tamanho da equipe</p>
              <div className="rounded-2xl border border-border bg-background/40 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[12px] text-foreground/80">
                    <Users className="h-3.5 w-3.5 text-success" />
                    {crew} {crew === 1 ? "profissional" : "profissionais"}
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    + R$ {(crew - 1) * 90} sobre a base
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={crew}
                  onChange={(e) => setCrew(Number(e.target.value))}
                  className="w-full accent-success"
                />
              </div>
            </div>

            {(() => {
              const svc = services.find((s) => s.id === selected) ?? services[0];
              const crewMultiplier = 1 + (crew - 2) * 0.18;
              const total = Math.max(svc.basePrice, Math.round(svc.basePrice * crewMultiplier + (crew - 1) * 90));
              const hours = Math.max(1, Math.round(svc.baseHours * (2 / Math.max(1, crew))));
              const pix = Math.round(total * 0.8);
              return (
                <div className="mx-5 mb-5 rounded-3xl border border-success/30 bg-success/10 p-4">
                  <p className="text-[10.5px] uppercase tracking-wider text-success/90 font-bold">
                    Estimativa para este serviço
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total estimado</p>
                      <p className="text-[22px] font-semibold text-foreground tabular-nums leading-none mt-0.5">
                        R$ {total}
                      </p>
                      <p className="text-[10.5px] text-success font-semibold mt-1">
                        PIX à vista: R$ {pix}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Prazo previsto</p>
                      <p className="text-[22px] font-semibold text-foreground tabular-nums leading-none mt-0.5">
                        ~{hours}h
                      </p>
                      <p className="text-[10.5px] text-muted-foreground mt-1">
                        {crew} {crew === 1 ? "profissional" : "profissionais"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="px-5 pb-7">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-success text-white py-4 font-semibold text-[14px] shadow-glow"
              >
                Solicitar limpeza
                <ChevronRight className="h-4 w-4" />
              </motion.button>
              <p className="text-[10.5px] text-muted-foreground text-center mt-2">
                Estimativa preliminar · confirmamos o valor exato após a vistoria
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
