import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon,
  Clock,
  Truck,
  CheckCircle2,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { calcPricing } from "@/lib/pricing";
import { unavailableDates, getSlotsForDate } from "@/lib/mock-orders";

interface Props {
  /** Called when the user confirms a reservation. */
  onReserve?: (info: { date: Date; slot: string; qty: number; days: number }) => void;
  className?: string;
}

const prazos = [
  { label: "1 dia", days: 1 },
  { label: "3 dias", days: 3 },
  { label: "Semanal", days: 7 },
  { label: "Quinzenal", days: 14 },
];

const benefits = [
  "Reserva garantida por até 24h",
  "Reagendamento sem custo até a véspera",
  "Motorista pré-alocado para a janela escolhida",
  "Frete cobre retirada + descarte correto",
];

export function DeliveryScheduler({ onReserve, className }: Props) {
  const [date, setDate] = useState<Date | undefined>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });
  const [slot, setSlot] = useState<string | null>(null);
  const [qty, setQty] = useState(2);
  const [prazoIdx, setPrazoIdx] = useState(1);
  const [reserved, setReserved] = useState(false);

  const days = prazos[prazoIdx].days;
  const pricing = useMemo(() => calcPricing({ qty, days, distanceKm: 12, loyalty: true }), [qty, days]);
  const slots = useMemo(() => (date ? getSlotsForDate(date) : []), [date]);

  const endDate = useMemo(() => {
    if (!date) return undefined;
    const e = new Date(date);
    e.setDate(e.getDate() + days);
    return e;
  }, [date, days]);

  const fmt = (d?: Date) =>
    d ? d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : "—";

  function handleReserve() {
    if (!date || !slot) return;
    setReserved(true);
    onReserve?.({ date, slot, qty, days });
  }

  return (
    <div className={cn("rounded-3xl border border-border bg-surface p-5 shadow-soft", className)}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="h-10 w-10 rounded-2xl bg-primary-soft text-primary flex items-center justify-center">
          <CalendarIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-[16px] font-semibold text-foreground">Agende sua entrega</h3>
          <p className="text-[12px] text-muted-foreground">Escolha data, janela e reserve o horário</p>
        </div>
      </div>

      {/* Quantidade + prazo */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-2xl border border-border bg-background p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Tambores</p>
          <div className="mt-2 flex items-center justify-between">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center active:scale-95"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-[18px] font-semibold tabular-nums">{qty}</span>
            <button
              onClick={() => setQty(Math.min(10, qty + 1))}
              className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center active:scale-95"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-background p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Prazo</p>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {prazos.map((p, i) => (
              <button
                key={p.label}
                onClick={() => setPrazoIdx(i)}
                className={`rounded-lg py-1.5 text-[11px] font-semibold transition-all ${
                  prazoIdx === i
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendário */}
      <div className="rounded-2xl border border-border bg-background p-2 flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            setDate(d);
            setSlot(null);
            setReserved(false);
          }}
          disabled={(d) => {
            const today = new Date(new Date().setHours(0, 0, 0, 0));
            const max = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60);
            return d < today || d > max || unavailableDates.has(d.toDateString());
          }}
          modifiers={{ unavailable: (d) => unavailableDates.has(d.toDateString()) }}
          modifiersClassNames={{ unavailable: "line-through text-muted-foreground/50 opacity-60" }}
          className={cn("p-2 pointer-events-auto")}
        />
      </div>

      {/* Janelas */}
      {date && slots.length > 0 && (
        <div className="mt-4">
          <p className="text-[12px] font-semibold text-foreground mb-2">Janelas disponíveis</p>
          <div className="grid grid-cols-2 gap-2">
            {slots.map((s) => (
              <button
                key={s.label}
                disabled={!s.available}
                onClick={() => {
                  setSlot(s.label);
                  setReserved(false);
                }}
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
        </div>
      )}

      {/* Regras e benefícios */}
      <div className="mt-4 rounded-2xl bg-primary-soft/40 border border-primary/20 p-3.5">
        <p className="text-[12px] font-semibold text-foreground inline-flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-primary" /> Regras e benefícios
        </p>
        <ul className="mt-2 space-y-1.5">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-1.5 text-[11.5px] text-foreground/80">
              <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Resumo de cobrança */}
      <div className="mt-4 rounded-2xl bg-muted/40 border border-border p-4">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
          Resumo da cobrança
        </p>
        <Row label={`Diária · ${days}d × ${qty} tambor(es)`} value={`R$ ${pricing.subtotal}`} />
        <Row label={`Frete · ${pricing.distanceKm} km`} value={`R$ ${pricing.logistics}`} />
        {pricing.handlingFee > 0 && <Row label="Manuseio rápido" value={`R$ ${pricing.handlingFee}`} />}
        {pricing.loyaltyDiscountValue > 0 && (
          <Row label="Desconto fidelidade" value={`- R$ ${pricing.loyaltyDiscountValue}`} accent />
        )}
        <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
          <span className="text-[13px] font-semibold text-foreground">Total</span>
          <span className="text-[18px] font-bold text-foreground tabular-nums">R$ {pricing.total}</span>
        </div>
        <p className="mt-1 text-[11px] text-success font-semibold inline-flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> R$ {pricing.pixTotal} no PIX (20% off)
        </p>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Reserva: {fmt(date)} → {fmt(endDate)} {slot ? `· ${slot}` : ""}
        </p>
      </div>

      <button
        onClick={handleReserve}
        disabled={!date || !slot || reserved}
        className="mt-4 w-full rounded-2xl bg-primary text-primary-foreground py-3.5 text-[14px] font-semibold active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {reserved ? (
          <>
            <CheckCircle2 className="h-4 w-4" /> Horário reservado
          </>
        ) : (
          <>
            <Truck className="h-4 w-4" /> Reservar este horário
          </>
        )}
      </button>

      <AnimatePresence>
        {reserved && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 rounded-xl bg-success/10 border border-success/20 px-3 py-2.5 text-[11.5px] text-foreground/80 flex items-center gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5 text-success" />
            Sua reserva está garantida por 24h. Finalize o pedido para confirmar.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span className={`text-[13px] font-medium tabular-nums ${accent ? "text-success" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}
