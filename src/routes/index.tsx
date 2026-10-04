import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Bell,
  Nfc,
  Star,
  Ticket,
  Users,
  QrCode,
  ExternalLink,
  ArrowUpRight,
  Megaphone,
  Gift,
  ShoppingBag,
  Settings2,
  Zap,
  User,
  Sparkles,
  ArrowRight,
  Layers,
  ChevronRight,
} from "lucide-react";
import { merchants, defaultMerchantSlug } from "@/lib/merchants";
import { OnboardingFunnelModal } from "@/components/app/OnboardingFunnelModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AvaliaTap · Painel do comércio" },
      {
        name: "description",
        content:
          "Acompanhe toques na placa NFC, avaliações, cupons resgatados e campanhas do seu comércio.",
      },
      { property: "og:title", content: "AvaliaTap · Painel do comércio" },
      {
        property: "og:description",
        content: "Toques NFC, avaliações e cupons do seu comércio em um só lugar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Panel,
});

const stats = [
  { id: "taps", icon: Nfc, label: "Toques hoje", value: "128", trend: "+18%" },
  { id: "reviews", icon: Star, label: "Avaliações", value: "34", trend: "+6" },
  { id: "coupons", icon: Ticket, label: "Cupons usados", value: "21", trend: "+9" },
  { id: "leads", icon: Users, label: "Novos contatos", value: "47", trend: "+12" },
];

const shortcuts = [
  { id: "campanha", icon: Megaphone, label: "Campanha", to: "/campanhas" as const },
  { id: "cupom", icon: Users, label: "Clientes", to: "/beneficiarios" as const },
  { id: "placa", icon: QrCode, label: "Placas", to: "/nfc" as const },
  { id: "vitrine", icon: ShoppingBag, label: "Vitrine", to: "/catalogo" as const },
  { id: "upgrades", icon: Zap, label: "Upgrades", to: "/upgrades" as const },
  { id: "plano", icon: Star, label: "Plano", to: "/financeiro" as const },
  { id: "pagina", icon: Settings2, label: "Página", to: "/configuracoes" as const },
  { id: "perfil", icon: User, label: "Perfil", to: "/perfil" as const },
];

