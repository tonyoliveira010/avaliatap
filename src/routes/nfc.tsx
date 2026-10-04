import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Nfc,
  CreditCard,
  Smartphone,
  Check,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Gift,
  Award,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { defaultMerchantSlug, merchants } from "@/lib/merchants";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/nfc")({
  head: () => ({
    meta: [
      { title: "Placas NFC & Embaixadores · AvaliaTap" },
      {
        name: "description",
        content:
          "Gerencie suas placas NFC, conheça novos modelos e participe do Programa de Embaixadores.",
      },
      { property: "og:title", content: "Placas NFC & Embaixadores · AvaliaTap" },
      {
        property: "og:description",
        content: "Placas, cartões e adesivos NFC com programa de benefícios e embaixadores.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NfcPage,
});

const devices = [
  { id: "placa", icon: Nfc, name: "Placa de balcão", state: "Ativa", taps: 1284 },
  { id: "cartao", icon: CreditCard, name: "Cartão NFC", state: "Ativa", taps: 342 },
  { id: "adesivo", icon: Smartphone, name: "Adesivo de vitrine", state: "Inativa", taps: 0 },
];

const models = [
  {
    id: "balcao",
    icon: Nfc,
    name: "Placa de balcão",
    detail: "Acrílico espelhado com QR Code gravado a laser para recepção e caixa.",
  },
  {
    id: "cartao",
    icon: CreditCard,
    name: "Cartão digital",
    detail: "Cartão PVC com chip NFC integrado para levar no bolso e eventos.",
  },
  {
    id: "vitrine",
    icon: Smartphone,
    name: "Adesivo NFC",
    detail: "Resistente à água e sol para vitrines, mesas de atendimento e portas.",
  },
  {
    id: "totem",
    icon: Nfc,
    name: "Totem Premium",
    detail: "Base em madeira nobre com placa fosca para ambientes refinados.",
  },
];

function NfcPage() {
  const merchant = merchants[defaultMerchantSlug]!;
  const [ambassadorJoined, setAmbassadorJoined] = useState(false);

  const handleJoinAmbassador = () => {
    setAmbassadorJoined(true);
    toast.success("Inscrição no Programa de Embaixadores enviada! Entraremos em contato via WhatsApp.");
  };

  return (
    <div className="min-h-screen bg-background px-5 pb-32 pt-6">
      {/* Navegação Topo */}
      <Link
        to="/perfil"
        className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground active:scale-95"
      >
        <ArrowLeft className="h-4 w-4" /> Perfil
      </Link>

      <h1 className="text-[28px] font-extrabold tracking-tight text-foreground">Placas NFC</h1>
      <p className="mt-1 text-[13.5px] text-muted-foreground">
        Cada dispositivo abre a sua página pública ao ser aproximado do celular.
      </p>

      {/* Card da URL NFC */}
      <div className="mt-5 relative overflow-hidden rounded-3xl bg-secondary p-5 text-secondary-foreground shadow-lg">
        <span className="pointer-events-none absolute -right-12 -top-10 h-36 w-36 rounded-full border-[28px] border-primary/20" />
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] opacity-60">
          Destino dos toques
        </p>
        <p className="mt-2 text-[17px] font-bold">avaliatap.com/c/{merchant.slug}</p>
        <Link
          to="/c/$slug"
          params={{ slug: merchant.slug }}
          className="mt-4 flex items-center justify-center gap-1.5 rounded-2xl bg-primary py-3.5 text-[13px] font-extrabold text-primary-foreground shadow-sm active:scale-[0.99]"
        >
          Testar experiência <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      {/* Dispositivos Ativos */}
      <div className="mt-5 space-y-3">
        {devices.map((d) => (
          <div
            key={d.id}
            className="flex items-center gap-3.5 rounded-3xl border border-border bg-surface p-4 shadow-sm"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-muted">
              <d.icon className="h-5 w-5 text-foreground" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-bold text-foreground">{d.name}</p>
              <p className="text-[12px] text-muted-foreground">{d.taps} toques registrados</p>
            </div>
            <span
              className={`shrink-0 rounded-xl px-2.5 py-1.5 text-[11px] font-extrabold ${
                d.state === "Ativa"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {d.state === "Ativa" ? (
                <span className="inline-flex items-center gap-1">
                  <Check className="h-3 w-3 stroke-[3]" /> Ativa
                </span>
              ) : (
                "Inativa"
              )}
            </span>
          </div>
        ))}
      </div>

      {/* NOVOS MODELOS DISPONÍVEIS - CARDS COM 200PX DE LARGURA */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-foreground">Novos modelos disponíveis</h2>
          <span className="text-[11px] font-semibold text-muted-foreground">Largura 200px</span>
        </div>

        <div className="-mx-5 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 scrollbar-none">
          {models.map((model) => (
            <article
              key={model.id}
              className="flex h-[360px] w-[200px] min-w-[200px] max-w-[200px] shrink-0 snap-start flex-col justify-between rounded-[28px] border border-border bg-surface p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="grid h-[155px] w-full place-items-center rounded-2xl bg-primary-soft shadow-inner">
                  <model.icon className="h-16 w-16 text-foreground stroke-[1.7]" />
                </div>
                <h3 className="mt-3 text-[15px] font-bold leading-tight text-foreground">
                  {model.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {model.detail}
                </p>
              </div>

              <Button
                onClick={() => toast.success(`Solicitação para ${model.name} enviada com sucesso!`)}
                className="mt-3 w-full rounded-2xl bg-secondary text-secondary-foreground text-xs font-bold hover:bg-secondary/90 shadow-sm"
              >
                Solicitar Modelo
              </Button>
            </article>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* NOVO COMPONENTE DE BENEFÍCIOS: PROGRAMA DE EMBAIXADORES (SCROLL HORIZONTAL) */}
      {/* ========================================================================= */}
      <section className="mt-12 pt-6 border-t border-border">
        {/* Header do Programa */}
        <div className="mb-6">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-primary">
            AVALIATAP • PROGRAMA DE EMBAIXADORES
          </p>
          <h2 className="mt-2 text-[26px] sm:text-[34px] font-black leading-[1.05] tracking-tight text-foreground">
            Transforme sua audiência em uma nova fonte de renda.
          </h2>
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground max-w-xl">
            Compartilhe o AvaliaTap, acompanhe suas indicações e receba comissão pelas ativações realizadas através do seu link e placa exclusiva de parceiro.
          </p>
        </div>

        {/* Scroll Horizontal de Cards do Programa de Embaixadores */}
        <div className="-mx-5 overflow-x-auto overflow-y-hidden px-5 pb-5 pt-1 snap-x snap-mandatory scrollbar-none">
          <div className="flex gap-4 w-max">
            {/* CARD 1: APRESENTAÇÃO / SEJA EMBAIXADOR */}
            <article className="relative w-[300px] sm:w-[360px] h-[520px] shrink-0 snap-start overflow-hidden rounded-[32px] border border-[#242424] bg-gradient-to-br from-[#0a0a0a] to-[#020202] p-7 text-white shadow-2xl flex flex-col justify-between">
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_10%,rgba(255,255,255,0.04),transparent_35%)]" />

              <div className="relative z-10">
                <span className="inline-block rounded-full border border-[#292929] bg-[#101010] px-3.5 py-1 text-[10px] font-extrabold tracking-wider text-[#ff75aa] uppercase">
                  SEJA EMBAIXADORA / EMBAIXADOR
                </span>

                <h3 className="mt-4 text-[26px] font-black leading-tight tracking-tight">
                  Seu conteúdo.<br />
                  Seu público.<br />
                  <span className="text-[#ff75aa]">Sua comissão.</span>
                </h3>

                {/* Box / Placa Visual */}
                <div className="mt-5 h-[190px] w-full rounded-[24px] border border-[#202020] bg-gradient-to-b from-[#141414] to-[#040404] flex items-center justify-center shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,63,134,0.18),transparent_40%)]" />
                  <div className="h-[120px] w-[150px] rounded-2xl border border-[#383838] bg-gradient-to-br from-[#222] to-[#0d0d0d] shadow-[0_20px_40px_rgba(255,63,134,0.2)] transform -rotate-3 flex flex-col items-center justify-center p-3 relative">
                    <span className="text-[20px] font-black tracking-widest text-white">AVALIA</span>
                    <span className="text-[9px] font-extrabold tracking-[0.2em] text-[#ff75aa]">TAP NFC</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                <span className="inline-block rounded-full border border-[#292929] bg-[#101010] px-3 py-1 text-[9.5px] font-extrabold tracking-wider text-[#8d8d8d] uppercase">
                  BOX PARCEIRO
                </span>
                <h4 className="mt-2 text-[20px] font-bold text-white tracking-tight">
                  Indique. Encante. Receba.
                </h4>
                <p className="mt-1 text-xs text-[#888] leading-relaxed">
                  Crie conteúdo do seu jeito, compartilhe seu link exclusivo e acompanhe os resultados das suas indicações.
                </p>
              </div>
            </article>

            {/* CARD 2: PAINEL / DASHBOARD */}
            <article className="relative w-[340px] sm:w-[540px] h-[520px] shrink-0 snap-start overflow-hidden rounded-[32px] border border-[#242424] bg-gradient-to-br from-[#0c0c0c] to-[#030303] p-6 sm:p-7 text-white shadow-2xl flex flex-col justify-between">
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,rgba(255,255,255,0.03),transparent_30%)]" />

              <div className="relative z-10">
                <span className="inline-block rounded-full border border-[#292929] bg-[#101010] px-3.5 py-1 text-[10px] font-extrabold tracking-wider text-[#8d8d8d] uppercase">
                  SEU PAINEL EM TEMPO REAL
                </span>

                <h3 className="mt-3 text-[24px] sm:text-[30px] font-black leading-tight tracking-tight max-w-sm">
                  Tudo o que você precisa para acompanhar suas indicações.
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#242424] bg-[#090909] px-3 py-1 text-[10px] font-bold text-[#888]">
                    <span className="h-2 w-2 rounded-full bg-[#ff3f86]" /> LINK EXCLUSIVO
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#242424] bg-[#090909] px-3 py-1 text-[10px] font-bold text-[#888]">
                    <span className="h-2 w-2 rounded-full bg-[#f2b85b]" /> COMISSÕES
                  </span>
                  <span className="inline-flex items-center rounded-full border border-[#242424] bg-[#090909] px-3 py-1 text-[10px] font-bold text-[#888]">
                    RELATÓRIOS
                  </span>
                </div>
              </div>

              {/* Dashboard Metrics */}
              <div className="relative z-10 rounded-2xl border border-[#222] bg-[#0a0a0a]/90 p-4 space-y-2.5">
                <h4 className="text-xs font-bold text-[#aaa] uppercase tracking-wider">
                  Resumo do Mês
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="rounded-xl border border-[#1c1c1c] bg-[#111] p-3">
                    <small className="text-[10px] text-[#666]">Vendas indicadas</small>
                    <strong className="block text-[20px] font-black text-white mt-0.5">24</strong>
                    <span className="block text-[9.5px] font-bold text-[#39d98a] mt-1">↑ +38% este mês</span>
                  </div>

                  <div className="rounded-xl border border-[#1c1c1c] bg-[#111] p-3">
                    <small className="text-[10px] text-[#666]">Comissões geradas</small>
                    <strong className="block text-[20px] font-black text-white mt-0.5">R$ 428,40</strong>
                    <span className="block text-[9.5px] font-bold text-[#39d98a] mt-1">+ pagamento semanal</span>
                  </div>

                  <div className="rounded-xl border border-[#1c1c1c] bg-[#111] p-3">
                    <small className="text-[10px] text-[#666]">Cliques no link</small>
                    <strong className="block text-[20px] font-black text-white mt-0.5">1.284</strong>
                    <span className="block text-[9.5px] font-bold text-[#39d98a] mt-1">↑ alcance ativo</span>
                  </div>
                </div>
              </div>
            </article>

            {/* CARD 3: COMO FUNCIONA (4 PASSOS) */}
            <article className="relative w-[300px] sm:w-[350px] h-[520px] shrink-0 snap-start overflow-hidden rounded-[32px] border border-[#242424] bg-gradient-to-br from-[#0c0c0c] to-[#040404] p-7 text-white shadow-2xl flex flex-col justify-between">
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_30%)]" />

              <div className="relative z-10">
                <span className="inline-block rounded-full border border-[#292929] bg-[#101010] px-3.5 py-1 text-[10px] font-extrabold tracking-wider text-[#8d8d8d] uppercase">
                  COMO FUNCIONA
                </span>

                <h3 className="mt-3 text-[24px] font-black leading-tight tracking-tight">
                  Quatro passos para começar.
                </h3>

                <p className="mt-1 text-xs text-[#888] leading-relaxed">
                  O programa foi pensado para ser simples: você divulga, sua rede adere e suas indicações ficam vinculadas ao seu painel.
                </p>
              </div>

              {/* 4 Steps */}
              <div className="relative z-10 space-y-2">
                {[
                  { step: "01", title: "Cadastre-se", desc: "Entre para o programa de parceiros." },
                  { step: "02", title: "Receba seu link & placa", desc: "Um link exclusivo para divulgar." },
                  { step: "03", title: "Compartilhe", desc: "Use seus canais, redes e conversas." },
                  { step: "04", title: "Receba comissão", desc: "Adesão confirmada = bônus na sua conta." },
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

            {/* CARD 4: NÍVEIS & BENEFÍCIOS (TIERS) */}
            <article className="relative w-[300px] sm:w-[350px] h-[520px] shrink-0 snap-start overflow-hidden rounded-[32px] border border-[#272727] bg-gradient-to-br from-[#121212] to-[#070707] p-7 text-white shadow-2xl flex flex-col justify-between">
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_90%,rgba(255,63,134,0.1),transparent_45%)]" />

              <div className="relative z-10">
                <span className="inline-block rounded-full border border-[#292929] bg-[#101010] px-3.5 py-1 text-[10px] font-extrabold tracking-wider text-[#ff75aa] uppercase">
                  PROGRESSÃO & TIERS
                </span>

                <h3 className="mt-3 text-[24px] font-black leading-tight tracking-tight">
                  Cresça com o programa.<br />
                  <span className="text-[#ff75aa]">Mais vendas, mais ganhos.</span>
                </h3>
              </div>

              {/* Tiers List */}
              <div className="relative z-10 space-y-2.5">
                {[
                  { icon: "E", name: "Embaixador", detail: "Comece a divulgar", percent: "BASE" },
                  { icon: "+", name: "Embaixador Plus", detail: "Mais indicações recorrentes", percent: "PLUS" },
                  { icon: "★", name: "Embaixador VIP", detail: "Alto desempenho e premiações", percent: "VIP" },
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
            Arraste horizontalmente para conhecer todos os detalhes do programa
          </div>
          <div className="text-right text-[10.5px]">
            Critérios de comissionamento e regras são disponibilizados no regulamento de parceiro.
          </div>
        </div>

        {/* Banner CTA */}
        <div className="mt-6 rounded-[28px] border border-[#242424] bg-gradient-to-r from-[#0d0d0d] via-[#141414] to-[#0a0a0a] p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-[19px] font-black tracking-tight leading-tight">
              Pronto para fazer parte do AvaliaTap Embaixadores?
            </h3>
            <p className="mt-1 text-xs text-[#888]">
              Cadastre-se e comece a compartilhar sua experiência com sua audiência e lojistas.
            </p>
          </div>

          <Button
            type="button"
            onClick={handleJoinAmbassador}
            className="h-12 px-6 rounded-2xl bg-[#ff3f86] text-white text-[13px] font-extrabold shadow-lg hover:bg-[#e62e75] active:scale-95 shrink-0"
          >
            {ambassadorJoined ? "SOLICITAÇÃO RECEBIDA ✓" : "QUERO SER EMBAIXADOR"}
          </Button>
        </div>
      </section>
    </div>
  );
}
