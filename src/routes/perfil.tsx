import { createFileRoute, Link } from "@tanstack/react-router";
import { Moon, Sun, Store, Link2, ShieldCheck, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { defaultMerchantSlug, merchants } from "@/lib/merchants";

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
          to="/admin"
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-4 active:scale-[0.99]"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
            <ShieldCheck className="h-4 w-4 text-foreground" />
          </span>
          <span className="flex-1">
            <span className="block text-[14px] font-semibold text-foreground">Área do administrador</span>
            <span className="block text-[12px] text-muted-foreground">Acesso restrito</span>
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
