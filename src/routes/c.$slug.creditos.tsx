import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, History, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { creditBalance, creditActions, rewards, nextPrize } from "@/lib/customer";
import { usePublicSettings } from "@/lib/public-settings";

export const Route = createFileRoute("/c/$slug/creditos")({
  head: () => ({
    meta: [
      { title: "Créditos e prêmios · AvaliaTap" },
      { name: "description", content: "Acumule créditos, troque por benefícios e concorra a prêmios do estabelecimento." },
      { property: "og:title", content: "Créditos e prêmios · AvaliaTap" },
      { property: "og:description", content: "Acumule créditos, troque por benefícios e concorra a prêmios." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CreditsPage,
});

function CreditsPage() {
  const { slug } = Route.useParams();
  const { settings } = usePublicSettings(slug);
  const navigate = useNavigate();
  const [balance, setBalance] = useState(creditBalance);
  const [redeemed, setRedeemed] = useState<string[]>([]);
  const progress = Math.round((nextPrize.current / nextPrize.target) * 100);

  const redeem = (id: string, title: string, cost: number) => {
    if (cost > balance) {
      toast(`Você precisa de mais ${cost - balance} créditos.`);
      return;
    }
    setBalance((b) => b - cost);
    setRedeemed((r) => [...r, id]);
    toast(`${title} resgatado! 🎉`);
  };

  return (
    <div className="min-h-screen bg-secondary px-5 pb-28 pt-7 text-secondary-foreground">
      <header className="flex items-center justify-between">
        <Link to="/c/$slug" params={{ slug }} aria-label="Voltar" className="grid h-10 w-10 place-items-center rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <strong className="text-[18px] tracking-tight">Créditos & Prêmios</strong>
        <button onClick={() => toast("Histórico de créditos")} aria-label="Histórico" className="grid h-10 w-10 place-items-center rounded-full">
          <History className="h-5 w-5" />
        </button>
      </header>

      <div className="mt-6 px-1">
        <h1 className="text-[32px] font-extrabold leading-[0.99] tracking-tight">
          Quanto mais
          <br />
          você participa,
          <br />
          mais você ganha.
        </h1>
        <p className="mt-2 text-[13px] opacity-55">Acumule créditos, desbloqueie benefícios e concorra a prêmios.</p>
      </div>

      <section className="relative mt-4 overflow-hidden rounded-[26px] bg-primary p-5 text-primary-foreground">
        <span className="pointer-events-none absolute -right-14 -top-11 h-36 w-36 rounded-full border border-black/15" />
        <small className="text-[9px] font-extrabold uppercase tracking-[0.1em]">Meu saldo</small>
        <strong className="mt-1 block text-[42px] leading-none tracking-tight">{balance.toLocaleString("pt-BR")}</strong>
        <span className="text-[11px] opacity-70">créditos disponíveis</span>
        <button
          onClick={() => toast("Abrindo carteira de créditos")}
          className="mt-4 flex items-center gap-1.5 rounded-[13px] bg-secondary px-3.5 py-2.5 text-[10px] font-extrabold text-secondary-foreground"
        >
          VER MINHA CARTEIRA <ArrowRight className="h-3 w-3" />
        </button>
      </section>

      <div className="mb-2.5 mt-5 flex items-center justify-between px-1">
        <h2 className="text-[15px] font-semibold tracking-tight">Ganhe mais créditos</h2>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {creditActions.filter((a) => a.id !== "indique" || settings.referrals).map((a) => (
          <button
            key={a.id}
          onClick={() => {
            if (a.id === "indique") {
              navigate({ to: "/c/$slug/indique", params: { slug } });
              return;
            }
            toast(`${a.title}: ${a.value}`);
          }}
            className="rounded-[18px] border border-white/10 bg-white/5 p-3.5 text-center"
          >
            <span className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-lg">{a.emoji}</span>
            <b className="block text-[10px]">{a.title}</b>
            <span className="text-[8px] opacity-55">{a.value}</span>
          </button>
        ))}
      </div>

      <div className="mb-2.5 mt-5 flex items-center justify-between px-1">
        <h2 className="text-[15px] font-semibold tracking-tight">Troque seus créditos</h2>
        <Link to="/c/$slug/beneficios" params={{ slug }} className="text-[10px] opacity-55">
          Ver benefícios
        </Link>
      </div>

      <div className="space-y-2.5">
        {rewards.map((r) => (
          <article key={r.id} className="flex items-center gap-3 rounded-[23px] bg-white p-4 text-black">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[17px] bg-[#efeee9] text-2xl">{r.emoji}</div>
            <div className="min-w-0 flex-1">
              <small className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-black/50">
                Recompensa · {r.cost} créditos
              </small>
              <h3 className="mt-1 text-[13px] font-bold">{r.title}</h3>
              <p className="text-[9px] text-black/55">{r.description}</p>
            </div>
            <button
              disabled={redeemed.includes(r.id)}
              onClick={() => redeem(r.id, r.title, r.cost)}
              className="shrink-0 rounded-xl bg-black px-3 py-2.5 text-[9px] font-extrabold text-white disabled:opacity-40"
            >
              {redeemed.includes(r.id) ? "RESGATADO" : "RESGATAR"}
            </button>
          </article>
        ))}
      </div>

      <div className="mb-2.5 mt-5 flex items-center justify-between px-1">
        <h2 className="text-[15px] font-semibold tracking-tight">Próximo prêmio</h2>
        <button onClick={() => toast("Regras do sorteio")} className="text-[10px] opacity-55">
          Como funciona?
        </button>
      </div>
      <div className="rounded-[21px] border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <b className="text-[12px]">{nextPrize.title}</b>
          <span className="text-[9px] opacity-55">
            {nextPrize.current.toLocaleString("pt-BR")} / {nextPrize.target.toLocaleString("pt-BR")} pts
          </span>
        </div>
        <div className="my-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[9px] opacity-55">
          <span>Você está quase lá!</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
