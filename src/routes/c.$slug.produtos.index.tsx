import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { getMerchant } from "@/lib/merchants";
import { useCatalogProducts, brl } from "@/lib/products";
import { CartButton } from "@/components/public/CartProvider";

export const Route = createFileRoute("/c/$slug/produtos/")({
  head: () => ({
    meta: [
      { title: "Produtos da loja · AvaliaTap" },
      { name: "description", content: "Compre os produtos do estabelecimento e finalize o pedido no WhatsApp." },
      { property: "og:title", content: "Produtos da loja · AvaliaTap" },
      { property: "og:description", content: "Compre os produtos do estabelecimento e finalize o pedido no WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { slug } = Route.useParams();
  const merchant = getMerchant(slug);
  const products = useCatalogProducts(slug);

  return (
    <div className="min-h-screen bg-background px-5 pb-28 pt-7">
      <header className="flex items-center justify-between">
        <Link to="/c/$slug" params={{ slug }} aria-label="Voltar" className="grid h-10 w-10 place-items-center rounded-full text-foreground">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <strong className="text-[19px] tracking-tight text-foreground">Produtos</strong>
        <CartButton />
      </header>

      <h1 className="mt-6 px-1 text-[30px] font-extrabold leading-[1.03] tracking-tight text-foreground">
        A loja de {merchant?.name ?? "nossa casa"}.
      </h1>
      <p className="mt-2 px-1 text-[13.5px] text-muted-foreground">
        Escolha, monte seu pacote e finalize direto no WhatsApp.
      </p>

      <div className="mt-6 grid gap-3">
        {products.map((p) => (
          <Link
            key={p.id}
            to="/c/$slug/produtos/$productId"
            params={{ slug, productId: p.id }}
            className="flex items-center gap-3 rounded-[22px] border border-border bg-surface p-3"
          >
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-primary-soft text-3xl">
              {p.emoji}
            </div>
            <div className="min-w-0 flex-1">
              {p.badge && (
                <small className="text-[9px] font-extrabold uppercase tracking-[0.09em] text-muted-foreground">
                  {p.badge}
                </small>
              )}
               <h2 className="mt-1 text-[15px] font-semibold text-foreground">{p.name}</h2>
              <p className="line-clamp-2 text-[11.5px] text-muted-foreground">{p.desc}</p>
              <p className="mt-1.5 text-[14px] font-extrabold text-foreground">
                {brl(p.price)}{" "}
                {p.oldPrice && (
                  <span className="text-[11px] font-medium text-muted-foreground line-through">
                    {brl(p.oldPrice)}
                  </span>
                )}
              </p>
            </div>
          </Link>
        ))}
        {products.length === 0 && (
          <p className="rounded-3xl bg-muted p-6 text-center text-[13px] text-muted-foreground">
            Nenhum produto cadastrado ainda.
          </p>
        )}
      </div>
    </div>
  );
}
