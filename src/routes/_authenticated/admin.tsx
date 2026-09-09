import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "motion/react";
import {
  Loader2,
  ShieldCheck,
  LogOut,
  Wallet,
  Receipt,
  Users,
  Coins,
  Package,
  CheckCircle2,
  Clock,
  Plus,
  Minus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getIsAdmin, claimAdmin, getAdminData, confirmOrder, adjustCredits } from "@/lib/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Painel Admin · AvaliaTap" }] }),
  component: AdminPage,
});

type AdminTab = "overview" | "orders" | "users";

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isAdminFn = useServerFn(getIsAdmin);
  const claimFn = useServerFn(claimAdmin);

  const { data: adminCheck, isLoading: checking } = useQuery({
    queryKey: ["is-admin"],
    queryFn: () => isAdminFn(),
  });

  const claim = useMutation({
    mutationFn: () => claimFn(),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success("Você agora é administrador!");
        qc.invalidateQueries({ queryKey: ["is-admin"] });
      } else {
        toast.error(res.reason === "admin_exists" ? "Já existe um administrador." : "Não foi possível.");
      }
    },
    onError: () => toast.error("Falha ao reivindicar admin"),
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!adminCheck?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-5">
        <div className="max-w-sm w-full rounded-3xl border border-border bg-surface p-6 text-center shadow-elegant">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-warning/15 text-warning flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-[18px] font-semibold text-foreground">Acesso restrito</h1>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Esta área é só para administradores. Se você é o responsável e ainda não há nenhum admin,
            pode reivindicar o acesso agora.
          </p>
          <button
            onClick={() => claim.mutate()}
            disabled={claim.isPending}
            className="mt-5 w-full rounded-2xl bg-primary text-primary-foreground py-3 text-[14px] font-semibold active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {claim.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Tornar-me administrador
          </button>
          <button onClick={signOut} className="mt-3 w-full text-[13px] text-muted-foreground hover:text-foreground">
            Sair da conta
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard onSignOut={signOut} />;
}

function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const qc = useQueryClient();
  const dataFn = useServerFn(getAdminData);
  const confirmFn = useServerFn(confirmOrder);
  const adjustFn = useServerFn(adjustCredits);
  const [tab, setTab] = useState<AdminTab>("overview");

  const { data, isLoading } = useQuery({ queryKey: ["admin-data"], queryFn: () => dataFn() });

  const confirm = useMutation({
    mutationFn: (orderId: string) => confirmFn({ data: { orderId } }),
    onSuccess: (res) => {
      toast.success(res.already ? "Pedido já estava pago" : `Crédito aplicado (+${res.credited ?? 0})`);
      qc.invalidateQueries({ queryKey: ["admin-data"] });
    },
    onError: () => toast.error("Falha ao confirmar pedido"),
  });

  const adjust = useMutation({
    mutationFn: (v: { userId: string; delta: number }) => adjustFn({ data: v }),
    onSuccess: () => {
      toast.success("Saldo atualizado");
      qc.invalidateQueries({ queryKey: ["admin-data"] });
    },
    onError: () => toast.error("Falha ao ajustar saldo"),
  });

  const brl = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
              T
            </div>
            <div>
              <h1 className="text-[16px] font-semibold text-foreground">Painel do administrador</h1>
              <p className="text-[12px] text-muted-foreground">Gestão de contratações e usuários</p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-[13px] font-semibold text-foreground hover:border-destructive/40 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-6">
        <div className="inline-flex bg-muted rounded-full p-1 mb-6">
          {(
            [
              { id: "overview", label: "Visão geral" },
              { id: "orders", label: "Contratações" },
              { id: "users", label: "Usuários" },
            ] as { id: AdminTab; label: string }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-[13px] font-semibold rounded-full transition-all ${
                tab === t.id ? "bg-surface text-foreground shadow-soft" : "text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : !data ? (
          <p className="text-muted-foreground text-[13px]">Sem dados.</p>
        ) : (
          <>
            {tab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  <StatCard icon={Wallet} label="Receita confirmada" value={brl(data.stats.revenue)} accent />
                  <StatCard icon={Receipt} label="Pedidos pagos" value={String(data.stats.paidCount)} />
                  <StatCard icon={Clock} label="Pendentes" value={String(data.stats.pendingCount)} />
                  <StatCard icon={Coins} label="Créditos vendidos" value={String(data.stats.creditsSold)} />
                  <StatCard icon={Package} label="Total de pedidos" value={String(data.stats.totalOrders)} />
                  <StatCard icon={Users} label="Usuários" value={String(data.stats.userCount)} />
                </div>
              </motion.div>
            )}

            {tab === "orders" && (
              <div className="space-y-3">
                {data.orders.length === 0 ? (
                  <p className="text-muted-foreground text-[13px]">Nenhuma contratação ainda.</p>
                ) : (
                  data.orders.map((o) => (
                    <div
                      key={o.id}
                      className="rounded-2xl border border-border bg-surface p-4 flex flex-wrap items-center gap-3 shadow-soft"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-semibold text-foreground truncate">
                            {o.userName ?? o.userEmail ?? "Cliente"}
                          </p>
                          <StatusBadge status={o.status} />
                        </div>
                        <p className="text-[12px] text-muted-foreground mt-0.5">
                          {o.credits} créditos {o.bonus ? `+${o.bonus} bônus` : ""} · {o.provider} ·{" "}
                          {new Date(o.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <p className="text-[15px] font-bold text-foreground tabular-nums">
                        {brl(Number(o.amount))}
                      </p>
                      {o.status !== "paid" && (
                        <button
                          onClick={() => confirm.mutate(o.id)}
                          disabled={confirm.isPending}
                          className="rounded-xl bg-primary text-primary-foreground px-3.5 py-2 text-[12.5px] font-semibold active:scale-95 flex items-center gap-1.5 disabled:opacity-60"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Confirmar
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === "users" && (
              <div className="space-y-3">
                {data.users.map((u) => (
                  <div
                    key={u.id}
                    className="rounded-2xl border border-border bg-surface p-4 flex flex-wrap items-center gap-3 shadow-soft"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary-soft text-primary flex items-center justify-center font-semibold shrink-0">
                      {(u.full_name ?? u.email ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-semibold text-foreground truncate">
                          {u.full_name ?? "Sem nome"}
                        </p>
                        {u.roles.includes("admin") && (
                          <span className="rounded-full bg-warning/20 text-warning px-2 py-0.5 text-[10px] font-bold uppercase">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adjust.mutate({ userId: u.id, delta: -50 })}
                        className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center active:scale-95"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-[14px] font-semibold tabular-nums min-w-[3ch] text-center">
                        {u.credits}
                      </span>
                      <button
                        onClick={() => adjust.mutate({ userId: u.id, delta: 50 })}
                        className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center active:scale-95"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 shadow-soft ${accent ? "border-primary/30 bg-primary-soft/30" : "border-border bg-surface"}`}>
      <Icon className={`h-5 w-5 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      <p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
      <p className="mt-0.5 text-[22px] font-bold text-foreground tabular-nums">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    paid: { label: "Pago", cls: "bg-success/15 text-success" },
    pending: { label: "Pendente", cls: "bg-warning/15 text-warning" },
    failed: { label: "Falhou", cls: "bg-destructive/15 text-destructive" },
  };
  const s = map[status] ?? { label: status, cls: "bg-muted text-muted-foreground" };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${s.cls}`}>{s.label}</span>;
}
