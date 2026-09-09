import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Nfc, Star, Ticket, Users, ArrowRight, Check } from "lucide-react";
import { defaultMerchantSlug } from "@/lib/merchants";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "AvaliaTap · Uma placa NFC que engaja seus clientes" },
      {
        name: "description",
        content:
          "O cliente aproxima o celular da placa e abre a página do seu comércio com cupons, avaliações e ofertas. R$ 29,90 por mês.",
      },
      { property: "og:title", content: "AvaliaTap · Uma placa NFC que engaja seus clientes" },
      {
        property: "og:description",
        content: "Cupons, raspadinhas, avaliações no Google e captação de contatos em um toque.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Landing,
});

const pillars = [
  { icon: Nfc, title: "Um toque", text: "O cliente aproxima o celular e sua página abre na hora." },
  { icon: Ticket, title: "Cupons e raspadinhas", text: "Benefícios que fazem o cliente voltar." },
  { icon: Star, title: "Mais avaliações", text: "Direcione o cliente satisfeito ao Google." },
  { icon: Users, title: "Base de contatos", text: "Capture leads e crie sua área de membros." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-secondary text-secondary-foreground">
      <header className="flex items-center justify-between px-6 pt-8">
        <span className="text-[17px] font-extrabold tracking-tight">
          Avalia<span className="text-primary">Tap</span>
        </span>
        <Link to="/auth" className="rounded-full bg-primary px-4 py-2 text-[12px] font-extrabold text-primary-foreground">
          Entrar
        </Link>
      </header>

      <section className="px-6 pb-10 pt-10">
        <motion.h1
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-[320px] text-[36px] font-extrabold leading-[1.03] tracking-tight"
        >
          Seu comércio a um toque de distância.
        </motion.h1>
        <p className="mt-4 max-w-[320px] text-[14.5px] opacity-65">
          A placa NFC do AvaliaTap abre a página do seu negócio no celular do cliente — com ofertas,
          cupons e um caminho direto para a avaliação no Google.
        </p>
        <div className="mt-6 flex gap-2">
          <Link
            to="/c/$slug"
            params={{ slug: defaultMerchantSlug }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-primary py-4 text-[13.5px] font-extrabold text-primary-foreground"
          >
            Ver demonstração <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/" className="rounded-2xl bg-white/10 px-5 py-4 text-[13.5px] font-bold">
            Painel
          </Link>
        </div>
      </section>

      <section className="rounded-t-[34px] bg-background px-5 pb-14 pt-7 text-foreground">
        <div className="grid grid-cols-2 gap-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ y: 8, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 * i }}
              className="rounded-3xl border border-border bg-surface p-4"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
                <p.icon className="h-4.5 w-4.5 text-foreground" />
              </span>
              <p className="mt-3 text-[14.5px] font-semibold">{p.title}</p>
              <p className="mt-1 text-[12px] text-muted-foreground">{p.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 rounded-[28px] bg-secondary p-6 text-secondary-foreground">
          <span className="inline-flex rounded-full bg-primary px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-primary-foreground">
            Plano único
          </span>
          <p className="mt-5 text-[36px] font-extrabold leading-none tracking-tight">
            R$ 29,90<span className="text-[15px] font-semibold opacity-60">/mês</span>
          </p>
          <p className="mt-2 text-[13px] opacity-65">Placas e cartões NFC vendidos à parte.</p>
          <ul className="mt-4 space-y-2 text-[13px] opacity-85">
            {["Página pública ilimitada", "Campanhas e cupons", "Relatórios em tempo real", "Suporte por WhatsApp"].map(
              (b) => (
                <li key={b} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> {b}
                </li>
              ),
            )}
          </ul>
          <Link
            to="/auth"
            className="mt-5 flex items-center justify-center rounded-2xl bg-primary py-4 text-[13.5px] font-extrabold text-primary-foreground"
          >
            Começar agora
          </Link>
        </div>
      </section>
    </div>
  );
}
