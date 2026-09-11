import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Search, Bell } from "lucide-react";
import { toast } from "sonner";
import { getMerchant } from "@/lib/merchants";
import { benefitCategories, featuredBenefits, benefitItems } from "@/lib/customer";

export const Route = createFileRoute("/c/$slug/beneficios")({
  head: () => ({
    meta: [
      { title: "Benefícios exclusivos · AvaliaTap" },
      { name: "description", content: "Ofertas, cupons e experiências exclusivas do estabelecimento." },
      { property: "og:title", content: "Benefícios exclusivos · AvaliaTap" },
      { property: "og:description", content: "Ofertas, cupons e experiências exclusivas do estabelecimento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BenefitsPage,
});

const cardTone: Record<string, string> = {
  orange: "bg-[#ff7649]",
  lilac: "bg-[#d9c6ff]",
  lime: "bg-primary",
};

const iconTone: Record<string, string> = {
  lime: "bg-[#b8ff72]",
  yellow: "bg-[#ffd76b]",
  purple: "bg-[#cbb8ff]",
};

function BenefitsPage() {
  const { slug } = Route.useParams();
  const merchant = getMerchant(slug);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");

  const matches = (item: { title: string; description: string; category: string }) =>
    (category === "Todos" || item.category === category) &&
    `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase());

  const cards = featuredBenefits.filter(matches);
  const items = benefitItems.filter(matches);

  return (
    <div className="min-h-screen bg-secondary px-5 pb-28 pt-7 text-secondary-foreground">
      <header className="flex items-center justify-between">
        <Link to="/c/$slug" params={{ slug }} aria-label="Voltar" className="grid h-10 w-10 place-items-center rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <strong className="text-[19px] tracking-tight">Benefícios</strong>
        <button onClick={() => toast("Notificações")} aria-label="Notificações" className="grid h-10 w-10 place-items-center rounded-full">
          <Bell className="h-5 w-5" />
        </button>
      </header>

      <div className="mt-6 px-1">
        <h1 className="text-[32px] font-extrabold leading-[1.02] tracking-tight">
          Benefícios para
          <br />
          você aproveitar.
        </h1>
        <p className="mt-2 text-[13.5px] opacity-55">
          {merchant ? `Ofertas e experiências de ${merchant.name}.` : "Descubra ofertas e experiências exclusivas."}
        </p>
      </div>

      <label className="mt-5 flex h-12 items-center gap-2.5 rounded-[15px] border border-white/10 bg-white/5 px-4">
        <Search className="h-4 w-4 opacity-50" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar benefício..."
          className="w-full bg-transparent text-[14px] outline-none placeholder:opacity-40"
        />
      </label>

      <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {benefitCategories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full px-3.5 py-2.5 text-[12px] font-bold ${
              category === c ? "bg-white text-black" : "bg-white/10 opacity-70"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mb-2.5 mt-5 flex items-center justify-between px-1">
        <h2 className="text-[17px] font-semibold tracking-tight">Em destaque</h2>
        <button onClick={() => setCategory("Todos")} className="text-[12px] opacity-55">
          Ver tudo
        </button>
      </div>

      {cards.length === 0 && items.length === 0 ? (
        <p className="rounded-3xl bg-white/5 p-6 text-center text-[13px] opacity-60">
          Nenhum benefício encontrado por aqui.
        </p>
      ) : null}

      <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cards.map((b) => (
          <button
            key={b.id}
            onClick={() => toast(`${b.title}`)}
            className={`relative h-[220px] w-[235px] shrink-0 overflow-hidden rounded-[25px] p-[18px] text-left text-black ${cardTone[b.tone]}`}
          >
            <span className="absolute -right-7 top-9 h-32 w-32 rounded-full bg-white/25" />
            <span className="relative inline-block rounded-full bg-black/80 px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-white">
              {b.tag}
            </span>
            <h3 className="absolute inset-x-[18px] bottom-12 text-[24px] font-extrabold leading-[0.98] tracking-tight">
              {b.title}
            </h3>
            <p className="absolute bottom-[18px] left-[18px] text-[11px] font-bold text-black/60">{b.description}</p>
          </button>
        ))}
      </div>

      <div className="mb-2.5 mt-5 flex items-center justify-between px-1">
        <h2 className="text-[17px] font-semibold tracking-tight">Mais benefícios</h2>
      </div>

      <div className="grid gap-2.5">
        {items.map((item) => (
          <article key={item.id} className="flex min-h-[86px] items-center gap-3 rounded-[20px] border border-white/10 bg-white/5 p-3">
            <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl ${iconTone[item.tone]}`}>
              {item.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <small className="text-[9px] font-extrabold uppercase tracking-[0.09em] opacity-50">{item.tag}</small>
              <h4 className="mt-1 text-[14px] font-semibold">{item.title}</h4>
              <p className="truncate text-[11px] opacity-55">{item.description}</p>
            </div>
            <button
              onClick={() => toast(`${item.title}: ${item.action.toLowerCase()}`)}
              className="shrink-0 rounded-xl bg-white px-3 py-2.5 text-[10px] font-extrabold text-black active:scale-95"
            >
              {item.action}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
