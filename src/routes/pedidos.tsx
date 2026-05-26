import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ActiveOrderCard } from "@/components/dashboard/ActiveOrderCard";
import { mockOrders } from "@/lib/mock-orders";
import { Filter, Search } from "lucide-react";

export const Route = createFileRoute("/pedidos")({
  head: () => ({ meta: [{ title: "Pedidos · Tambor" }] }),
  component: OrdersPage,
});

type Tab = "active" | "completed";

// Ordem solicitada: entrega → em uso → finalizado → retirada
const sortRank: Record<string, number> = {
  in_delivery: 0,
  active: 1,
  near_expiration: 1,
  completed: 2,
  pickup_requested: 3,
};

function OrdersPage() {
  const [tab, setTab] = useState<Tab>("active");
  const list = mockOrders
    .filter((o) => (tab === "active" ? o.status !== "completed" : o.status === "completed"))
    .sort((a, b) => (sortRank[a.status] ?? 9) - (sortRank[b.status] ?? 9));

  return (
    <>
      <PageHeader
        title="Pedidos"
        subtitle={`${list.length} ${tab === "active" ? "em andamento" : "finalizados"}`}
        right={
          <button className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center active:scale-95">
            <Filter className="h-4 w-4 text-foreground" />
          </button>
        }
      />

      <div className="px-5">
        <div className="rounded-2xl bg-surface border border-border px-3.5 py-2.5 flex items-center gap-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Buscar por ID, endereço ou material"
            className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Segmented control */}
      <div className="px-5 mt-4">
        <div className="inline-flex bg-muted rounded-full p-1 w-full">
          {(["active", "completed"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-[12px] font-semibold rounded-full transition-all ${
                tab === t
                  ? "bg-surface text-foreground shadow-soft"
                  : "text-muted-foreground"
              }`}
            >
              {t === "active" ? "Ativos" : "Finalizados"}
            </button>
          ))}
        </div>
      </div>

      <section className="px-5 mt-4 space-y-3">
        {list.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-[13px]">
            Nenhum pedido aqui ainda.
          </div>
        ) : (
          list.map((o) => <ActiveOrderCard key={o.id} order={o} />)
        )}
      </section>
    </>
  );
}
