import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChevronLeft, History, ArrowRight, Sparkles, Lock, Coins, Check } from "lucide-react";
import { toast } from "sonner";
import { creditActions, rewards, nextPrize, useTenantCustomer, saveTenantCustomer } from "@/lib/customer";
import { usePublicSettings } from "@/lib/public-settings";
import { getMerchant } from "@/lib/merchants";
import { LeadCaptureModal } from "@/components/public/LeadCaptureModal";

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
  const merchant = getMerchant(slug);
  const { settings } = usePublicSettings(slug);
  const navigate = useNavigate();
  const { customer, isRegistered } = useTenantCustomer(slug);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [redeemed, setRedeemed] = useState<string[]>([]);

  const userCredits = customer?.credits ?? 0;
  const progress = Math.min(100, Math.round((userCredits / 1000) * 100));

  const redeem = (id: string, title: string, cost: number) => {
    if (!isRegistered) {
      setLeadModalOpen(true);
      return;
    }
    if (!customer) return;

    if (cost > customer.credits) {
      toast.error(`Você precisa de mais ${cost - customer.credits} créditos para resgatar este item.`);
      return;
    }
    const updated = {
      ...customer,
      credits: customer.credits - cost,
    };
    saveTenantCustomer(slug, updated);
    setRedeemed((r) => [...r, id]);
    toast.success(`🎉 ${title} resgatado com sucesso! Apresente no balcão.`);
  };

  return (
    <div className="min-h-screen bg-secondary px-5 pb-28 pt-7 text-secondary-foreground">
      <header className="flex items-center justify-between">
        <Link to="/c/$slug" params={{ slug }} aria-label="Voltar" className="grid h-10 w-10 place-items-center rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <strong className="text-[18px] tracking-tight">Créditos {merchant?.name}</strong>
        <button onClick={() => toast("Histórico de créditos da loja")} aria-label="Histórico" className="grid h-10 w-10 place-items-center rounded-full">
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
        <p className="mt-2 text-[13px] opacity-55">
          Créditos exclusivos para usar em {merchant?.name ?? "nosso estabelecimento"}.
        </p>
      </div>

      {/* Saldo de Créditos ou Banner de Cadastro */}
      {isRegistered && customer ? (
        <section className="relative mt-4 overflow-hidden rounded-[26px] bg-primary p-5 text-primary-foreground shadow-lg">
          <span className="pointer-events-none absolute -right-14 -top-11 h-36 w-36 rounded-full border border-black/15" />
          <div className="flex items-center justify-between">
            <small className="text-[10px] font-extrabold uppercase tracking-[0.1em]">
              Carteira de {customer.name.split(" ")[0]}
            </small>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-black text-secondary-foreground">
              Nível {customer.tier}
            </span>
          </div>
          <strong className="mt-1 block text-[42px] leading-none tracking-tight">
            {customer.credits.toLocaleString("pt-BR")}
          </strong>
          <span className="text-[11px] opacity-75">créditos disponíveis para resgate</span>
        </section>
      ) : (
        <section className="relative mt-4 overflow-hidden rounded-[26px] bg-gradient-to-br from-[#1c1917] to-[#0a0908] p-5 text-white border border-[#302a24] shadow-lg">
          <span className="pointer-events-none absolute -right-14 -top-11 h-36 w-36 rounded-full border border-white/10" />
          <div className="flex items-center gap-1.5 text-[#f4c95d] text-[11px] font-bold">
            <Lock className="h-3.5 w-3.5" /> CARTEIRA BLOQUEADA
          </div>
          <strong className="mt-2 block text-[24px] font-extrabold leading-tight tracking-tight">
            Cadastre-se e ganhe 100 créditos
          </strong>
          <p className="mt-1 text-[12.5px] opacity-70 leading-relaxed">
            Seus créditos ficam salvos exclusivamente para {merchant?.name}. Cadastre-se em 20 segundos.
          </p>
          <button
            onClick={() => setLeadModalOpen(true)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#f4c95d] py-3.5 text-[13px] font-black text-black shadow-md hover:bg-[#e0b54e]"
          >
            <Sparkles className="h-4 w-4" /> Cadastrar e Ativar (+100 créditos)
          </button>
        </section>
      )}

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
              if (!isRegistered) {
                setLeadModalOpen(true);
                return;
              }
              toast.success(`${a.title}: ${a.value} registrados na sua visita!`);
            }}
            className="rounded-[18px] border border-white/10 bg-white/5 p-3.5 text-center transition active:scale-95"
          >
            <span className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-lg">{a.emoji}</span>
            <b className="block text-[10px]">{a.title}</b>
            <span className="text-[8px] opacity-55">{a.value}</span>
          </button>
        ))}
      </div>

      <div className="mb-2.5 mt-5 flex items-center justify-between px-1">
        <h2 className="text-[15px] font-semibold tracking-tight">Troque seus créditos</h2>
      </div>

      <div className="space-y-2.5">
        {rewards.map((r) => {
          const hasRedeemed = redeemed.includes(r.id);
          return (
            <article key={r.id} className="flex items-center gap-3 rounded-[23px] bg-white p-4 text-black">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[17px] bg-[#efeee9] text-2xl">{r.emoji}</div>
              <div className="min-w-0 flex-1">
                <small className="text-[8.5px] font-extrabold uppercase tracking-[0.1em] opacity-50">{r.cost} créditos</small>
                <h3 className="text-[14.5px] font-semibold leading-tight">{r.title}</h3>
                <p className="text-[11px] opacity-60">{r.description}</p>
              </div>
              <button
                onClick={() => redeem(r.id, r.title, r.cost)}
                disabled={hasRedeemed}
                className={`shrink-0 rounded-[12px] px-3 py-2 text-[10px] font-extrabold uppercase transition active:scale-95 ${
                  hasRedeemed
                    ? "bg-muted text-muted-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {hasRedeemed ? "Resgatado ✓" : "Resgatar"}
              </button>
            </article>
          );
        })}
      </div>

      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        slug={slug}
        merchantName={merchant?.name ?? "o estabelecimento"}
      />
    </div>
  );
}
