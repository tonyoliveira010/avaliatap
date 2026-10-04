import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Nfc, Star, Ticket, Users, ArrowRight, Check, MessageCircle, Copy, ShoppingBag, Plus } from "lucide-react";
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

const benefitStories = [
  {
    id: "scratch",
    tag: "Raspadinha digital",
    title: "Uma raspadinha que qualquer cliente quer raspar.",
    text: "O cliente descobre o desconto na hora e recebe um código único. Você define valor, validade e usos.",
    preview: "coupon",
  },
  {
    id: "reviews",
    tag: "Reputação",
    title: "Peça a avaliação no momento certo.",
    text: "Logo após o cupom, convide o cliente satisfeito para avaliar no Google em apenas 20 segundos.",
    preview: "review",
  },
  {
    id: "referral",
    tag: "Indique e ganhe",
    title: "Cliente feliz chama outro cliente.",
    text: "Cada cliente recebe seu código para indicar amigos. Quando o amigo compra, os dois ganham.",
    preview: "referral",
  },
  {
    id: "catalog",
    tag: "Catálogo no WhatsApp",
    title: "Cardápio ou vitrine, sem loja virtual.",
    text: "Publique fotos, pacotes e preços. O cliente monta o pedido e finaliza direto no seu WhatsApp.",
    preview: "catalog",
  },
] as const;

const faq = [
  ["Como funciona a placa NFC?", "O cliente aproxima o celular da placa e abre a página pública do seu comércio, sem instalar aplicativo."],
  ["Preciso ter uma loja virtual?", "Não. Você publica produtos e serviços na vitrine e recebe os pedidos pelo WhatsApp."],
  ["Posso mudar ofertas e benefícios?", "Sim. Você pode atualizar a vitrine e escolher quais experiências aparecem na sua página."],
  ["As placas estão incluídas no plano?", "Não. Placas e cartões NFC são vendidos separadamente da mensalidade."],
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

        <div className="mt-9">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">Experiências que convertem</p>
          <h2 className="mt-2 max-w-[330px] text-[28px] font-extrabold leading-[1.03] tracking-tight">Cada toque vira um motivo para voltar.</h2>
        </div>
        <div className="-mx-5 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {benefitStories.map((story) => (
            <article key={story.id} className="flex h-[390px] w-[285px] shrink-0 snap-start flex-col overflow-hidden rounded-[26px] bg-secondary p-5 text-secondary-foreground">
              <span className="w-fit rounded-full border border-white/15 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] opacity-65">{story.tag}</span>
              <h3 className="mt-5 text-[25px] font-extrabold leading-[1.02] tracking-tight">{story.title}</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed opacity-55">{story.text}</p>
              <div className="mt-auto rounded-[20px] border border-white/10 bg-white/5 p-4">
                {story.preview === "coupon" && <div className="rounded-2xl bg-primary p-4 text-center text-primary-foreground"><small className="text-[9px] font-extrabold uppercase opacity-60">Seu cupom</small><b className="mt-1 block text-[29px]">20% OFF</b><code className="mt-1 inline-block rounded-full bg-secondary px-3 py-1 text-[10px] text-secondary-foreground">BEMVINDO20</code></div>}
                {story.preview === "review" && <div><div className="text-primary">★★★★★</div><p className="mt-3 text-[13px] font-semibold">“Conta pra gente no Google — leva 20 segundos.”</p><Star className="ml-auto mt-2 h-7 w-7 text-primary"/></div>}
                {story.preview === "referral" && <div><code className="text-[14px] font-extrabold">BELLA-JOAO20</code><div className="mt-4 flex gap-2"><span className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#25D366] py-2.5 text-[10px] font-bold text-white"><MessageCircle className="h-3.5 w-3.5"/> WhatsApp</span><span className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-white/10 py-2.5 text-[10px] font-bold"><Copy className="h-3.5 w-3.5"/> Copiar link</span></div></div>}
                {story.preview === "catalog" && <div className="space-y-2">{[["Sérum Facial","R$ 89,90"],["Kit Massagem","R$ 119,00"]].map(p => <div key={p[0]} className="flex items-center gap-2 rounded-xl bg-white/5 p-2"><span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-foreground"><ShoppingBag className="h-4 w-4"/></span><span className="flex-1 text-[11px] font-bold">{p[0]}</span><b className="text-[10px] text-primary">{p[1]}</b></div>)}</div>}
              </div>
            </article>
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
      <section className="bg-background px-5 pb-16 text-foreground" aria-labelledby="faq-title"><div className="mx-auto max-w-3xl border-t border-border pt-10"><h2 id="faq-title" className="text-2xl font-extrabold">Perguntas frequentes</h2><div className="mt-5 divide-y divide-border">{faq.map(([question, answer]) => <details key={question} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold">{question}<Plus className="h-4 w-4 shrink-0 transition-transform group-open:rotate-45" /></summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{answer}</p></details>)}</div></div></section>
      <footer className="border-t border-secondary-foreground/15 bg-secondary px-6 pb-10 pt-8 text-secondary-foreground"><div className="mx-auto flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xl font-extrabold">Avalia<span className="text-primary">Tap</span></p><p className="mt-2 max-w-xs text-xs opacity-60">Aproxime pessoas do seu comércio.</p></div><nav aria-label="Links do rodapé" className="flex flex-wrap gap-5 text-xs font-semibold"><Link to="/auth">Entrar</Link><Link to="/c/$slug" params={{ slug: defaultMerchantSlug }}>Ver demonstração</Link><Link to="/">Painel</Link></nav></div></footer>
    </div>
  );
}
