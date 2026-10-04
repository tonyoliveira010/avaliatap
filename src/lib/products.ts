import { useEffect, useState } from "react";

export type Pack = {
  id: string;
  name: string;
  mult: number;
  tag?: string;
  save?: string;
};

export type Plan = {
  id: string;
  name: string;
  desc: string;
  badge?: string;
  discount: number;
};

export type Product = {
  id: string;
  name: string;
  desc: string;
  price: number;
  oldPrice?: number;
  emoji: string;
  badge?: string;
  rating?: number;
  reviews?: string;
  features?: string[];
  shipping?: string;
  promo?: string;
  kind?: "Produto" | "Serviço";
  active?: boolean;
};

export const packs: Pack[] = [
  { id: "single", name: "Unidade", mult: 1 },
  { id: "pack2", name: "Pacote c/ 2", mult: 1.8, tag: "POPULAR", save: "Economize 10%" },
  { id: "pack3", name: "Pacote c/ 3", mult: 2.4, tag: "MELHOR OFERTA", save: "Economize 20%" },
];

export const plans: Plan[] = [
  {
    id: "subscribe",
    name: "Assinar e economizar",
    desc: "Receba automaticamente",
    badge: "Economize até 25%",
    discount: 0.75,
  },
  { id: "onetime", name: "Compra única", desc: "Pague uma vez, sem recorrência", discount: 1 },
];

export const defaultProductsByMerchant: Record<string, Product[]> = {
  "barbearia-alpha": [
    {
      id: "pomada",
      name: "Pomada Modeladora Alpha",
      desc: "Fixação forte com acabamento matte. Modela o cabelo o dia todo sem pesar e sai fácil na lavagem.",
      price: 49.9,
      oldPrice: 69.9,
      emoji: "🧴",
      badge: "Mais vendido",
      rating: 4.9,
      reviews: "Amado por 2 mil+ clientes",
      features: ["Efeito matte", "Fácil de lavar", "Fragrância amadeirada"],
      shipping: "🚚 Frete grátis acima de R$ 150 ou retire no balcão",
      promo: "🕒 Peça até 18h e retire hoje",
      kind: "Produto",
      active: true,
    },
    {
      id: "oleo-barba",
      name: "Óleo de Barba Premium",
      desc: "Hidrata, amacia e perfuma a barba. Blend de óleos naturais com absorção rápida.",
      price: 39.9,
      oldPrice: 54.9,
      emoji: "🧔",
      badge: "Recomendado",
      rating: 4.8,
      reviews: "Amado por 900+ clientes",
      features: ["Óleo 100% natural", "Vitamina E", "Sem oleosidade excessiva"],
      shipping: "🚚 Frete grátis acima de R$ 150 ou retire no balcão",
      promo: "🎁 Leve 2 e ganhe um pente de madeira",
      kind: "Produto",
      active: true,
    },
    {
      id: "kit-alpha",
      name: "Kit Cuidado Completo",
      desc: "Shampoo, pomada e óleo de barba em um só kit, com a curadoria dos nossos barbeiros.",
      price: 119.9,
      oldPrice: 159.9,
      emoji: "🎁",
      badge: "Melhor Oferta",
      rating: 5.0,
      reviews: "Amado por 500+ clientes",
      features: ["3 produtos essenciais", "Melhor custo-benefício", "Caixa de presente"],
      shipping: "🚚 Frete grátis nesta compra",
      promo: "🕒 Estoque limitado da semana",
      kind: "Produto",
      active: true,
    },
    {
      id: "corte-cabelo",
      name: "Corte de Cabelo Masculino",
      desc: "Corte moderno ou clássico com lavagem especial, finalização com pomada e toalha quente.",
      price: 65.0,
      oldPrice: 80.0,
      emoji: "✂️",
      badge: "Popular",
      rating: 4.9,
      reviews: "Mais de 3.500 cortes realizados",
      features: ["Lavagem inclusa", "Toalha aromatizada", "Consultoria de estilo"],
      shipping: "📍 Atendimento com hora marcada",
      promo: "⭐ Ganhe 10% de desconto no primeiro agendamento",
      kind: "Serviço",
      active: true,
    },
    {
      id: "barba-terapia",
      name: "Barba Terapia com Toalha Quente",
      desc: "Desenho e alinhamento da barba com navalha, toalha quente e massagem facial relaxante.",
      price: 55.0,
      oldPrice: 65.0,
      emoji: "💈",
      badge: "Destaque",
      rating: 5.0,
      reviews: "Avaliado 5 estrelas por 1.800 clientes",
      features: ["Toalha quente", "Balm pós-barba", "Esfoliação facial"],
      shipping: "📍 Atendimento com hora marcada",
      promo: "☕ Acompanha expresso ou chopp cortesia",
      kind: "Serviço",
      active: true,
    },
  ],
  "cafe-lumiere": [
    {
      id: "cafe-graos",
      name: "Café em Grãos Lumière",
      desc: "Blend autoral torrado na casa, notas de chocolate e caramelo. Pacote de 250g.",
      price: 44.9,
      oldPrice: 59.9,
      emoji: "☕",
      badge: "Mais vendido",
      rating: 4.9,
      reviews: "Amado por 1,5 mil+ clientes",
      features: ["Torra artesanal", "100% Arábica", "250g"],
      shipping: "🚚 Frete grátis acima de R$ 150",
      promo: "🕒 Torra fresca toda semana",
      kind: "Produto",
      active: true,
    },
    {
      id: "caneca",
      name: "Caneca Lumière",
      desc: "Cerâmica esmaltada de 300ml, feita à mão por um ateliê parceiro do bairro.",
      price: 59.9,
      emoji: "🍵",
      badge: "Edição Limitada",
      rating: 4.7,
      reviews: "Amado por 300+ clientes",
      features: ["Feita à mão", "300ml cerâmica nobre"],
      shipping: "🚚 Frete grátis acima de R$ 150",
      promo: "🎁 Ganhe um café expresso ao levar a caneca",
      kind: "Produto",
      active: true,
    },
  ],
};

