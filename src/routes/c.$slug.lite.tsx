import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  Share2,
  Star,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";
import { getMerchant, defaultMerchantSlug } from "@/lib/merchants";
import { useLiteConfig, QRGen, buildDynamicPixCode, type LitePageLayout } from "@/lib/lite-page";
import { useInfinitePay, generateInfinitePayLink } from "@/lib/infinitepay";
import { agendaServicesList } from "@/lib/agenda-state";

export const Route = createFileRoute("/c/$slug/lite")({
  head: () => ({
    meta: [
      { title: "Página Pública Lite · AvaliaTap" },
      { name: "description", content: "Versão lite da página pública com agendamento, Pix e avaliações." },
      { property: "og:title", content: "Página Pública Lite · AvaliaTap" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LitePage,
});

export default function LitePage() {
  const { slug } = Route.useParams();
  const merchant = getMerchant(slug);
  const { config, updateConfig } = useLiteConfig(merchant?.slug || defaultMerchantSlug);
  const { config: infinitePayConfig } = useInfinitePay(merchant?.slug || defaultMerchantSlug);

  const [activeTab, setActiveTab] = useState<"servicos" | "sobre" | "avaliacoes" | "pagamento" | "contato">("servicos");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);

  // Layout preview selector state (allows user to test/switch layout directly or via config)
  const currentLayout = config.layout || "classic";

  // Pix state
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payAmountInput, setPayAmountInput] = useState<string>("");
  const [pixCopied, setPixCopied] = useState(false);

  // Booking Flow State
  const [bookStep, setBookStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<{ id: string; name: string; duration: string; price: string } | null>(
    agendaServicesList[0]
  );
  const [selectedDay, setSelectedDay] = useState<string>("Hoje");
  const [selectedTime, setSelectedTime] = useState<string>("10:00");
  const [bookName, setBookName] = useState("");
  const [bookPhone, setBookPhone] = useState("");
  const [bookEmail, setBookEmail] = useState("");
  const [isRedirectingPay, setIsRedirectingPay] = useState(false);

  // Pix BR Code calculation
  const dynamicPixCode = useMemo(() => {
    if (!config.pixKey || payAmount <= 0) return "";
    return buildDynamicPixCode(config.pixKey, config.pixName || merchant.name, config.pixCity || "SAO PAULO", payAmount);
  }, [config.pixKey, config.pixName, config.pixCity, merchant.name, payAmount]);

  const pixSvgHtml = useMemo(() => {
    if (!dynamicPixCode) return "";
    try {
      return QRGen.svg(dynamicPixCode);
    } catch {
      return "";
    }
  }, [dynamicPixCode]);

  // WhatsApp share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: config.title || merchant.name,
          text: config.sub,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link da página copiado!");
      }
    } catch {
      // canceled
    }
  };

  const handleCopyPix = () => {
    if (!dynamicPixCode) return;
    navigator.clipboard.writeText(dynamicPixCode);
    setPixCopied(true);
    toast.success("Código Pix copiado para a área de transferência!");
    setTimeout(() => setPixCopied(false), 2500);
  };

  const handleAmountChange = (valStr: string) => {
    const clean = valStr.replace(/\./g, "").replace(",", ".");
    const num = parseFloat(clean) || 0;
    setPayAmount(num);
    setPayAmountInput(valStr);
  };

  const handleQuickAmount = (val: number) => {
    setPayAmount(val);
    setPayAmountInput(val.toFixed(2).replace(".", ","));
  };

  // Start booking with a service
  const handleStartBooking = (service: typeof agendaServicesList[0]) => {
    setSelectedService(service);
    setBookStep(2);
    setBookModalOpen(true);
  };

  // Proceed to payment checkout
  const handleProceedPayment = () => {
    if (!bookName.trim() || !bookPhone.trim()) {
      toast.error("Por favor, preencha seu nome e WhatsApp.");
      return;
    }

    setIsRedirectingPay(true);

    const priceNum = selectedService ? parseFloat(selectedService.price.replace(/\D/g, "")) || 100 : 100;
    const { checkoutUrl } = generateInfinitePayLink(merchant.slug, selectedService?.name || "Atendimento", priceNum);

    setTimeout(() => {
      setIsRedirectingPay(false);
      setBookModalOpen(false);
      window.open(checkoutUrl, "_blank");
    }, 900);
  };

  // Split title for Cinema format: first word soft, remaining bold
  const titleParts = (config.title || merchant.name).trim().split(/\s+/);
  const firstTitleWord = titleParts[0];
  const restTitle = titleParts.slice(1).join(" ");

  return (
    <div className="flex justify-center bg-[#050505] min-h-screen text-[#fafafa] font-sans antialiased selection:bg-[#ff5f8a] selection:text-black">
      <div className="w-full max-w-[430px] min-h-screen bg-[#000000] relative pb-28 shadow-2xl">
        {/* Top Control Bar (Admin/Editor quick access) */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#121212]/80 backdrop-blur-md sticky top-0 z-40 text-xs">
          <Link
            to="/upgrades"
            className="inline-flex items-center gap-1 text-white/70 hover:text-white font-semibold transition"
          >
            <ChevronLeft className="h-4 w-4" /> Upgrades
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              Versão Lite
            </span>
            <span className="text-[11px] text-white/50 font-mono">
              /c/{config.linkedSlug || `${merchant.slug}-lite`}
            </span>
          </div>
        </div>

        {/* ================= HERO / COVER AREA ================= */}
        <div className="relative">
          {/* Cinema 9:16 Layout */}
          {currentLayout === "cinema" && (
            <div className="relative w-full aspect-[9/14] max-h-[580px] overflow-hidden rounded-b-[34px] bg-gradient-to-b from-[#6b1a30] via-[#2a0a14] to-[#000000] text-white shadow-xl flex flex-col justify-end p-6">
              {config.coverImage ? (
                <img
                  src={config.coverImage}
                  alt="Capa"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center font-black tracking-tight text-white/10 select-none pointer-events-none text-7xl uppercase leading-none">
                  <span>{merchant.name.split(" ")[0]}</span>
                  <span>PREMIUM</span>
                </div>
              )}
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 via-60% to-black pointer-events-none" />

              {/* Share button */}
              <button
                onClick={handleShare}
                aria-label="Compartilhar"
                className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-black/50 border border-white/20 text-white backdrop-blur-md hover:bg-black/80 transition"
              >
                <Share2 className="h-4 w-4" />
              </button>

              {/* Cinema Title and Subtitle */}
              <div className="relative z-10">
                <h1 className="text-[32px] font-black leading-tight tracking-tight text-white">
                  <span className="text-white/55 font-light">{firstTitleWord}</span> {restTitle}
                </h1>
                <p className="mt-2 text-[14px] text-white/90 leading-relaxed font-light max-w-[32ch]">
                  {config.sub || merchant.subtitle}
                </p>
              </div>
            </div>
          )}

          {/* Destaque (Hero) Layout */}
          {currentLayout === "hero" && (
            <div>
              <div className="relative h-[200px] w-full overflow-hidden bg-gradient-to-br from-[#ff5f8a] via-[#ef1f4d] to-[#8f0d24]">
                {config.coverImage ? (
                  <img src={config.coverImage} alt="Capa" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-white/25">
                    {merchant.name}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70 pointer-events-none" />
                <button
                  onClick={handleShare}
                  aria-label="Compartilhar"
                  className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/50 border border-white/20 text-white backdrop-blur-md hover:bg-black/80 transition"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>

              {/* Centered Profile Avatar */}
              <div className="flex flex-col items-center text-center -mt-12 px-4 relative z-10">
                <div className="relative grid h-24 w-24 place-items-center rounded-full border-4 border-[#000000] bg-[#161616] text-[32px] font-black text-white shadow-xl overflow-hidden">
                  {config.avatarImage ? (
                    <img src={config.avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    merchant.name.charAt(0)
                  )}
                </div>
                <h2 className="mt-3 text-[22px] font-extrabold text-white flex items-center gap-1.5 justify-center">
                  {config.title || merchant.name}
                  <span className="text-[#2f7dff]" title="Perfil Verificado">
                    <ShieldCheck className="h-5 w-5 fill-[#2f7dff] text-black" />
                  </span>
                </h2>
                <p className="mt-1 text-[13px] text-white/60 max-w-xs">{config.sub || merchant.subtitle}</p>
              </div>
            </div>
          )}

          {/* Clássico Layout */}
          {currentLayout === "classic" && (
            <div>
              <div className="relative h-[150px] w-full overflow-hidden bg-gradient-to-br from-[#ff5f8a] via-[#ef1f4d] to-[#8f0d24]">
                {config.coverImage ? (
                  <img src={config.coverImage} alt="Capa" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold text-white/20">
                    {merchant.name}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 pointer-events-none" />
                <button
                  onClick={handleShare}
                  aria-label="Compartilhar"
                  className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/50 border border-white/20 text-white backdrop-blur-md hover:bg-black/80 transition"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>

              {/* Lateral Profile Info */}
              <div className="flex items-end gap-3.5 px-4 -mt-10 relative z-10">
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full border-4 border-[#000000] bg-[#161616] text-[26px] font-black text-white shadow-xl overflow-hidden">
                  {config.avatarImage ? (
                    <img src={config.avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    merchant.name.charAt(0)
                  )}
                </div>
                <div className="min-w-0 pb-1">
                  <h2 className="text-[19px] font-bold text-white truncate flex items-center gap-1.5">
                    {config.title || merchant.name}
                    <span className="text-[#2f7dff]">
                      <ShieldCheck className="h-4 w-4 fill-[#2f7dff] text-black" />
                    </span>
                  </h2>
                  <div className="flex items-center gap-2 text-[11.5px] text-white/60 truncate">
                    <span>{config.instagram || "@" + merchant.slug}</span>
                    <span>·</span>
                    <span>{agendaServicesList.length} serviços</span>
                  </div>
                  <p className="text-[11.5px] text-white/50 truncate mt-0.5">{config.bio || merchant.subtitle}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= GOOGLE REVIEW CARD ================= */}
        {config.googleOn !== false && (
          <div className="px-4 mt-4">
            <div className="rounded-3xl border border-white/10 bg-[#161616] p-4 shadow-md">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white shadow-sm">
                    {/* Google G logo */}
                    <svg width="24" height="24" viewBox="0 0 48 48">
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.5 17.7 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">Avaliações no Google</p>
                    <div className="flex items-center gap-1.5 text-[12.5px]">
                      <span className="text-[#f5b942] tracking-wider text-[13px]">★★★★★</span>
                      <b className="text-white text-[14px]">5.0</b>
                      <span className="text-white/50">(48 avaliações)</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400 text-center leading-tight">
                  Google<br />Verificado ✓
                </div>
              </div>

              <h4 className="text-[14px] font-bold text-white mb-1">Avalie nosso atendimento no Google</h4>
              <p className="text-[12px] text-white/55 leading-relaxed mb-3">
                Sua opinião é fundamental para nossa equipe! Conte como foi sua experiência.
              </p>

              <button
                onClick={() => setReviewModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-full border border-white/15 bg-[#1e1e1e] py-3 text-[13px] font-bold text-white hover:bg-[#262626] transition"
              >
                Deixar avaliação no Google <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= TABS NAVIGATION ================= */}
        <div className="mt-5 border-b border-white/10 px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-none pb-0.5">
            {[
              { id: "servicos", label: "Serviços" },
              { id: "sobre", label: "Sobre nós" },
              { id: "avaliacoes", label: "Avaliações" },
              { id: "pagamento", label: "Pagar Pix" },
              { id: "contato", label: "Contato" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`shrink-0 px-3.5 py-2.5 text-[12.5px] font-bold transition border-b-2 -mb-[2px] ${
                  activeTab === tab.id
                    ? "border-white text-white"
                    : "border-transparent text-white/50 hover:text-white/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= TAB PANELS ================= */}
        <div className="px-4 mt-4">
          {/* TAB 1: SERVIÇOS */}
          {activeTab === "servicos" && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-bold text-white/60 uppercase tracking-wider">Procedimentos & Cuidados</span>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Pagamento InfinitePay
                </span>
              </div>

              {agendaServicesList.map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => handleStartBooking(svc)}
                  className="w-full flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#161616] p-3.5 text-left transition hover:border-white/20 hover:bg-[#1a1a1a] active:scale-[0.99]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-bold text-white truncate">{svc.name}</p>
                    <p className="text-[11.5px] text-white/50">{svc.duration} de duração</p>
                  </div>
                  <div className="rounded-full bg-[#262626] px-3 py-1.5 text-[13px] font-bold text-white shrink-0">
                    {svc.price}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* TAB 2: SOBRE */}
          {activeTab === "sobre" && (
            <div className="rounded-3xl border border-white/10 bg-[#161616] p-4 text-[13px] text-white/80 leading-relaxed space-y-4">
              <p>
                {config.bio ||
                  "Trabalhamos com alto padrão de qualidade e cuidado, focados em criar experiências personalizadas e acolhedoras para cada cliente."}
              </p>
              <div>
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-white mb-2">
                  Diferenciais e Certificações
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11.5px] text-white font-medium">
                    ✓ Atendimento especializado
                  </span>
                  <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11.5px] text-white font-medium">
                    ✓ Biossegurança rigorosa
                  </span>
                  <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11.5px] text-white font-medium">
                    ✓ Protocolos sob medida
                  </span>
                  <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11.5px] text-white font-medium">
                    ✓ Produtos de alta performance
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AVALIAÇÕES */}
          {activeTab === "avaliacoes" && (
            <div className="space-y-3">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#161616] p-4">
                <span className="text-[32px] font-black text-white leading-none">5.0</span>
                <div>
                  <div className="text-[#f5b942] tracking-wider text-[14px]">★★★★★</div>
                  <small className="text-[11.5px] text-white/50 block mt-0.5">48 avaliações verificadas no Google</small>
                </div>
              </div>

              {/* Map Embed */}
              <div className="relative h-60 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a]">
                <iframe
                  title="Estabelecimento no Google Maps"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(config.place || merchant.name)}&output=embed&hl=pt-BR`}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>

              <a
                href={config.googleUrl || merchant.googleReview}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-[13px] font-bold text-black hover:bg-neutral-200 transition"
              >
                Escrever avaliação no Google <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          {/* TAB 4: PAGAMENTO PIX DINÂMICO */}
          {activeTab === "pagamento" && (
            <div className="rounded-3xl border border-white/10 bg-[#161616] p-4 text-white">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <b className="text-[14px] text-white block">{config.pixName || merchant.name}</b>
                  <span className="text-[11.5px] text-white/50">{config.pixKey || "Chave Pix configurada"}</span>
                </div>
              </div>

              <label className="block text-[11.5px] font-bold text-white/60 mb-1.5 uppercase">
                Quanto você quer pagar?
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/50 px-4 py-1 mb-2.5">
                <span className="text-[18px] font-bold text-white/50">R$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={payAmountInput}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-transparent py-2.5 text-[22px] font-extrabold text-white outline-none"
                />
              </div>

              {/* Quick Values */}
              <div className="flex gap-1.5 flex-wrap mb-4">
                {[50, 100, 150, 200].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleQuickAmount(v)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11.5px] font-bold text-white/80 hover:bg-white/15 transition"
                  >
                    R$ {v}
                  </button>
                ))}
              </div>

              {/* QR Code and Copy Paste */}
              {payAmount > 0 && dynamicPixCode ? (
                <div className="space-y-3 pt-2 border-t border-white/10 text-center animate-in fade-in">
                  <div className="mx-auto w-44 h-44 rounded-2xl bg-white p-2.5 flex items-center justify-center shadow-lg">
                    <div
                      className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: pixSvgHtml }}
                    />
                  </div>

                  <p className="text-[13px] text-white/70">
                    Total: <b className="text-white text-[16px]">R$ {payAmount.toFixed(2).replace(".", ",")}</b>
                  </p>

                  <div className="rounded-xl border border-white/10 bg-black/60 p-2.5 text-left">
                    <p className="text-[10px] font-bold text-white/50 uppercase mb-1">Pix Copia e Cola</p>
                    <p className="text-[10.5px] font-mono text-white/70 truncate">{dynamicPixCode}</p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleCopyPix}
                      className="w-full flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-500 py-3 text-[13px] font-bold text-black hover:bg-emerald-400 transition"
                    >
                      {pixCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copiar código Pix
                    </button>
                    <a
                      href={`https://wa.me/55${config.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                        `Olá! Realizei um pagamento Pix de R$ ${payAmount.toFixed(2)} para ${config.pixName || merchant.name}. Segue comprovante.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-white/5 py-2.5 text-[12px] font-bold text-white hover:bg-white/10 transition"
                    >
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-400" /> Enviar comprovante no WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-[11.5px] text-white/40 text-center py-2">
                  Digite um valor acima para gerar o QR Code Pix instantâneo.
                </p>
              )}
            </div>
          )}

          {/* TAB 5: CONTATO */}
          {activeTab === "contato" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <a
                  href={`https://wa.me/55${config.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#161616] p-3.5 text-white hover:bg-[#1a1a1a] transition"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#262626] text-emerald-400">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <b className="text-[13.5px] block leading-tight">WhatsApp</b>
                    <span className="text-[12px] text-white/50">{config.whatsapp}</span>
                  </div>
                  <span className="text-white/40">&gt;</span>
                </a>

                <a
                  href={`https://instagram.com/${config.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#161616] p-3.5 text-white hover:bg-[#1a1a1a] transition"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#262626] text-pink-400">
                    📸
                  </span>
                  <div className="min-w-0 flex-1">
                    <b className="text-[13.5px] block leading-tight">Instagram</b>
                    <span className="text-[12px] text-white/50">{config.instagram}</span>
                  </div>
                  <span className="text-white/40">&gt;</span>
                </a>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#161616] p-3.5 text-white">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#262626] text-white/70">
                    📍
                  </span>
                  <div className="min-w-0 flex-1">
                    <b className="text-[13.5px] block leading-tight">Endereço</b>
                    <span className="text-[12px] text-white/50">{config.address}</span>
                  </div>
                </div>
              </div>

              {/* Horários */}
              <div className="rounded-2xl border border-white/10 bg-[#161616] p-4 text-[12.5px] space-y-2">
                <div className="flex justify-between border-b border-white/5 pb-2 text-white/80">
                  <span>Segunda a sexta</span>
                  <b className="text-white">09:00 – 18:00</b>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2 text-white/80">
                  <span>Sábado</span>
                  <b className="text-white">09:00 – 14:00</b>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Domingo</span>
                  <b>Fechado</b>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= FIXED BOTTOM ACTION: AGENDAR HORÁRIO ================= */}
        <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[430px] border-t border-white/10 bg-[#000000]/90 backdrop-blur-md p-4">
          <button
            onClick={() => setBookModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-white py-4 text-[14px] font-black text-black hover:bg-neutral-200 active:scale-95 transition shadow-xl"
          >
            <Calendar className="h-4 w-4" /> Agendar horário online
          </button>
        </div>

        {/* ================= MODAL: AGENDAR HORÁRIO (INFINITEPAY) ================= */}
        {bookModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in"
            onClick={() => setBookModalOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[430px] max-h-[90vh] overflow-y-auto rounded-t-[32px] border border-white/15 bg-[#121212] p-5 text-white shadow-2xl pb-8"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div>
                  <h3 className="text-[16px] font-bold text-white">Agendamento Online</h3>
                  <p className="text-[11px] text-white/50">Confirmação instantânea com InfinitePay</p>
                </div>
                <button
                  onClick={() => setBookModalOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex gap-1.5 mb-4">
                <span className={`h-1 flex-1 rounded-full ${bookStep >= 1 ? "bg-white" : "bg-white/15"}`} />
                <span className={`h-1 flex-1 rounded-full ${bookStep >= 2 ? "bg-white" : "bg-white/15"}`} />
                <span className={`h-1 flex-1 rounded-full ${bookStep >= 3 ? "bg-white" : "bg-white/15"}`} />
              </div>

              {bookStep === 1 && (
                <div className="space-y-2">
                  <p className="text-[12px] font-bold text-white/60 mb-2">1. Escolha o serviço desejado</p>
                  {agendaServicesList.map((svc) => (
                    <button
                      key={svc.id}
                      onClick={() => {
                        setSelectedService(svc);
                        setBookStep(2);
                      }}
                      className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-3 text-left hover:bg-white/10"
                    >
                      <div>
                        <b className="text-[13px] text-white block">{svc.name}</b>
                        <span className="text-[11px] text-white/50">{svc.duration}</span>
                      </div>
                      <span className="font-bold text-emerald-400 text-[13px]">{svc.price}</span>
                    </button>
                  ))}
                </div>
              )}

              {bookStep === 2 && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-white/5 p-3 flex justify-between items-center text-[12.5px]">
                    <span className="text-white/70">{selectedService?.name}</span>
                    <b className="text-emerald-400">{selectedService?.price}</b>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-white/60 uppercase mb-1.5">Escolha o dia</label>
                    <div className="flex gap-2">
                      {["Hoje", "Amanhã", "Segunda", "Terça"].map((day) => (
                        <button
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`flex-1 rounded-xl py-2.5 text-[12px] font-bold transition ${
                            selectedDay === day ? "bg-white text-black" : "bg-white/5 border border-white/10 text-white"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-white/60 uppercase mb-1.5">Escolha o horário</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["09:00", "10:30", "11:30", "14:00", "15:30", "17:00"].map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={`rounded-xl py-2.5 text-[12px] font-bold transition ${
                            selectedTime === t ? "bg-white text-black" : "bg-white/5 border border-white/10 text-white"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setBookStep(1)}
                      className="rounded-xl border border-white/15 py-2.5 px-4 text-[12px] font-bold text-white"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={() => setBookStep(3)}
                      className="flex-1 rounded-xl bg-white py-2.5 text-[12.5px] font-bold text-black hover:bg-neutral-200"
                    >
                      Continuar para Dados
                    </button>
                  </div>
                </div>
              )}

              {bookStep === 3 && (
                <div className="space-y-3.5">
                  <div className="rounded-xl bg-white/5 p-3 text-[12px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white/50">Serviço:</span>
                      <b>{selectedService?.name}</b>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Data & Hora:</span>
                      <b>
                        {selectedDay} às {selectedTime}
                      </b>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-1 text-emerald-400 font-bold">
                      <span>Total:</span>
                      <span>{selectedService?.price}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-white mb-1">Seu Nome Completo *</label>
                    <input
                      type="text"
                      value={bookName}
                      onChange={(e) => setBookName(e.target.value)}
                      placeholder="Ex: Amanda Silva"
                      className="w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-[13px] text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-white mb-1">WhatsApp para Confirmação *</label>
                    <input
                      type="tel"
                      value={bookPhone}
                      onChange={(e) => setBookPhone(e.target.value)}
                      placeholder="(11) 98888-7777"
                      className="w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-[13px] text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-white mb-1">E-mail (opcional)</label>
                    <input
                      type="email"
                      value={bookEmail}
                      onChange={(e) => setBookEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-[13px] text-white"
                    />
                  </div>

                  <button
                    onClick={handleProceedPayment}
                    disabled={isRedirectingPay}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-[13.5px] font-bold text-black hover:bg-emerald-400 transition"
                  >
                    <span className="font-extrabold text-base">∞</span>
                    {isRedirectingPay ? "Abrindo InfinitePay..." : "Pagar com InfinitePay (Pix ou 12x)"}
                  </button>

                  <p className="text-[11px] text-white/40 text-center">
                    Você será direcionado ao checkout seguro oficial da InfinitePay com confirmação instantânea.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= MODAL: AVALIAR NO GOOGLE ================= */}
        {reviewModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in"
            onClick={() => setReviewModalOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[430px] rounded-t-[32px] border border-white/15 bg-[#121212] p-5 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div>
                  <h3 className="text-[16px] font-bold text-white">Avaliar no Google</h3>
                  <p className="text-[11px] text-white/50">{config.place || merchant.name}</p>
                </div>
                <button
                  onClick={() => setReviewModalOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Map embed */}
              <div className="relative h-64 w-full rounded-2xl border border-white/10 overflow-hidden bg-black mb-3">
                <iframe
                  title="Google Maps"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(config.place || merchant.name)}&output=embed&hl=pt-BR`}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>

              <div className="space-y-2">
                <a
                  href={config.googleUrl || merchant.googleReview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 rounded-2xl bg-white py-3 text-[13px] font-bold text-black hover:bg-neutral-200 transition"
                >
                  Abrir e Escrever Avaliação no Google <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={() => setReviewModalOpen(false)}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 py-2.5 text-[12px] font-bold text-white/70"
                >
                  Agora não
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
