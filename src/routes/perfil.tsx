import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  Bell,
  ChevronRight,
  CreditCard,
  HelpCircle,
  LogOut,
  MapPin,
  Moon,
  Settings,
  Shield,
  Star,
  Sun,
} from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/hooks/use-theme";


export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Perfil · Tambor" }] }),
  component: ProfilePage,
});

const groups = [
  {
    title: "Conta",
    items: [
      { icon: Settings, label: "Dados pessoais", hint: "Nome, telefone, e-mail" },
      { icon: MapPin, label: "Endereços salvos", hint: "2 endereços" },
      { icon: CreditCard, label: "Pagamento", hint: "Visa •••• 4821" },
    ],
  },
  {
    title: "Preferências",
    items: [
      { icon: Bell, label: "Notificações", hint: "Push, e-mail, SMS" },
      { icon: Shield, label: "Privacidade e segurança" },
    ],
  },
  {
    title: "Suporte",
    items: [
      { icon: HelpCircle, label: "Central de ajuda" },
      { icon: Star, label: "Avaliar o app" },
    ],
  },
];

function ProfilePage() {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <>
      <PageHeader title="Perfil" subtitle="Conta e preferências" />


      {/* User card */}
      <motion.section
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-5 rounded-4xl bg-secondary text-white p-5 shadow-elegant relative overflow-hidden"
      >
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-success flex items-center justify-center text-[22px] font-semibold shrink-0">
            R
          </div>
          <div className="min-w-0">
            <h2 className="text-[18px] font-semibold">Rogério Almeida</h2>
            <p className="text-[12px] text-white/60">rogerio@email.com</p>
            <p className="text-[12px] text-white/60">+55 11 98765-4321</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <Stat label="Pedidos" value="12" />
          <Stat label="Score" value="4.9" highlight />
          <Stat label="Membro" value="2024" />
        </div>
      </motion.section>

      {/* Aparência */}
      <section className="px-5 mt-6">
        <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-1">
          Aparência
        </h3>
        <div className="bg-surface rounded-3xl border border-border shadow-soft p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary-soft flex items-center justify-center shrink-0">
              {isLight ? (
                <Sun className="h-4 w-4 text-primary" />
              ) : (
                <Moon className="h-4 w-4 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-foreground">
                {isLight ? "Modo claro" : "Modo escuro"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Toque para alternar o tema do app
              </p>
            </div>
            <button
              role="switch"
              aria-checked={isLight}
              aria-label="Alternar modo claro"
              onClick={toggle}
              className={`relative h-7 w-12 rounded-full transition-colors shrink-0 ${
                isLight ? "bg-primary" : "bg-muted"
              }`}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className={`absolute top-1 h-5 w-5 rounded-full bg-background shadow-soft flex items-center justify-center ${
                  isLight ? "right-1" : "left-1"
                }`}
              >
                {isLight ? (
                  <Sun className="h-3 w-3 text-warning" />
                ) : (
                  <Moon className="h-3 w-3 text-muted-foreground" />
                )}
              </motion.span>
            </button>
          </div>
        </div>
      </section>

      {/* Menu groups */}
      <div className="mt-6 space-y-6 pb-6">
        {groups.map((g) => (
          <section key={g.title} className="px-5">

            <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-1">
              {g.title}
            </h3>
            <div className="bg-surface rounded-3xl border border-border shadow-soft overflow-hidden">
              <ul className="divide-y divide-border">
                {g.items.map((item) => (
                  <li key={item.label}>
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-muted transition-colors">
                      <div className="h-9 w-9 rounded-xl bg-primary-soft flex items-center justify-center shrink-0">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-[14px] font-medium text-foreground">
                          {item.label}
                        </p>
                        {item.hint && (
                          <p className="text-[11px] text-muted-foreground truncate">
                            {item.hint}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}

        <div className="px-5">
          <button className="w-full flex items-center justify-center gap-2 rounded-2xl bg-surface border border-border text-destructive px-4 py-3.5 text-[13px] font-semibold active:scale-[0.98] transition">
            <LogOut className="h-4 w-4" />
            Sair da conta
          </button>
          <p className="text-center text-[11px] text-muted-foreground mt-4">
            Tambor · v1.0.0 MVP
          </p>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center">
      <p
        className={`text-[18px] font-semibold tabular-nums ${
          highlight ? "text-success" : "text-white"
        }`}
      >
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-wide text-white/60 mt-0.5">{label}</p>
    </div>
  );
}
