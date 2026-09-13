import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Calendar, ChevronRight, Plus, Search, Ticket, UserRound, X } from "lucide-react";
import { toast } from "sonner";

type CouponEvent = { date: string; title: string; detail: string };
type Beneficiary = {
  id: string;
  name: string;
  phone: string;
  coupon: string;
  status: "Disponível" | "Usado" | "Expirado";
  createdAt: string;
  history: CouponEvent[];
};

const seed: Beneficiary[] = [
  { id: "1", name: "Mariana Costa", phone: "(11) 98881-2201", coupon: "BEMVINDO20", status: "Usado", createdAt: "10/09/2026", history: [
    { date: "10/09/2026 · 14:32", title: "Cupom liberado", detail: "20% OFF · BEMVINDO20" },
    { date: "11/09/2026 · 16:08", title: "Cupom utilizado", detail: "Validado no balcão por Carlos" },
  ] },
  { id: "2", name: "Rafael Souza", phone: "(11) 97712-8430", coupon: "ALPHA10", status: "Disponível", createdAt: "11/09/2026", history: [
    { date: "11/09/2026 · 09:15", title: "Cupom liberado", detail: "10% OFF · ALPHA10" },
  ] },
  { id: "3", name: "Tainá Lima", phone: "(11) 96630-1198", coupon: "FRETEGRATIS", status: "Expirado", createdAt: "01/09/2026", history: [
    { date: "01/09/2026 · 18:20", title: "Cupom liberado", detail: "Frete grátis · FRETEGRATIS" },
    { date: "09/09/2026 · 00:00", title: "Cupom expirado", detail: "Prazo encerrado sem utilização" },
  ] },
];

