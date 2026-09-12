import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Bell } from "lucide-react";
import { toast } from "sonner";
import { getMerchant } from "@/lib/merchants";
import { customerCoupons } from "@/lib/products";
import { ScratchCoupon } from "@/components/public/ScratchCoupon";

export const Route = createFileRoute("/c/$slug/cupons")({
  head: () => ({
    meta: [
      { title: "Meus cupons · AvaliaTap" },
      { name: "description", content: "Raspe e descubra seu cupom, e acompanhe os benefícios já resgatados." },
      { property: "og:title", content: "Meus cupons · AvaliaTap" },
      { property: "og:description", content: "Raspe e descubra seu cupom, e acompanhe os benefícios já resgatados." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CouponsPage,
});

function CouponsPage() {
  const { slug } = Route.useParams();
  const merchant = getMerchant(slug);

  return (
    <div className="min-h-screen bg-secondary px-5 pb-28 pt-7 text-secondary-foreground">
      <header className="flex items-center justify-between">
        <Link to="/c/$slug" params={{ slug }} aria-label="Voltar" className="grid h-10 w-10 place-items-center rounded-full">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <strong className="text-[19px] tracking-tight">Cupom</strong>
        <button onClick={() => toast("Notificações")} aria-label="Notificações" className="grid h-10 w-10 place-items-center rounded-full">
          <Bell className="h-5 w-5" />
        </button>
      </header>

      <div className="mt-6 px-1 text-center">
        <h1 className="text-[29px] font-extrabold leading-[1.05] tracking-tight">
          Tem uma surpresa
          <br />
          esperando por você 🎁
        </h1>
        <p className="mt-2 text-[13.5px] opacity-55">Raspe a área abaixo e descubra seu benefício.</p>
      </div>

      <div className="mt-5">
        <ScratchCoupon
          discount={merchant?.campaign.discount ?? "20% OFF"}
          code={merchant?.campaign.code ?? "BEMVINDO20"}
          rules={merchant?.campaign.rules ?? "Apresente o código no estabelecimento."}
        />
      </div>

      <div className="mb-3 mt-7 flex items-center justify-between px-1">
        <h2 className="text-[17px] font-semibold tracking-tight">Seus cupons</h2>
        <button onClick={() => toast("Todos os cupons")} className="text-[12px] opacity-55">
          Ver todos
        </button>
      </div>

      <div className="grid gap-2.5">
        {customerCoupons.map((c) => (
          <article key={c.id} className="flex min-h-[80px] items-center gap-3 rounded-[20px] border border-white/10 bg-white/5 p-3">
            <div className={`grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl text-2xl ${c.status === "Disponível" ? "bg-[#b8ff72]" : "bg-[#4d83ff]"}`}>
              {c.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <small className="text-[9px] font-extrabold uppercase tracking-[0.09em] opacity-50">{c.tag}</small>
              <h4 className="mt-1 text-[13.5px] font-semibold">{c.title}</h4>
              <p className="truncate text-[11px] opacity-55">{c.description}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1.5 text-[10px] font-extrabold ${
                c.status === "Disponível" ? "bg-[#b8ff72]/15 text-[#b8ff72]" : "bg-white/10 opacity-60"
              }`}
            >
              {c.status}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
