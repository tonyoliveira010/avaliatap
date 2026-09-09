import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Megaphone, Ticket, Sparkles, Plus, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/campanhas")({
  head: () => ({
    meta: [
      { title: "Campanhas · AvaliaTap" },
      { name: "description", content: "Crie cupons, raspadinhas e campanhas para engajar seus clientes." },
      { property: "og:title", content: "Campanhas · AvaliaTap" },
      { property: "og:description", content: "Cupons, raspadinhas e campanhas do seu comércio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Campanhas,
});

type Campaign = { id: string; icon: typeof Ticket; title: string; detail: string; active: boolean };

const initial: Campaign[] = [
  { id: "1", icon: Sparkles, title: "Raspadinha de boas-vindas", detail: "20% OFF · código BEMVINDO20", active: true },
  { id: "2", icon: Ticket, title: "Cupom do dia", detail: "10% OFF na próxima visita", active: true },
  { id: "3", icon: Megaphone, title: "Clube de fidelidade", detail: "A cada 5 visitas, 1 grátis", active: false },
];

function Campanhas() {
  const [list, setList] = useState(initial);

  return (
    <div className="px-5 pb-10 pt-6">
      <h1 className="text-[26px] font-extrabold tracking-tight text-foreground">Campanhas</h1>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Tudo que aparece na sua página pública quando o cliente toca a placa.
      </p>

      <button
        onClick={() => toast("Editor de campanha em breve")}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary py-4 text-[13.5px] font-extrabold text-secondary-foreground active:scale-[0.99]"
      >
        <Plus className="h-4 w-4" /> Nova campanha
      </button>

      <div className="mt-5 space-y-3">
        {list.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.04 * i }}
            className="flex items-center gap-3 rounded-3xl border border-border bg-surface p-4"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-muted">
              <c.icon className="h-5 w-5 text-foreground" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-semibold text-foreground">{c.title}</p>
              <p className="text-[12px] text-muted-foreground">{c.detail}</p>
            </div>
            <button
              onClick={() =>
                setList((prev) => prev.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)))
              }
              className={`shrink-0 rounded-xl px-3 py-2 text-[11px] font-extrabold ${
                c.active
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {c.active ? (
                <span className="inline-flex items-center gap-1">
                  <Check className="h-3 w-3" /> Ativa
                </span>
              ) : (
                "Ativar"
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
