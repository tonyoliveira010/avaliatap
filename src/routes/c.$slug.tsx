import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { getMerchant } from "@/lib/merchants";
import { CustomerNav } from "@/components/public/CustomerNav";

export const Route = createFileRoute("/c/$slug")({
  loader: ({ params }) => {
    const merchant = getMerchant(params.slug);
    if (!merchant) throw notFound();
    return { merchant };
  },
  component: CustomerLayout,
  errorComponent: () => (
    <div className="grid min-h-screen place-items-center bg-secondary px-8 text-center text-secondary-foreground">
      <p className="text-[15px]">Não foi possível carregar esta página agora.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-secondary px-8 text-center text-secondary-foreground">
      <div>
        <p className="text-[22px] font-extrabold tracking-tight">Estabelecimento não encontrado</p>
        <p className="mt-2 text-[13px] opacity-60">Confira o link da placa e tente novamente.</p>
      </div>
    </div>
  ),
});

function CustomerLayout() {
  return (
    <div className="relative">
      <Outlet />
      <CustomerNav />
    </div>
  );
}
