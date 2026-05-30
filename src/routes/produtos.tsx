import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Minus, Plus, ShoppingCart, Check, Truck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { products, productCategories, type Product } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos · Tambor" },
      {
        name: "description",
        content:
          "Compre sacos de entulho, EPI, lonas e produtos para complementar sua obra.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [cat, setCat] = useState<Product["category"]>("sacos");
  const [cart, setCart] = useState<Record<string, number>>({});

  const list = useMemo(() => products.filter((p) => p.category === cat), [cat]);
  const itemsCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = useMemo(
    () =>
      Object.entries(cart).reduce((sum, [id, q]) => {
        const p = products.find((x) => x.id === id);
        return sum + (p ? p.price * q : 0);
      }, 0),
    [cart],
  );
  const pix = Math.round(total * 0.8);

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const remove = (id: string) =>
    setCart((c) => {
      const next = { ...c };
      const v = (next[id] ?? 0) - 1;
      if (v <= 0) delete next[id];
      else next[id] = v;
      return next;
    });

  return (
    <>
      <PageHeader
        title="Produtos"
        subtitle="Sacos de entulho e itens para sua obra"
        right={
          <Link
            to="/"
            className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center active:scale-95"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </Link>
        }
      />

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-1">
        {productCategories.map((c) => {
          const active = c.id === cat;
          return (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors ${
                active
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-surface border border-border text-muted-foreground"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Product list */}
      <section className="px-5 mt-4 space-y-2.5">
        {list.map((p) => {
          const qty = cart[p.id] ?? 0;
          return (
            <motion.div
              key={p.id}
              layout
              className="rounded-2xl border border-border bg-surface p-3.5 flex gap-3 items-center shadow-soft"
            >
              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <p.icon className="h-5 w-5 text-primary" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[13.5px] font-semibold text-foreground">{p.name}</p>
                  {p.highlight && (
                    <span className="rounded-full bg-success/15 text-success px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                      {p.highlight}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                  {p.desc}
                </p>
                <p className="text-[13px] font-bold text-foreground mt-1 tabular-nums">
                  R$ {p.price}
                  <span className="text-[10px] font-medium text-muted-foreground">/{p.unit}</span>
                </p>
              </div>
              {qty === 0 ? (
                <button
                  onClick={() => add(p.id)}
                  className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center active:scale-95 shrink-0"
                  aria-label="Adicionar"
                >
                  <Plus className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5 rounded-xl bg-background/60 border border-border p-1 shrink-0">
                  <button
                    onClick={() => remove(p.id)}
                    className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center active:scale-95"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[13px] font-semibold tabular-nums w-5 text-center">{qty}</span>
                  <button
                    onClick={() => add(p.id)}
                    className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center active:scale-95"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </section>

      {/* Sticky cart bar */}
      <AnimatePresence>
        {itemsCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-[92px] inset-x-0 z-30 px-5 max-w-md mx-auto"
          >
            <div className="rounded-2xl bg-surface border border-border shadow-elegant p-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center relative shrink-0">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                  {itemsCount}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-foreground tabular-nums leading-none">
                  R$ {total}
                </p>
                <p className="text-[10.5px] text-success font-semibold mt-0.5">
                  PIX à vista: R$ {pix}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  toast.success("Pedido de produtos enviado!", {
                    description: `${itemsCount} item(ns) · entrega junto ao próximo tambor.`,
                  });
                  setCart({});
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 font-semibold text-[12.5px] shadow-glow"
              >
                <Truck className="h-3.5 w-3.5" />
                Finalizar
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5 mt-5 flex items-center gap-2 text-[11px] text-muted-foreground">
        <Check className="h-3.5 w-3.5 text-success shrink-0" />
        Entrega gratuita junto ao seu próximo tambor · economize em pacotes.
      </div>
    </>
  );
}
