import { AnimatePresence, motion } from "motion/react";
import { X, Camera, Check, CheckCircle2, Upload, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { DrumUnit } from "./ActiveOrderCard";

interface Props {
  open: boolean;
  onClose: () => void;
  drum: DrumUnit | null;
  orderId: string;
}

const checklistItems = [
  { id: "no_overflow", label: "Sem transbordo de material" },
  { id: "no_hazard", label: "Sem materiais perigosos (gás, químicos)" },
  { id: "lid_clear", label: "Tampa/topo desobstruído" },
  { id: "access_ok", label: "Acesso livre para coleta" },
];

const occupancyLevels = [
  { value: 25, label: "Início", desc: "Pouca ocupação" },
  { value: 50, label: "Metade", desc: "50% ocupado" },
  { value: 75, label: "Quase cheio", desc: "75% ocupado" },
  { value: 100, label: "Cheio", desc: "Solicitar coleta" },
];

export function PhotoChecklistModal({ open, onClose, drum, orderId }: Props) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [occupancy, setOccupancy] = useState<number>(50);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [stage, setStage] = useState<"capture" | "success">("capture");

  useEffect(() => {
    if (open && drum) {
      setPhoto(drum.photoUrl ?? null);
      setOccupancy(drum.occupancy || 50);
      setChecks({});
      setStage("capture");
    }
  }, [open, drum]);

  if (!drum) return null;

  const allChecked = checklistItems.every((i) => checks[i.id]);
  const canSubmit = !!photo && allChecked;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-[70] bg-surface rounded-t-[32px] shadow-elegant max-h-[94vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-surface pt-2.5 pb-1 z-10">
              <div className="mx-auto h-1.5 w-10 rounded-full bg-border" />
            </div>

            <div className="px-5 pt-3 pb-2 flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Vistoria diária · {orderId}
                </p>
                <h2 className="text-[19px] font-semibold text-foreground mt-0.5">
                  Tambor {drum.id}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {stage === "capture" ? (
              <div className="px-5 pb-7 space-y-5 mt-3">
                {/* Photo */}
                <div>
                  <p className="text-[11px] font-medium text-foreground/80 mb-2">
                    Foto do tambor
                  </p>
                  <div className="relative rounded-3xl overflow-hidden border border-border bg-background aspect-[4/3]">
                    {photo ? (
                      <>
                        <img src={photo} alt="" className="h-full w-full object-cover" />
                        <button
                          onClick={() => setPhoto(null)}
                          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-success/90 text-primary-foreground px-2.5 py-1 text-[10px] font-semibold">
                            <Sparkles className="h-3 w-3" /> IA · enquadramento OK
                          </span>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          setPhoto(
                            `https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&q=80&auto=format&fit=crop&t=${Date.now()}`,
                          )
                        }
                        className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-glow">
                          <Camera className="h-6 w-6" />
                        </div>
                        <span className="text-[13px] font-medium">Toque para capturar</span>
                        <span className="text-[11px]">JPG · até 8MB</span>
                      </button>
                    )}
                  </div>
                  {photo && (
                    <button
                      onClick={() => setPhoto(null)}
                      className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-muted text-foreground py-2.5 text-[12px] font-medium"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Substituir foto
                    </button>
                  )}
                </div>

                {/* Occupancy */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-medium text-foreground/80">
                      Ocupação estimada
                    </p>
                    <span className="text-[12px] font-semibold text-primary tabular-nums">
                      {occupancy}%
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {occupancyLevels.map((lv) => (
                      <button
                        key={lv.value}
                        onClick={() => setOccupancy(lv.value)}
                        className={`rounded-xl border py-2.5 text-[11px] font-medium transition-all flex flex-col items-center gap-0.5 ${
                          occupancy === lv.value
                            ? "bg-primary-soft border-primary text-foreground"
                            : "bg-surface border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        <span className="text-[13px] font-semibold tabular-nums text-foreground">
                          {lv.value}%
                        </span>
                        {lv.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checklist */}
                <div>
                  <p className="text-[11px] font-medium text-foreground/80 mb-2">
                    Checklist de conformidade
                  </p>
                  <ul className="space-y-2">
                    {checklistItems.map((item) => {
                      const checked = !!checks[item.id];
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() =>
                              setChecks((c) => ({ ...c, [item.id]: !c[item.id] }))
                            }
                            className={`w-full flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all ${
                              checked
                                ? "bg-primary-soft/40 border-primary/40"
                                : "bg-surface border-border"
                            }`}
                          >
                            <div
                              className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                                checked
                                  ? "border-primary bg-primary"
                                  : "border-border"
                              }`}
                            >
                              {checked && (
                                <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
                              )}
                            </div>
                            <span className="text-[13px] text-foreground">{item.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={!canSubmit}
                  onClick={() => setStage("success")}
                  className={`w-full rounded-2xl py-4 font-semibold text-[15px] inline-flex items-center justify-center gap-2 transition-all ${
                    canSubmit
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Enviar vistoria
                </motion.button>

                {!canSubmit && (
                  <p className="text-center text-[11px] text-muted-foreground -mt-2">
                    {!photo
                      ? "Adicione uma foto para continuar"
                      : "Marque todos os itens do checklist"}
                  </p>
                )}
              </div>
            ) : (
              <div className="px-5 pb-8 pt-3 text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="mx-auto h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-glow"
                >
                  <Check className="h-8 w-8 text-primary-foreground" strokeWidth={3} />
                </motion.div>
                <h3 className="mt-4 text-[18px] font-semibold text-foreground">
                  Vistoria registrada
                </h3>
                <p className="mt-1 text-[12px] text-muted-foreground max-w-[260px] mx-auto">
                  Ocupação atualizada para <strong className="text-foreground">{occupancy}%</strong>. Status do tambor sincronizado.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-left">
                  <div className="rounded-2xl bg-muted/40 border border-border p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tambor</p>
                    <p className="text-[13px] font-semibold text-foreground mt-0.5">{drum.id}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 border border-border p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Validada</p>
                    <p className="text-[13px] font-semibold text-foreground mt-0.5">
                      {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="mt-6 w-full bg-primary text-primary-foreground rounded-2xl py-3.5 font-semibold text-[14px] shadow-glow"
                >
                  Concluir
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
