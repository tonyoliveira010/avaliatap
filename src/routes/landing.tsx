import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Nfc,
  Star,
  Ticket,
  Users,
  ArrowRight,
  Check,
  ShoppingBag,
  Sparkles,
  ChevronDown,
  Gift,
  Coins,
  ExternalLink,
  Smartphone,
  Lock,
  MessageCircle,
  Zap,
  ShieldCheck,
  CalendarCheck,
  Layers,
} from "lucide-react";
import { defaultMerchantSlug, merchants } from "@/lib/merchants";
import { OnboardingFunnelModal } from "@/components/app/OnboardingFunnelModal";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "AvaliaTap — O ecossistema de placas NFC, fidelidade e avaliações" },
      {
        name: "description",
        content:
          "Placas NFC inteligentes, vitrine digital, carteira de fidelidade e avaliações 5 estrelas no Google para o seu comércio físico faturar mais.",
      },
      { property: "og:title", content: "AvaliaTap — O ecossistema de placas NFC e fidelidade" },
      {
        property: "og:description",
        content: "Transforme aproximações no balcão e mesas em clientes fiéis, cadastros qualificados e avaliações 5 estrelas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

export default function LandingPage() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const merchant = merchants[defaultMerchantSlug]!;

  const handleRequestMultiSlugs = () => {
    const text = encodeURIComponent(
      "Olá! Gostaria de conhecer mais sobre a plataforma AvaliaTap e solicitar o upgrade de Multi-Slugs e placas NFC para meu estabelecimento."
    );
    window.open(`https://wa.me/5511999990000?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] selection:bg-[#ff5f8a] selection:text-black">
      {/* ============= NAV ============= */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-[#ef1f4d] to-[#ff5f8a] text-black shadow-md">
              <Nfc className="h-4 w-4 stroke-[2.5]" />
            </span>
            <span className="text-[18px] font-extrabold tracking-tight">
              Avalia<span className="text-[#ff5f8a]">Tap</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-[#9a9a9a]">
            <a href="#ecossistema" className="hover:text-white transition">Ecossistema</a>
            <a href="#recursos" className="hover:text-white transition">Recursos</a>
            <a href="#beneficios" className="hover:text-white transition">Benefícios</a>
            <a href="#multislugs" className="hover:text-white transition">Multi-Slugs</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1 text-[13px] font-semibold text-[#9a9a9a] hover:text-white transition"
            >
              Painel do Comércio
            </Link>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff5f8a] to-[#ef1f4d] px-5 py-2.5 text-[13px] font-extrabold text-white shadow-[0_4px_20px_rgba(239,31,77,0.35)] transition hover:opacity-95 active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5" /> Conhecer o Funil
            </button>
          </div>
        </div>
      </header>

      {/* ============= HERO ============= */}
      <section className="relative overflow-hidden px-5 pt-16 pb-24 text-center">
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-radial from-[#ef1f4d]/22 to-transparent blur-3xl" />

        <div className="mx-auto max-w-4xl relative z-10">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#141414] px-4 py-1.5 text-[12px] text-[#9a9a9a] mb-6 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#ff5f8a] animate-pulse" />
            <span className="font-semibold text-white">TECNOLOGIA NFC • INDUÇÃO SEM APLICATIVO</span>
          </div>

          {/* Main Title */}
          <h1 className="text-[34px] sm:text-[54px] md:text-[62px] font-black leading-[1.05] tracking-tight text-white">
            Uma placa NFC que transforma <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-white via-[#ff92b2] to-[#ff5f8a] bg-clip-text text-transparent">
              aproximações em clientes fiéis.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-2xl text-[15px] sm:text-[17px] text-[#9a9a9a] leading-relaxed">
            Sem baixar aplicativo: o cliente aproxima o celular da placa no balcão ou nas mesas, raspa cupons, cadastra-se para acumular créditos e avalia seu negócio com 5 estrelas no Google.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/c/$slug"
              params={{ slug: defaultMerchantSlug }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff5f8a] to-[#ef1f4d] px-7 py-4 text-[14px] font-extrabold text-white shadow-[0_8px_30px_rgba(239,31,77,0.4)] transition hover:opacity-95 active:scale-95"
            >
              Testar Página Pública ao Vivo <ExternalLink className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#141414] px-6 py-4 text-[14px] font-bold text-white hover:bg-white/10 transition"
            >
              Como Faturar 4x Mais (1 min) <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Micro social proof chips */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4 text-xs text-[#8a8a8a]">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[#ff5f8a]" /> Funciona em iPhone e Android
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[#ff5f8a]" /> Zero downloads de aplicativo
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[#ff5f8a]" /> Chip NFC com gravação permanente
            </span>
          </div>

          {/* Interactive Mockup / Live Preview Card */}
          <div className="mt-14 mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-gradient-to-b from-[#181818] via-[#121212] to-[#0a0a0a] p-6 sm:p-8 shadow-2xl relative text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-secondary-foreground font-black text-lg">
                  {merchant.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{merchant.name}</h3>
                    <span className="rounded-full bg-[#ff5f8a]/15 text-[#ff5f8a] text-[10px] font-extrabold px-2.5 py-0.5">
                      AO VIVO NA PLACA
                    </span>
                  </div>
                  <p className="text-xs text-[#8a8a8a]">avaliatap.com/c/{merchant.slug}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white">
                  ⭐ 5.0 Google Reviews
                </span>
                <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#ffb020]">
                  ⚡ 1.284 Toques NFC
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-[#161616] p-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ff5f8a] block">
                  1. Toque Sem App
                </span>
                <p className="mt-1 text-[13.5px] font-bold text-white">Aproximou celular</p>
                <p className="text-[11.5px] text-[#8a8a8a] mt-0.5">A página abre no navegador nativo em 1 segundo.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#161616] p-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ffb020] block">
                  2. Fidelização & Créditos
                </span>
                <p className="mt-1 text-[13.5px] font-bold text-white">Carteira Própria</p>
                <p className="text-[11.5px] text-[#8a8a8a] mt-0.5">Lead captado ganha +100 créditos para consumir na loja.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#161616] p-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#39d98a] block">
                  3. Reputação Máxima
                </span>
                <p className="mt-1 text-[13.5px] font-bold text-white">5★ no Google</p>
                <p className="text-[11.5px] text-[#8a8a8a] mt-0.5">Clientes satisfeitos são guiados direto para avaliação.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= SEGMENTOS ============= */}
      <section className="border-y border-white/10 bg-[#0d0d0d] py-6">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <p className="text-[11.5px] font-bold uppercase tracking-wider text-[#8a8a8a] mb-3">
            Projetado para negócios físicos de atendimento e balcão
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { icon: "💈", label: "Barbearias" },
              { icon: "💇", label: "Salões & Beleza" },
              { icon: "✨", label: "Estética & Clínicas" },
              { icon: "☕", label: "Cafés & Bistrôs" },
              { icon: "🍔", label: "Restaurantes" },
              { icon: "💪", label: "Studios & Academias" },
              { icon: "🛍️", label: "Lojas & Varejo" },
            ].map((seg) => (
              <span
                key={seg.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#141414] px-3.5 py-1.5 text-xs text-[#d8d8d8]"
              >
                <span>{seg.icon}</span> {seg.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============= ECOSSISTEMA ============= */}
      <section id="ecossistema" className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#141414] px-4 py-1 text-[11px] text-[#ff5f8a] mb-4 font-bold uppercase tracking-wide">
              O ECOSSISTEMA AVALIATAP
            </div>
            <h2 className="text-[30px] sm:text-[44px] font-black leading-tight tracking-tight text-white">
              O ciclo contínuo de conversão, fidelidade e avaliações
            </h2>
            <p className="mt-3 text-[15px] text-[#9a9a9a] leading-relaxed">
              Diferente de um simples QR Code estático, o AvaliaTap combina hardware físico de indução com software de fidelização e captação de clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-[24px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0d0d0d] p-6 text-center hover:border-white/20 transition">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#ff5f8a]/15 text-[#ff5f8a]">
                <Nfc className="h-6 w-6" />
              </div>
              <h3 className="text-[16px] font-bold text-white mb-2">1. Placa NFC no Balcão</h3>
              <p className="text-[13px] text-[#9a9a9a] leading-relaxed">
                Posicionada estrategicamente na recepção, caixas ou mesas para aproximação com 1 toque.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0d0d0d] p-6 text-center hover:border-white/20 transition">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#ffb020]/15 text-[#ffb020]">
                <Ticket className="h-6 w-6" />
              </div>
              <h3 className="text-[16px] font-bold text-white mb-2">2. Raspadinha & Ofertas</h3>
              <p className="text-[13px] text-[#9a9a9a] leading-relaxed">
                O cliente raspa e se encanta com o benefício na hora do pagamento, gerando reciprocidade.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#ff5f8a]/40 bg-gradient-to-b from-[#1c1214] to-[#0f090a] p-6 text-center shadow-lg">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#ff5f8a] text-black">
                <Coins className="h-6 w-6" />
              </div>
              <h3 className="text-[16px] font-bold text-white mb-2">3. Lead & Créditos</h3>
              <p className="text-[13px] text-[#9a9a9a] leading-relaxed">
                Cadastro rápido em 20 segundos. Ganha créditos exclusivos para voltar e consumir novamente.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0d0d0d] p-6 text-center hover:border-white/20 transition">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#39d98a]/15 text-[#39d98a]">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-[16px] font-bold text-white mb-2">4. 5 Estrelas no Google</h3>
              <p className="text-[13px] text-[#9a9a9a] leading-relaxed">
                Multiplica avaliações no mapa e atrai novos clientes orgânicos na sua região todos os dias.
              </p>
            </div>
          </div>

          {/* Loop Flow representation */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-[13px] text-[#8a8a8a] text-center">
            <span className="rounded-full border border-white/10 bg-[#141414] px-3.5 py-1.5">Toque na Placa</span>
            <span>→</span>
            <span className="rounded-full border border-white/10 bg-[#141414] px-3.5 py-1.5">Cadastro de Lead</span>
            <span>→</span>
            <span className="rounded-full border border-white/10 bg-[#141414] px-3.5 py-1.5">Créditos na Carteira</span>
            <span>→</span>
            <span className="rounded-full border border-white/10 bg-[#141414] px-3.5 py-1.5">Avaliação Google</span>
            <span>→</span>
            <span className="rounded-full border border-[#ff5f8a]/40 bg-[#ff5f8a]/15 text-[#ff5f8a] font-bold px-3.5 py-1.5">
              Recompra & Indicação 🔄
            </span>
          </div>
        </div>
      </section>

      {/* ============= RECURSOS ============= */}
      <section id="recursos" className="py-20 border-t border-white/10 bg-[#0d0d0d]">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#141414] px-4 py-1 text-[11px] text-[#ff5f8a] mb-4 font-bold uppercase tracking-wide">
              RECURSOS COMPLETOS
            </div>
            <h2 className="text-[30px] sm:text-[42px] font-black leading-tight tracking-tight text-white">
              Tudo o que seu negócio precisa para crescer
            </h2>
            <p className="mt-3 text-[15px] text-[#9a9a9a] leading-relaxed">
              Desenvolvido especificamente para o ritmo dinâmico do varejo e serviços físicos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="rounded-[26px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0a0a0a] p-6 flex flex-col justify-between">
              <div>
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#ff5f8a]/15 text-[#ff5f8a]">
                  <Nfc className="h-6 w-6" />
                </div>
                <h3 className="text-[18px] font-bold text-white mb-2">Placa Física NFC de Indução</h3>
                <p className="text-[13.5px] text-[#9a9a9a] leading-relaxed">
                  Acrílico espelhado de alta resistência, gravação a laser e chip NFC interno permanente. Nunca precisa recarregar bateria.
                </p>
              </div>
              <div className="mt-5 rounded-xl border border-white/10 bg-[#161616] p-3 text-xs text-[#8a8a8a]">
                ⚡ Chip de resposta ultrarrápida (menos de 0.5s)
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-[26px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0a0a0a] p-6 flex flex-col justify-between">
              <div>
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#ffb020]/15 text-[#ffb020]">
                  <Ticket className="h-6 w-6" />
                </div>
                <h3 className="text-[18px] font-bold text-white mb-2">Raspadinha Digital Interativa</h3>
                <p className="text-[13.5px] text-[#9a9a9a] leading-relaxed">
                  Efeito tátil realista de raspar na tela do celular. Transforma o momento de pagamento em uma experiência divertida de desconto.
                </p>
              </div>
              <div className="mt-5 rounded-xl border border-white/10 bg-[#161616] p-3 text-xs text-[#8a8a8a]">
                🎁 Cupons com regras e validade controladas
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-[26px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0a0a0a] p-6 flex flex-col justify-between">
              <div>
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#39d98a]/15 text-[#39d98a]">
                  <Coins className="h-6 w-6" />
                </div>
                <h3 className="text-[18px] font-bold text-white mb-2">Carteira Multitenant de Créditos</h3>
                <p className="text-[13.5px] text-[#9a9a9a] leading-relaxed">
                  Cada loja tem sua moeda própria. O cliente só pode usar os créditos no seu estabelecimento, gerando fidelidade absoluta.
                </p>
              </div>
              <div className="mt-5 rounded-xl border border-white/10 bg-[#161616] p-3 text-xs text-[#8a8a8a]">
                🔒 100% isolado por estabelecimento (slug exclusiva)
              </div>
            </div>

            {/* Feature 4 */}
            <div className="rounded-[26px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0a0a0a] p-6 flex flex-col justify-between">
              <div>
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#3b82f6]/15 text-[#3b82f6]">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="text-[18px] font-bold text-white mb-2">Vitrine & Detalhes de Produtos</h3>
                <p className="text-[13.5px] text-[#9a9a9a] leading-relaxed">
                  Catálogo online completo com fotos, variações, planos de assinatura, cupons de primeira compra e agendamento de serviços.
                </p>
              </div>
              <div className="mt-5 rounded-xl border border-white/10 bg-[#161616] p-3 text-xs text-[#8a8a8a]">
                🛍️ Edição completa no painel e prévia instantânea
              </div>
            </div>

            {/* Feature 5 */}
            <div className="rounded-[26px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0a0a0a] p-6 flex flex-col justify-between">
              <div>
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#ef1f4d]/15 text-[#ef1f4d]">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-[18px] font-bold text-white mb-2">Captação Inteligente de Leads</h3>
                <p className="text-[13.5px] text-[#9a9a9a] leading-relaxed">
                  Capture nome, WhatsApp e data de aniversário dos clientes com permissão. O cliente recebe 100 créditos de boas-vindas na hora.
                </p>
              </div>
              <div className="mt-5 rounded-xl border border-white/10 bg-[#161616] p-3 text-xs text-[#8a8a8a]">
                📱 Sincronização direta com CRM de clientes
              </div>
            </div>

            {/* Feature 6 */}
            <div className="rounded-[26px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0a0a0a] p-6 flex flex-col justify-between">
              <div>
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#f2b85b]/15 text-[#f2b85b]">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="text-[18px] font-bold text-white mb-2">Google 5★ em 20 Segundos</h3>
                <p className="text-[13.5px] text-[#9a9a9a] leading-relaxed">
                  O cliente é direcionado diretamente para a caixa de 5 estrelas do seu perfil no Google Maps, acelerando sua classificação local.
                </p>
              </div>
              <div className="mt-5 rounded-xl border border-white/10 bg-[#161616] p-3 text-xs text-[#8a8a8a]">
                ⭐ Multiplica o tráfego orgânico no seu bairro
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= BENEFÍCIOS ============= */}
      <section id="beneficios" className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#141414] px-4 py-1 text-[11px] text-[#ff5f8a] mb-4 font-bold uppercase tracking-wide">
              POR QUE O AVALIATAP?
            </div>
            <h2 className="text-[30px] sm:text-[42px] font-black leading-tight tracking-tight text-white">
              Vantagens reais para faturar mais
            </h2>
            <p className="mt-3 text-[15px] text-[#9a9a9a] leading-relaxed">
              Compare a facilidade do AvaliaTap com cartões de papel ou aplicativos pesados que ninguém quer baixar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0a0a0a] p-7 space-y-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ff5f8a]/15 text-[#ff5f8a]">
                <Zap className="h-6 w-6" />
              </span>
              <h3 className="text-[20px] font-extrabold text-white">Zero Atrito no Ponto de Venda</h3>
              <p className="text-[14px] text-[#9a9a9a] leading-relaxed">
                Nenhum cliente quer gastar 5 minutos baixando aplicativo na fila do caixa. O toque na placa NFC abre imediatamente no navegador nativo do iPhone ou Android em 1 segundo.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0a0a0a] p-7 space-y-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ffb020]/15 text-[#ffb020]">
                <Coins className="h-6 w-6" />
              </span>
              <h3 className="text-[20px] font-extrabold text-white">Retenção Através da Moeda Própria</h3>
              <p className="text-[14px] text-[#9a9a9a] leading-relaxed">
                Quando o cliente tem 250 créditos acumulados na sua barbearia ou restaurante, ele prefere voltar ao seu estabelecimento em vez de ir ao concorrente para não perder o saldo.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0a0a0a] p-7 space-y-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#39d98a]/15 text-[#39d98a]">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <h3 className="text-[20px] font-extrabold text-white">Segurança e Multitenancy Rigoroso</h3>
              <p className="text-[14px] text-[#9a9a9a] leading-relaxed">
                Os dados dos seus clientes e as moedas nunca são compartilhados com outros comércios. Cada negócio tem sua infraestrutura, créditos e histórico completamente isolados.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-[#141414] to-[#0a0a0a] p-7 space-y-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#3b82f6]/15 text-[#3b82f6]">
                <Layers className="h-6 w-6" />
              </span>
              <h3 className="text-[20px] font-extrabold text-white">Multi-Slugs & Placas Estratégicas</h3>
              <p className="text-[14px] text-[#9a9a9a] leading-relaxed">
                Você pode posicionar placas com objetivos diferentes: uma no caixa para avaliação Google, uma nas mesas para cardápio e raspadinha, e placas separadas por filial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CTA DE MULTI-SLUGS COM O COMPONENTE IDÊNTICO AO DA PÁGINA DE NFC */}
      {/* ========================================================================= */}
      <section id="multislugs" className="py-24 border-t border-white/10 bg-[#0c0c0c]">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-8">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#ff5f8a]">
              AVALIATAP • ARQUITETURA DE SLUGS & REGRAS DE HARDWARE
            </p>
            <h2 className="mt-2 text-[28px] sm:text-[40px] font-black leading-[1.05] tracking-tight text-white">
              Sua placa é permanente. Suas possibilidades são ilimitadas.
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#9a9a9a] max-w-2xl">
              A URL gravada no chip NFC do seu estabelecimento é única e nunca quebra. Atualize produtos, agendamento e fotos à vontade. E se precisar de placas para ações diferentes, ative o Upgrade Multi-Slugs.
            </p>
          </div>

          {/* Scroll Horizontal de Cards da Página de NFC */}
          <div className="-mx-5 overflow-x-auto overflow-y-hidden px-5 pb-5 pt-1 snap-x snap-mandatory scrollbar-none">
            <div className="flex gap-4 w-max">
              {/* CARD 1: REGRA DE OURO - SLUG ÚNICA & INTEGRIDADE */}
              <article className="relative w-[300px] sm:w-[360px] h-[520px] shrink-0 snap-start overflow-hidden rounded-[32px] border border-[#242424] bg-gradient-to-br from-[#0a0a0a] to-[#020202] p-7 text-white shadow-2xl flex flex-col justify-between">
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_10%,rgba(255,255,255,0.04),transparent_35%)]" />

                <div className="relative z-10">
                  <span className="inline-block rounded-full border border-[#292929] bg-[#101010] px-3.5 py-1 text-[10px] font-extrabold tracking-wider text-[#ff75aa] uppercase">
                    CHIP NFC PERMANENTE
                  </span>

                  <h3 className="mt-4 text-[26px] font-black leading-tight tracking-tight">
                    Sua placa física.<br />
                    Seu link seguro.<br />
                    <span className="text-[#ff75aa]">Zero interferência.</span>
                  </h3>

                  {/* Box / Placa Visual */}
                  <div className="mt-5 h-[190px] w-full rounded-[24px] border border-[#202020] bg-gradient-to-b from-[#141414] to-[#040404] flex items-center justify-center shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,63,134,0.18),transparent_40%)]" />
                    <div className="h-[120px] w-[160px] rounded-2xl border border-[#383838] bg-gradient-to-br from-[#222] to-[#0d0d0d] shadow-[0_20px_40px_rgba(255,63,134,0.2)] transform -rotate-3 flex flex-col items-center justify-center p-3 relative text-center">
                      <span className="text-[17px] font-black tracking-widest text-white">/c/{merchant.slug}</span>
                      <span className="text-[8.5px] font-extrabold tracking-[0.16em] text-[#ff75aa] mt-1">
                        CHIP INDUÇÃO NFC
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <span className="inline-block rounded-full border border-[#292929] bg-[#101010] px-3 py-1 text-[9.5px] font-extrabold tracking-wider text-[#8d8d8d] uppercase">
                    SEGURANÇA TOTAL
                  </span>
                  <h4 className="mt-2 text-[19px] font-bold text-white tracking-tight">
                    Atualize tudo sem trocar de placa.
                  </h4>
                  <p className="mt-1 text-xs text-[#888] leading-relaxed">
                    Mude preços, banners, procedimentos e produtos. A placa física continua abrindo sua página perfeitamente sem necessidade de reconfiguração.
                  </p>
                </div>
              </article>

              {/* CARD 2: MULTI-SLUGS & NOVAS PLACAS */}
              <article className="relative w-[340px] sm:w-[540px] h-[520px] shrink-0 snap-start overflow-hidden rounded-[32px] border border-[#242424] bg-gradient-to-br from-[#0c0c0c] to-[#030303] p-6 sm:p-7 text-white shadow-2xl flex flex-col justify-between">
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,rgba(255,255,255,0.03),transparent_30%)]" />

                <div className="relative z-10">
                  <span className="inline-block rounded-full border border-[#292929] bg-[#101010] px-3.5 py-1 text-[10px] font-extrabold tracking-wider text-[#ff75aa] uppercase">
                    UPGRADE MULTI-SLUGS
                  </span>

                  <h3 className="mt-3 text-[24px] sm:text-[30px] font-black leading-tight tracking-tight max-w-sm">
                    Até 5 páginas e placas físicas para o seu negócio.
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#242424] bg-[#090909] px-3 py-1 text-[10px] font-bold text-[#888]">
                      <span className="h-2 w-2 rounded-full bg-[#ff3f86]" /> BALCÃO: AGENDAR
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#242424] bg-[#090909] px-3 py-1 text-[10px] font-bold text-[#888]">
                      <span className="h-2 w-2 rounded-full bg-[#f2b85b]" /> MESAS: CLUBE
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#242424] bg-[#090909] px-3 py-1 text-[10px] font-bold text-[#888]">
                      <span className="h-2 w-2 rounded-full bg-[#39d98a]" /> CAIXA: AVALIAÇÃO
                    </span>
                  </div>
                </div>

                {/* Dashboard Metrics */}
                <div className="relative z-10 rounded-2xl border border-[#222] bg-[#0a0a0a]/90 p-4 space-y-2.5">
                  <h4 className="text-xs font-bold text-[#aaa] uppercase tracking-wider">
                    Exemplo de Distribuição por Placa Física
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="rounded-xl border border-[#1c1c1c] bg-[#111] p-3">
                      <small className="text-[10px] text-[#666]">Placa 1 · Geral</small>
                      <strong className="block text-[14px] font-bold text-white mt-0.5 truncate">/c/{merchant.slug}</strong>
                      <span className="block text-[9.5px] font-bold text-[#39d98a] mt-1">1.284 toques</span>
                    </div>

                    <div className="rounded-xl border border-[#1c1c1c] bg-[#111] p-3">
                      <small className="text-[10px] text-[#666]">Placa 2 · Recepção</small>
                      <strong className="block text-[14px] font-bold text-white mt-0.5 truncate">...-agendamento</strong>
                      <span className="block text-[9.5px] font-bold text-[#39d98a] mt-1">520 toques</span>
                    </div>

                    <div className="rounded-xl border border-[#1c1c1c] bg-[#111] p-3">
                      <small className="text-[10px] text-[#666]">Placa 3 · Mesas</small>
                      <strong className="block text-[14px] font-bold text-white mt-0.5 truncate">...-fidelidade</strong>
                      <span className="block text-[9.5px] font-bold text-[#39d98a] mt-1">340 toques</span>
                    </div>
                  </div>
                </div>
              </article>

              {/* CARD 3: COMO FUNCIONA O MULTI-SLUGS */}
              <article className="relative w-[300px] sm:w-[350px] h-[520px] shrink-0 snap-start overflow-hidden rounded-[32px] border border-[#242424] bg-gradient-to-br from-[#0c0c0c] to-[#040404] p-7 text-white shadow-2xl flex flex-col justify-between">
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_30%)]" />

                <div className="relative z-10">
                  <span className="inline-block rounded-full border border-[#292929] bg-[#101010] px-3.5 py-1 text-[10px] font-extrabold tracking-wider text-[#8d8d8d] uppercase">
                    PASSO A PASSO
                  </span>

                  <h3 className="mt-3 text-[24px] font-black leading-tight tracking-tight">
                    Quatro passos para ter múltiplas placas.
                  </h3>

                  <p className="mt-1 text-xs text-[#888] leading-relaxed">
                    O processo é 100% assistido por nossa equipe técnica para garantir entrega rápida e pré-configurada.
                  </p>
                </div>

                {/* 4 Steps */}
                <div className="relative z-10 space-y-2">
                  {[
                    { step: "01", title: "Solicite no WhatsApp", desc: "Entre em contato conosco para ativar o upgrade." },
                    { step: "02", title: "Defina suas ações", desc: "Agendamentos, avaliações, clube ou vitrine." },
                    { step: "03", title: "Gravação física", desc: "Programamos cada chip NFC sob medida." },
                    { step: "04", title: "Receba e posicione", desc: "Multiplique pontos de contato no estabelecimento." },
                  ].map((s) => (
                    <div
                      key={s.step}
                      className="flex items-center gap-3 rounded-xl border border-[#1b1b1b] bg-[#090909] p-2.5"
                    >
                      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#191919] text-[10.5px] font-black text-[#ff75aa]">
                        {s.step}
                      </div>
                      <div>
                        <strong className="block text-[12px] text-white leading-tight">{s.title}</strong>
                        <span className="text-[10px] text-[#666]">{s.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              {/* CARD 4: NÍVEIS & TIERS DE SLUGS */}
              <article className="relative w-[300px] sm:w-[350px] h-[520px] shrink-0 snap-start overflow-hidden rounded-[32px] border border-[#272727] bg-gradient-to-br from-[#121212] to-[#070707] p-7 text-white shadow-2xl flex flex-col justify-between">
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_90%,rgba(255,63,134,0.1),transparent_45%)]" />

                <div className="relative z-10">
                  <span className="inline-block rounded-full border border-[#292929] bg-[#101010] px-3.5 py-1 text-[10px] font-extrabold tracking-wider text-[#ff75aa] uppercase">
                    PLANOS DE HARDWARE
                  </span>

                  <h3 className="mt-3 text-[24px] font-black leading-tight tracking-tight">
                    Escolha sua escala.<br />
                    <span className="text-[#ff75aa]">Do balcão à loja inteira.</span>
                  </h3>
                </div>

                {/* Tiers List */}
                <div className="relative z-10 space-y-2.5">
                  {[
                    { icon: "1", name: "Plano Base", detail: "1 Slug + 1 Placa Balcão", percent: "INCLUSO" },
                    { icon: "3", name: "Multi-Slug Plus", detail: "3 Slugs + 3 Placas Físicas", percent: "PLUS" },
                    { icon: "5", name: "Multi-Slug VIP", detail: "Até 5 Slugs + 5 Placas + Totem", percent: "VIP FULL" },
                  ].map((tier) => (
                    <div
                      key={tier.name}
                      className="flex items-center justify-between rounded-xl border border-[#262626] bg-[#0e0e0e] p-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#191919] text-[12px] font-black text-[#ff75aa]">
                          {tier.icon}
                        </div>
                        <div>
                          <strong className="block text-[12px] text-white leading-tight">
                            {tier.name}
                          </strong>
                          <small className="text-[10px] text-[#777]">{tier.detail}</small>
                        </div>
                      </div>
                      <span className="text-[13px] font-extrabold text-[#39d98a]">
                        {tier.percent}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>

          {/* Instruções de Navegação */}
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11.5px] text-[#777] px-1">
            <div className="flex items-center gap-2 font-medium">
              <span className="h-2 w-2 rounded-full bg-[#ff75aa] animate-pulse" />
              Arraste horizontalmente para conferir as regras de hardware e multi-slugs
            </div>
            <div className="text-right text-[10.5px]">
              Para criação de novas slugs e envio de novas placas físicas, fale com nossa equipe.
            </div>
          </div>

          {/* Banner CTA com o botão "QUERO TER MULTI-SLUGS" */}
          <div className="mt-8 rounded-[28px] border border-[#242424] bg-gradient-to-r from-[#0d0d0d] via-[#141414] to-[#0a0a0a] p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#ff75aa] block mb-1">
                DISPONÍVEL AGORA
              </span>
              <h3 className="text-[20px] sm:text-[22px] font-black tracking-tight leading-tight">
                Pronto para expandir com o Upgrade Multi-Slugs?
              </h3>
              <p className="mt-1 text-xs sm:text-[13px] text-[#888]">
                Solicite novas placas NFC físicas gravadas sob medida para cada área do seu comércio.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRequestMultiSlugs}
              className="h-13 px-8 rounded-2xl bg-[#ff3f86] text-white text-[13.5px] font-black shadow-lg hover:bg-[#e62e75] active:scale-95 shrink-0 transition"
            >
              QUERO TER MULTI-SLUGS
            </button>
          </div>
        </div>
      </section>

      {/* ============= FAQ ============= */}
      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-5">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#141414] px-4 py-1 text-[11px] text-[#ff5f8a] mb-4 font-bold uppercase tracking-wide">
              DÚVIDAS FREQUENTES
            </div>
            <h2 className="text-[30px] sm:text-[40px] font-black leading-tight tracking-tight text-white">
              Perguntas que lojistas costumam fazer
            </h2>
            <p className="mt-2 text-[14px] text-[#9a9a9a]">
              Tudo o que você precisa saber para colocar a placa NFC para rodar no seu balcão.
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              {
                q: "Os créditos de um comércio valem em outro?",
                a: "Não. O AvaliaTap é 100% multitenant. Cada negócio tem sua carteira própria, regras de resgate exclusivas e dados totalmente isolados.",
              },
              {
                q: "O cliente precisa baixar algum aplicativo no celular?",
                a: "Não! Basta aproximar o celular da placa NFC ou escanear o QR Code gravado a laser. A página abre instantaneamente no navegador padrão do cliente.",
              },
              {
                q: "Como funciona a entrega da placa física?",
                a: "Enviamos a placa física programada e pronta para uso direto para o endereço do seu comércio, com frete expresso para todo o Brasil.",
              },
              {
                q: "Por que ter múltiplos slugs e mais de uma placa?",
                a: "Com múltiplos slugs, você pode colocar uma placa no caixa (focada em avaliação Google), outra nas mesas (focada em raspadinha e cardápio) e controlar filiais diferentes com métricas separadas em um único painel.",
              },
              {
                q: "Como as avaliações do Google Meu Negócio funcionam?",
                a: "O sistema direciona clientes satisfeitos com apenas 1 toque direto para a tela de avaliação de 5 estrelas do seu perfil no Google, multiplicando sua reputação no mapa da sua cidade.",
              },
              {
                q: "Como funciona a captação de leads na página pública?",
                a: "O cliente se cadastra em 20 segundos informando nome e WhatsApp para desbloquear ofertas exclusivas, o programa de fidelidade e ganhar 100 créditos de boas-vindas na sua loja.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-white/10 bg-[#141414] p-5 transition hover:border-white/20"
              >
                <summary className="flex cursor-pointer items-center justify-between font-bold text-[15px] text-white">
                  <span>{faq.q}</span>
                  <ChevronDown className="h-4 w-4 text-[#9a9a9a] transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-[13.5px] leading-relaxed text-[#9a9a9a]">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============= RODAPÉ ============= */}
      <footer className="border-t border-white/10 bg-[#080808] py-14 text-[13px] text-[#9a9a9a]">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 font-bold text-white mb-3">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#ff5f8a] text-black">
                  <Nfc className="h-3.5 w-3.5 stroke-[2.5]" />
                </span>
                <span className="text-[16px] font-extrabold">AvaliaTap</span>
              </div>
              <p className="text-[12.5px] leading-relaxed text-[#888]">
                A plataforma que une tecnologia física de indução NFC com fidelização de clientes, raspadinha digital e reputação máxima no Google.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-[13px] uppercase tracking-wider mb-3">Plataforma</h4>
              <ul className="space-y-2">
                <li><Link to="/nfc" className="hover:text-white transition">Placas NFC & Hardware</Link></li>
                <li><Link to="/catalogo" className="hover:text-white transition">Vitrine & Produtos</Link></li>
                <li><Link to="/upgrades" className="hover:text-white transition">Upgrade Multi-Slugs</Link></li>
                <li>
                  <button
                    onClick={() => setIsOnboardingOpen(true)}
                    className="hover:text-white transition text-left"
                  >
                    Funil Interativo (1 min)
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-[13px] uppercase tracking-wider mb-3">Demonstração</h4>
              <ul className="space-y-2">
                <li><Link to="/c/$slug" params={{ slug: "barbearia-alpha" }} className="hover:text-white transition">Barbearia Alpha</Link></li>
                <li><Link to="/c/$slug" params={{ slug: "cantina-do-ze" }} className="hover:text-white transition">Cantina do Zé</Link></li>
                <li><Link to="/" className="hover:text-white transition">Painel Administrativo</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-[13px] uppercase tracking-wider mb-3">Atendimento</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://wa.me/5511999990000"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition flex items-center gap-1.5"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Suporte WhatsApp
                  </a>
                </li>
                <li><a href="mailto:contato@avaliatap.com" className="hover:text-white transition">contato@avaliatap.com</a></li>
                <li><span className="text-white/40">São Paulo, SP · Brasil</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/40">
            <p>© 2026 AvaliaTap. Todos os direitos reservados.</p>
            <div className="flex gap-4">
              <span className="hover:text-white transition cursor-pointer">Termos de Uso</span>
              <span className="hover:text-white transition cursor-pointer">Privacidade</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Onboarding Funnel Modal */}
      <OnboardingFunnelModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
}
