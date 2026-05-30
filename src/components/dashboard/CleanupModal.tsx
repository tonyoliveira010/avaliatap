import { AnimatePresence, motion } from "motion/react";
import {
  X,
  Sparkles,
  Check,
  ChevronRight,
  ChevronLeft,
  Users,
  Trash2,
  Brush,
  Hammer,
  Ruler,
  Camera,
  MapPin,
  QrCode,
  Coins,
  Wallet,
  Radar,
  Star,
  Phone,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

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

type Step = "service" | "details" | "payment" | "finding";

const payMethods = [
  { id: "pix", label: "PIX à vista", icon: QrCode, note: "-20% no total" },
  { id: "credits", label: "Descontar dos créditos", icon: Coins, note: "-10% extra" },
  { id: "presencial", label: "Pagar no ato", icon: Wallet, note: "Reserva de 40% via PIX" },
] as const;

export function CleanupModal({ open, onClose }: Props) {
  const [step, setStep] = useState<Step>("service");
  const [selected, setSelected] = useState<string>("bruta");
  const [crew, setCrew] = useState(2);
  const [area, setArea] = useState(40);
  const [address, setAddress] = useState("R. Aspicuelta, 350 - Vila Madalena");
  const [photo, setPhoto] = useState<string | null>(null);
  const [pay, setPay] = useState<(typeof payMethods)[number]["id"]>("pix");
  const fileRef = useRef<HTMLInputElement>(null);

  const svc = services.find((s) => s.id === selected) ?? services[0];
  const crewMultiplier = 1 + (crew - 2) * 0.18;
  const areaExtra = Math.max(0, area - 40) * 3.5;
  const total = Math.max(
    svc.basePrice,
    Math.round(svc.basePrice * crewMultiplier + (crew - 1) * 90 + areaExtra),
  );
  const hours = Math.max(1, Math.round((svc.baseHours * (2 / Math.max(1, crew))) * (area / 40)));
  const pix = Math.round(total * 0.8);
  const credits = Math.round(total * 0.72);

  // reset on close
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep("service");
        setPhoto(null);
        setCrew(2);
        setArea(40);
        setPay("pix");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const onPhotoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPhoto(URL.createObjectURL(f));
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-[60] bg-surface rounded-t-[32px] shadow-elegant max-h-[94vh] overflow-y-auto max-w-md mx-auto"
          >
            <div className="sticky top-0 bg-surface pt-2.5 pb-1 z-10">
              <div className="mx-auto h-1.5 w-10 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="px-5 pt-3 pb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                {step !== "service" && step !== "finding" && (
                  <button
                    onClick={() => setStep(step === "payment" ? "details" : "service")}
                    className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-95"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                )}
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-success/15 flex items-center justify-center">
                    <Brush className="h-5 w-5 text-success" strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      Serviço Tambor
                    </p>
                    <h2 className="text-[18px] font-semibold text-foreground">
                      {step === "service" && "Limpeza & faxina"}
                      {step === "details" && "Detalhes do local"}
                      {step === "payment" && "Pagamento"}
                      {step === "finding" && "Buscando equipe"}
                    </h2>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Step progress */}
            {step !== "finding" && (
              <div className="px-5 pb-3 flex items-center gap-1.5">
                {(["service", "details", "payment"] as Step[]).map((s, i) => {
                  const order = ["service", "details", "payment"];
                  const cur = order.indexOf(step);
                  const done = i <= cur;
                  return (
                    <div
                      key={s}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        done ? "bg-success" : "bg-border"
                      }`}
                    />
                  );
                })}
              </div>
            )}

            {/* ---------- STEP: SERVICE ---------- */}
            {step === "service" && (
              <div className="px-5 pb-5 space-y-2.5">
                <p className="text-[12.5px] text-muted-foreground pb-1">
                  Escolha o tipo de serviço. Você pode combinar com seus tambores.
                </p>
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

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep("details")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-success text-white py-4 font-semibold text-[14px] shadow-glow mt-2"
                >
                  Continuar
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            )}

            {/* ---------- STEP: DETAILS ---------- */}
            {step === "details" && (
              <div className="px-5 pb-5 space-y-4">
                {/* Crew */}
                <div>
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

                {/* Area */}
                <div>
                  <p className="text-[12px] font-medium text-foreground/80 mb-2 flex items-center gap-1.5">
                    <Ruler className="h-3.5 w-3.5 text-success" /> Metragem da área
                  </p>
                  <div className="rounded-2xl border border-border bg-background/40 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[18px] font-semibold text-foreground tabular-nums">
                        {area} m²
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {area > 40 ? `+ R$ ${Math.round(areaExtra)} de área` : "incluso na base"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={300}
                      step={5}
                      value={area}
                      onChange={(e) => setArea(Number(e.target.value))}
                      className="w-full accent-success"
                    />
                  </div>
                </div>

                {/* Photo */}
                <div>
                  <p className="text-[12px] font-medium text-foreground/80 mb-2 flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-success" /> Foto do local
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={onPhotoPick}
                    className="hidden"
                  />
                  {photo ? (
                    <div className="relative rounded-2xl overflow-hidden border border-border">
                      <img src={photo} alt="Local" className="w-full h-40 object-cover" />
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="absolute bottom-2 right-2 rounded-full bg-black/60 text-white px-3 py-1.5 text-[11px] font-semibold backdrop-blur-sm"
                      >
                        Trocar foto
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="w-full rounded-2xl border border-dashed border-border bg-background/40 py-7 flex flex-col items-center gap-2 active:scale-[0.99] transition-transform"
                    >
                      <Camera className="h-6 w-6 text-muted-foreground" />
                      <span className="text-[12px] text-muted-foreground">
                        Adicionar foto do local a ser limpo
                      </span>
                    </button>
                  )}
                </div>

                {/* Address */}
                <div>
                  <p className="text-[12px] font-medium text-foreground/80 mb-2 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-success" /> Endereço
                  </p>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background/40 px-4 py-3 text-[13px] text-foreground outline-none focus:border-success/50"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep("payment")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-success text-white py-4 font-semibold text-[14px] shadow-glow"
                >
                  Ir para pagamento
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            )}

            {/* ---------- STEP: PAYMENT ---------- */}
            {step === "payment" && (
              <div className="px-5 pb-6 space-y-4">
                {/* Estimate */}
                <div className="rounded-3xl border border-success/30 bg-success/10 p-4">
                  <p className="text-[10.5px] uppercase tracking-wider text-success/90 font-bold">
                    {svc.title}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total estimado</p>
                      <p className="text-[22px] font-semibold text-foreground tabular-nums leading-none mt-0.5">
                        R$ {total}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Prazo previsto</p>
                      <p className="text-[22px] font-semibold text-foreground tabular-nums leading-none mt-0.5">
                        ~{hours}h
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-foreground/70">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-success" /> {crew} profissionais
                    </span>
                    <span className="flex items-center gap-1">
                      <Ruler className="h-3 w-3 text-success" /> {area} m²
                    </span>
                  </div>
                </div>

                {/* Pay methods */}
                <div className="space-y-2">
                  <p className="text-[12px] font-medium text-foreground/80">Forma de pagamento</p>
                  {payMethods.map((m) => {
                    const active = pay === m.id;
                    const value =
                      m.id === "pix" ? pix : m.id === "credits" ? credits : total;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setPay(m.id)}
                        className={`w-full rounded-2xl border p-3.5 flex items-center gap-3 transition-all ${
                          active ? "border-success bg-success/10" : "border-border bg-background/40"
                        }`}
                      >
                        <div
                          className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                            active ? "bg-success text-white" : "bg-muted text-foreground"
                          }`}
                        >
                          <m.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-[13px] font-semibold text-foreground">{m.label}</p>
                          <p className="text-[10.5px] text-success font-semibold">{m.note}</p>
                        </div>
                        <p className="text-[14px] font-bold text-foreground tabular-nums">
                          R$ {value}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep("finding")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-success text-white py-4 font-semibold text-[14px] shadow-glow"
                >
                  Confirmar e encontrar profissional
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
                <p className="text-[10.5px] text-muted-foreground text-center">
                  Estimativa preliminar · confirmamos o valor exato após a vistoria
                </p>
              </div>
            )}

            {/* ---------- STEP: FINDING (Uber-style) ---------- */}
            {step === "finding" && (
              <FindingProfessional
                area={area}
                crew={crew}
                onDone={() => {
                  toast.success("Profissional a caminho!", {
                    description: "Você receberá atualizações em tempo real.",
                  });
                  handleClose();
                }}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FindingProfessional({
  area,
  crew,
  onDone,
}: {
  area: number;
  crew: number;
  onDone: () => void;
}) {
  const [found, setFound] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFound(true), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="px-5 pb-8 pt-2">
      <AnimatePresence mode="wait">
        {!found ? (
          <motion.div
            key="searching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center py-8"
          >
            <div className="relative h-40 w-40 flex items-center justify-center">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-full border border-success/40"
                  initial={{ width: 56, height: 56, opacity: 0.6 }}
                  animate={{ width: 160, height: 160, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                />
              ))}
              <div className="h-16 w-16 rounded-full bg-success text-white flex items-center justify-center shadow-glow">
                <Radar className="h-7 w-7" />
              </div>
            </div>
            <h3 className="mt-6 text-[18px] font-semibold text-foreground">
              Encontrando profissional…
            </h3>
            <p className="mt-1.5 text-[12.5px] text-muted-foreground max-w-[260px]">
              Procurando a equipe mais próxima e disponível para {area} m² com {crew}{" "}
              {crew === 1 ? "profissional" : "profissionais"}.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Conectando com parceiros verificados
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="found"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-4"
          >
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-success/15 flex items-center justify-center">
                <Check className="h-7 w-7 text-success" />
              </div>
              <h3 className="mt-3 text-[18px] font-semibold text-foreground">
                Profissional encontrado!
              </h3>
              <p className="text-[12.5px] text-muted-foreground mt-1">
                A equipe está a caminho do seu endereço.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-background/40 p-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-success to-primary flex items-center justify-center text-white font-bold text-[15px]">
                CR
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-foreground">Carlos Ribeiro</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Star className="h-3 w-3 text-warning fill-warning" /> 4,9 · 320 serviços
                </p>
              </div>
              <div className="text-right">
                <p className="text-[18px] font-bold text-success tabular-nums leading-none">
                  18<span className="text-[11px] text-muted-foreground font-medium ml-0.5">min</span>
                </p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-1">
                  Chegada
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background/40 py-3.5 font-semibold text-[13px] text-foreground active:scale-[0.98]">
                <Phone className="h-4 w-4 text-success" /> Contatar
              </button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onDone}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-success text-white py-3.5 font-semibold text-[13px] shadow-glow"
              >
                Acompanhar
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
