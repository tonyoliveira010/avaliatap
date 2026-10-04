import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Trash2,
  X,
  ExternalLink,
  Star,
  Sparkles,
  Leaf,
  Eye,
  Edit3,
  Copy,
  Check,
  Tag,
  Truck,
  Clock,
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  brl,
  catalogKey,
  getAllCatalogProducts,
  saveCatalogProducts,
  packs,
  plans,
  type Product,
} from "@/lib/products";
import { defaultMerchantSlug, getMerchant } from "@/lib/merchants";

type CatalogItem = Product & {
  kind: "Produto" | "Serviço";
  active: boolean;
};

const slug = defaultMerchantSlug;

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Vitrine & Produtos · AvaliaTap" },
      {
        name: "description",
        content: "Gerencie, edite e personalize todos os detalhes dos produtos e serviços da sua vitrine pública.",
      },
      { property: "og:title", content: "Vitrine & Produtos · AvaliaTap" },
      {
        property: "og:description",
        content: "Edição completa de produtos, selos, avaliações, pacotes e pré-visualização da vitrine.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CatalogPage,
});

const emojiPresets = [
  { label: "Barbearia & Beleza", emojis: ["🧴", "🧔", "💈", "✂️", "🪒", "💆‍♂️", "✨", "🌟", "💅", "💄", "🧖‍♀️", "🌸"] },
  { label: "Café & Comida", emojis: ["☕", "🥐", "🍰", "🍵", "🥪", "🍕", "🍔", "🥗", "🥤", "🍪", "🍷", "🍺"] },
  { label: "Varejo & Serviços", emojis: ["🛍️", "🎁", "👕", "👟", "🕶️", "📦", "🏷️", "⚡", "📱", "💼", "🚗", "🐾"] },
];

const badgePresets = [
  "Mais vendido",
  "Recomendado",
  "Destaque",
  "Melhor Oferta",
  "Lançamento",
  "Edição Limitada",
  "Popular",
  "Kit da casa",
];

