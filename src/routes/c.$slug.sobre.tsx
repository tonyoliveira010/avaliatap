import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, MapPin, MessageCircle, Instagram, Star } from "lucide-react";
import { getMerchant } from "@/lib/merchants";
export const Route = createFileRoute("/c/$slug/sobre")({
  head: () => ({ meta: [{ title: "Sobre o comércio · AvaliaTap" }, { name: "description", content: "Conheça o estabelecimento, endereço e contatos." }, { property: "og:title", content: "Sobre o comércio · AvaliaTap" }, { property: "og:description", content: "Conheça o estabelecimento, endereço e contatos." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AboutMerchant,
});
function AboutMerchant() {
  const { slug } = Route.useParams(); const merchant = getMerchant(slug);
  if (!merchant) return null;
  return <main className="min-h-screen bg-background px-5 pb-28 pt-7"><Link to="/c/$slug" params={{ slug }} aria-label="Voltar" className="inline-flex items-center gap-2 text-sm"><ChevronLeft className="h-5 w-5" /> Voltar</Link><p className="mt-8 text-xs font-bold uppercase text-muted-foreground">{merchant.category}</p><h1 className="mt-2 text-3xl font-extrabold">{merchant.name}</h1><p className="mt-3 text-sm text-muted-foreground">{merchant.subtitle}</p><section className="mt-9 border-t border-border pt-6"><h2 className="text-lg font-bold">Onde estamos</h2><p className="mt-3 flex items-start gap-2 text-sm"><MapPin className="h-5 w-5 shrink-0" /> {merchant.address}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(merchant.address)}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-bold underline">Como chegar</a></section><section className="mt-9 border-t border-border pt-6"><h2 className="text-lg font-bold">Fale com a gente</h2><div className="mt-4 grid gap-3">{[[merchant.whatsapp,"WhatsApp",MessageCircle],[merchant.instagram,"Instagram",Instagram],[merchant.googleReview,"Avaliar no Google",Star]].map(([url,label,Icon]) => <a key={label as string} href={url as string} target="_blank" rel="noreferrer" className="flex items-center gap-3 border-b border-border py-3 text-sm font-semibold"><Icon className="h-5 w-5" />{label as string}</a>)}</div></section></main>;
}
