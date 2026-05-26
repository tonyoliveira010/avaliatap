import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ArrowDownLeft, ArrowUpRight, CreditCard, Download, TrendingUp, Wallet } from "lucide-react";
import { motion } from "motion/react";

export const Route = createFileRoute("/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro · Tambor" }] }),
  component: FinancePage,
});

const transactions = [
  { id: 1, label: "Pedido TMB-2841 · 3 tambores", date: "Hoje · 09:42", amount: -240, status: "paid" },
  { id: 2, label: "Diária extra · TMB-2820", date: "Ontem · 18:00", amount: -45, status: "pending" },
  { id: 3, label: "Caução devolvida · TMB-2799", date: "12 nov · 14:21", amount: 100, status: "refund" },
  { id: 4, label: "Pedido TMB-2820 · 2 tambores", date: "10 nov · 11:08", amount: -320, status: "paid" },
  { id: 5, label: "Pedido TMB-2799 · 1 tambor", date: "07 nov · 16:55", amount: -140, status: "paid" },
];

function FinancePage() {
  return (
    <>
      <PageHeader
        title="Financeiro"
        subtitle="Controle suas cobranças e cauções"
        right={
          <button className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center active:scale-95">
            <Download className="h-4 w-4 text-foreground" />
          </button>
        }
      />

      {/* Saldo / Balance card */}
      <motion.section
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-5 rounded-4xl hero-gradient grain p-5 text-white shadow-elegant"
      >
        <p className="text-[11px] uppercase tracking-wider text-white/60 font-medium">
          Total este mês
        </p>
        <p className="mt-1 text-[34px] font-semibold tracking-tight tabular-nums">
          R$ 605,00
        </p>
        <div className="mt-1 inline-flex items-center gap-1 text-[12px] text-success">
          <TrendingUp className="h-3 w-3" />
          12% vs. mês passado
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm p-3">
            <Wallet className="h-4 w-4 text-white/70" />
            <p className="mt-2 text-[10px] uppercase tracking-wide text-white/60">Pago</p>
            <p className="text-[16px] font-semibold mt-0.5">R$ 480</p>
          </div>
          <div className="rounded-2xl bg-warning/15 border border-warning/25 p-3">
            <CreditCard className="h-4 w-4 text-warning" />
            <p className="mt-2 text-[10px] uppercase tracking-wide text-white/60">Pendente</p>
            <p className="text-[16px] font-semibold mt-0.5">R$ 125</p>
          </div>
        </div>
      </motion.section>

      {/* Quick actions */}
      <section className="px-5 mt-5">
        <div className="grid grid-cols-2 gap-2.5">
          <button className="rounded-2xl bg-primary text-primary-foreground px-4 py-3.5 text-[13px] font-semibold active:scale-[0.98] transition">
            Pagar pendentes
          </button>
          <button className="rounded-2xl bg-surface border border-border text-foreground px-4 py-3.5 text-[13px] font-semibold active:scale-[0.98] transition">
            Método de pagamento
          </button>
        </div>
      </section>

      {/* Transactions */}
      <section className="px-5 mt-6">
        <h3 className="text-[15px] font-semibold text-foreground mb-3">Transações</h3>
        <div className="bg-surface rounded-3xl border border-border shadow-soft overflow-hidden">
          <ul className="divide-y divide-border">
            {transactions.map((tx) => {
              const isOut = tx.amount < 0;
              return (
                <li key={tx.id} className="flex items-center gap-3 px-4 py-3.5">
                  <div
                    className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isOut ? "bg-muted text-foreground" : "bg-success/10 text-success"
                    }`}
                  >
                    {isOut ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground truncate">
                      {tx.label}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[11px] text-muted-foreground">{tx.date}</p>
                      {tx.status === "pending" && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-warning">
                          Pendente
                        </span>
                      )}
                      {tx.status === "refund" && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-success">
                          Reembolso
                        </span>
                      )}
                    </div>
                  </div>
                  <p
                    className={`text-[14px] font-semibold tabular-nums ${
                      isOut ? "text-foreground" : "text-success"
                    }`}
                  >
                    {isOut ? "-" : "+"}R$ {Math.abs(tx.amount)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
