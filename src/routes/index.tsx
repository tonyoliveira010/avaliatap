import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { HeroScroller } from "@/components/dashboard/HeroScroller";
import { QuickCategories } from "@/components/dashboard/QuickCategories";
import { ActiveOrderCard } from "@/components/dashboard/ActiveOrderCard";
import { RequestModal } from "@/components/dashboard/RequestModal";
import { PhotoChecklistModal } from "@/components/dashboard/PhotoChecklistModal";
import { mockOrders } from "@/lib/mock-orders";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tambor · Descarte inteligente para pequenas obras" },
      { name: "description", content: "Solicite tambores, acompanhe retiradas e organize sua obra de forma simples." },
    ],
  }),
  component: Home,
});

function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const active = mockOrders.filter((o) => o.status !== "completed").slice(0, 2);
  const focusOrder = active[0];
  const focusDrum = focusOrder?.drums.find((d) => !d.photoToday) ?? focusOrder?.drums[0] ?? null;

  return (
    <>
      <Header />

      <HeroScroller
        onRequest={() => setModalOpen(true)}
        onPhoto={() => setPhotoOpen(true)}
        order={focusOrder}
      />

      <QuickCategories />

      <section className="px-5 mt-7">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-semibold text-foreground">Pedidos ativos</h3>
          <Link to="/pedidos" className="text-[12px] text-primary font-medium">
            Ver todos
          </Link>
        </div>
        <div className="space-y-3">
          {active.map((o) => (
            <ActiveOrderCard key={o.id} order={o} />
          ))}
        </div>
      </section>

      <RequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <PhotoChecklistModal
        open={photoOpen}
        onClose={() => setPhotoOpen(false)}
        drum={focusDrum}
        orderId={focusOrder?.id ?? ""}
      />
    </>
  );
}
