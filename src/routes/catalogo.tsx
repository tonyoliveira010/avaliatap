import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { brl } from "@/lib/products";

type CatalogItem = {
  id: string;
  kind: "Produto" | "Serviço";
  emoji: string;
  name: string;
  desc: string;
  price: number;
  oldPrice?: number;
  active: boolean;
};

const seed: CatalogItem[] = [
  {
    id: "1",
    kind: "Produto",
    emoji: "🧴",
    name: "Pomada Modeladora Alpha",
    desc: "Fixação forte com acabamento matte.",
    price: 49.9,
    oldPrice: 69.9,
    active: true,
  },
  {
    id: "2",
    kind: "Serviço",
    emoji: "✂️",
    name: "Corte + Barba",
    desc: "De segunda a quinta, com hora marcada.",
    price: 69,
    active: true,
  },
];

const storageKey = "avaliatap-catalogo";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Produtos e serviços · AvaliaTap" },
      { name: "description", content: "Cadastre os produtos e serviços que aparecem na página pública do seu comércio." },
      { property: "og:title", content: "Produtos e serviços · AvaliaTap" },
      { property: "og:description", content: "Cadastre produtos e serviços da sua vitrine." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const [items, setItems] = useState<CatalogItem[]>(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    kind: "Produto" as CatalogItem["kind"],
    emoji: "🧴",
    name: "",
    desc: "",
    price: "",
    oldPrice: "",
  });

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        setItems(JSON.parse(saved) as CatalogItem[]);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
  }, []);

  const save = (next: CatalogItem[]) => {
    setItems(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.price.replace(",", "."));
    const oldPrice = form.oldPrice ? Number(form.oldPrice.replace(",", ".")) : undefined;
    if (!Number.isFinite(price) || price <= 0) {
      toast("Informe um preço válido.");
      return;
    }
    save([
      {
        id: crypto.randomUUID(),
        kind: form.kind,
        emoji: form.emoji || "🛍️",
        name: form.name,
        desc: form.desc,
        price,
        oldPrice,
        active: true,
      },
      ...items,
    ]);
    setForm({ kind: "Produto", emoji: "🧴", name: "", desc: "", price: "", oldPrice: "" });
    setOpen(false);
    toast("Item adicionado à vitrine");
  };

  return (
    <div className="px-5 pb-28 pt-6">
      <h1 className="text-[26px] font-extrabold tracking-tight text-foreground">Produtos e serviços</h1>
      <p className="mt-1 text-[13px] text-muted-foreground">
        O que você cadastra aqui aparece na vitrine da sua página pública.
      </p>

      <button
        onClick={() => setOpen(true)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary py-4 text-[13.5px] font-extrabold text-secondary-foreground active:scale-[0.99]"
      >
        <Plus className="h-4 w-4" /> Adicionar produto ou serviço
      </button>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <article key={item.id} className="flex items-center gap-3 rounded-3xl border border-border bg-surface p-3.5">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-soft text-2xl">
              {item.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <small className="text-[9px] font-extrabold uppercase tracking-[0.09em] text-muted-foreground">
                {item.kind}
              </small>
              <p className="mt-0.5 text-[14.5px] font-semibold text-foreground">{item.name}</p>
              <p className="truncate text-[11.5px] text-muted-foreground">{item.desc}</p>
              <p className="mt-1 text-[13px] font-extrabold text-foreground">
                {brl(item.price)}{" "}
                {item.oldPrice ? (
                  <span className="text-[11px] font-medium text-muted-foreground line-through">{brl(item.oldPrice)}</span>
                ) : null}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <button
                onClick={() => save(items.map((i) => (i.id === item.id ? { ...i, active: !i.active } : i)))}
                className={`rounded-xl px-2.5 py-1.5 text-[10px] font-extrabold ${
                  item.active ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
                }`}
              >
                {item.active ? "Ativo" : "Pausado"}
              </button>
              <button
                onClick={() => {
                  save(items.filter((i) => i.id !== item.id));
                  toast("Item removido");
                }}
                aria-label={`Remover ${item.name}`}
                className="text-muted-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
        {items.length === 0 && (
          <p className="flex flex-col items-center gap-2 rounded-3xl bg-muted p-8 text-center text-[13px] text-muted-foreground">
            <Package className="h-6 w-6" /> Sua vitrine ainda está vazia.
          </p>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <form onSubmit={submit} className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-background p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[19px] font-extrabold text-foreground">Novo item</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {(["Produto", "Serviço"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setForm({ ...form, kind: k })}
                  className={`rounded-xl py-3 text-[12px] font-extrabold ${
                    form.kind === k ? "bg-secondary text-secondary-foreground" : "border border-border text-muted-foreground"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            <div className="mt-3 space-y-3">
              <label className="block text-[11px] font-bold text-muted-foreground">
                Ícone
                <input
                  value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                  maxLength={2}
                  className="mt-1.5 h-12 w-full rounded-xl border border-border bg-surface px-3 text-[18px] text-foreground outline-none focus:border-primary"
                />
              </label>
              <label className="block text-[11px] font-bold text-muted-foreground">
                Nome
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1.5 h-12 w-full rounded-xl border border-border bg-surface px-3 text-[14px] text-foreground outline-none focus:border-primary"
                />
              </label>
              <label className="block text-[11px] font-bold text-muted-foreground">
                Descrição
                <textarea
                  required
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface p-3 text-[14px] text-foreground outline-none focus:border-primary"
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block text-[11px] font-bold text-muted-foreground">
                  Preço (R$)
                  <input
                    required
                    inputMode="decimal"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="49,90"
                    className="mt-1.5 h-12 w-full rounded-xl border border-border bg-surface px-3 text-[14px] text-foreground outline-none focus:border-primary"
                  />
                </label>
                <label className="block text-[11px] font-bold text-muted-foreground">
                  Preço antigo
                  <input
                    inputMode="decimal"
                    value={form.oldPrice}
                    onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                    placeholder="69,90"
                    className="mt-1.5 h-12 w-full rounded-xl border border-border bg-surface px-3 text-[14px] text-foreground outline-none focus:border-primary"
                  />
                </label>
              </div>
            </div>

            <button className="mt-5 w-full rounded-2xl bg-primary py-4 text-[14px] font-extrabold text-primary-foreground">
              Salvar na vitrine
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
