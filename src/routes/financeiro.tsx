import { createFileRoute } from "@tanstack/react-router";
import { Check, Receipt, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/financeiro")({
  head: () => ({
    meta: [
      { title: "Plano e faturas · AvaliaTap" },
      { name: "description", content: "Seu plano AvaliaTap, faturas e itens contratados." },
      { property: "og:title", content: "Plano e faturas · AvaliaTap" },
      { property: "og:description", content: "Assinatura mensal, faturas e placas contratadas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Financeiro,
});

const benefits = [
  "Página pública ilimitada com sua marca",
  "Cupons, raspadinhas e campanhas",
  "Captação de contatos e área de membros",
  "Relatórios de toques e avaliações",
];

const invoices = [
  { id: "1", ref: "Março/2026", value: "R$ 29,90", state: "Pago" },
  { id: "2", ref: "Fevereiro/2026", value: "R$ 29,90", state: "Pago" },
  { id: "3", ref: "Placa NFC (unidade)", value: "R$ 89,00", state: "Pago" },
];

function Financeiro() {
  return (
    <div className="px-5 pb-10 pt-6">
      <h1 className="text-[26px] font-extrabold tracking-tight text-foreground">Plano</h1>
      <p className="mt-1 text-[13px] text-muted-foreground">Assinatura, faturas e itens contratados.</p>

      <div className="relative mt-5 overflow-hidden rounded-[28px] bg-secondary p-6 text-secondary-foreground">
        <span className="pointer-events-none absolute -right-14 -top-12 h-40 w-40 rounded-full border-[34px] border-primary/25" />
        <span className="inline-flex rounded-full bg-primary px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-primary-foreground">
          Plano ativo
        </span>
        <p className="mt-5 text-[34px] font-extrabold leading-none tracking-tight">
          R$ 29,90<span className="text-[15px] font-semibold opacity-60">/mês</span>
        </p>
        <p className="mt-2 text-[13px] opacity-65">Renova em 12 de abril · placas cobradas à parte.</p>
        <ul className="mt-5 space-y-2">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-2 text-[13px] opacity-85">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {b}
            </li>
          ))}
        </ul>
        <button
          onClick={() => toast("Gerenciamento do plano em breve")}
          className="mt-5 w-full rounded-2xl bg-primary py-3.5 text-[13px] font-extrabold text-primary-foreground"
        >
          Gerenciar assinatura
        </button>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-foreground" />
        <h3 className="text-[15px] font-semibold text-foreground">Faturas</h3>
      </div>
      <div className="mt-3 space-y-3">
        {invoices.map((f) => (
          <div key={f.id} className="flex items-center gap-3 rounded-3xl border border-border bg-surface p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-muted">
              <Receipt className="h-4.5 w-4.5 text-foreground" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-foreground">{f.ref}</p>
              <p className="text-[12px] text-muted-foreground">{f.state}</p>
            </div>
            <span className="text-[14px] font-bold tabular-nums text-foreground">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
