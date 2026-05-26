import { AnimatePresence, motion } from "motion/react";
import { X, QrCode, CreditCard, Handshake, Check, ChevronRight, ShieldCheck, MapPin, Calendar, Copy, Download, Clock, Truck } from "lucide-react";
import { useState } from "react";

export interface OrderSummary {
  material: string;
  qty: number;
  dias: number;
  address: string;
  reservationDate?: Date;
  reservationSlot?: string;
  driverEta?: number;
  subtotal: number;
  logistica: number;
  caucao: number;
  total: number;
}


interface Props {
  open: boolean;
  onClose: () => void;
  summary: OrderSummary;
}

type Method = "pix" | "card" | "in_person";

const methods: { id: Method; icon: typeof QrCode; title: string; desc: string; badge?: string }[] = [
  {
    id: "pix",
    icon: QrCode,
    title: "Pix — Reserva",
    desc: "Pague 40% do frete agora para reservar a data",
    badge: "Recomendado",
  },
  {
    id: "card",
    icon: CreditCard,
    title: "Cartão de crédito",
    desc: "Em até 3x sem juros · caução pré-autorizada",
  },
  {
    id: "in_person",
    icon: Handshake,
    title: "Pagar pessoalmente",
    desc: "No ato da entrega · pague reserva proporcional do frete",
  },
];

