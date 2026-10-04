import { createFileRoute, notFound, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Flame, Ticket, Sparkles, Vote, MessageCircle, Instagram, MapPin, Star, X, Clock, Navigation, CalendarCheck, Gift } from "lucide-react";
import { toast } from "sonner";
import { getMerchant, type Offer } from "@/lib/merchants";
import { ScratchCoupon } from "@/components/public/ScratchCoupon";
import { BookingModal } from "@/components/public/BookingModal";
import { usePublicSettings } from "@/lib/public-settings";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  { id: "products", icon: Flame, label: "Produtos" },
  { id: "coupons", icon: Ticket, label: "Cupons" },
  { id: "polls", icon: Vote, label: "Enquetes" },
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
  const [comboOpen, setComboOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { settings } = usePublicSettings(slug);

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
          {quick.filter((q) => (q.id === "products" ? settings.products : q.id === "coupons" ? settings.coupons : q.id === "polls" ? settings.polls : true)).map((q, i) => (
            <motion.button
              key={q.id}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.04 * i }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (q.id === "contact") window.open(merchant.whatsapp, "_blank");
                else if (q.id === "coupons") navigate({ to: "/c/$slug/cupons", params: { slug } });
                else if (q.id === "products") navigate({ to: "/c/$slug/produtos", params: { slug } });
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

        {/* Banners em Scroll Horizontal */}
        {((settings.coupons && showCampaign && !scratchOpen) || settings.booking) && (
          <div className="mt-4">
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 -mx-5 px-5 pt-1">
              {/* Banner 1: Benefício Exclusivo (Cupom de Raspar) */}
              {settings.coupons && showCampaign && !scratchOpen && (
                <motion.article
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="relative min-w-[84vw] max-w-[340px] shrink-0 snap-center min-h-[300px] overflow-hidden rounded-[28px] bg-primary p-6 text-primary-foreground shadow-lg flex flex-col justify-between"
                >
                  <span className="pointer-events-none absolute -right-16 -top-11 h-44 w-44 rounded-full border-[38px] border-white/25" />
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="relative z-10 inline-flex rounded-full bg-secondary px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-secondary-foreground">
                        {merchant.campaign.label}
                      </span>
                      <button
                        onClick={() => setShowCampaign(false)}
                        aria-label="Fechar campanha"
                        className="relative z-10 grid h-7 w-7 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <h2 className="relative z-10 mt-6 max-w-[270px] text-[28px] font-extrabold leading-[1.05] tracking-tight">
                      {merchant.campaign.title}
                    </h2>
                    <p className="relative z-10 mt-2 max-w-[285px] text-[13.5px] opacity-80 leading-relaxed">
                      {merchant.campaign.text}
                    </p>
                  </div>
                  <button
                    onClick={() => setScratchOpen(true)}
                    className="relative z-10 mt-6 w-full rounded-[18px] bg-secondary py-4 text-[14px] font-extrabold text-secondary-foreground active:scale-[0.99] shadow-sm hover:opacity-95"
                  >
                    {merchant.campaign.cta}
                  </button>
                </motion.article>
              )}

              {/* Banner 2: Agendamento de Serviços */}
              {settings.booking && (
                <motion.article
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="relative min-w-[84vw] max-w-[340px] shrink-0 snap-center min-h-[300px] overflow-hidden rounded-[28px] bg-secondary p-6 text-secondary-foreground shadow-lg flex flex-col justify-between"
                >
                  <span className="pointer-events-none absolute -right-12 -top-10 h-44 w-44 rounded-full border-[34px] border-primary/20" />
                  <span className="pointer-events-none absolute -left-12 -bottom-10 h-36 w-36 rounded-full border-[28px] border-white/5" />
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-primary-foreground">
                        <CalendarCheck className="h-3 w-3" />
                        Agendamento Online
                      </span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/80">
                        Hora marcada
                      </span>
                    </div>
                    <h2 className="relative z-10 mt-6 max-w-[270px] text-[28px] font-extrabold leading-[1.05] tracking-tight">
                      Agende seu horário com praticidade.
                    </h2>
                    <p className="relative z-10 mt-2 max-w-[285px] text-[13.5px] opacity-80 leading-relaxed">
                      Escolha o serviço, a data ideal e selecione seu horário com confirmação rápida.
                    </p>
                  </div>
                  <button
                    onClick={() => setBookingOpen(true)}
                    className="relative z-10 mt-6 w-full rounded-[18px] bg-primary py-4 text-[14px] font-extrabold text-primary-foreground active:scale-[0.99] shadow-md hover:bg-primary/90"
                  >
                    Agendar serviço
                  </button>
                </motion.article>
              )}

              {/* Banner 3: Clube de Fidelidade Digital */}
              {settings.club && (
                <motion.article
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="relative min-w-[84vw] max-w-[340px] shrink-0 snap-center min-h-[300px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1c1917] via-[#141210] to-[#0a0908] p-6 text-white shadow-lg flex flex-col justify-between border border-[#302a24]"
                >
                  <span className="pointer-events-none absolute -right-12 -top-10 h-44 w-44 rounded-full border-[34px] border-[#f4c95d]/20" />
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-[#f4c95d] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-black">
                        <Gift className="h-3 w-3" />
                        Clube de Fidelidade
                      </span>
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white">
                        8 / 10 Carimbos
                      </span>
                    </div>
                    <h2 className="relative z-10 mt-6 max-w-[270px] text-[27px] font-extrabold leading-[1.05] tracking-tight">
                      Colecione carimbos e ganhe mimos.
                    </h2>
                    <p className="relative z-10 mt-2 max-w-[285px] text-[13px] opacity-80 leading-relaxed text-[#ddd]">
                      Faltam apenas 2 visitas para resgatar sua recompensa especial exclusiva!
                    </p>
                  </div>
                  <button
                    onClick={() => navigate({ to: "/c/$slug/clube", params: { slug } })}
                    className="relative z-10 mt-6 w-full rounded-[18px] bg-[#f4c95d] py-4 text-[14px] font-black text-black active:scale-[0.99] shadow-md hover:bg-[#e0b54e]"
                  >
                    Ver meu cartão de carimbos
                  </button>
                </motion.article>
              )}
            </div>

            {/* Indicador de scroll se ambos estiverem visíveis */}
            {settings.coupons && showCampaign && !scratchOpen && settings.booking && (
              <div className="mt-1 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <span className="h-1.5 w-4 rounded-full bg-primary" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                <span className="ml-1 text-[10.5px]">Deslize para o lado para agendar</span>
              </div>
            )}
          </div>
        )}

        <BookingModal
          open={bookingOpen}
          onOpenChange={setBookingOpen}
          merchant={merchant}
        />

        {settings.coupons && scratchOpen && (
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-4">
            <ScratchCoupon
              discount={merchant.campaign.discount}
              code={merchant.campaign.code}
              rules={merchant.campaign.rules}
            />
          </motion.div>
        )}

        {settings.benefits && <><div className="mb-2.5 mt-5 flex items-center justify-between px-0.5">
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
                o.id === "combo"
                  ? setComboOpen(true)
                  : o.id === "review"
                  ? window.open(merchant.googleReview, "_blank")
                  : toast("Cupom selecionado!")
              }
            />
          ))}
        </div></>}

        <Dialog open={comboOpen} onOpenChange={setComboOpen}><DialogContent className="w-[calc(100vw-32px)] max-w-md rounded-lg bg-background p-6 text-foreground"><DialogTitle>Combo corte + barba</DialogTitle><DialogDescription>Por R$ 69, de segunda a quinta, com hora marcada em {merchant.name}.</DialogDescription><p className="text-sm text-muted-foreground">Confirme horários e disponibilidade diretamente com a equipe.</p><Button onClick={() => window.open(merchant.whatsapp, "_blank", "noopener,noreferrer")}>Consultar no WhatsApp</Button></DialogContent></Dialog>

        <div className="mb-2.5 mt-6 flex items-center justify-between px-0.5">
          <h3 className="text-[17px] font-semibold tracking-tight text-foreground">Novidades</h3>
        </div>
        <div className="space-y-3">
          {merchant.news.filter((o) => o.id !== "club" || settings.club).map((o) => (
            <OfferRow
              key={o.id}
              offer={o}
              onAction={() =>
                o.id === "club"
                  ? navigate({ to: "/c/$slug/clube", params: { slug } })
                  : toast("Em breve por aqui")
              }
            />
          ))}
        </div>

        {/* Cartão de Fidelidade Interativo */}
        {settings.club && (
          <div className="mt-5 rounded-3xl border border-border bg-surface p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#f4c95d]/20 text-[#f4c95d]">
                  <Gift className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-[14px] font-bold text-foreground">Cartão Fidelidade {merchant.name}</h4>
                  <span className="text-[11px] text-muted-foreground">8 de 10 carimbos preenchidos</span>
                </div>
              </div>
              <span className="rounded-full bg-[#f4c95d]/15 px-2.5 py-1 text-[10px] font-black text-[#f4c95d] uppercase">
                Quase lá!
              </span>
            </div>

            {/* Grid dos 10 carimbos */}
            <div className="mt-4 grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const filled = num <= 8;
                return (
                  <div
                    key={num}
                    className={`flex flex-col items-center justify-center h-13 rounded-2xl border transition-all ${
                      filled
                        ? "border-[#f4c95d] bg-[#f4c95d]/15 text-[#f4c95d] font-black shadow-sm"
                        : "border-dashed border-border bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs">{filled ? "★" : num}</span>
                    <span className="text-[8.5px] font-bold mt-0.5">{filled ? "Visita" : "Livre"}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground text-[11px]">Prêmio: 1 Procedimento Express Grátis</span>
              <button
                onClick={() => navigate({ to: "/c/$slug/clube", params: { slug } })}
                className="font-bold text-primary hover:underline text-[12px]"
              >
                Abrir Cartão →
              </button>
            </div>
          </div>
        )}

        {/* Programa Indique e Ganhe */}
        <div className="mt-3.5 rounded-3xl border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <h4 className="text-[13.5px] font-bold text-foreground">Indique uma Amiga</h4>
                <p className="text-[11px] text-muted-foreground">Ambas ganham R$ 20 OFF no agendamento</p>
              </div>
            </div>
            <button
              onClick={() => {
                const text = encodeURIComponent(`Olá! Conheça ${merchant.name} e ganhe R$ 20 de desconto no seu agendamento usando meu link exclusivo: https://avaliatap.com/c/${slug}`);
                window.open(`https://wa.me/?text=${text}`, "_blank");
              }}
              className="rounded-xl bg-primary px-3 py-2 text-[11px] font-extrabold text-primary-foreground shadow-sm hover:bg-primary/90 shrink-0"
            >
              Indicar
            </button>
          </div>
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

        <article className="mt-3 overflow-hidden rounded-3xl border border-border bg-surface">
          <div className="flex items-start gap-3 p-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft">
              <MapPin className="h-5 w-5 text-foreground" />
            </span>
            <div className="min-w-0 flex-1">
              <small className="text-[9.5px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                Onde estamos
              </small>
              <h3 className="mt-1 text-[15px] font-semibold text-foreground">{merchant.address}</h3>
              <p className="mt-1 text-[12px] text-muted-foreground">{merchant.category}</p>
              <p className="mt-2 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Seg a sáb, 9h às 20h
              </p>
            </div>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${merchant.name} ${merchant.address}`,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 border-t border-border py-4 text-[13px] font-extrabold text-foreground"
          >
            <Navigation className="h-4 w-4" /> Como chegar
          </a>
        </article>


        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          Experiência criada com <span className="font-bold text-foreground">AvaliaTap</span>
        </p>
      </section>
    </div>
  );
}
