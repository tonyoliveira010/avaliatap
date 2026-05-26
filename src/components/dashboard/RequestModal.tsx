import { AnimatePresence, motion } from "motion/react";
import {
  X,
  Minus,
  Plus,
  MapPin,
  Package2,
  Camera,
  ChevronRight,
  ChevronDown,
  Calendar as CalendarIcon,
  Truck,
  Clock,
  CheckCircle2,
  Info,
  RefreshCw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PromoCards } from "./PromoCards";
import { PaymentModal, type OrderSummary } from "./PaymentModal";
import { unavailableDates, getSlotsForDate } from "@/lib/mock-orders";
import { cn } from "@/lib/utils";


interface Props {
  open: boolean;
  onClose: () => void;
}

const materials = ["Entulho", "Areia", "Pedra", "Madeira", "Gesso", "Recicláveis", "Terra"];
const prazos = [
  { label: "1 dia", days: 1 },
  { label: "3 dias", days: 3 },
  { label: "Semanal", days: 7 },
  { label: "Custom", days: 5 },
];

export function RequestModal({ open, onClose }: Props) {
  const [material, setMaterial] = useState("Entulho");
  const [qty, setQty] = useState(1);
  const [prazoIdx, setPrazoIdx] = useState(1);
  const [address, setAddress] = useState("R. Aspicuelta, 350 - Vila Madalena");
  const [date, setDate] = useState<Date | undefined>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });
  const [payOpen, setPayOpen] = useState(false);
  const [slot, setSlot] = useState<string | null>(null);

  const diaria = 80;
  const dias = prazos[prazoIdx].days;
  const subtotal = diaria * dias * qty;
  const logistica = 60 + (qty > 1 ? (qty - 1) * 15 : 0);
  // Caução agora é cobrado somente em caso de demora/pendência — não entra no total
  const caucao = 100 * qty;
  const total = subtotal + logistica;

  const slots = useMemo(() => (date ? getSlotsForDate(date) : []), [date]);
  const driverEta = useMemo(() => 18 + (qty - 1) * 4, [qty]);

  const summary: OrderSummary = useMemo(
    () => ({
      material,
      qty,
      dias,
      address,
      reservationDate: date,
      reservationSlot: slot ?? undefined,
      driverEta,
      subtotal,
      logistica,
      caucao,
      total,
    }),
    [material, qty, dias, address, date, slot, driverEta, subtotal, logistica, caucao, total],
  );


  return (
    <>
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
              className="fixed inset-x-0 bottom-0 z-50 bg-surface rounded-t-4xl shadow-elegant max-h-[94vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-surface pt-2.5 pb-1 z-10">
                <div className="mx-auto h-1.5 w-10 rounded-full bg-border" />
              </div>

              <div className="px-5 pt-3 pb-2 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-primary-soft flex items-center justify-center">
                    <Package2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-semibold text-foreground">
                      Solicitar tambor
                    </h2>
                    <p className="text-[12px] text-muted-foreground">Configure seu pedido</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-95"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-5 pb-6 space-y-6 mt-3">
                <Field label="Tipo de material">
                  <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 no-scrollbar">
                    {materials.map((m) => (
                      <button
                        key={m}
                        onClick={() => setMaterial(m)}
                        className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-medium border transition-all ${
                          material === m
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-surface text-foreground border-border hover:border-primary/40"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Quantidade de tambores">
                  <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-2 py-2">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center active:scale-95"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-[22px] font-semibold tabular-nums">{qty}</span>
                    <button
                      onClick={() => setQty(Math.min(10, qty + 1))}
                      className="h-11 w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {qty >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center gap-2 rounded-xl bg-primary-soft/50 text-foreground px-3 py-2 text-[12px]"
                    >
                      <Package2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>
                        Será criado um <strong className="font-semibold">conjunto</strong> com{" "}
                        {qty} tambores agrupados — vistoria e coleta unificadas.
                      </span>
                    </motion.div>
                  )}
                </Field>

                <Field label="Endereço de entrega">
                  <div className="rounded-2xl border border-border bg-surface px-4 py-3.5 flex items-center gap-3 focus-within:border-primary transition-colors">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                      placeholder="Buscar endereço..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-muted-foreground"
                    />
                  </div>
                </Field>

                <Field label="Prazo desejado">
                  <div className="grid grid-cols-4 gap-2">
                    {prazos.map((p, i) => (
                      <button
                        key={p.label}
                        onClick={() => setPrazoIdx(i)}
                        className={`rounded-xl border py-2.5 text-[12px] font-medium transition-all flex flex-col items-center gap-1 ${
                          prazoIdx === i
                            ? "bg-primary-soft border-primary text-foreground"
                            : "bg-surface border-border text-foreground hover:border-primary/40"
                        }`}
                      >
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {p.label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Reservar data de entrega">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className={cn(
                          "w-full rounded-2xl border border-border bg-surface px-4 py-3.5 flex items-center gap-3 text-left hover:border-primary/40 transition-colors",
                        )}
                      >
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-[14px] font-medium text-foreground">
                            {date
                              ? date.toLocaleDateString("pt-BR", {
                                  weekday: "long",
                                  day: "2-digit",
                                  month: "long",
                                })
                              : "Escolher data"}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Garanta a disponibilidade do dia
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover border-border" align="center">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                          setDate(d);
                          setSlot(null);
                        }}
                        disabled={(d) => {
                          const today = new Date(new Date().setHours(0, 0, 0, 0));
                          const max = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60);
                          return (
                            d < today ||
                            d > max ||
                            unavailableDates.has(d.toDateString())
                          );
                        }}
                        modifiers={{
                          unavailable: (d) => unavailableDates.has(d.toDateString()),
                        }}
                        modifiersClassNames={{
                          unavailable:
                            "line-through text-muted-foreground/50 opacity-60",
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                      <div className="px-3 pb-3 -mt-1 flex items-center justify-between gap-3 text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-primary" /> Disponível
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-muted-foreground/40" /> Esgotado
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-primary font-semibold">
                          <RefreshCw className="h-2.5 w-2.5" /> Reagendável
                        </span>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {date && (
                    <p className="mt-2 text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
                      <Info className="h-3 w-3 text-primary" />
                      Você pode reagendar essa data até 24h antes da entrega, desde que haja janela disponível.
                    </p>
                  )}
                </Field>

                {date && slots.length > 0 && (
                  <Field label="Janela de entrega disponível">
                    <div className="grid grid-cols-2 gap-2">
                      {slots.map((s) => (
                        <button
                          key={s.label}
                          disabled={!s.available}
                          onClick={() => setSlot(s.label)}
                          className={`rounded-xl border py-2.5 px-3 text-[12px] font-medium transition-all flex items-center justify-center gap-1.5 ${
                            !s.available
                              ? "bg-muted/30 border-border text-muted-foreground/50 line-through cursor-not-allowed"
                              : slot === s.label
                                ? "bg-primary-soft border-primary text-foreground"
                                : "bg-surface border-border text-foreground hover:border-primary/40"
                          }`}
                        >
                          <Clock className="h-3 w-3" />
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </Field>
                )}

                {slot && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-muted/40 border border-border p-3.5 flex items-center gap-3"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-foreground">
                        Motorista pré-alocado
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Iveco Daily · ETA inicial {driverEta} min na janela
                      </p>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </motion.div>
                )}


                <Field label="Foto da obra (opcional)">
                  <button className="w-full rounded-2xl border-2 border-dashed border-border bg-muted/40 px-4 py-5 flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-colors">
                    <Camera className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[12px] text-muted-foreground">
                      Toque para adicionar
                    </span>
                  </button>
                </Field>

                <PromoCards />

                <div className="rounded-3xl bg-muted/40 border border-border p-4 space-y-1">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                    Resumo da cobrança
                  </p>

                  <CostLine
                    label="Diária"
                    sub={`${dias} dia(s) × ${qty} tambor(es) × R$ ${diaria}`}
                    value={`R$ ${subtotal}`}
                    explanation="Valor cobrado por dia de permanência de cada tambor na obra. Inclui o uso do equipamento, manutenção e seguro contra danos parciais. Quanto mais dias contratados, melhor é o desconto progressivo no próximo aluguel."
                  />
                  <CostLine
                    label="Frete logístico"
                    sub={`Entrega + retirada · ${qty} item(ns)`}
                    value={`R$ ${logistica}`}
                    explanation="Custo de transporte do tambor até a obra e da retirada de volta ao centro logístico. O valor é estimado pela região, distância e quantidade de tambores. Pedidos com 2 ou mais tambores ganham otimização de rota."
                  />
                  <CostLine
                    label="Caução (somente em demora)"
                    sub="Não cobrado agora · garantia"
                    value={`R$ ${caucao}`}
                    muted
                    explanation="O caução é uma garantia que NÃO é cobrada agora. Ele só será debitado caso você não solicite a retirada do tambor dentro do prazo combinado, evitando que o equipamento fique parado e bloqueie a logística de outros clientes. Solicitando a coleta dentro do prazo, nenhum valor adicional é cobrado."
                  />

                  <div className="h-px bg-border my-2" />
                  <Row label="Total previsto agora" value={`R$ ${total}`} bold />
                  <p className="text-[10px] text-muted-foreground pt-1">
                    Caução de R$ {caucao} fica reservado e só é debitado em caso de atraso na solicitação de retirada.
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPayOpen(true)}
                  className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-semibold text-[15px] inline-flex items-center justify-center gap-2 shadow-glow"
                >
                  Continuar para pagamento
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <PaymentModal
        open={payOpen}
        onClose={() => {
          setPayOpen(false);
          onClose();
        }}
        summary={summary}
      />
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[12px] font-medium text-foreground/80 mb-2">{label}</p>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  muted,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-[13px] ${muted ? "text-muted-foreground" : "text-foreground/80"}`}>
        {label}
      </span>
      <span
        className={`tabular-nums ${
          bold ? "text-[16px] font-semibold text-foreground" : "text-[13px] font-medium text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function CostLine({
  label,
  sub,
  value,
  explanation,
  muted,
}: {
  label: string;
  sub?: string;
  value: string;
  explanation: string;
  muted?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/60 last:border-0 py-2 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 text-left active:opacity-80"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[13px] font-semibold ${
                muted ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {label}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
          {sub && <p className="text-[10.5px] text-muted-foreground mt-0.5">{sub}</p>}
        </div>
        <span
          className={`tabular-nums text-[14px] font-semibold ${
            muted ? "text-muted-foreground line-through decoration-1" : "text-foreground"
          }`}
        >
          {value}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-[11.5px] text-muted-foreground leading-relaxed overflow-hidden"
          >
            <span className="block pt-2">{explanation}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