export function PaymentModal({ open, onClose, summary }: Props) {
  const [method, setMethod] = useState<Method>("pix");
  const [stage, setStage] = useState<"select" | "success">("select");

  // Reserva = 40% do frete logístico para garantir alocação da entrega
  const reservaFrete = Math.round(summary.logistica * 0.4);
  const amountNow =
    method === "pix" ? reservaFrete : method === "card" ? summary.total : reservaFrete;
  const amountLabel =
    method === "card" ? "Total cobrado agora" : "Reserva da entrega agora";

  function handleClose() {
    onClose();
    setTimeout(() => setStage("select"), 400);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-[60] bg-surface rounded-t-4xl shadow-elegant max-h-[94vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-surface pt-2.5 pb-1 z-10">
              <div className="mx-auto h-1.5 w-10 rounded-full bg-border" />
            </div>

            {stage === "select" ? (
              <SelectStage
                onClose={handleClose}
                onPay={() => setStage("success")}
                method={method}
                setMethod={setMethod}
                summary={summary}
                amountNow={amountNow}
                amountLabel={amountLabel}
                reservaFrete={reservaFrete}
              />
            ) : (
              <SuccessStage
                onClose={handleClose}
                amount={amountNow}
                method={method}
                summary={summary}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SelectStage({
  onClose,
  onPay,
  method,
  setMethod,
  summary,
  amountNow,
  amountLabel,
  reservaFrete,
}: {
  onClose: () => void;
  onPay: () => void;
  method: Method;
  setMethod: (m: Method) => void;
  summary: OrderSummary;
  amountNow: number;
  amountLabel: string;
  reservaFrete: number;
}) {
  return (
    <>
      <div className="px-5 pt-3 pb-2 flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            Pagamento
          </p>
          <h2 className="text-[20px] font-semibold text-foreground mt-0.5">
            Como deseja pagar?
          </h2>
        </div>
        <button
          onClick={onClose}
          className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-95"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-5 pb-6 space-y-5 mt-3">
        {/* Resumo */}
        <div className="rounded-3xl border border-border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
              Resumo do pedido
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] text-primary font-medium">
              <ShieldCheck className="h-3 w-3" /> Protegido
            </span>
          </div>
          <p className="mt-2 text-[15px] font-semibold text-foreground">
            {summary.qty}× {summary.material} · {summary.dias} dia
            {summary.dias > 1 ? "s" : ""}
          </p>
          <div className="mt-1.5 space-y-1 text-[12px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{summary.address}</span>
            </div>
            {summary.reservationDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                <span>
                  Entrega em{" "}
                  {summary.reservationDate.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })}
                  {summary.reservationSlot && (
                    <> · <Clock className="inline h-3 w-3 -mt-0.5" /> {summary.reservationSlot}</>
                  )}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Truck className="h-3 w-3" />
              <span>
                Prazo aluguel · <strong className="text-foreground">{summary.dias} dia{summary.dias > 1 ? "s" : ""}</strong>
                {summary.driverEta && <> · ETA motorista ~{summary.driverEta} min</>}
              </span>
            </div>

          </div>

          <div className="mt-3 pt-3 border-t border-border space-y-1.5">
            <Row label={`Diária × ${summary.qty}`} value={`R$ ${summary.subtotal}`} />
            <Row label="Frete logístico" value={`R$ ${summary.logistica}`} />
            <Row label="Caução" value={`R$ ${summary.caucao}`} muted />
            <div className="h-px bg-border my-1" />
            <Row label="Total previsto" value={`R$ ${summary.total}`} bold />
          </div>
        </div>

        {/* Métodos */}
        <div className="space-y-2.5">
          {methods.map((m) => {
            const active = method === m.id;
            return (
              <motion.button
                key={m.id}
                whileTap={{ scale: 0.99 }}
                onClick={() => setMethod(m.id)}
                className={`w-full text-left rounded-2xl border p-4 flex items-center gap-3 transition-all ${
                  active
                    ? "border-primary bg-primary-soft/40"
                    : "border-border bg-surface hover:border-primary/30"
                }`}
              >
                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  <m.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-semibold text-foreground">{m.title}</p>
                    {m.badge && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-muted-foreground mt-0.5 leading-snug">
                    {m.desc}
                  </p>
                </div>
                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    active ? "border-primary bg-primary" : "border-border"
                  }`}
                >
                  {active && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Aviso reserva */}
        {method !== "card" && (
          <div className="rounded-2xl bg-primary-soft/50 border border-primary/20 px-4 py-3 text-[12px] text-foreground/80 leading-snug">
            Para garantir a alocação da entrega, cobramos uma{" "}
            <strong className="text-primary font-semibold">reserva de R$ {reservaFrete}</strong>{" "}
            (40% do frete). O valor é abatido do total final.
          </div>
        )}

        {/* CTA */}
        <div className="rounded-3xl bg-muted/50 p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
              {amountLabel}
            </p>
            <p className="text-[24px] font-semibold text-foreground tabular-nums mt-0.5">
              R$ {amountNow}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onPay}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-2xl px-5 py-3.5 font-semibold text-[14px] shadow-glow"
          >
            Confirmar
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </>
  );
}

function SuccessStage({
  onClose,
  amount,
  method,
  summary,
}: {
  onClose: () => void;
  amount: number;
  method: Method;
  summary: OrderSummary;
}) {
  const methodLabel =
    method === "pix" ? "Pix · Reserva" : method === "card" ? "Cartão de crédito" : "Presencial";
  const paymentId = "TMB" + Math.floor(Math.random() * 9_000_000 + 1_000_000);

  return (
    <div className="px-5 pb-7 pt-2">
      <div className="rounded-4xl hero-gradient grain p-6 text-white text-center shadow-elegant relative overflow-hidden">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-glow"
          style={{ clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)" }}
        >
          <Check className="h-7 w-7 text-primary-foreground" strokeWidth={3} />
        </motion.div>
        <h2 className="mt-4 text-[20px] font-semibold">Pagamento confirmado!</h2>
        <p className="mt-1 text-[12px] text-white/70">
          Sua entrega está reservada com sucesso
        </p>

        {/* Recibo card */}
        <div className="mt-5 rounded-2xl bg-white text-foreground p-4 text-left relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-secondary text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
              {methodLabel}
            </span>
          </div>
          <p className="text-center text-[28px] font-semibold tabular-nums mt-2">
            R$ {amount.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-center text-[11px] text-muted-foreground mt-0.5">
            {new Date().toLocaleString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <div className="my-4 flex items-center gap-2">
            <div className="flex-1 border-t border-dashed border-border" />
            <div className="h-2 w-2 rounded-full bg-border" />
            <div className="flex-1 border-t border-dashed border-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">ID Pagamento</p>
              <p className="text-[12px] font-medium text-foreground font-mono mt-0.5">
                {paymentId}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Método</p>
              <p className="text-[12px] font-medium text-foreground mt-0.5">{methodLabel}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Pedido</p>
              <p className="text-[12px] font-medium text-foreground mt-0.5">
                {summary.qty}× {summary.material} · {summary.dias}d
              </p>
            </div>
          </div>
        </div>

        <p className="mt-5 text-[12px] text-white/60">
          Obrigado pela confiança.
          <br />
          Acompanhe sua entrega em <strong className="text-white">Pedidos</strong>.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button className="rounded-2xl bg-muted text-foreground py-3.5 text-[13px] font-medium inline-flex items-center justify-center gap-2 active:scale-95">
          <Copy className="h-4 w-4" />
          Copiar ID
        </button>
        <button className="rounded-2xl bg-muted text-foreground py-3.5 text-[13px] font-medium inline-flex items-center justify-center gap-2 active:scale-95">
          <Download className="h-4 w-4" />
          Comprovante
        </button>
      </div>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onClose}
        className="mt-3 w-full bg-primary text-primary-foreground rounded-2xl py-4 font-semibold text-[15px] shadow-glow"
      >
        Voltar para o início
      </motion.button>
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
      <span className={`text-[12px] ${muted ? "text-muted-foreground" : "text-foreground/80"}`}>
        {label}
      </span>
      <span
        className={`tabular-nums ${
          bold ? "text-[15px] font-semibold text-foreground" : "text-[12px] font-medium text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
