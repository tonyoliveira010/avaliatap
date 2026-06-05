import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Package2,
  Truck,
  Recycle,
  ShieldCheck,
  ArrowRight,
  Clock,
  MapPin,
  Sparkles,
  Coins,
} from "lucide-react";
import { RequestModal } from "@/components/dashboard/RequestModal";
import { DeliveryScheduler } from "@/components/dashboard/DeliveryScheduler";
import { toast } from "sonner";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "Tambor · Descarte de entulho sob demanda" },
      {
        name: "description",
        content:
          "Solicite tambores para sua obra, agende a entrega e descarte resíduos de forma simples. Frete por distância, preço por volume e retirada garantida.",
      },
      { property: "og:title", content: "Tambor · Descarte de entulho sob demanda" },
      {
        property: "og:description",
        content: "Tambores para obra com entrega agendada, preço por volume e descarte correto.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Package2,
    title: "Tambores sob demanda",
    desc: "1 a 10 tambores por pedido. Quanto mais volume, menor a diária por tambor.",
  },
  {
    icon: Truck,
    title: "Entrega agendada",
    desc: "Escolha data e janela de horário. Motorista pré-alocado e reserva garantida por 24h.",
  },
  {
    icon: Recycle,
    title: "Descarte correto",
    desc: "Frete cobre retirada + destinação ambientalmente correta dos resíduos.",
  },
  {
    icon: ShieldCheck,
    title: "Sem surpresas",
    desc: "Resumo de cobrança detalhado, desconto no PIX e fidelidade para recorrentes.",
  },
];

const steps = [
  { n: 1, title: "Monte seu pedido", desc: "Material, quantidade e serviços extras." },
  { n: 2, title: "Agende a entrega", desc: "Data, janela e endereço no mapa." },
  { n: 3, title: "Pague e acompanhe", desc: "PIX ou cartão, com rastreio em tempo real." },
];

function Landing() {
  const [requestOpen, setRequestOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="max-w-5xl mx-auto px-5 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-success flex items-center justify-center text-primary-foreground font-bold">
            T
          </div>
          <span className="text-[18px] font-semibold text-foreground tracking-tight">Tambor</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="hidden sm:inline-flex rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-semibold text-foreground hover:border-primary/40"
          >
            Abrir app
          </Link>
          <Link
            to="/auth"
            className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-[13px] font-semibold active:scale-95"
          >
            Entrar
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-5 pt-8 pb-12 grid md:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft text-primary px-3 py-1 text-[12px] font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> Descarte inteligente para obras
          </span>
          <h1 className="mt-4 text-[40px] leading-[1.05] font-bold text-foreground tracking-tight">
            Tambores na sua obra,{" "}
            <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              quando você precisar
            </span>
          </h1>
          <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed">
            Solicite tambores, agende a entrega em janelas de horário e deixe o descarte com a
            gente. Preço por volume, frete por distância e retirada garantida.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setRequestOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary text-primary-foreground px-5 py-3.5 text-[14px] font-semibold active:scale-[0.98] shadow-glow"
            >
              <Package2 className="h-4 w-4" /> Solicitar tambor
            </button>
            <Link
              to="/financeiro"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface px-5 py-3.5 text-[14px] font-semibold text-foreground hover:border-primary/40"
            >
              <Coins className="h-4 w-4" /> Ver pacotes de crédito
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-5 text-[12px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" /> Reserva em 24h
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" /> São Paulo e região
            </span>
          </div>
        </motion.div>

        <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <DeliveryScheduler onReserve={() => toast.success("Horário reservado! Finalize no app.")} />
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-5 py-10">
        <h2 className="text-[24px] font-bold text-foreground text-center tracking-tight">
          Tudo num só lugar
        </h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
              <div className="h-11 w-11 rounded-2xl bg-primary-soft text-primary flex items-center justify-center">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-[15px] font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1 text-[12.5px] text-muted-foreground leading-snug">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-5xl mx-auto px-5 py-10">
        <h2 className="text-[24px] font-bold text-foreground text-center tracking-tight">
          Como funciona
        </h2>
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-3xl border border-border bg-surface p-6 text-center shadow-soft">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-[18px] font-bold">
                {s.n}
              </div>
              <h3 className="mt-3 text-[15px] font-semibold text-foreground">{s.title}</h3>
              <p className="mt-1 text-[12.5px] text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-5 py-12">
        <div className="rounded-4xl hero-gradient grain p-8 md:p-12 text-white text-center shadow-elegant">
          <h2 className="text-[28px] font-bold tracking-tight">Pronto para liberar sua obra?</h2>
          <p className="mt-2 text-[14px] text-white/70 max-w-md mx-auto">
            Faça seu primeiro pedido em minutos. Sem mensalidade, paga só pelo que usar.
          </p>
          <button
            onClick={() => setRequestOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white text-secondary px-6 py-3.5 text-[14px] font-bold active:scale-[0.98]"
          >
            Solicitar tambor <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <footer className="max-w-5xl mx-auto px-5 py-8 text-center text-[12px] text-muted-foreground">
        Tambor · Descarte inteligente para pequenas obras
      </footer>

      <RequestModal open={requestOpen} onClose={() => setRequestOpen(false)} />
    </div>
  );
}
