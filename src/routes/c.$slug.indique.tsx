import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronLeft, Copy, MoreHorizontal, Share2 } from "lucide-react";
import { toast } from "sonner";
import { getMerchant } from "@/lib/merchants";

export const Route = createFileRoute("/c/$slug/indique")({
  head: () => ({ meta: [
    { title: "Indique e ganhe · AvaliaTap" },
    { name: "description", content: "Compartilhe seu código, acompanhe indicações e ganhe créditos." },
    { property: "og:title", content: "Indique e ganhe · AvaliaTap" },
    { property: "og:description", content: "Compartilhe seu código e ganhe créditos com seus amigos." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ReferralPage,
});

const friends = [
  { initials: "MC", name: "Mariana Costa", detail: "Comprou há 2 dias", value: "+R$20", done: true },
  { initials: "RS", name: "Rafael Souza", detail: "Comprou há 1 semana", value: "+R$20", done: true },
  { initials: "TL", name: "Tainá Lima", detail: "Ainda não comprou", value: "Pendente", done: false },
  { initials: "PA", name: "Pedro Andrade", detail: "Ainda não comprou", value: "Pendente", done: false },
];

function ReferralPage() {
  const { slug } = Route.useParams();
  const merchant = getMerchant(slug);
  const [copied, setCopied] = useState(false);
  const code = "ALPHA-JOAO20";
  const referralUrl = `/c/${slug}?ref=${code}`;
  const copy = async () => { await navigator.clipboard?.writeText(code); setCopied(true); toast("Código copiado"); setTimeout(() => setCopied(false), 1500); };
  const share = async () => {
    const fullUrl = `${window.location.origin}${referralUrl}`;
    if (navigator.share) await navigator.share({ title: `Indicação ${merchant?.name}`, text: `Use meu código ${code} e ganhe 15% de desconto.`, url: fullUrl });
    else { await navigator.clipboard?.writeText(fullUrl); toast("Link copiado"); }
  };

  return <div className="min-h-screen bg-secondary px-5 pb-28 pt-7 text-secondary-foreground">
    <header className="flex items-center gap-3"><Link to="/c/$slug/creditos" params={{slug}} aria-label="Voltar" className="grid h-10 w-10 place-items-center rounded-full bg-white/5"><ChevronLeft/></Link><span className="text-[12px] font-extrabold uppercase tracking-[0.08em] opacity-55">Clube de indicações</span></header>
    <section className="relative mt-4 overflow-hidden rounded-[26px] bg-primary p-6 text-primary-foreground"><span className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full border-[28px] border-white/30"/><small className="relative z-10 text-[10px] font-extrabold uppercase tracking-[0.08em] opacity-70">Indique e ganhe</small><h1 className="relative z-10 mt-2 max-w-[280px] text-[28px] font-extrabold leading-[1.05] tracking-tight">Chame seus amigos para {merchant?.name}.</h1><p className="relative z-10 mt-2 max-w-[270px] text-[13px] opacity-70">Você ganha, seu amigo ganha. Sem limite de indicações.</p></section>
    <section className="mt-3 flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/5 p-4"><div className="min-w-0 flex-1"><small className="text-[9px] font-extrabold uppercase tracking-[0.08em] opacity-50">Seu código exclusivo</small><p className="mt-1 font-mono text-[17px] font-extrabold tracking-wide">{code}</p></div><button onClick={copy} className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-3 text-[11px] font-extrabold text-primary-foreground">{copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}{copied ? "COPIADO" : "COPIAR"}</button></section>
    <div className="mt-3 grid grid-cols-3 gap-2">{[
      {label:"WhatsApp", icon:Share2, action:() => window.open(`https://wa.me/?text=${encodeURIComponent(`Use meu código ${code} em ${merchant?.name}: ${window.location.origin}${referralUrl}`)}`, "_blank")},
      {label:"Copiar link", icon:Copy, action:async()=>{await navigator.clipboard?.writeText(`${window.location.origin}${referralUrl}`); toast("Link copiado")}},
      {label:"Mais opções", icon:MoreHorizontal, action:share},
    ].map(a => <button key={a.label} onClick={a.action} className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-[10px] font-bold"><span className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><a.icon className="h-4 w-4"/></span>{a.label}</button>)}</div>
    <h2 className="mb-3 mt-6 text-[16px] font-bold">Como funciona</h2><div className="space-y-2">{[
      ["1", "Compartilhe seu código", "Envie pelo WhatsApp, Instagram ou copie o link."],
      ["2", "Seu amigo compra", "Ele usa o código e ganha 15% na primeira compra."],
      ["3", "Vocês dois ganham", "Você recebe R$ 20 em crédito na próxima visita."],
    ].map(s => <div key={s[0]} className="flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/5 p-3.5"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 text-[13px] font-extrabold text-primary">{s[0]}</span><div><b className="text-[13px]">{s[1]}</b><p className="text-[11px] opacity-50">{s[2]}</p></div></div>)}</div>
    <h2 className="mb-3 mt-6 text-[16px] font-bold">Seus resultados</h2><div className="grid grid-cols-3 gap-2">{[["7","Indicados"],["4","Converteram"],["R$80","Ganhos"]].map(s => <div key={s[1]} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center"><b className="text-[19px] text-primary">{s[0]}</b><p className="mt-1 text-[9px] font-bold uppercase opacity-45">{s[1]}</p></div>)}</div>
    <h2 className="mb-2 mt-6 text-[16px] font-bold">Seus indicados</h2><div>{friends.map(f => <div key={f.name} className="flex items-center gap-3 border-b border-white/10 py-3 last:border-0"><span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-[12px] font-extrabold">{f.initials}</span><div className="flex-1"><b className="text-[13px]">{f.name}</b><p className="text-[11px] opacity-50">{f.detail}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${f.done ? "bg-primary/15 text-primary" : "bg-white/10 opacity-50"}`}>{f.value}</span></div>)}</div>
  </div>;
}