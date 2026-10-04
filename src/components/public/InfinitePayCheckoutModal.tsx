import { useState } from "react";
import { X, Check, Copy, ExternalLink, QrCode, CreditCard, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { brl } from "@/lib/products";
import { generateInfinitePayLink } from "@/lib/infinitepay";

interface InfinitePayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  item: {
    name: string;
    price: number;
    description?: string;
    emoji?: string;
  };
  merchantName?: string;
}

export function InfinitePayCheckoutModal({
  isOpen,
  onClose,
  slug,
  item,
  merchantName = "Loja",
}: InfinitePayCheckoutModalProps) {
  const [tab, setTab] = useState<"pix" | "card">("pix");
  const [copied, setCopied] = useState(false);
  const [simulatedPaid, setSimulatedPaid] = useState(false);

  if (!isOpen) return null;

  const { checkoutUrl, directHandleUrl, pixQrCodePayload, handle } = generateInfinitePayLink(
    slug,
    item.name,
    item.price
  );

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixQrCodePayload);
    setCopied(true);
    toast.success("Código Pix copiado! Cole no app do seu banco.");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulatePayment = () => {
    setSimulatedPaid(true);
    toast.success("Pagamento aprovado com sucesso via InfinitePay!");
  };

  // Up to 12 installments calculation
  const installment12 = (item.price / 12).toFixed(2).replace(".", ",");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#121212] p-5 text-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white font-black text-lg">
              ∞
            </div>
            <div>
              <p className="text-[14px] font-bold leading-tight">Checkout InfinitePay</p>
              <p className="text-[11px] text-white/50">{merchantName} · ${handle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Item Summary */}
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/5 p-3.5 border border-white/10">
          <div className="flex items-center gap-3">
            {item.emoji ? (
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-xl">
                {item.emoji}
              </span>
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 font-bold">
                {item.name.charAt(0)}
              </span>
            )}
            <div>
              <p className="text-[13.5px] font-bold text-white leading-tight">{item.name}</p>
              <p className="text-[11px] text-white/50">{item.description || "Pagamento seguro"}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[15px] font-black text-emerald-400">{brl(item.price)}</p>
            <p className="text-[10px] text-white/40">ou 12x R$ {installment12}</p>
          </div>
        </div>

        {simulatedPaid ? (
          <div className="my-6 text-center py-6">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-3">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-[18px] font-black text-white">Pagamento Confirmado!</h3>
            <p className="mt-1 text-[12.5px] text-white/60 max-w-xs mx-auto">
              Recebemos seu pagamento via InfinitePay com sucesso. O comprovante foi gerado para este pedido.
            </p>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-[11px] text-white/50 font-mono">
              NSU: {`INF-${Date.now().toString(36).toUpperCase()}`}
            </div>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-2xl bg-emerald-500 py-3 text-[13px] font-bold text-black hover:bg-emerald-400 transition"
            >
              Concluir
            </button>
          </div>
        ) : (
          <>
            {/* Tabs (Pix / Cartão) */}
            <div className="mt-4 flex rounded-2xl border border-white/10 bg-black/40 p-1">
              <button
                type="button"
                onClick={() => setTab("pix")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[12.5px] font-bold transition ${
                  tab === "pix"
                    ? "bg-emerald-500 text-black shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <QrCode className="h-3.5 w-3.5" /> Pix (Instantâneo)
              </button>
              <button
                type="button"
                onClick={() => setTab("card")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[12.5px] font-bold transition ${
                  tab === "card"
                    ? "bg-emerald-500 text-black shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <CreditCard className="h-3.5 w-3.5" /> Cartão (até 12x)
              </button>
            </div>

            {tab === "pix" ? (
              <div className="mt-4 space-y-3.5 text-center">
                <div className="mx-auto w-48 h-48 rounded-2xl border-2 border-emerald-500/30 bg-white p-3 shadow-lg flex items-center justify-center">
                  {/* Visual QR Code representation */}
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 rounded-xl p-2 relative overflow-hidden">
                    <div className="grid grid-cols-6 gap-1 w-32 h-32 opacity-90">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-[2px] ${
                            (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                              ? "bg-emerald-400"
                              : "bg-white"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                      <span className="rounded-lg bg-emerald-500 px-2 py-0.5 text-[9px] font-black text-black">
                        PIX INFINITEPAY
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-left">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-white/70">Código Pix Copia e Cola</span>
                    <span className="text-[10px] text-emerald-400 font-bold">Taxa 0%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pixQrCodePayload}
                      className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-[11px] font-mono text-white/70"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="shrink-0 rounded-xl bg-emerald-500 px-3 py-2 text-[12px] font-bold text-black hover:bg-emerald-400 transition"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-[13px] font-bold text-black hover:bg-emerald-400 transition active:scale-95 shadow-md shadow-emerald-500/20"
                  >
                    Abrir Página de Pagamento InfinitePay <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  <button
                    onClick={handleSimulatePayment}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 py-2.5 text-[12px] font-bold text-white/80 hover:bg-white/10 transition"
                  >
                    Simular confirmação Pix
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-white">Parcelamento no Cartão</span>
                    <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                      Até 12 parcelas
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded-xl border border-white/10 bg-black/40 p-2 text-center">
                      <p className="text-white/50">1x à vista</p>
                      <p className="font-bold text-white text-[13px]">{brl(item.price)}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/40 p-2 text-center">
                      <p className="text-white/50">12x sem burocracia</p>
                      <p className="font-bold text-emerald-400 text-[13px]">12x R$ {installment12}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                  <p className="text-[12px] font-bold text-white mb-1">Processamento Seguro InfinitePay</p>
                  <p className="text-[11px] text-white/55 leading-relaxed">
                    Você será direcionado ao ambiente seguro da InfinitePay com criptografia de ponta a ponta e proteção antifraude.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-[13px] font-bold text-black hover:bg-emerald-400 transition active:scale-95 shadow-md shadow-emerald-500/20"
                  >
                    Pagar no Cartão via InfinitePay <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  <button
                    onClick={handleSimulatePayment}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 py-2.5 text-[12px] font-bold text-white/80 hover:bg-white/10 transition"
                  >
                    Simular aprovação do cartão
                  </button>
                </div>
              </div>
            )}

            {/* Footer Trust */}
            <div className="mt-4 flex items-center justify-center gap-2 text-[10.5px] text-white/40 border-t border-white/10 pt-3">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Transação protegida e auditada pela InfinitePay</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