export const Route = createFileRoute("/beneficiarios")({
  head: () => ({ meta: [
    { title: "Beneficiários de cupons · AvaliaTap" },
    { name: "description", content: "Cadastre clientes contemplados e acompanhe o histórico de cada cupom." },
    { property: "og:title", content: "Beneficiários de cupons · AvaliaTap" },
    { property: "og:description", content: "Cadastro e histórico de beneficiários de cupons." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: BeneficiariesPage,
});

const storageKey = "avaliatap-beneficiaries";

function BeneficiariesPage() {
  const [people, setPeople] = useState<Beneficiary[]>(seed);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Beneficiary | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", coupon: "" });

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try { setPeople(JSON.parse(saved) as Beneficiary[]); } catch { window.localStorage.removeItem(storageKey); }
    }
  }, []);

  const save = (next: Beneficiary[]) => {
    setPeople(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const filtered = useMemo(() => people.filter((p) => `${p.name} ${p.phone} ${p.coupon}`.toLowerCase().includes(query.toLowerCase())), [people, query]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const date = now.toLocaleDateString("pt-BR");
    const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const person: Beneficiary = {
      id: crypto.randomUUID(), name: form.name, phone: form.phone, coupon: form.coupon.toUpperCase(), status: "Disponível", createdAt: date,
      history: [{ date: `${date} · ${time}`, title: "Cupom liberado", detail: `Benefício · ${form.coupon.toUpperCase()}` }],
    };
    save([person, ...people]);
    setForm({ name: "", phone: "", coupon: "" });
    setFormOpen(false);
    toast("Beneficiário cadastrado");
  };

  return <div className="min-h-screen bg-background pb-28">
    <header className="bg-secondary px-5 pb-7 pt-7 text-secondary-foreground">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] opacity-50">Cupons e benefícios</p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <div><h1 className="text-[30px] font-extrabold tracking-tight">Beneficiários</h1><p className="mt-1 text-[13px] opacity-60">Quem ganhou e o que aconteceu com cada cupom.</p></div>
        <button onClick={() => setFormOpen(true)} aria-label="Novo beneficiário" className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground"><Plus /></button>
      </div>
    </header>

    <main className="px-5 pt-5">
      <div className="grid grid-cols-3 gap-2">
        {[{ label: "Total", value: people.length }, { label: "Disponíveis", value: people.filter(p => p.status === "Disponível").length }, { label: "Utilizados", value: people.filter(p => p.status === "Usado").length }].map(s => <div key={s.label} className="rounded-2xl border border-border bg-surface p-3"><strong className="block text-[22px] text-foreground">{s.value}</strong><span className="text-[10px] text-muted-foreground">{s.label}</span></div>)}
      </div>
      <label className="mt-4 flex h-12 items-center gap-2 rounded-2xl border border-border bg-surface px-4"><Search className="h-4 w-4 text-muted-foreground"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar nome, telefone ou cupom" className="w-full bg-transparent text-[13px] text-foreground outline-none"/></label>
      <div className="mt-4 space-y-2.5">
        {filtered.map(person => <button key={person.id} onClick={() => setSelected(person)} className="flex w-full items-center gap-3 rounded-[20px] border border-border bg-surface p-3 text-left">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-muted text-[15px] font-extrabold text-foreground">{person.name.split(" ").slice(0,2).map(n => n[0]).join("")}</span>
          <span className="min-w-0 flex-1"><b className="block text-[14px] text-foreground">{person.name}</b><span className="block text-[11px] text-muted-foreground">{person.coupon} · {person.createdAt}</span></span>
          <span className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold ${person.status === "Disponível" ? "bg-primary-soft text-foreground" : "bg-muted text-muted-foreground"}`}>{person.status}</span><ChevronRight className="h-4 w-4 text-muted-foreground"/>
        </button>)}
      </div>
    </main>

    {formOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"><form onSubmit={submit} className="w-full max-w-md rounded-t-[28px] bg-background p-5"><div className="flex items-center justify-between"><h2 className="text-[19px] font-extrabold text-foreground">Novo beneficiário</h2><button type="button" onClick={() => setFormOpen(false)} aria-label="Fechar" className="grid h-9 w-9 place-items-center rounded-full bg-muted"><X className="h-4 w-4"/></button></div><div className="mt-5 space-y-3">{[["Nome completo", "name"], ["WhatsApp", "phone"], ["Código do cupom", "coupon"]].map(([label, key]) => <label key={key} className="block text-[11px] font-bold text-muted-foreground">{label}<input required value={form[key as keyof typeof form]} onChange={e => setForm({...form, [key]: e.target.value})} className="mt-1.5 h-12 w-full rounded-xl border border-border bg-surface px-3 text-[14px] text-foreground outline-none focus:border-primary"/></label>)}</div><button className="mt-5 w-full rounded-2xl bg-secondary py-4 text-[14px] font-extrabold text-secondary-foreground">Cadastrar ganhador</button></form></div>}

    {selected && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => setSelected(null)}><section onClick={e => e.stopPropagation()} className="max-h-[82vh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-background p-5"><div className="flex items-start justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">Histórico do beneficiário</p><h2 className="mt-1 text-[21px] font-extrabold text-foreground">{selected.name}</h2><p className="text-[12px] text-muted-foreground">{selected.phone}</p></div><button onClick={() => setSelected(null)} aria-label="Fechar" className="grid h-9 w-9 place-items-center rounded-full bg-muted"><X className="h-4 w-4"/></button></div><div className="mt-5 flex items-center gap-3 rounded-2xl bg-primary-soft p-4"><Ticket className="h-5 w-5 text-foreground"/><div><b className="text-[14px] text-foreground">{selected.coupon}</b><p className="text-[11px] text-muted-foreground">Situação: {selected.status}</p></div></div><h3 className="mb-3 mt-6 text-[14px] font-bold text-foreground">Linha do tempo</h3><div className="space-y-0">{selected.history.map((event, i) => <div key={`${event.date}-${i}`} className="relative flex gap-3 pb-5 last:pb-0"><span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"><Calendar className="h-3.5 w-3.5"/></span>{i < selected.history.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-32px)] w-px bg-border"/>}<div><b className="text-[13px] text-foreground">{event.title}</b><p className="text-[11px] text-muted-foreground">{event.detail}</p><small className="mt-1 block text-[10px] text-muted-foreground">{event.date}</small></div></div>)}</div></section></div>}
  </div>;
}