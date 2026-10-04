import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronLeft,
  CalendarCheck,
  Sparkles,
  Users,
  Award,
  Nfc,
  Gift,
  Star,
  CheckCircle2,
  ExternalLink,
  Zap,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { defaultMerchantSlug, getMerchant } from "@/lib/merchants";
import { usePublicSettings } from "@/lib/public-settings";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/upgrades")({
  head: () => ({
    meta: [
      { title: "Upgrades & Funcionalidades · AvaliaTap" },
      {
        name: "description",
        content: "Ative funcionalidades e módulos sob medida para o seu comércio.",
      },
      { property: "og:title", content: "Upgrades & Funcionalidades · AvaliaTap" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UpgradesPage,
});

function UpgradesPage() {
  const merchant = getMerchant(defaultMerchantSlug)!;
  const { settings, update: updateSettings } = usePublicSettings(defaultMerchantSlug);

  const toggleModule = (key: keyof typeof settings, label: string) => {
    const next = !settings[key];
    updateSettings({ ...settings, [key]: next });
    toast.success(`${label} ${next ? "ativado com sucesso!" : "desativado."}`);
  };

  return (
    <div className="min-h-screen bg-background pb-32 pt-6 px-5">
      {/* Voltar ao Perfil */}
      <Link
        to="/perfil"
        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-muted-foreground hover:text-foreground active:scale-95 mb-4"
      >
        <ChevronLeft className="h-4 w-4" /> Voltar ao Perfil
      </Link>

      {/* BANNER PRINCIPAL NO TOPO */}
      <section className="relative overflow-hidden rounded-[30px] bg-secondary p-6 text-secondary-foreground shadow-xl">
        <span className="pointer-events-none absolute -right-16 -top-12 h-48 w-48 rounded-full border-[38px] border-primary/25" />
        <span className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full border-[30px] border-white/5" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary-foreground">
              <Zap className="h-3.5 w-3.5" /> Upgrades & Inovações
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white/80">
              Plataforma 2026
            </span>
          </div>

          <h1 className="mt-5 text-[28px] font-extrabold leading-[1.05] tracking-tight">
            Turbine o seu comércio com módulos exclusivos.
          </h1>
          <p className="mt-2 text-[13.5px] opacity-75 max-w-sm leading-relaxed">
            Ative recursos sob medida em tempo real. Cada funcionalidade se conecta automaticamente à sua placa NFC e à sua página pública.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-bold">
            <div className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Ativação Imediata
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Sincronização em Tempo Real
            </div>
          </div>
        </div>
      </section>

      {/* LISTA EM COMPONENTES DE FUNCIONALIDADES E UPGRADES */}
      <section className="mt-7 space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[17px] font-bold text-foreground">
            Módulos Disponíveis
          </h2>
          <span className="text-[11px] font-semibold text-muted-foreground">
            Configure individualmente
          </span>
        </div>

        {/* 1. MÓDULO AGENDAMENTO ONLINE */}
        <article className="rounded-3xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <CalendarCheck className="h-6 w-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-foreground">Agendamento de Serviços</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                      settings.booking ? "bg-[#25D366] text-black" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {settings.booking ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">Módulo com fotos, calendário e horários</p>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => toggleModule("booking", "Agendamento de Serviços")}
              variant={settings.booking ? "default" : "outline"}
              className={`h-9 px-3 text-xs font-bold rounded-xl shrink-0 ${
                settings.booking ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
              }`}
            >
              {settings.booking ? "Ativo" : "Ativar"}
            </Button>
          </div>

          <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
            Exibe o carrossel horizontal de agendamento na página pública com procedimentos fotográficos, seletor de dias, horários disponíveis e integração com o CRM e WhatsApp.
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-border/80 pt-3 text-[11px]">
            <span className="text-muted-foreground font-medium">
              Impacto: +45% de conversão de novos clientes
            </span>
            <Link
              to="/c/$slug"
              params={{ slug: merchant.slug }}
              className="font-bold text-primary hover:underline inline-flex items-center gap-1"
            >
              Ver na página <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </article>

        {/* 2. MÓDULO CRM & DISPAROS WHATSAPP */}
        <article className="rounded-3xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-secondary-foreground shadow-sm">
                <Users className="h-6 w-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-foreground">CRM 360° & Disparos</h3>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-extrabold uppercase text-primary">
                    Incluído
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">Gestão de leads, histórico e campanhas</p>
              </div>
            </div>

            <Link
              to="/beneficiarios"
              className="h-9 px-3 text-xs font-bold rounded-xl border border-border bg-muted/40 hover:bg-muted inline-flex items-center"
            >
              Acessar CRM
            </Link>
          </div>

          <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
            Centralize todos os clientes que tocaram na placa NFC, visualizaram cupons ou agendaram horários. Envie mensagens personalizadas com 1 toque no WhatsApp.
          </p>
        </article>

        {/* 3. MÓDULO PROGRAMA DE EMBAIXADORES */}
        <article className="rounded-3xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Award className="h-6 w-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-foreground">Programa de Embaixadores</h3>
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-extrabold uppercase text-primary-foreground">
                    Novidade
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">Indicações e comissões para parceiros</p>
              </div>
            </div>

            <Link
              to="/nfc"
              className="h-9 px-3 text-xs font-bold rounded-xl bg-secondary text-secondary-foreground inline-flex items-center gap-1"
            >
              Conhecer <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
            Transforme seus melhores clientes em divulgadores ativos. Painel exclusivo com links comissionados, níveis de embaixadores (Base, Plus e VIP) e relatórios em tempo real.
          </p>
        </article>

        {/* 4. MÓDULO CLUBE DE FIDELIDADE DIGITAL */}
        <article className="rounded-3xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-muted text-foreground">
                <Gift className="h-6 w-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-foreground">Clube de Fidelidade</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                      settings.club ? "bg-[#25D366] text-black" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {settings.club ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">Cartão digital de carimbos e recompensas</p>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => toggleModule("club", "Clube de Fidelidade")}
              variant={settings.club ? "default" : "outline"}
              className={`h-9 px-3 text-xs font-bold rounded-xl shrink-0 ${
                settings.club ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
              }`}
            >
              {settings.club ? "Ativo" : "Ativar"}
            </Button>
          </div>

          <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
            A cada número de visitas ou compras, o cliente desbloqueia brindes e benefícios exclusivos, incentivando o retorno recorrente ao seu estabelecimento.
          </p>
        </article>

        {/* 5. MÓDULO PLACAS NFC INTELIGENTES */}
        <article className="rounded-3xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-secondary-foreground shadow-sm">
                <Nfc className="h-6 w-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-foreground">Hardware & Placas NFC</h3>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-extrabold uppercase text-primary">
                    3 Modelos
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">Balcão, mesas e cartões portáteis</p>
              </div>
            </div>

            <Link
              to="/nfc"
              className="h-9 px-3 text-xs font-bold rounded-xl border border-border bg-muted/40 hover:bg-muted inline-flex items-center"
            >
              Ver Placas
            </Link>
          </div>

          <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
            Placas acrílicas gravadas a laser, cartões digitais e adesivos resistentes à água para expor em mesas e na vitrine.
          </p>
        </article>
      </section>
    </div>
  );
}
