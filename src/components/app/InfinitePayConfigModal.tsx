import { useState } from "react";
import { X, Check, ExternalLink, Zap, ShieldCheck, Copy, Sparkles, CreditCard, QrCode } from "lucide-react";
import { toast } from "sonner";
import { useInfinitePay, type InfinitePayConfig } from "@/lib/infinitepay";

interface InfinitePayConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
}

export function InfinitePayConfigModal({ isOpen, onClose, slug }: InfinitePayConfigModalProps) {
  const { config, updateConfig } = useInfinitePay(slug);
  const [handle, setHandle] = useState(config.handle);
  const [apiKey, setApiKey] = useState(config.apiKey || "");
  const [redirectUrl, setRedirectUrl] = useState(config.redirectUrl || "");
  const [acceptPix, setAcceptPix] = useState(config.acceptPix);
  const [acceptCard, setAcceptCard] = useState(config.acceptCard);
  const [maxInstallments, setMaxInstallments] = useState(config.maxInstallments);
  const [testAmount, setTestAmount] = useState("50.00");
  const [testResultUrl, setTestResultUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    const cleanHandle = handle.replace(/^\$/, "").trim();
    if (!cleanHandle) {
      toast.error("Informe seu InfiniteTag (handle da InfinitePay)");
      return;
    }

    updateConfig({
      handle: cleanHandle,
      apiKey: apiKey.trim() || undefined,
      redirectUrl: redirectUrl.trim() || undefined,
      acceptPix,
      acceptCard,
      maxInstallments: Number(maxInstallments) || 12,
      enabled: true,
    });

    toast.success("Integração InfinitePay salva com sucesso!");
    onClose();
  };

  const handleSimulateTest = () => {
    const cleanHandle = handle.replace(/^\$/, "").trim() || "avaliatap";
    const testUrl = `https://checkout.infinitepay.io/pay/${cleanHandle}?amount=${Math.round(
      parseFloat(testAmount || "10") * 100
    )}&desc=Teste+AvaliaTap`;
    setTestResultUrl(testUrl);
    toast.success("Link de teste gerado com sucesso!");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#121212] p-6 text-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-xl shadow-md">
              ∞
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-[17px] font-bold text-white">Integração InfinitePay</h2>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  Checkout Oficial
                </span>
              </div>
              <p className="text-[12px] text-white/55">
                Venda produtos e serviços com Pix Taxa 0% e Cartão até 12x
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Benefits badge */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3">
            <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">Pix Instantâneo</p>
            <p className="text-[18px] font-black text-white mt-0.5">Taxa 0%</p>
            <p className="text-[11px] text-white/50">Receba no mesmo segundo na sua conta InfinitePay</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-[11px] font-bold text-teal-400 uppercase tracking-wide">Cartão de Crédito</p>
            <p className="text-[18px] font-black text-white mt-0.5">Até 12x</p>
            <p className="text-[11px] text-white/50">Menores taxas do mercado brasileiro e antifraude nativo</p>
          </div>
        </div>

        {/* Fields */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-[12.5px] font-bold text-white mb-1.5">
              Seu InfiniteTag (Handle InfinitePay) <span className="text-emerald-400">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-white/40 font-bold text-[14px]">$</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value.replace(/^\$/, ""))}
                placeholder="sua-empresa"
                className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 pl-8 pr-4 text-[14px] text-white placeholder:text-white/30 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <p className="mt-1 text-[11px] text-white/50">
              O InfiniteTag é o seu nome de usuário no app InfinitePay (ex: se seu link é infinitepay.io/$studio, informe <b>studio</b>).
            </p>
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-white mb-1.5">
              API Token / Key (Opcional)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Cole sua chave de API para integração direta"
              className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 px-4 text-[13px] text-white placeholder:text-white/30 focus:border-emerald-500 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-white/50">
              Permite criar links de cobrança via endpoint oficial <code>api.checkout.infinitepay.io/v1/links</code>.
            </p>
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-white mb-1.5">
              URL de Redirecionamento após Pagamento (Opcional)
            </label>
            <input
              type="text"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="https://seusite.com/sucesso"
              className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 px-4 text-[13px] text-white placeholder:text-white/30 focus:border-emerald-500 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-white/50">
              A InfinitePay redirecionará o cliente após a aprovação com o NSU e comprovante.
            </p>
          </div>

          {/* Formas de pagamento aceitas */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <p className="text-[12.5px] font-bold text-white">Métodos de Pagamento Ativos</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-emerald-400" />
                <span className="text-[13px] text-white">Aceitar Pix (Instantâneo)</span>
              </div>
              <input
                type="checkbox"
                checked={acceptPix}
                onChange={(e) => setAcceptPix(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-teal-400" />
                <span className="text-[13px] text-white">Aceitar Cartão de Crédito (até 12x)</span>
              </div>
              <input
                type="checkbox"
                checked={acceptCard}
                onChange={(e) => setAcceptCard(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500"
              />
            </div>
          </div>

          {/* Test Simulator */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-bold text-white/80">Simulador de Link InfinitePay</span>
              <button
                type="button"
                onClick={handleSimulateTest}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
              >
                Gerar teste
              </button>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-white/40 text-[12px]">R$</span>
                <input
                  type="number"
                  value={testAmount}
                  onChange={(e) => setTestAmount(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-2 pl-9 pr-3 text-[12px] text-white"
                  placeholder="50.00"
                />
              </div>
              <button
                type="button"
                onClick={handleSimulateTest}
                className="rounded-xl bg-white/15 px-3 py-2 text-[12px] font-bold text-white hover:bg-white/25 transition"
              >
                Testar
              </button>
            </div>

            {testResultUrl && (
              <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-2.5 text-[11px]">
                <p className="font-bold text-emerald-400 mb-1">Link de Checkout Gerado:</p>
                <p className="truncate text-white/70 font-mono select-all">{testResultUrl}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(testResultUrl);
                      toast.success("Link copiado para a área de transferência!");
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-black hover:bg-emerald-400 transition"
                  >
                    <Copy className="h-3 w-3" /> Copiar Link
                  </button>
                  <a
                    href={testResultUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-white/20 transition"
                  >
                    Abrir Checkout <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/40 pt-1">
            <a
              href="https://www.infinitepay.io/checkout-documentacao"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
            >
              Documentação Oficial do Checkout InfinitePay <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-white/15 py-3 text-[13px] font-bold text-white hover:bg-white/5 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-2xl bg-emerald-500 py-3 text-[13px] font-bold text-black hover:bg-emerald-400 active:scale-95 transition shadow-lg shadow-emerald-500/20"
          >
            Salvar Integração
          </button>
        </div>
      </div>
    </div>
  );
}
