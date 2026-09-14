import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ChevronLeft, Crown, Gift, Scissors, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import { getMerchant } from "@/lib/merchants";

export const Route = createFileRoute("/c/$slug/clube")({
  head: () => ({
    meta: [
      { title: "Clube de fidelidade · AvaliaTap" },
      {
        name: "description",
        content: "Programa de fidelidade premium: acumule selos, suba de nível e desbloqueie benefícios exclusivos.",
      },
      { property: "og:title", content: "Clube de fidelidade · AvaliaTap" },
      { property: "og:description", content: "Acumule selos, suba de nível e ganhe benefícios exclusivos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ClubPage,
});

const tiers = [
  {
    id: "bronze",
    name: "Bronze",
    requirement: "A partir da 1ª visita",
    icon: Star,
    perks: ["10% OFF de boas-vindas", "Cupom de aniversário"],
  },
  {
    id: "prata",
    name: "Prata",
    requirement: "A partir de 5 visitas",
    icon: Sparkles,
    perks: ["Todos os do Bronze", "Bebida cortesia", "Prioridade no agendamento"],
  },
  {
    id: "ouro",
    name: "Ouro Premium",
    requirement: "A partir de 10 visitas",
    icon: Crown,
    perks: ["Todos os do Prata", "Um serviço grátis por mês", "Convites para eventos fechados"],
  },
];

const steps = [
  ["1", "Entre no clube", "Cadastro em um toque, sem app e sem cartão."],
  ["2", "Acumule selos", "Cada visita registrada vale um selo no seu cartão digital."],
  ["3", "Suba de nível", "Quanto mais você volta, melhores ficam os seus benefícios."],
  ["4", "Resgate quando quiser", "Mostre seu nível no balcão e aproveite na hora."],
];

const stampGoal = 6;
const storageKey = "avaliatap-clube";

function ClubPage() {
  const { slug } = Route.useParams();
  const merchant = getMerchant(slug);
  const [joined, setJoined] = useState(false);
  const [stamps, setStamps] = useState(3);

  useEffect(() => {
    const saved = window.localStorage.getItem(`${storageKey}-${slug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { joined: boolean; stamps: number };
        setJoined(parsed.joined);
        setStamps(parsed.stamps);
      } catch {
        window.localStorage.removeItem(`${storageKey}-${slug}`);
      }
    }
  }, [slug]);

  const persist = (next: { joined: boolean; stamps: number }) => {
    setJoined(next.joined);
    setStamps(next.stamps);
    window.localStorage.setItem(`${storageKey}-${slug}`, JSON.stringify(next));
  };

  const currentTier = stamps >= 10 ? tiers[2] : stamps >= 5 ? tiers[1] : tiers[0];
  const remaining = Math.max(stampGoal - stamps, 0);

  return (
    <div className="min-h-screen bg-secondary px-5 pb-28 pt-7 text-secondary-foreground">
      <header className="flex items-center gap-3">
        <Link
          to="/c/$slug"
          params={{ slug }}
          aria-label="Voltar"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/5"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] opacity-55">
          Programa de fidelidade
        </span>
      </header>

      <section className="relative mt-4 overflow-hidden rounded-[26px] bg-primary p-6 text-primary-foreground">
        <span className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full border-[28px] border-white/30" />
        <span className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-secondary-foreground">
          <Crown className="h-3 w-3" /> Clube {merchant?.name.split(" ").slice(-1)[0] ?? "Premium"}
        </span>
        <h1 className="relative z-10 mt-4 max-w-[280px] text-[29px] font-extrabold leading-[1.03] tracking-tight">
          Quem volta sempre merece mais.
        </h1>
        <p className="relative z-10 mt-2 max-w-[275px] text-[13px] opacity-70">
          Um clube exclusivo para clientes de casa: selos a cada visita, níveis e benefícios que crescem com você.
        </p>
      </section>

      <section className="mt-3 rounded-[24px] border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <small className="text-[9px] font-extrabold uppercase tracking-[0.1em] opacity-50">Seu cartão digital</small>
            <p className="mt-1 text-[15px] font-bold">Nível {currentTier.name}</p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <currentTier.icon className="h-5 w-5" />
          </span>
        </div>

        <div className="mt-4 grid grid-cols-6 gap-2">
          {Array.from({ length: stampGoal }).map((_, i) => (
            <span
              key={i}
              className={`grid aspect-square place-items-center rounded-2xl border ${
                i < stamps ? "border-primary bg-primary text-primary-foreground" : "border-white/10 bg-white/5 opacity-45"
              }`}
            >
              {i < stamps ? <Check className="h-4 w-4" /> : <Scissors className="h-4 w-4" />}
            </span>
          ))}
        </div>

        <p className="mt-3 text-[12px] opacity-60">
          {remaining === 0
            ? "Cartão completo! Fale com a equipe e resgate seu serviço cortesia."
            : `Faltam ${remaining} ${remaining === 1 ? "selo" : "selos"} para o próximo serviço por nossa conta.`}
        </p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              if (joined) {
                toast("Você já faz parte do clube.");
                return;
              }
              persist({ joined: true, stamps });
              toast("Bem-vindo ao clube! 🎉");
            }}
            className={`flex-1 rounded-[15px] py-3.5 text-[12px] font-extrabold ${
              joined ? "bg-white/10 opacity-60" : "bg-primary text-primary-foreground"
            }`}
          >
            {joined ? "VOCÊ JÁ É MEMBRO" : "ENTRAR NO CLUBE"}
          </button>
          <button
            onClick={() => {
              persist({ joined: true, stamps: Math.min(stamps + 1, stampGoal) });
              toast("Selo registrado nesta visita.");
            }}
            className="rounded-[15px] bg-white/10 px-4 text-[12px] font-extrabold"
          >
            + Selo
          </button>
        </div>
      </section>

      <h2 className="mb-3 mt-6 text-[16px] font-bold">Como funciona</h2>
      <div className="space-y-2">
        {steps.map((s) => (
          <div key={s[0]} className="flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/5 p-3.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 text-[13px] font-extrabold text-primary">
              {s[0]}
            </span>
            <div>
              <b className="text-[13px]">{s[1]}</b>
              <p className="text-[11px] opacity-50">{s[2]}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-6 text-[16px] font-bold">Níveis do clube</h2>
      <div className="space-y-2.5">
        {tiers.map((tier) => {
          const active = tier.id === currentTier.id;
          return (
            <article
              key={tier.id}
              className={`rounded-[22px] border p-4 ${
                active ? "border-primary bg-primary/10" : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10">
                  <tier.icon className="h-4.5 w-4.5 text-primary" />
                </span>
                <div className="flex-1">
                  <b className="text-[14px]">{tier.name}</b>
                  <p className="text-[11px] opacity-50">{tier.requirement}</p>
                </div>
                {active && (
                  <span className="rounded-full bg-primary px-2.5 py-1 text-[9px] font-extrabold text-primary-foreground">
                    SEU NÍVEL
                  </span>
                )}
              </div>
              <ul className="mt-3 space-y-1.5">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-[12px] opacity-75">
                    <Check className="h-3.5 w-3.5 text-primary" /> {perk}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-[22px] bg-white/5 p-4">
        <Gift className="h-5 w-5 shrink-0 text-primary" />
        <p className="text-[12px] opacity-65">
          Membros do clube recebem primeiro os cupons e as novidades de {merchant?.name ?? "nossa casa"}.
        </p>
      </div>

      <Link
        to="/c/$slug/beneficios"
        params={{ slug }}
        className="mt-4 flex items-center justify-center rounded-2xl bg-primary py-4 text-[13.5px] font-extrabold text-primary-foreground"
      >
        Ver meus benefícios
      </Link>
    </div>
  );
}
