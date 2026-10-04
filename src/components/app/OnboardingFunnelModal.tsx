import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Nfc,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Star,
  Ticket,
  Users,
  QrCode,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Layers,
  ArrowRight,
} from "lucide-react";
import { defaultMerchantSlug } from "@/lib/merchants";

interface OnboardingFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHECKLIST_STORAGE_KEY = "avaliatap-onboarding-checklist";

export function OnboardingFunnelModal({ isOpen, onClose }: OnboardingFunnelModalProps) {
  const [slideIdx, setSlideIdx] = useState(0);
  const totalSlides = 8;
  const trackRef = useRef<HTMLDivElement>(null);

  const [checklist, setChecklist] = useState<Record<number, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleCheck = (index: number) => {
    setChecklist((prev) => {
      const next = { ...prev, [index]: !prev[index] };
      window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const checklistItems = [
    { title: "Configurar a vitrine e cadastrar produtos", to: "/catalogo" },
    { title: "Testar a raspadinha digital e cupom", to: `/c/${defaultMerchantSlug}` },
    { title: "Solicitar minha primeira placa NFC para balcão", to: "/nfc" },
    { title: "Ativar novos slugs para mesas ou filiais", to: "/upgrades" },
    { title: "Conectar meu link do Google Meu Negócio", to: "/configuracoes" },
  ];

  const goToSlide = (idx: number) => {
    const nextIdx = Math.max(0, Math.min(totalSlides - 1, idx));
    setSlideIdx(nextIdx);
    if (trackRef.current) {
      trackRef.current.scrollTo({
        left: nextIdx * trackRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goToSlide(slideIdx + 1);
      if (e.key === "ArrowLeft") goToSlide(slideIdx - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, slideIdx]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4">
      <div className="relative flex h-full w-full max-w-[480px] flex-col overflow-hidden bg-[#0a0a0a] text-[#f5f5f5] sm:h-[90vh] sm:rounded-[36px] border border-white/10 shadow-2xl">
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute -top-28 left-1/2 h-[340px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#ef1f4d]/25 to-transparent blur-3xl" />

        {/* Top Bar */}
        <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-2">
          <div className="flex items-center gap-2.5 font-bold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-xl bg-gradient-to-tr from-[#ef1f4d] to-[#ff5f8a] text-black shadow-md">
              <Nfc className="h-4 w-4" />
            </span>
            <span className="text-[17px] font-extrabold tracking-tight">AvaliaTap</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToSlide(totalSlides - 1)}
              className="text-[12.5px] font-semibold text-[#9a9a9a] transition hover:text-white"
            >
              Pular
            </button>
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-[#9a9a9a] hover:bg-white/15 hover:text-white transition"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress Segments */}
        <div className="relative z-10 flex gap-1.5 px-6 py-2" aria-hidden="true">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div
              key={i}
              className={`h-[3.5px] flex-1 rounded-full transition-all duration-300 ${
                i <= slideIdx ? "bg-[#ff5f8a]" : "bg-white/15"
              }`}
            />
          ))}
        </div>

        {/* Scrollable Slide Track */}
        <div
          ref={trackRef}
          onScroll={() => {
            if (trackRef.current) {
              const i = Math.round(trackRef.current.scrollLeft / trackRef.current.clientWidth);
              if (i !== slideIdx && i >= 0 && i < totalSlides) {
                setSlideIdx(i);
              }
            }
          }}
          className="relative z-10 flex flex-1 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none"
        >
          {/* SLIDE 0: Bem-vindo */}
          <section className="flex flex-col flex-none w-full snap-start overflow-y-auto px-6 py-4">
            <div className="relative mb-5 flex min-h-[220px] flex-col items-center justify-center gap-3 overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0c0c0c] p-5 text-center shadow-lg">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-[#ef1f4d] to-[#ff5f8a] text-black shadow-[0_0_40px_rgba(239,31,77,0.5)]">
                <Nfc className="h-8 w-8" />
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-black shadow-sm">
                  Placa NFC
                </span>
                <span className="rounded-full border border-white/10 bg-[#161616] px-3 py-1 text-[11px] font-semibold text-[#d8d8d8]">
                  Vitrine
                </span>
                <span className="rounded-full border border-white/10 bg-[#161616] px-3 py-1 text-[11px] font-semibold text-[#d8d8d8]">
                  Raspadinha
                </span>
                <span className="rounded-full border border-white/10 bg-[#161616] px-3 py-1 text-[11px] font-semibold text-[#ffb020]">
                  Multislugs
                </span>
              </div>
            </div>

            <div className="text-[12px] font-bold uppercase tracking-wider text-[#ff5f8a]">Bem-vindo</div>
            <h2 className="mt-1 text-[27px] font-extrabold leading-[1.18] tracking-tight">
              Conheça o AvaliaTap em 1 minuto.
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#9a9a9a]">
              É a sua placa NFC, vitrine de produtos e avaliações no mesmo link. Veja como cada parte do funil multiplica suas conversões antes de começar.
            </p>

            <ul className="mt-4 space-y-2.5 text-[13px] text-[#d8d8d8]">
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff5f8a] text-black">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span>Seu cliente aproxima o celular da placa física e abre sua página sem instalar nada</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff5f8a] text-black">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span>Você acompanha toques, avaliações no Google e vendas direto no celular</span>
              </li>
            </ul>
          </section>

          {/* SLIDE 1: Vitrine Inteligente */}
          <section className="flex flex-col flex-none w-full snap-start overflow-y-auto px-6 py-4">
            <div className="relative mb-5 flex min-h-[220px] flex-col justify-center gap-3 overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0c0c0c] p-4 shadow-lg">
              <span className="absolute top-2.5 right-3 text-[10px] text-white/40 font-mono">exemplo</span>
              {/* Cover card */}
              <div className="relative h-20 w-full rounded-2xl bg-gradient-to-r from-[#ef1f4d] via-[#ff5f8a] to-[#8f0d24] p-3">
                <div className="absolute -bottom-4 left-3 grid h-12 w-12 place-items-center rounded-full border-2 border-[#0d0d0d] bg-[#1a1a1a] shadow-[0_0_0_2px_#ff5f8a] text-lg font-bold">
                  💈
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-black">
                  Produtos
                </span>
                <span className="rounded-full border border-white/10 bg-[#161616] px-3 py-1 text-[11px] font-medium text-[#d8d8d8]">
                  Serviços
                </span>
                <span className="rounded-full border border-white/10 bg-[#161616] px-3 py-1 text-[11px] font-medium text-[#d8d8d8]">
                  Raspadinha
                </span>
                <span className="rounded-full border border-white/10 bg-[#161616] px-3 py-1 text-[11px] font-medium text-[#d8d8d8]">
                  Avaliar Google
                </span>
              </div>
            </div>

            <div className="text-[12px] font-bold uppercase tracking-wider text-[#ff5f8a]">Passo 1 de 6 · Vitrine</div>
            <h2 className="mt-1 text-[27px] font-extrabold leading-[1.18] tracking-tight">
              Sua vitrine é a sua página pública inteligente.
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#9a9a9a]">
              É o que o cliente abre quando encosta o celular na placa do balcão ou da mesa. Carrega em milissegundos e organiza tudo em abas fluidas.
            </p>

            <ul className="mt-4 space-y-2.5 text-[13px] text-[#d8d8d8]">
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff5f8a] text-black">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span>Produtos, serviços, agendamentos e benefícios em um só link</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff5f8a] text-black">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span>Link próprio avaliatap.com/c/seu-negocio com design premium escuro</span>
              </li>
            </ul>
          </section>

          {/* SLIDE 2: Produtos & Edição Total */}
          <section className="flex flex-col flex-none w-full snap-start overflow-y-auto px-6 py-4">
            <div className="relative mb-5 flex min-h-[220px] flex-col justify-center gap-2 overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0c0c0c] p-4 shadow-lg">
              <span className="absolute top-2.5 right-3 text-[10px] text-white/40 font-mono">exemplo</span>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#161616] p-3 text-[12.5px]">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🧴</span>
                  <div>
                    <b className="block text-[13px] font-semibold text-white">Pomada Modeladora Alpha</b>
                    <small className="text-[#9a9a9a]">Mais vendido · Efeito matte</small>
                  </div>
                </div>
                <span className="font-bold text-[#ff5f8a]">R$ 49,90</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#161616] p-3 text-[12.5px]">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">✂️</span>
                  <div>
                    <b className="block text-[13px] font-semibold text-white">Corte Masculino VIP</b>
                    <small className="text-[#9a9a9a]">Serviço · Toalha quente</small>
                  </div>
                </div>
                <span className="font-bold text-[#ff5f8a]">R$ 65,00</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#ff5f8a]/30 bg-[#ff5f8a]/10 p-2.5 text-[12px]">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#ff5f8a]" />
                  <span className="text-[#ff5f8a] font-semibold">Pacotes com desconto: 10% a 20% OFF</span>
                </div>
                <span className="font-extrabold text-white">AUTO</span>
              </div>
            </div>

            <div className="text-[12px] font-bold uppercase tracking-wider text-[#ff5f8a]">Passo 2 de 6 · Catálogo</div>
            <h2 className="mt-1 text-[27px] font-extrabold leading-[1.18] tracking-tight">
              Cadastre e edite cada detalhe da vitrine.
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#9a9a9a]">
              A página de detalhes possui edição completa: selos de Mais Vendido, avaliações em estrelas, frete, mensagens de urgência e pacotes com desconto.
            </p>

            <ul className="mt-4 space-y-2.5 text-[13px] text-[#d8d8d8]">
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff5f8a] text-black">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span>Pré-visualização em tempo real simulando exatamente a tela do cliente</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff5f8a] text-black">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span>Passe produtos de ativo para pausado com um toque quando o estoque zerar</span>
              </li>
            </ul>
          </section>

          {/* SLIDE 3: O PODER DOS MÚLTIPLOS SLUGS (BENEFÍCIOS) */}
          <section className="flex flex-col flex-none w-full snap-start overflow-y-auto px-6 py-4">
            <div className="relative mb-5 flex min-h-[220px] flex-col justify-center gap-2.5 overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0c0c0c] p-4 shadow-lg">
              <span className="absolute top-2.5 right-3 text-[10px] text-white/40 font-mono">estratégia</span>

              <div className="flex items-center justify-between rounded-xl border border-[#ff5f8a]/40 bg-[#ff5f8a]/15 p-2.5 text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#ff5f8a] text-black font-extrabold text-[11px]">1</span>
                  <div>
                    <b className="block text-white">/c/sua-loja-balcao</b>
                    <small className="text-[#d8d8d8]">Foco em avaliação Google & cupom</small>
                  </div>
                </div>
                <span className="rounded-full bg-[#ff5f8a] px-2 py-0.5 text-[10px] font-bold text-black">Placa 1</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#161616] p-2.5 text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-white/20 text-white font-extrabold text-[11px]">2</span>
                  <div>
                    <b className="block text-white">/c/sua-loja-mesas</b>
                    <small className="text-[#9a9a9a]">Cardápio digital e raspadinha</small>
                  </div>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white">Placa 2</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#161616] p-2.5 text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-white/20 text-white font-extrabold text-[11px]">3</span>
                  <div>
                    <b className="block text-white">/c/sua-loja-filial2</b>
                    <small className="text-[#9a9a9a]">2ª Unidade ou ponto de parceiro</small>
                  </div>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white">Placa 3</span>
              </div>
            </div>

            <div className="text-[12px] font-bold uppercase tracking-wider text-[#ff5f8a]">
              Passo 3 de 6 · Por que ter mais slugs?
            </div>
            <h2 className="mt-1 text-[26px] font-extrabold leading-[1.18] tracking-tight">
              Multiplique conversões com vários slugs e placas.
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#9a9a9a]">
              Ter múltiplos slugs permite colocar uma placa NFC em cada ponto de contato físico (caixa, mesa, provador, barbearia, filial).
            </p>

            <ul className="mt-4 space-y-2.5 text-[13px] text-[#d8d8d8]">
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff5f8a] text-black">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span><strong>Métricas por Ponto:</strong> Saiba exatamente qual mesa ou atendente gera mais toques e avaliações</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff5f8a] text-black">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span><strong>Campanhas Segmentadas:</strong> Boas-vindas na entrada e cupom de recompra no fechamento</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff5f8a] text-black">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span><strong>Múltiplas Filiais:</strong> Controle diferentes endereços em um único painel central</span>
              </li>
            </ul>
          </section>

          {/* SLIDE 4: Raspadinha Digital */}
          <section className="flex flex-col flex-none w-full snap-start overflow-y-auto px-6 py-4">
            <div className="relative mb-5 flex min-h-[220px] flex-col items-center justify-center gap-3 overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0c0c0c] p-5 shadow-lg text-center">
              <span className="absolute top-2.5 right-3 text-[10px] text-white/40 font-mono">interativo</span>
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#ffb020] text-black shadow-lg text-2xl font-black">
                🎟️
              </div>
              <div>
                <span className="rounded-full bg-[#ffb020] px-3 py-1 text-[11px] font-extrabold text-black">
                  CUPOM: BEMVINDO20
                </span>
                <p className="mt-2 text-lg font-extrabold text-white">20% OFF na Primeira Compra</p>
                <small className="text-[#9a9a9a]">O cliente raspa na tela e descobre na hora</small>
              </div>
            </div>

            <div className="text-[12px] font-bold uppercase tracking-wider text-[#ff5f8a]">Passo 4 de 6 · Raspadinha</div>
            <h2 className="mt-1 text-[27px] font-extrabold leading-[1.18] tracking-tight">
              Uma raspadinha que qualquer cliente quer raspar.
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#9a9a9a]">
              A gamificação ativa a curiosidade do cliente no balcão. Ele descobre o benefício na hora e ganha um motivo imediato para consumir e voltar.
            </p>

            <ul className="mt-4 space-y-2.5 text-[13px] text-[#d8d8d8]">
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff5f8a] text-black">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span>Captura o contato do cliente antes de liberar o cupom</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff5f8a] text-black">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span>Você define as regras: prazo de validade, valor mínimo e quantidade</span>
              </li>
            </ul>
          </section>

          {/* SLIDE 5: Avaliações no Google */}
          <section className="flex flex-col flex-none w-full snap-start overflow-y-auto px-6 py-4">
            <div className="relative mb-5 flex min-h-[220px] flex-col items-center justify-center gap-3 overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0c0c0c] p-5 shadow-lg text-center">
              <span className="absolute top-2.5 right-3 text-[10px] text-white/40 font-mono">reputação</span>
              <div className="flex items-center gap-1.5 text-[#ffb020]">
                <Star className="h-7 w-7 fill-[#ffb020]" />
                <Star className="h-7 w-7 fill-[#ffb020]" />
                <Star className="h-7 w-7 fill-[#ffb020]" />
                <Star className="h-7 w-7 fill-[#ffb020]" />
                <Star className="h-7 w-7 fill-[#ffb020]" />
              </div>
              <p className="text-[20px] font-extrabold text-white">5.0 Estrelas no Google</p>
              <span className="rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-semibold text-[#d8d8d8]">
                Direcionamento inteligente em 20 segundos
              </span>
            </div>

            <div className="text-[12px] font-bold uppercase tracking-wider text-[#ff5f8a]">Passo 5 de 6 · Google 5★</div>
            <h2 className="mt-1 text-[27px] font-extrabold leading-[1.18] tracking-tight">
              Peça a avaliação no momento certo.
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#9a9a9a]">
              Logo após receber o cupom ou produto, o cliente satisfeito é convidado a avaliar seu comércio no Google Meu Negócio enquanto a experiência está fresca.
            </p>

            <ul className="mt-4 space-y-2.5 text-[13px] text-[#d8d8d8]">
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff5f8a] text-black">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span>Aumenta exponencialmente seu ranking nas buscas da sua região</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff5f8a] text-black">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span>Sem formulários chatos: abre direto a tela de 5 estrelas do Google</span>
              </li>
            </ul>
          </section>

          {/* SLIDE 6: Programa de Afiliados */}
          <section className="flex flex-col flex-none w-full snap-start overflow-y-auto px-6 py-4">
            <div className="relative mb-5 flex min-h-[220px] flex-col justify-center gap-2.5 overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0c0c0c] p-4 shadow-lg">
              <span className="absolute top-2.5 right-3 text-[10px] text-white/40 font-mono">comunidade</span>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#161616] p-3 text-[13px]">
                <span>Nível 1 · Bronze</span>
                <span className="rounded-md bg-[#cd7f32] px-2.5 py-1 text-[10px] font-extrabold text-black">Início</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#161616] p-3 text-[13px]">
                <span>Nível 2 · Prata</span>
                <span className="rounded-md bg-[#c0c0c0] px-2.5 py-1 text-[10px] font-extrabold text-black">Avançando</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#ffb020]/40 bg-[#ffb020]/15 p-3 text-[13px]">
                <span className="font-bold text-white">Nível 3 · Ouro VIP</span>
                <span className="rounded-md bg-[#ffb020] px-2.5 py-1 text-[10px] font-extrabold text-black">Topo</span>
              </div>
            </div>

            <div className="text-[12px] font-bold uppercase tracking-wider text-[#ff5f8a]">Passo 6 de 6 · Afiliados</div>
            <h2 className="mt-1 text-[27px] font-extrabold leading-[1.18] tracking-tight">
              Indique outros comércios e avance de nível.
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#9a9a9a]">
              No programa de parceiros do AvaliaTap, cada loja que você indica gera mensalidades grátis para o seu comércio e comissões recorrentes.
            </p>

            <ul className="mt-4 space-y-2.5 text-[13px] text-[#d8d8d8]">
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff5f8a] text-black">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span>Bônus recorrente por espalhar placas na sua cidade</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff5f8a] text-black">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span>Painel transparente para acompanhar suas indicações</span>
              </li>
            </ul>
          </section>

          {/* SLIDE 7: Primeiros Passos (Checklist Interativo) */}
          <section className="flex flex-col flex-none w-full snap-start overflow-y-auto px-6 py-4">
            <div className="text-[12px] font-bold uppercase tracking-wider text-[#ff5f8a]">Tudo pronto</div>
            <h2 className="mt-1 text-[27px] font-extrabold leading-[1.18] tracking-tight">
              Seus primeiros passos.
            </h2>
            <p className="mt-1 text-[13px] text-[#9a9a9a]">
              {completedCount} de {checklistItems.length} concluídos
            </p>

            <div className="mt-4 space-y-2.5">
              {checklistItems.map((item, idx) => {
                const isDone = !!checklist[idx];
                return (
                  <div
                    key={item.title}
                    className={`flex items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all ${
                      isDone
                        ? "border-[#ff5f8a]/40 bg-[#ff5f8a]/10"
                        : "border-white/10 bg-[#141414] hover:border-white/25"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleCheck(idx)}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all ${
                          isDone ? "border-[#ff5f8a] bg-[#ff5f8a] text-black" : "border-white/20 bg-transparent"
                        }`}
                      >
                        {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </span>
                      <span
                        className={`text-[13.5px] font-medium leading-snug ${
                          isDone ? "line-through text-[#9a9a9a]" : "text-white"
                        }`}
                      >
                        {item.title}
                      </span>
                    </button>

                    <Link
                      to={item.to}
                      onClick={onClose}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/5 text-[#9a9a9a] hover:bg-white/15 hover:text-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer Controls */}
        <div className="relative z-10 flex items-center gap-3 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent px-6 py-4">
          {slideIdx > 0 && (
            <button
              onClick={() => goToSlide(slideIdx - 1)}
              className="grid h-13 w-13 shrink-0 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white/10 active:scale-95"
              aria-label="Voltar"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <button
            onClick={() => {
              if (slideIdx === totalSlides - 1) {
                onClose();
              } else {
                goToSlide(slideIdx + 1);
              }
            }}
            className="flex-1 h-13 rounded-full bg-gradient-to-r from-[#ff5f8a] to-[#ef1f4d] text-white text-[15px] font-extrabold shadow-[0_8px_30px_rgba(239,31,77,0.45)] transition hover:opacity-95 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {slideIdx === 0
              ? "Ver como funciona"
              : slideIdx === totalSlides - 1
              ? "Começar agora ✓"
              : "Continuar"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
