import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Minus, Plus, ShoppingCart, X, CreditCard, QrCode } from "lucide-react";
import { brl } from "@/lib/products";
import { defaultMerchantSlug } from "@/lib/merchants";
import { InfinitePayCheckoutModal } from "@/components/public/InfinitePayCheckoutModal";

export type CartItem = {
  key: string;
  name: string;
  packName: string;
  planName: string;
  emoji: string;
  unitPrice: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "key"> & { key: string }) => void;
  changeQty: (key: string, delta: number) => void;
  remove: (key: string) => void;
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}

export function CartProvider({
  children,
  merchantName,
  whatsappNumber,
}: {
  children: ReactNode;
  merchantName: string;
  whatsappNumber: string;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [infinitePayOpen, setInfinitePayOpen] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const storageKey = `avaliatap-cart-${whatsappNumber}`;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setItems(parsed as CartItem[]);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setStorageReady(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey, storageReady]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    return {
      items,
      count,
      subtotal,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add: (item) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.key === item.key);
          if (existing) {
            return prev.map((i) => (i.key === item.key ? { ...i, qty: i.qty + item.qty } : i));
          }
          return [...prev, item];
        }),
      changeQty: (key, delta) =>
        setItems((prev) =>
          prev
            .map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i))
            .filter((i) => i.qty > 0),
        ),
      remove: (key) => setItems((prev) => prev.filter((i) => i.key !== key)),
    };
  }, [items, isOpen]);

  const checkout = () => {
    if (items.length === 0) return;
    let msg = `Olá! Gostaria de finalizar meu pedido na *${merchantName}*:\n\n`;
    items.forEach((i) => {
      msg += `• ${i.qty}x ${i.name} (${i.packName} — ${i.planName}) — ${brl(i.unitPrice * i.qty)}\n`;
    });
    msg += `\n*Total: ${brl(value.subtotal)}*\n\nAguardo a confirmação, obrigado!`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[88vh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[24px] bg-background"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="text-[17px] font-extrabold text-foreground">Seu carrinho</h3>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Fechar carrinho"
                className="grid h-8 w-8 place-items-center rounded-full bg-muted text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              {items.length === 0 ? (
                <p className="py-12 text-center text-[13px] text-muted-foreground">
                  Seu carrinho está vazio.
                </p>
              ) : (
                items.map((item) => (
                  <div key={item.key} className="flex items-center gap-3 border-b border-border py-3 last:border-b-0">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary text-xl">
                      {item.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-foreground">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.packName} · {item.planName}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <button
                          onClick={() => value.changeQty(item.key, -1)}
                          aria-label="Diminuir"
                          className="grid h-6 w-6 place-items-center rounded-full border border-border text-foreground"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-4 text-center text-[12px] font-bold text-foreground">{item.qty}</span>
                        <button
                          onClick={() => value.changeQty(item.key, 1)}
                          aria-label="Aumentar"
                          className="grid h-6 w-6 place-items-center rounded-full border border-border text-foreground"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => value.remove(item.key)}
                          className="ml-2 text-[11px] font-bold text-destructive"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                    <span className="shrink-0 text-[13px] font-extrabold text-foreground">
                      {brl(item.unitPrice * item.qty)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-border px-5 pb-6 pt-4 space-y-2">
              <div className="mb-2 flex justify-between text-[14px] font-bold text-foreground">
                <span>Subtotal</span>
                <span>{brl(value.subtotal)}</span>
              </div>
              <button
                disabled={items.length === 0}
                onClick={() => setInfinitePayOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-[14px] font-black text-black hover:bg-emerald-400 active:scale-95 transition shadow-sm disabled:opacity-40"
              >
                <span className="font-extrabold text-base">∞</span>
                Pagar com InfinitePay (Pix / 12x)
              </button>
              <button
                disabled={items.length === 0}
                onClick={checkout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3 text-[13px] font-bold text-white hover:opacity-90 transition active:scale-95 disabled:opacity-40"
              >
                <ShoppingCart className="h-4 w-4" />
                Finalizar pedido no WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {infinitePayOpen && items.length > 0 && (
        <InfinitePayCheckoutModal
          isOpen={infinitePayOpen}
          onClose={() => setInfinitePayOpen(false)}
          slug={defaultMerchantSlug}
          item={{
            name: `${items.length} item(s) do Carrinho`,
            price: value.subtotal,
            description: items.map((i) => `${i.qty}x ${i.name}`).join(", "),
            emoji: "🛒",
          }}
          merchantName={merchantName}
        />
      )}
    </CartContext.Provider>
  );
}

export function CartButton() {
  const { count, open } = useCart();
  return (
    <button
      onClick={open}
      aria-label="Abrir carrinho"
      className="relative grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground"
    >
      <ShoppingCart className="h-4 w-4" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9.5px] font-extrabold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