function Panel() {
  const merchant = merchants[defaultMerchantSlug]!;
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  return (
    <div className="pb-8">
      <header className="px-5 pb-4 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-[15px] font-extrabold text-secondary-foreground">
              {merchant.name.charAt(0)}
            </div>
            <div>
              <p className="text-[13px] leading-tight text-muted-foreground">Olá, bom dia</p>
              <h2 className="text-base font-semibold leading-tight text-foreground">{merchant.name}</h2>
            </div>
          </div>
          <button className="relative grid h-11 w-11 place-items-center rounded-full border border-border bg-surface active:scale-95">
            <Bell className="h-[18px] w-[18px] text-foreground" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-surface" />
          </button>
        </div>
      </header>

      {/* Banners em Scroll Horizontal na Mesma Linha */}
      <section className="px-5">
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-none snap-x snap-mandatory pt-1">
          {/* Card 1: Sua Página Pública */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative w-[86vw] max-w-[350px] shrink-0 snap-start overflow-hidden rounded-[28px] bg-secondary p-5 text-secondary-foreground shadow-md flex flex-col justify-between min-h-[290px]"
          >
            <span className="pointer-events-none absolute -right-14 -top-12 h-40 w-40 rounded-full border-[34px] border-primary/25" />
            <div>
              <span className="inline-flex rounded-full bg-primary px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-primary-foreground">
                Sua página pública
              </span>
              <h3 className="mt-5 max-w-[240px] text-[25px] font-extrabold leading-[1.08] tracking-tight">
                avaliatap.com/c/{merchant.slug}
              </h3>
              <p className="mt-2 max-w-[260px] text-[13px] opacity-70 leading-relaxed">
                É o que o cliente vê ao aproximar o celular da sua placa NFC no balcão ou nas mesas.
              </p>
            </div>
            <div className="mt-5 flex gap-2">
              <Link
                to="/c/$slug"
                params={{ slug: merchant.slug }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-primary py-3.5 text-[13px] font-extrabold text-primary-foreground active:scale-[0.99]"
              >
                Ver página <ExternalLink className="h-4 w-4" />
              </Link>
              <Link
                to="/campanhas"
                className="flex items-center justify-center rounded-2xl bg-white/10 px-4 py-3.5 text-[13px] font-bold hover:bg-white/15"
              >
                Editar
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Conheça mais a plataforma (Funil & Multislugs) */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="relative w-[86vw] max-w-[350px] shrink-0 snap-start overflow-hidden rounded-[28px] border border-[#ff5f8a]/35 bg-gradient-to-br from-[#181818] via-[#121212] to-[#0a0a0a] p-5 text-white shadow-xl flex flex-col justify-between min-h-[290px]"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#ef1f4d]/20 blur-2xl" />

            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ff5f8a]/40 bg-[#ff5f8a]/15 px-3 py-1 text-[10px] font-extrabold tracking-wide text-[#ff5f8a]">
                  <Sparkles className="h-3 w-3" /> FUNIL DE CONVERSÃO & MULTISLUGS
                </span>
                <span className="text-[11px] font-bold text-[#ffb020]">1 min</span>
              </div>

              <div className="mt-3.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5f8a]">
                  Conheça mais a plataforma
                </span>
                <h3 className="mt-0.5 text-[20px] font-extrabold leading-tight text-white">
                  Como faturar até 4x mais com o AvaliaTap
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[#9a9a9a]">
                  Entenda como a Placa NFC, a Raspadinha Digital e ter múltiplos slugs (balcão, mesas e filiais) transformam aproximações em clientes fiéis.
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5 text-[10.5px] font-semibold text-[#d8d8d8]">
                <span className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1">
                  ⚡ Toques sem app
                </span>
                <span className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1">
                  📍 Múltiplos slugs
                </span>
                <span className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1">
                  ⭐ Google 5★
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff5f8a] to-[#ef1f4d] py-3.5 text-[13px] font-extrabold text-white shadow-[0_6px_20px_rgba(239,31,77,0.35)] transition hover:opacity-95 active:scale-[0.99]"
              >
                Conhecer o funil interativo <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/upgrades"
                className="flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-3.5 py-3.5 text-[12.5px] font-bold text-white hover:bg-white/10"
                title="Ver benefícios de mais slugs"
              >
                <Layers className="h-4 w-4 text-[#ffb020]" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Indicador sutil de scroll horizontal */}
        <div className="mt-2 flex items-center justify-center gap-1.5">
          <span className="h-1.5 w-5 rounded-full bg-primary" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
        </div>
      </section>

      <section className="mt-5 px-5">
        <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-2 scrollbar-none snap-x">
          {shortcuts.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.03 * i }}
              className="shrink-0 snap-start"
            >
              <Link
                to={s.to}
                className="flex h-[70px] w-[70px] min-h-[70px] min-w-[70px] flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-surface p-1 active:scale-95 shadow-sm transition-all hover:border-primary/40 hover:bg-muted/40"
              >
                <s.icon className="h-5 w-5 text-foreground shrink-0" strokeWidth={2.2} />
                <span className="text-[10px] font-bold text-foreground/85 truncate max-w-[62px] text-center">
                  {s.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <h3 className="mb-3 text-[15px] font-semibold text-foreground">Resumo de hoje</h3>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.04 * i }}
              className="rounded-3xl border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-muted">
                  <s.icon className="h-4 w-4 text-foreground" />
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                  <ArrowUpRight className="h-3 w-3" />
                  {s.trend}
                </span>
              </div>
              <p className="mt-3 text-2xl font-extrabold tracking-tight text-foreground">{s.value}</p>
              <p className="text-[12px] text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-foreground">Comércios de demonstração</h3>
        </div>
        <div className="space-y-3">
          {Object.values(merchants).map((m) => (
            <Link
              key={m.slug}
              to="/c/$slug"
              params={{ slug: m.slug }}
              className="flex items-center gap-3 rounded-3xl border border-border bg-surface p-4 active:scale-[0.99]"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                <Nfc className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-semibold text-foreground">{m.name}</p>
                <p className="truncate text-[12px] text-muted-foreground">/c/{m.slug}</p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {/* Onboarding Funnel Modal */}
      <OnboardingFunnelModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
}
