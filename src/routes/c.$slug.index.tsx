import { createFileRoute, notFound, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Flame, Ticket, Sparkles, MessageCircle, Instagram, MapPin, Star, X } from "lucide-react";
import { toast } from "sonner";
import { getMerchant, type Offer } from "@/lib/merchants";
import { ScratchCoupon } from "@/components/public/ScratchCoupon";

export const Route = createFileRoute("/c/$slug/")({
  loader: ({ params }) => {
    const merchant = getMerchant(params.slug);
    if (!merchant) throw notFound();
    return { merchant };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Estabelecimento não encontrado · AvaliaTap" }, { name: "robots", content: "noindex" }] };
    }
    const { merchant } = loaderData;
    const title = `${merchant.name} · Benefícios exclusivos`;
    const description = `${merchant.subtitle} Ofertas, cupons e novidades de ${merchant.name}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: PublicMerchant,
});

const quick = [
  { id: "offers", icon: Flame, label: "Ofertas" },
  { id: "coupons", icon: Ticket, label: "Cupons" },
  { id: "news", icon: Sparkles, label: "Novidades" },
  { id: "contact", icon: MessageCircle, label: "Contato" },
];

function OfferRow({ offer, onAction }: { offer: Offer; onAction: () => void }) {
  return (
    <article className="flex items-center gap-3 rounded-3xl border border-border bg-surface p-4">
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-secondary text-2xl">
        {offer.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <small className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
          {offer.tag}
        </small>
        <h4 className="mt-1 text-[15px] font-semibold text-foreground">{offer.title}</h4>
        <p className="text-[12px] text-muted-foreground">{offer.description}</p>
      </div>
      <button
        onClick={onAction}
        className="shrink-0 rounded-xl bg-secondary px-3 py-2.5 text-[11px] font-extrabold text-secondary-foreground active:scale-95"
      >
        {offer.action}
      </button>
    </article>
  );
}

function PublicMerchant() {
  const { merchant } = Route.useLoaderData();
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [showCampaign, setShowCampaign] = useState(true);
  const [scratchOpen, setScratchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary">
      <section className="px-6 pt-8 pb-9 text-secondary-foreground">
        <div className="flex items-center justify-between">
          <span className="text-[17px] font-extrabold tracking-tight">
            Avalia<span className="text-primary">Tap</span>
          </span>
          <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold opacity-80">
            {merchant.category}
          </span>
        </div>

        <p className="mt-7 text-[13px] opacity-60">{merchant.greeting}</p>
        <h1 className="mt-1.5 max-w-[300px] text-[31px] font-extrabold leading-[1.05] tracking-tight">
          {merchant.headline}
        </h1>
        <p className="mt-3 max-w-[300px] text-[13.5px] opacity-60">{merchant.subtitle}</p>
      </section>

      <section className="min-h-[70vh] rounded-t-[34px] bg-background px-5 pt-6 pb-28">
        <div className="grid grid-cols-4 gap-2.5">
          {quick.map((q, i) => (
            <motion.button
              key={q.id}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.04 * i }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (q.id === "contact") window.open(merchant.whatsapp, "_blank");
                else if (q.id === "coupons") setScratchOpen(true);
                else if (q.id === "offers") navigate({ to: "/c/$slug/beneficios", params: { slug } });
                else navigate({ to: "/c/$slug/enquetes", params: { slug } });
              }}
              className="flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-[20px] bg-muted"
            >
              <span className="grid h-9 w-9 place-items-center rounded-[13px] bg-surface">
                <q.icon className="h-4 w-4 text-foreground" />
              </span>
              <b className="text-[11px] font-bold text-foreground">{q.label}</b>
            </motion.button>
          ))}
        </div>

        {showCampaign && !scratchOpen && (
          <motion.article
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative mt-4 min-h-[290px] overflow-hidden rounded-[28px] bg-primary p-6 text-primary-foreground"
          >
            <span className="pointer-events-none absolute -right-16 -top-11 h-44 w-44 rounded-full border-[38px] border-white/25" />
            <button
              onClick={() => setShowCampaign(false)}
              aria-label="Fechar campanha"
              className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-surface text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <span className="relative z-10 inline-flex rounded-full bg-secondary px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-secondary-foreground">
              {merchant.campaign.label}
            </span>
            <h2 className="relative z-10 mt-11 max-w-[270px] text-[31px] font-extrabold leading-[1.02] tracking-tight">
              {merchant.campaign.title}
            </h2>
            <p className="relative z-10 mt-2 max-w-[285px] text-[14px] opacity-75">
              {merchant.campaign.text}
            </p>
            <button
              onClick={() => setScratchOpen(true)}
              className="absolute inset-x-5 bottom-5 rounded-[18px] bg-secondary py-4 text-[14px] font-extrabold text-secondary-foreground active:scale-[0.99]"
            >
              {merchant.campaign.cta}
            </button>
          </motion.article>
        )}

        {scratchOpen && (
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-4">
            <ScratchCoupon
              discount={merchant.campaign.discount}
              code={merchant.campaign.code}
              rules={merchant.campaign.rules}
            />
          </motion.div>
        )}

        <div className="mb-2.5 mt-5 flex items-center justify-between px-0.5">
          <h3 className="text-[17px] font-semibold tracking-tight text-foreground">Mais para você</h3>
          <Link to="/c/$slug/beneficios" params={{ slug }} className="text-[12px] text-muted-foreground">
            Ver tudo
          </Link>
        </div>
        <div className="space-y-3">
          {merchant.offers.map((o) => (
            <OfferRow
              key={o.id}
              offer={o}
              onAction={() =>
                o.id === "review"
                  ? window.open(merchant.googleReview, "_blank")
                  : toast("Cupom selecionado!")
              }
            />
          ))}
        </div>

        <div className="mb-2.5 mt-6 flex items-center justify-between px-0.5">
          <h3 className="text-[17px] font-semibold tracking-tight text-foreground">Novidades</h3>
        </div>
        <div className="space-y-3">
          {merchant.news.map((o) => (
            <OfferRow key={o.id} offer={o} onAction={() => toast("Em breve por aqui")} />
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-secondary p-5 text-secondary-foreground">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] opacity-60">Fale com a gente</p>
          <p className="mt-2 text-[15px] font-semibold">{merchant.name}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[12.5px] opacity-70">
            <MapPin className="h-3.5 w-3.5" /> {merchant.address}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] font-bold">
            <a href={merchant.whatsapp} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-primary-foreground">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a href={merchant.instagram} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 rounded-xl bg-white/10 py-3">
              <Instagram className="h-4 w-4" /> Instagram
            </a>
            <a href={merchant.googleReview} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 rounded-xl bg-white/10 py-3">
              <Star className="h-4 w-4" /> Avaliar
            </a>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          Experiência criada com <span className="font-bold text-foreground">AvaliaTap</span>
        </p>
      </section>
    </div>
  );
}
