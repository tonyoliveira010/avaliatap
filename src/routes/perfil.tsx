import { createFileRoute, Link } from "@tanstack/react-router";
import { Moon, Sun, Store, Link2, ShieldCheck, LogOut, Nfc, Settings2, Zap, ChevronRight, Megaphone, CalendarCheck, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { defaultMerchantSlug, merchants } from "@/lib/merchants";
import { useAgendaNavConfig } from "@/lib/agenda-state";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil do comércio · AvaliaTap" },
      { name: "description", content: "Dados do comércio, tema do app e acesso administrativo." },
      { property: "og:title", content: "Perfil do comércio · AvaliaTap" },
      { property: "og:description", content: "Configurações do seu comércio no AvaliaTap." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const merchant = merchants[defaultMerchantSlug]!;
  const dark = theme === "dark";
  const { hasAgendaPlan, useAgendaInNav, isAgendaOnNav, toggleAgendaPlan, toggleAgendaInNav } = useAgendaNavConfig();

  return (
    <div className="px-5 pb-10 pt-6">
      <h1 className="text-[26px] font-extrabold tracking-tight text-foreground">Perfil</h1>

      <div className="mt-5 flex items-center gap-3 rounded-3xl border border-border bg-surface p-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-[17px] font-extrabold text-secondary-foreground">
          {merchant.name.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-foreground">{merchant.name}</p>
          <p className="truncate text-[12px] text-muted-foreground">{user?.email ?? merchant.category}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {/* Seção de Campanhas (direcionada para o perfil quando a agenda está na navbar) */}
        {isAgendaOnNav ? (
          <Link
            to="/campanhas"
            className="flex w-full items-center gap-3.5 rounded-2xl border-2 border-primary/40 bg-primary/10 p-4 transition-all hover:bg-primary/15 active:scale-[0.99] shadow-sm"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Megaphone className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="flex items-center gap-1.5">
                <span className="text-[14.5px] font-bold text-foreground">Campanhas & Promoções</span>
                <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-extrabold uppercase text-primary-foreground">
                  No Perfil
                </span>
              </span>
              <span className="block text-[11.5px] text-muted-foreground mt-0.5">
                Gerencie seus cupons de raspadinha, ofertas e campanhas ativas
              </span>
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ) : (
          <Link
            to="/campanhas"
            className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
              <Megaphone className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold">Campanhas</span>
              <span className="text-xs text-muted-foreground">Cupons e promoções</span>
            </span>
          </Link>
        )}

        {/* Configuração de Plano de Agenda & Navbar */}
        <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-foreground">
                <CalendarCheck className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[13.5px] font-bold text-foreground">Plano de Agendamento</p>
                <p className="text-[11px] text-muted-foreground">Agenda de clientes, ficha de anamnese e horários</p>
              </div>
            </div>
            <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[10px] font-bold text-primary">
              {hasAgendaPlan ? "Ativo" : "Inativo"}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-[12px] text-muted-foreground">
              Exibir <b>Agenda</b> na barra inferior (em vez de Campanhas)
            </span>
            <button
              onClick={() => {
                toggleAgendaInNav(!useAgendaInNav);
                toast.success(!useAgendaInNav ? "Agenda ativada na barra inferior!" : "Campanhas restauradas na barra inferior.");
              }}
              className={`h-6 w-11 rounded-full p-0.5 transition-colors ${
                isAgendaOnNav ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`block h-5 w-5 rounded-full bg-surface shadow-soft transition-transform ${
                  isAgendaOnNav ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Seção que leva para a página de Upgrades & Novas Funcionalidades */}
        <Link
          to="/upgrades"
          className="flex w-full items-center gap-3.5 rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 transition-all hover:bg-primary/10 active:scale-[0.99] shadow-sm"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Zap className="h-5 w-5" />
          </span>
          <span className="flex-1">
            <span className="flex items-center gap-1.5">
              <span className="text-[14.5px] font-bold text-foreground">Upgrades & Funcionalidades</span>
              <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-extrabold uppercase text-primary-foreground">
                Novidades
              </span>
            </span>
            <span className="block text-[11.5px] text-muted-foreground mt-0.5">
              Agendamentos, CRM, embaixadores e módulos sob medida
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <Link to="/nfc" className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-muted"><Nfc className="h-4 w-4" /></span><span><span className="block text-sm font-semibold">Minhas placas NFC</span><span className="text-xs text-muted-foreground">Dispositivos e novos modelos</span></span></Link>
        <Link to="/configuracoes" className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-muted"><Settings2 className="h-4 w-4" /></span><span><span className="block text-sm font-semibold">Página pública</span><span className="text-xs text-muted-foreground">Indicações, benefícios e experiências</span></span></Link>
        <button
          onClick={toggle}
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left active:scale-[0.99]"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
            {dark ? <Moon className="h-4 w-4 text-foreground" /> : <Sun className="h-4 w-4 text-foreground" />}
          </span>
          <span className="flex-1">
            <span className="block text-[14px] font-semibold text-foreground">Aparência</span>
            <span className="block text-[12px] text-muted-foreground">{dark ? "Modo escuro" : "Modo claro"}</span>
          </span>
          <span
            className={`h-6 w-11 rounded-full p-0.5 transition-colors ${dark ? "bg-primary" : "bg-muted"}`}
          >
            <span
              className={`block h-5 w-5 rounded-full bg-surface shadow-soft transition-transform ${dark ? "translate-x-5" : ""}`}
            />
          </span>
        </button>

        <Link
          to="/c/$slug"
          params={{ slug: merchant.slug }}
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4 active:scale-[0.99]"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
            <Link2 className="h-4 w-4 text-foreground" />
          </span>
          <span className="flex-1">
            <span className="block text-[14px] font-semibold text-foreground">Minha página pública</span>
            <span className="block text-[12px] text-muted-foreground">/c/{merchant.slug}</span>
          </span>
        </Link>

        <button
          onClick={() => toast("Edição dos dados do comércio em breve")}
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left active:scale-[0.99]"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
            <Store className="h-4 w-4 text-foreground" />
          </span>
          <span className="flex-1">
            <span className="block text-[14px] font-semibold text-foreground">Dados do comércio</span>
            <span className="block text-[12px] text-muted-foreground">Nome, endereço, redes sociais</span>
          </span>
        </button>

        <Link
          to="/adm"
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4 active:scale-[0.99]"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
            <ShieldCheck className="h-4 w-4 text-foreground" />
          </span>
          <span className="flex-1">
            <span className="block text-[14px] font-semibold text-foreground">Área do administrador</span>
            <span className="block text-[12px] text-muted-foreground">Painel OS · /adm</span>
          </span>
        </Link>

        {user && (
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              toast("Você saiu da conta");
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left active:scale-[0.99]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
              <LogOut className="h-4 w-4 text-destructive" />
            </span>
            <span className="text-[14px] font-semibold text-destructive">Sair</span>
          </button>
        )}
      </div>
    </div>
  );
}