export const productsByMerchant = defaultProductsByMerchant;

export function getProducts(slug: string): Product[] {
  return defaultProductsByMerchant[slug] ?? [];
}

export const catalogKey = (slug: string) => `avaliatap-catalogo-${slug}`;

export function getAllCatalogProducts(slug: string): Product[] {
  const defaults = getProducts(slug);
  if (typeof window === "undefined") return defaults;
  try {
    const saved = window.localStorage.getItem(catalogKey(slug));
    if (!saved) return defaults;
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) return defaults;
    return parsed as Product[];
  } catch {
    return defaults;
  }
}

export function getVisibleProducts(slug: string): Product[] {
  const all = getAllCatalogProducts(slug);
  return all.filter((item) => item.active !== false);
}

export function saveCatalogProducts(slug: string, products: Product[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(catalogKey(slug), JSON.stringify(products));
  window.dispatchEvent(new Event("avaliatap-catalog-update"));
}

export function useCatalogProducts(slug: string): Product[] {
  const [products, setProducts] = useState(() => getVisibleProducts(slug));
  useEffect(() => {
    const refresh = () => setProducts(getVisibleProducts(slug));
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("avaliatap-catalog-update", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("avaliatap-catalog-update", refresh);
    };
  }, [slug]);
  return products;
}

export function getProduct(slug: string, productId: string): Product | undefined {
  const all = getAllCatalogProducts(slug);
  const found = all.find((p) => p.id === productId);
  if (found) return found;
  return getProducts(slug).find((p) => p.id === productId);
}

export function brl(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function whatsappDigits(url: string) {
  return url.replace(/\D/g, "");
}

export type CustomerCoupon = {
  id: string;
  emoji: string;
  tag: string;
  title: string;
  description: string;
  status: "Disponível" | "Usado";
};

export const customerCoupons: CustomerCoupon[] = [
  {
    id: "off10",
    emoji: "🎟️",
    tag: "Ativo",
    title: "10% OFF",
    description: "Válido até 30/09",
    status: "Disponível",
  },
  {
    id: "frete",
    emoji: "🎁",
    tag: "Usado",
    title: "Frete grátis",
    description: "Utilizado em 02/09",
    status: "Usado",
  },
];
