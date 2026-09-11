import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Bell } from "lucide-react";
import { toast } from "sonner";
import { featuredPoll, miniPolls } from "@/lib/customer";

export const Route = createFileRoute("/c/$slug/enquetes")({
  head: () => ({
    meta: [
      { title: "Enquetes · AvaliaTap" },
      { name: "description", content: "Participe das enquetes do estabelecimento e ajude a escolher as próximas novidades." },
      { property: "og:title", content: "Enquetes · AvaliaTap" },
      { property: "og:description", content: "Participe das enquetes e ajude a escolher as próximas novidades." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PollsPage,
});

function PollsPage() {
  const { slug } = Route.useParams();
  const [selected, setSelected] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);

  return (
    <div className="min-h-screen bg-secondary px-5 pb-28 pt-7 text-secondary-foreground">
      <header className="flex items-center justify-between">
        <Link to="/c/$slug" params={{ slug }} aria-label="Voltar" className="grid h-10 w-10 place-items-center rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <strong className="text-[19px] tracking-tight">Enquetes</strong>
        <button onClick={() => toast("Notificações")} aria-label="Notificações" className="grid h-10 w-10 place-items-center rounded-full">
          <Bell className="h-5 w-5" />
        </button>
      </header>

      <div className="mt-6 px-1">
        <h1 className="text-[33px] font-extrabold leading-[1] tracking-tight">
          Sua opinião
          <br />
          faz diferença.
        </h1>
        <p className="mt-2 text-[13.5px] opacity-55">
          Participe das enquetes e ajude a construir as próximas novidades.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <div className="rounded-[19px] border border-white/10 bg-white/5 p-4">
          <small className="text-[9px] font-extrabold uppercase tracking-[0.08em] opacity-50">Enquetes</small>
          <strong className="mt-1 block text-[23px] tracking-tight">04</strong>
          <span className="text-[10px] opacity-55">disponíveis</span>
        </div>
        <div className="rounded-[19px] border border-white/10 bg-white/5 p-4">
          <small className="text-[9px] font-extrabold uppercase tracking-[0.08em] opacity-50">Participações</small>
          <strong className="mt-1 block text-[23px] tracking-tight">+248</strong>
          <span className="text-[10px] opacity-55">clientes votaram</span>
        </div>
      </div>

      <div className="mb-2.5 mt-5 flex items-center justify-between px-1">
        <h2 className="text-[16px] font-semibold tracking-tight">Enquete em destaque</h2>
      </div>

      <article className="rounded-[25px] bg-white p-5 text-black">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-black px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-white">
            {featuredPoll.badge}
          </span>
          <span className="text-[10px] font-bold text-black/50">{featuredPoll.deadline}</span>
        </div>
        <h3 className="text-[20px] font-extrabold leading-[1.05] tracking-tight">{featuredPoll.question}</h3>
        <p className="mt-1.5 text-[11px] text-black/55">{featuredPoll.description}</p>

        <div className="mt-3 space-y-2">
          {featuredPoll.options.map((o) => {
            const isSelected = selected === o.id;
            return (
              <button
                key={o.id}
                onClick={() => !voted && setSelected(o.id)}
                className="relative flex w-full items-center gap-2.5 overflow-hidden rounded-[14px] border border-black/10 bg-[#f6f5f3] p-3 text-left"
              >
                <span
                  className="absolute inset-y-0 left-0 bg-black/10 transition-[width] duration-300"
                  style={{ width: voted ? `${o.percent}%` : 0 }}
                />
                <span
                  className={`relative grid h-[17px] w-[17px] shrink-0 place-items-center rounded-full border-[1.5px] ${
                    isSelected ? "border-black" : "border-black/40"
                  }`}
                >
                  {isSelected ? <span className="h-[7px] w-[7px] rounded-full bg-black" /> : null}
                </span>
                <span className="relative flex-1 text-[12px] font-bold">{o.label}</span>
                <span className="relative text-[10px] font-extrabold text-black/55">
                  {voted ? (isSelected ? "Você" : `${o.percent}%`) : `${o.percent}%`}
                </span>
              </button>
            );
          })}
        </div>

        <button
          disabled={!selected || voted}
          onClick={() => {
            setVoted(true);
            toast("Obrigado por participar! 🎉");
          }}
          className="mt-3 w-full rounded-[14px] bg-black py-3.5 text-[12px] font-extrabold text-white disabled:opacity-30"
        >
          {voted ? "VOTO REGISTRADO ✓" : "VOTAR"}
        </button>
      </article>

      <div className="mb-2.5 mt-5 flex items-center justify-between px-1">
        <h2 className="text-[16px] font-semibold tracking-tight">Participe também</h2>
      </div>

      <div className="space-y-2.5">
        {miniPolls.map((p) => (
          <article key={p.id} className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/5 p-3.5">
            <div className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[15px] bg-primary text-[22px] text-primary-foreground">
              {p.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <small className="text-[9px] font-extrabold uppercase tracking-[0.08em] opacity-50">{p.tag}</small>
              <h4 className="mt-1 text-[13px] font-semibold">{p.title}</h4>
              <p className="text-[10px] opacity-55">{p.description}</p>
            </div>
            <button
              onClick={() => toast("Enquete aberta!")}
              className="shrink-0 rounded-xl bg-white px-3 py-2.5 text-[10px] font-extrabold text-black active:scale-95"
            >
              Responder
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