export default function CatalogPage() {
  const merchant = getMerchant(slug);
  const [items, setItems] = useState<CatalogItem[]>(() => {
    return getAllCatalogProducts(slug).map((item) => ({
      ...item,
      kind: item.kind || "Produto",
      active: item.active !== false,
    }));
  });

  const [filterTab, setFilterTab] = useState<"Todos" | "Produto" | "Serviço" | "Pausados">("Todos");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"edit" | "preview">("edit");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState<{
    id: string;
    kind: "Produto" | "Serviço";
    emoji: string;
    name: string;
    desc: string;
    price: string;
    oldPrice: string;
    badge: string;
    rating: string;
    reviews: string;
    shipping: string;
    promo: string;
    features: string[];
    newFeatureText: string;
    active: boolean;
  }>({
    id: "",
    kind: "Produto",
    emoji: "🧴",
    name: "",
    desc: "",
    price: "",
    oldPrice: "",
    badge: "",
    rating: "4.9",
    reviews: "Amado por centenas de clientes",
    shipping: "🚚 Frete grátis acima de R$ 150 ou retire no balcão",
    promo: "🕒 Peça e receba atendimento exclusivo",
    features: ["Alta qualidade", "Pronta entrega"],
    newFeatureText: "",
    active: true,
  });

  // Sync on mount
  useEffect(() => {
    const loaded = getAllCatalogProducts(slug).map((item) => ({
      ...item,
      kind: item.kind || "Produto",
      active: item.active !== false,
    }));
    setItems(loaded);

    const handleSync = () => {
      const refreshed = getAllCatalogProducts(slug).map((item) => ({
        ...item,
        kind: item.kind || "Produto",
        active: item.active !== false,
      }));
      setItems(refreshed);
    };

    window.addEventListener("avaliatap-catalog-update", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("avaliatap-catalog-update", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const persist = (next: CatalogItem[]) => {
    setItems(next);
    saveCatalogProducts(slug, next);
  };

  const openNewItem = (kind: "Produto" | "Serviço" = "Produto") => {
    setEditingId(null);
    setForm({
      id: "prod-" + Date.now(),
      kind,
      emoji: kind === "Serviço" ? "✨" : "🧴",
      name: "",
      desc: "",
      price: "",
      oldPrice: "",
      badge: "Mais vendido",
      rating: "5.0",
      reviews: "Avaliado com nota máxima",
      shipping: kind === "Serviço" ? "📍 Atendimento com hora marcada" : "🚚 Frete grátis acima de R$ 150 ou retire no balcão",
      promo: kind === "Serviço" ? "⭐ Agende seu horário com facilidade" : "🕒 Peça até 18h e retire hoje",
      features: kind === "Serviço" ? ["Atendimento VIP", "Sem fila de espera"] : ["Qualidade garantida", "Melhor custo-benefício"],
      newFeatureText: "",
      active: true,
    });
    setModalTab("edit");
    setIsModalOpen(true);
  };

  const openEditItem = (item: CatalogItem) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      kind: item.kind,
      emoji: item.emoji || (item.kind === "Serviço" ? "✨" : "🛍️"),
      name: item.name,
      desc: item.desc,
      price: item.price ? String(item.price).replace(".", ",") : "",
      oldPrice: item.oldPrice ? String(item.oldPrice).replace(".", ",") : "",
      badge: item.badge || "",
      rating: item.rating ? String(item.rating) : "4.9",
      reviews: item.reviews || "Amado por clientes",
      shipping: item.shipping || "🚚 Frete grátis ou retire no balcão",
      promo: item.promo || "",
      features: item.features && item.features.length > 0 ? [...item.features] : ["Destaque especial", "Garantia de satisfação"],
      newFeatureText: "",
      active: item.active !== false,
    });
    setModalTab("edit");
    setIsModalOpen(true);
  };

  const handleSaveForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPrice = Number(form.price.replace(",", "."));
    if (!Number.isFinite(cleanPrice) || cleanPrice <= 0) {
      toast.error("Informe um preço de venda válido.");
      return;
    }

    const cleanOldPrice = form.oldPrice ? Number(form.oldPrice.replace(",", ".")) : undefined;
    const cleanRating = form.rating ? Number(form.rating.replace(",", ".")) : 5.0;

    const itemData: CatalogItem = {
      id: editingId || form.id || "prod-" + Date.now(),
      name: form.name.trim() || (form.kind === "Serviço" ? "Novo Serviço" : "Novo Produto"),
      desc: form.desc.trim() || "Descrição do item na vitrine.",
      price: cleanPrice,
      oldPrice: cleanOldPrice && cleanOldPrice > cleanPrice ? cleanOldPrice : undefined,
      emoji: form.emoji || (form.kind === "Serviço" ? "✨" : "🛍️"),
      badge: form.badge.trim() || undefined,
      rating: cleanRating,
      reviews: form.reviews.trim() || undefined,
      features: form.features.filter((f) => f.trim().length > 0),
      shipping: form.shipping.trim() || undefined,
      promo: form.promo.trim() || undefined,
      kind: form.kind,
      active: form.active,
    };

    if (editingId) {
      const next = items.map((i) => (i.id === editingId ? itemData : i));
      persist(next);
      toast.success(`"${itemData.name}" atualizado com sucesso!`);
    } else {
      const next = [itemData, ...items];
      persist(next);
      toast.success(`"${itemData.name}" adicionado à vitrine pública!`);
    }

    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDuplicate = (item: CatalogItem) => {
    const copy: CatalogItem = {
      ...item,
      id: "prod-" + Date.now(),
      name: `${item.name} (Cópia)`,
      active: true,
    };
    persist([copy, ...items]);
    toast.success(`Item duplicado com sucesso!`);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Deseja remover "${name}" da vitrine?`)) {
      const next = items.filter((i) => i.id !== id);
      persist(next);
      toast.success(`Item removido.`);
      if (editingId === id) setIsModalOpen(false);
    }
  };

  const handleToggleActive = (id: string) => {
    const next = items.map((i) => (i.id === id ? { ...i, active: !i.active } : i));
    persist(next);
    const item = items.find((i) => i.id === id);
    if (item?.active) {
      toast("Item pausado (oculto na vitrine do cliente)");
    } else {
      toast.success("Item ativado na vitrine!");
    }
  };

  const addFeature = () => {
    if (form.newFeatureText.trim()) {
      setForm({
        ...form,
        features: [...form.features, form.newFeatureText.trim()],
        newFeatureText: "",
      });
    }
  };

  const removeFeature = (index: number) => {
    setForm({
      ...form,
      features: form.features.filter((_, i) => i !== index),
    });
  };

  // Filtered items
  const filteredItems = items.filter((item) => {
    if (filterTab === "Produto" && item.kind !== "Produto") return false;
    if (filterTab === "Serviço" && item.kind !== "Serviço") return false;
    if (filterTab === "Pausados" && item.active !== false) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.desc.toLowerCase().includes(q);
      const matchBadge = item.badge?.toLowerCase().includes(q);
      return matchName || matchDesc || matchBadge;
    }
    return true;
  });

  const parsedFormPrice = Number(form.price.replace(",", ".")) || 0;
  const parsedFormOldPrice = Number(form.oldPrice.replace(",", ".")) || 0;
  const formDiscountPct =
    parsedFormOldPrice > parsedFormPrice && parsedFormPrice > 0
      ? Math.round((1 - parsedFormPrice / parsedFormOldPrice) * 100)
      : null;

  return (
    <div className="min-h-screen bg-background px-4 pb-28 pt-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-xl bg-surface px-3 py-1.5 text-[12px] font-bold text-foreground border border-border"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Início
        </Link>
        <Link
          to="/c/$slug/produtos"
          params={{ slug }}
          className="inline-flex items-center gap-1 text-[12px] font-bold text-primary hover:underline"
        >
          Ver vitrine pública <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-4">
        <h1 className="text-[26px] font-extrabold tracking-tight text-foreground">
          Vitrine & Catálogo
        </h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Gerencie cada detalhe dos produtos e serviços que seus clientes acessam pelo toque NFC.
        </p>
      </div>

      {/* Metrics Bar */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-border bg-surface p-3">
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Total Itens</p>
          <p className="mt-0.5 text-lg font-extrabold text-foreground">{items.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-3">
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Ativos</p>
          <p className="mt-0.5 text-lg font-extrabold text-primary">
            {items.filter((i) => i.active !== false).length}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-3">
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Serviços</p>
          <p className="mt-0.5 text-lg font-extrabold text-foreground">
            {items.filter((i) => i.kind === "Serviço").length}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => openNewItem("Produto")}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-[13px] font-extrabold text-primary-foreground shadow-sm active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> Novo produto
        </button>
        <button
          onClick={() => openNewItem("Serviço")}
          className="flex items-center justify-center gap-2 rounded-2xl bg-secondary py-3.5 text-[13px] font-extrabold text-secondary-foreground shadow-sm active:scale-[0.98]"
        >
          <Sparkles className="h-4 w-4" /> Novo serviço
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mt-4 space-y-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar produto, serviço ou selo..."
          className="h-11 w-full rounded-2xl border border-border bg-surface px-4 text-[13.5px] text-foreground outline-none focus:border-primary"
        />

        <div className="flex rounded-2xl bg-muted p-1">
          {(["Todos", "Produto", "Serviço", "Pausados"] as const).map((tab) => {
            const count =
              tab === "Todos"
                ? items.length
                : tab === "Pausados"
                ? items.filter((i) => i.active === false).length
                : items.filter((i) => i.kind === tab && i.active !== false).length;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`flex-1 rounded-xl py-2 text-[11.5px] font-extrabold transition-all ${
                  filterTab === tab
                    ? "bg-surface text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "Todos" ? "Todos" : tab === "Produto" ? "Produtos" : tab === "Serviço" ? "Serviços" : "Pausados"}{" "}
                ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Items List */}
      <div className="mt-4 space-y-3">
        {filteredItems.map((item) => (
          <article
            key={item.id}
            className="group relative rounded-3xl border border-border bg-surface p-4 transition-all hover:border-primary/50"
          >
            <div className="flex items-start gap-3.5">
              {/* Emoji avatar */}
              <div
                onClick={() => openEditItem(item)}
                className="relative grid h-16 w-16 shrink-0 cursor-pointer place-items-center rounded-2xl bg-primary-soft text-3xl active:scale-95"
              >
                {item.emoji}
                {item.badge && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-extrabold text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1 cursor-pointer" onClick={() => openEditItem(item)}>
                <div className="flex items-center gap-1.5">
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    {item.kind}
                  </span>
                  {item.rating && (
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-foreground">
                      <Star className="h-3 w-3 fill-primary text-primary" /> {item.rating.toFixed(1)}
                    </span>
                  )}
                  {!item.active && (
                    <span className="rounded-md bg-destructive/15 px-1.5 py-0.5 text-[9.5px] font-bold text-destructive">
                      Pausado
                    </span>
                  )}
                </div>

                <h3 className="mt-1 text-[15px] font-bold leading-tight text-foreground group-hover:text-primary">
                  {item.name}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-[12px] text-muted-foreground">{item.desc}</p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[14.5px] font-extrabold text-foreground">{brl(item.price)}</span>
                  {item.oldPrice && (
                    <span className="text-[11.5px] text-muted-foreground line-through">
                      {brl(item.oldPrice)}
                    </span>
                  )}
                  {item.features && item.features.length > 0 && (
                    <span className="truncate text-[10.5px] text-muted-foreground">
                      · {item.features[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="mt-3.5 flex items-center justify-between border-t border-border/60 pt-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditItem(item)}
                  className="inline-flex items-center gap-1 rounded-xl bg-muted px-2.5 py-1.5 text-[11px] font-bold text-foreground hover:bg-muted/80"
                >
                  <Edit3 className="h-3 w-3" /> Editar detalhes
                </button>
                <Link
                  to="/c/$slug/produtos/$productId"
                  params={{ slug, productId: item.id }}
                  className="inline-flex items-center gap-1 rounded-xl bg-muted/60 px-2.5 py-1.5 text-[11px] font-bold text-muted-foreground hover:text-foreground"
                >
                  <Eye className="h-3 w-3" /> Ver pública
                </Link>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleToggleActive(item.id)}
                  title={item.active ? "Pausar item" : "Ativar item"}
                  className={`rounded-xl px-2.5 py-1 text-[10.5px] font-extrabold ${
                    item.active
                      ? "bg-primary-soft text-foreground"
                      : "border border-border text-muted-foreground"
                  }`}
                >
                  {item.active ? "Ativo" : "Pausado"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDuplicate(item)}
                  title="Duplicar item"
                  className="grid h-7 w-7 place-items-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.name)}
                  title="Excluir item"
                  className="grid h-7 w-7 place-items-center rounded-xl text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface p-8 text-center">
            <Package className="h-10 w-10 text-muted-foreground/60" />
            <p className="mt-2 text-[14.5px] font-bold text-foreground">Nenhum item encontrado</p>
            <p className="mt-1 max-w-[240px] text-[12px] text-muted-foreground">
              Tente alterar o filtro ou cadastre um novo produto/serviço para sua vitrine.
            </p>
            <button
              onClick={() => openNewItem("Produto")}
              className="mt-4 rounded-xl bg-primary px-4 py-2 text-[12.5px] font-extrabold text-primary-foreground"
            >
              Criar primeiro item
            </button>
          </div>
        )}
      </div>

      {/* FULL MODAL: DETALHES, EDIÇÃO & LIVE PREVIEW */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xs sm:items-center p-0 sm:p-4">
          <div className="flex h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[32px] sm:rounded-[32px] bg-background border border-border shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-primary">
                  {editingId ? "Edição da Vitrine" : "Novo Cadastro"}
                </span>
                <h2 className="text-[18px] font-extrabold text-foreground">
                  {editingId ? form.name || "Detalhes do Produto" : "Criar Novo Item"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-muted text-foreground hover:bg-muted/80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Tabs: Formulário vs Prévia da Página Pública */}
            <div className="flex border-b border-border bg-muted/40 p-1.5">
              <button
                type="button"
                onClick={() => setModalTab("edit")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12.5px] font-extrabold transition ${
                  modalTab === "edit"
                    ? "bg-surface text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" /> Edição & Detalhes
              </button>
              <button
                type="button"
                onClick={() => setModalTab("preview")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12.5px] font-extrabold transition ${
                  modalTab === "preview"
                    ? "bg-surface text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" /> Prévia da Página Pública
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {modalTab === "edit" ? (
                <form id="product-form" onSubmit={handleSaveForm} className="space-y-4">
                  {/* Tipo: Produto vs Serviço */}
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground">Tipo de Item</label>
                    <div className="mt-1.5 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, kind: "Produto" })}
                        className={`rounded-2xl py-3 text-[13px] font-extrabold ${
                          form.kind === "Produto"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "border border-border bg-surface text-muted-foreground"
                        }`}
                      >
                        📦 Produto Físico (com carrinho)
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, kind: "Serviço" })}
                        className={`rounded-2xl py-3 text-[13px] font-extrabold ${
                          form.kind === "Serviço"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "border border-border bg-surface text-muted-foreground"
                        }`}
                      >
                        ✨ Serviço (atendimento/horário)
                      </button>
                    </div>
                  </div>

                  {/* Emoji selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground">
                      Ícone / Emoji em Destaque
                    </label>
                    <div className="mt-1.5 flex items-center gap-3">
                      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-soft text-3xl">
                        {form.emoji}
                      </div>
                      <input
                        value={form.emoji}
                        onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                        maxLength={4}
                        placeholder="🧴"
                        className="h-12 w-20 rounded-2xl border border-border bg-surface text-center text-xl text-foreground outline-none focus:border-primary"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Escolha um emoji que represente este item na página pública.
                      </p>
                    </div>

                    {/* Presets */}
                    <div className="mt-2 space-y-1.5">
                      {emojiPresets.map((category) => (
                        <div key={category.label} className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold text-muted-foreground min-w-[90px]">
                            {category.label}:
                          </span>
                          {category.emojis.map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => setForm({ ...form, emoji: em })}
                              className={`h-7 w-7 rounded-lg text-sm transition ${
                                form.emoji === em ? "bg-primary scale-110 shadow-sm" : "bg-muted hover:bg-muted/70"
                              }`}
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nome do item */}
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground">
                      Nome do Item <span className="text-primary">*</span>
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ex: Pomada Modeladora Alpha ou Corte Especial"
                      className="mt-1.5 h-12 w-full rounded-2xl border border-border bg-surface px-4 text-[14px] text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  {/* Badge / Selo */}
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground">
                      Selo / Badge de Destaque
                    </label>
                    <input
                      value={form.badge}
                      onChange={(e) => setForm({ ...form, badge: e.target.value })}
                      placeholder="Ex: Mais vendido, Edição Especial, Melhor Oferta"
                      className="mt-1.5 h-11 w-full rounded-2xl border border-border bg-surface px-4 text-[13.5px] text-foreground outline-none focus:border-primary"
                    />
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {badgePresets.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setForm({ ...form, badge: b })}
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition ${
                            form.badge === b
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preços */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground">
                        Preço Atual (R$) <span className="text-primary">*</span>
                      </label>
                      <input
                        required
                        inputMode="decimal"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="49,90"
                        className="mt-1.5 h-12 w-full rounded-2xl border border-border bg-surface px-4 text-[15px] font-bold text-foreground outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground">
                        Preço Riscado Anterior (R$)
                      </label>
                      <input
                        inputMode="decimal"
                        value={form.oldPrice}
                        onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                        placeholder="69,90"
                        className="mt-1.5 h-12 w-full rounded-2xl border border-border bg-surface px-4 text-[15px] text-muted-foreground outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {formDiscountPct !== null && formDiscountPct > 0 && (
                    <div className="flex items-center gap-2 rounded-xl bg-primary-soft p-2.5 text-[12px] font-bold text-accent-foreground">
                      <Tag className="h-4 w-4" /> Desconto aparente de {formDiscountPct}% para o cliente!
                    </div>
                  )}

                  {/* Descrição */}
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground">
                      Descrição Detalhada na Vitrine <span className="text-primary">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={form.desc}
                      onChange={(e) => setForm({ ...form, desc: e.target.value })}
                      placeholder="Explique os benefícios, modo de uso ou detalhes do atendimento..."
                      className="mt-1.5 w-full rounded-2xl border border-border bg-surface p-3.5 text-[13.5px] text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  {/* Prova Social & Avaliações */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground">
                        Nota de Avaliação (1 a 5)
                      </label>
                      <input
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: e.target.value })}
                        placeholder="4.9"
                        className="mt-1.5 h-11 w-full rounded-2xl border border-border bg-surface px-4 text-[13.5px] font-bold text-foreground outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground">
                        Texto de Prova Social
                      </label>
                      <input
                        value={form.reviews}
                        onChange={(e) => setForm({ ...form, reviews: e.target.value })}
                        placeholder="Ex: Amado por 1,5 mil+ clientes"
                        className="mt-1.5 h-11 w-full rounded-2xl border border-border bg-surface px-4 text-[13.5px] text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Features / Destaques */}
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground">
                      Benefícios e Destaques (Tags)
                    </label>
                    <div className="mt-1.5 flex gap-2">
                      <input
                        value={form.newFeatureText}
                        onChange={(e) => setForm({ ...form, newFeatureText: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addFeature();
                          }
                        }}
                        placeholder="Ex: Efeito matte, 100% Vegano..."
                        className="h-11 flex-1 rounded-2xl border border-border bg-surface px-4 text-[13px] text-foreground outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="rounded-2xl bg-secondary px-4 text-[12.5px] font-bold text-secondary-foreground"
                      >
                        Adicionar
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {form.features.map((feat, idx) => (
                        <span
                          key={feat + idx}
                          className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[11.5px] font-semibold text-foreground"
                        >
                          <Sparkles className="h-3 w-3 text-primary" /> {feat}
                          <button
                            type="button"
                            onClick={() => removeFeature(idx)}
                            className="ml-1 text-muted-foreground hover:text-destructive"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Frete & Urgência */}
                  <div className="space-y-3 rounded-2xl border border-border bg-surface p-3.5">
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                        <Truck className="h-3.5 w-3.5" /> Mensagem de Frete / Disponibilidade
                      </label>
                      <input
                        value={form.shipping}
                        onChange={(e) => setForm({ ...form, shipping: e.target.value })}
                        placeholder="Ex: 🚚 Frete grátis acima de R$ 150 ou retire no balcão"
                        className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-[12.5px] text-foreground outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> Banner de Urgência / Promoção
                      </label>
                      <input
                        value={form.promo}
                        onChange={(e) => setForm({ ...form, promo: e.target.value })}
                        placeholder="Ex: 🕒 Peça até 18h e retire hoje"
                        className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3 text-[12.5px] text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Status do item */}
                  <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-3.5">
                    <div>
                      <p className="text-[13.5px] font-bold text-foreground">Disponível na vitrine pública</p>
                      <p className="text-[11.5px] text-muted-foreground">
                        Se desativado, o item ficará oculto para clientes no toque NFC.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, active: !form.active })}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        form.active ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`absolute top-1 block h-4 w-4 rounded-full bg-white transition-transform ${
                          form.active ? "right-1" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                </form>
              ) : (
                /* LIVE PREVIEW DA PÁGINA PÚBLICA */
                <div className="rounded-3xl border border-border bg-background p-4 shadow-inner">
                  <div className="mb-3 flex items-center justify-between border-b border-border pb-2 text-[11.5px] text-muted-foreground">
                    <span className="font-bold text-primary">Simulador da Tela do Cliente</span>
                    <span className="font-mono text-[10px]">avaliatap.com/c/{slug}</span>
                  </div>

                  {/* Frete banner */}
                  <p className="rounded-xl bg-secondary py-2 text-center text-[11.5px] font-bold text-secondary-foreground">
                    {form.shipping || "Confira a disponibilidade com o estabelecimento"}
                  </p>

                  {/* Promo alert */}
                  {form.promo && (
                    <p className="mt-2.5 rounded-xl bg-primary-soft px-3 py-2 text-[11.5px] font-bold text-foreground">
                      {form.promo}
                    </p>
                  )}

                  {/* Main Art Card */}
                  <div className="relative mt-3 grid h-44 place-items-center overflow-hidden rounded-[22px] bg-primary-soft text-[72px]">
                    {form.emoji || "🛍️"}
                    {form.badge && (
                      <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-extrabold text-primary-foreground shadow-sm">
                        {form.badge}
                      </span>
                    )}
                  </div>

                  {/* Details Header */}
                  <div className="mt-4">
                    <div className="flex items-center gap-1.5 text-[12px]">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      <span className="font-bold text-foreground">
                        {Number(form.rating || 5).toFixed(1)}/5
                      </span>
                      <span className="text-muted-foreground">| {form.reviews || "Avaliações verificadas"}</span>
                    </div>

                    <h3 className="mt-1 text-[20px] font-extrabold leading-tight text-foreground">
                      {form.name || "Nome do Produto"}
                    </h3>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                      {form.desc || "Descrição completa que o cliente lê após aproximar o celular."}
                    </p>

                    {/* Features tags */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.features.map((f, i) => (
                        <div
                          key={f + i}
                          className="flex items-center gap-1.5 rounded-xl bg-primary-soft/60 px-2.5 py-1 text-[11.5px] font-bold text-foreground"
                        >
                          <Sparkles className="h-3 w-3 text-primary" /> {f}
                        </div>
                      ))}
                    </div>

                    {/* Price preview */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-[22px] font-extrabold text-foreground">
                        {brl(parsedFormPrice)}
                      </span>
                      {parsedFormOldPrice > parsedFormPrice && (
                        <span className="text-[13px] text-muted-foreground line-through">
                          {brl(parsedFormOldPrice)}
                        </span>
                      )}
                      {formDiscountPct && (
                        <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10.5px] font-extrabold text-foreground">
                          Economize {formDiscountPct}%
                        </span>
                      )}
                    </div>

                    {/* Pacotes (para produtos) */}
                    {form.kind === "Produto" && (
                      <div className="mt-4 space-y-2">
                        <p className="text-[12px] font-bold text-foreground">1. Pacotes disponíveis</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {packs.map((p) => (
                            <div
                              key={p.id}
                              className={`rounded-xl border p-2 text-center text-[10.5px] ${
                                p.id === "single"
                                  ? "border-primary bg-primary-soft font-bold text-foreground"
                                  : "border-border bg-surface text-muted-foreground"
                              }`}
                            >
                              <p className="font-extrabold">{p.name}</p>
                              <p className="text-foreground">{brl(parsedFormPrice * p.mult)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-background p-4">
              <div className="flex items-center gap-2">
                {editingId && (
                  <Link
                    to="/c/$slug/produtos/$productId"
                    params={{ slug, productId: editingId }}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-2xl border border-border bg-surface px-3 py-3 text-[12.5px] font-bold text-foreground hover:bg-muted"
                  >
                    <ExternalLink className="h-4 w-4" /> Abrir no navegador
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-2xl border border-border px-4 py-3 text-[13px] font-bold text-muted-foreground hover:text-foreground"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="product-form"
                  onClick={() => handleSaveForm()}
                  className="rounded-2xl bg-primary px-6 py-3 text-[13px] font-extrabold text-primary-foreground shadow-md active:scale-95"
                >
                  Salvar na Vitrine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
