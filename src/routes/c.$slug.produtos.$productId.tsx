import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Minus, Plus, Sparkles, Leaf, Star } from "lucide-react";
import { toast } from "sonner";
import { getMerchant } from "@/lib/merchants";
import { getProduct, useCatalogProducts, packs, plans, brl } from "@/lib/products";
import { CartButton, useCart } from "@/components/public/CartProvider";

export const Route = createFileRoute("/c/$slug/produtos/$productId")({
  loader: ({ params }) => ({ product: getProduct(params.slug, params.productId) }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Produto não encontrado · AvaliaTap" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    if (!product) return { meta: [{ title: "Produto · AvaliaTap" }, { name: "description", content: "Detalhes da vitrine do comércio." }, { property: "og:title", content: "Produto · AvaliaTap" }, { property: "og:description", content: "Detalhes da vitrine do comércio." }, { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary" }] };
    const title = `${product.name} · AvaliaTap`;
    return {
      meta: [
        { title },
        { name: "description", content: product.desc },
        { property: "og:title", content: title },
        { property: "og:description", content: product.desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background px-8 text-center text-foreground">
      <p className="text-[15px]">Produto não encontrado.</p>
    </div>
  ),
});

function ProductDetail() {
  const { slug, productId } = Route.useParams();
  const catalogProducts = useCatalogProducts(slug);
  const product = catalogProducts.find((item) => item.id === productId) || getProduct(slug, productId);
  const merchant = getMerchant(slug);
  const cart = useCart();

  const [pack, setPack] = useState(packs[0]);
  const [plan, setPlan] = useState(plans[1]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const unitPrice = (product?.price ?? 0) * pack.mult * plan.discount;
  const savePct = product?.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  const addToCart = () => {
    if (!product) return;
    cart.add({
      key: `${product.id}_${pack.id}_${plan.id}`,
      name: product.name,
      packName: pack.name,
      planName: plan.name,
      emoji: product.emoji,
      unitPrice,
      qty,
    });
    setAdded(true);
    toast(`${qty}x ${product.name} adicionado ao carrinho`);
    setTimeout(() => setAdded(false), 1200);
    setQty(1);
  };

  if (!product) return <div className="min-h-screen bg-background p-6 text-foreground"><p>Produto indisponível.</p><Link to="/c/$slug/produtos" params={{ slug }} className="mt-4 inline-block underline">Voltar aos produtos</Link></div>;

  return (
    <div className="flex min-h-screen flex-col bg-background pb-28">
      <p className="bg-secondary py-2 text-center text-[12px] font-bold text-secondary-foreground">
        {product.shipping ?? "Confira a disponibilidade com o estabelecimento"}
      </p>

      <header className="flex items-center justify-between px-4 py-3">
        <Link
          to="/c/$slug/produtos"
          params={{ slug }}
          className="flex items-center gap-1 text-[13px] font-bold text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Voltar
        </Link>
        <span className="text-[14px] font-extrabold tracking-tight text-foreground">
          {merchant?.name ?? "Loja"}
        </span>
        <CartButton />
      </header>

      {product.promo && <p className="mx-4 rounded-xl bg-primary-soft px-3 py-2.5 text-[12px] font-bold text-foreground">{product.promo}</p>}

      <div className="relative mx-4 mt-4 grid h-56 place-items-center overflow-hidden rounded-[22px] bg-primary-soft text-[86px]">
        {product.emoji}
        {product.badge && (
          <span className="absolute right-3.5 top-3.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-extrabold text-primary-foreground">
            {product.badge}
          </span>
        )}
      </div>

      <div className="px-4 pt-5">
        {product.rating && <div className="mb-2 flex items-center gap-2 text-[13px] text-foreground">
          <Star className="h-4 w-4 fill-primary text-primary" />
           <span className="font-bold">{product.rating?.toFixed(1)}/5</span>
          <span className="text-muted-foreground">| {product.reviews}</span>
        </div>}

        <h1 className="text-[23px] font-extrabold tracking-tight text-foreground">{product.name}</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{product.desc}</p>

        <div className="mt-4 flex gap-3">
          {(product.features ?? []).map((f, i) => (
            <div key={f} className="flex flex-1 items-center gap-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft">
                {i === 0 ? <Sparkles className="h-4 w-4 text-foreground" /> : <Leaf className="h-4 w-4 text-foreground" />}
              </span>
              <span className="text-[12px] font-bold text-foreground">{f}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2.5">
          <span className="text-[23px] font-extrabold text-foreground">{brl(product.price)}</span>
          {product.oldPrice && (
            <span className="text-[14px] text-muted-foreground line-through">{brl(product.oldPrice)}</span>
          )}
          {savePct && (
            <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-extrabold text-foreground">
              Economize {savePct}%
            </span>
          )}
        </div>

        {product.kind !== "Serviço" && <><h3 className="mb-3 mt-6 text-[14px] font-bold text-foreground">1. Escolha o pacote</h3>
        <div className="grid grid-cols-3 gap-2">
          {packs.map((p) => {
            const selected = p.id === pack.id;
            return (
              <button
                key={p.id}
                onClick={() => setPack(p)}
                className={`relative rounded-2xl border-[1.5px] px-1.5 pb-3 pt-4 text-center ${
                  selected ? "border-primary bg-primary-soft" : "border-border bg-surface"
                }`}
              >
                {p.tag && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-secondary px-2 py-0.5 text-[8.5px] font-extrabold text-secondary-foreground">
                    {p.tag}
                  </span>
                )}
                <div className="mx-auto mb-1.5 text-2xl">{product.emoji}</div>
                <div className="text-[12px] font-bold text-foreground">{p.name}</div>
                <div className="text-[11px] text-muted-foreground">{brl(product.price * p.mult)}</div>
                  {p.save && (
                   <span className="mt-1.5 inline-block rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-extrabold text-primary-foreground">
                    {p.save}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <h3 className="mb-3 mt-6 text-[14px] font-bold text-foreground">2. Escolha o plano</h3>
        <div className="space-y-2.5">
          {plans.map((p) => {
            const selected = p.id === plan.id;
            const basePrice = product.price * pack.mult;
            return (
              <button
                key={p.id}
                onClick={() => setPlan(p)}
                className={`flex w-full items-start gap-3 rounded-[16px] border-[1.5px] p-3.5 text-left ${
                  selected ? "border-primary bg-primary-soft" : "border-border bg-surface"
                }`}
              >
                <span
                  className={`relative mt-0.5 h-[19px] w-[19px] shrink-0 rounded-full border-2 ${
                    selected ? "border-primary" : "border-border"
                  }`}
                >
                  {selected && <span className="absolute inset-[3px] rounded-full bg-primary" />}
                </span>
                <span className="flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <b className="text-[13.5px] text-foreground">{p.name}</b>
                    {p.badge && (
                       <span className="rounded-full bg-primary px-2 py-0.5 text-[9.5px] font-extrabold text-primary-foreground">
                        {p.badge}
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-[12.5px] text-muted-foreground">
                    {p.desc} —{" "}
                    {p.discount < 1 && (
                      <span className="mr-1 line-through opacity-60">{brl(basePrice)}</span>
                    )}
                    <b className="text-foreground">{brl(basePrice * p.discount)}</b>
                  </span>
                  {p.id === "subscribe" && selected && (
                    <span className="mt-2 flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-[12px] font-semibold text-foreground">
                      <span>Entrega a cada</span>
                      <span>45 dias</span>
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div></>}

        <div className="mt-6 flex items-center justify-between">
          <span className="text-[14px] font-bold text-foreground">Quantidade</span>
          <div className="flex items-center gap-3 rounded-full bg-muted px-2 py-1.5">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Diminuir quantidade"
              className="grid h-7 w-7 place-items-center rounded-full bg-surface text-foreground shadow-soft"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-4 text-center text-[14px] font-extrabold text-foreground">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              aria-label="Aumentar quantidade"
              className="grid h-7 w-7 place-items-center rounded-full bg-surface text-foreground shadow-soft"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-[430px] items-center gap-3 border-t border-border bg-background px-4 pb-4 pt-3">
        <div>
          <p className="text-[9.5px] font-bold uppercase tracking-[0.05em] text-muted-foreground">Total</p>
          <p className="text-[16px] font-extrabold text-foreground">{brl(unitPrice * qty)}</p>
        </div>
        <button
          onClick={addToCart}
          className={`flex-1 rounded-[14px] py-4 text-[14px] font-extrabold transition ${
            added ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          {added ? "Adicionado ✓" : "Adicionar ao carrinho"}
        </button>
      </div>
    </div>
  );
}
