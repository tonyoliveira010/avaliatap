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

export const productsByMerchant: Record<string, Product[]> = {
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
      features: ["Efeito matte", "Fácil de lavar"],
      shipping: "🚚 Frete grátis acima de R$150",
      promo: "🕒 Peça até 18h e retire hoje",
    },
    {
      id: "oleo-barba",
      name: "Óleo de Barba Premium",
      desc: "Hidrata, amacia e perfuma a barba. Blend de óleos naturais com absorção rápida.",
      price: 39.9,
      oldPrice: 54.9,
      emoji: "🧔",
      rating: 4.8,
      reviews: "Amado por 900+ clientes",
      features: ["Óleo natural", "Vitamina E"],
      shipping: "🚚 Frete grátis acima de R$150",
      promo: "🎁 Leve 2 e ganhe um pente",
    },
    {
      id: "kit-alpha",
      name: "Kit Cuidado Completo",
      desc: "Shampoo, pomada e óleo de barba em um só kit, com a curadoria dos nossos barbeiros.",
      price: 119.9,
      oldPrice: 159.9,
      emoji: "🎁",
      badge: "Kit da casa",
      rating: 5,
      reviews: "Amado por 500+ clientes",
      features: ["3 produtos", "Melhor custo"],
      shipping: "🚚 Frete grátis nesta compra",
      promo: "🕒 Estoque limitado desta semana",
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
      features: ["Torra artesanal", "250g"],
      shipping: "🚚 Frete grátis acima de R$150",
      promo: "🕒 Torra fresca toda semana",
    },
    {
      id: "caneca",
      name: "Caneca Lumière",
      desc: "Cerâmica esmaltada de 300ml, feita à mão por um ateliê parceiro do bairro.",
      price: 59.9,
      emoji: "🍵",
      rating: 4.7,
      reviews: "Amado por 300+ clientes",
      features: ["Feita à mão", "300ml"],
      shipping: "🚚 Frete grátis acima de R$150",
      promo: "🎁 Ganhe um café ao levar a caneca",
    },
  ],
};

export function getProducts(slug: string): Product[] {
  return productsByMerchant[slug] ?? [];
}

export const catalogKey = (slug: string) => `avaliatap-catalogo-${slug}`;

export function getVisibleProducts(slug: string): Product[] {
  const defaults = getProducts(slug);
  if (typeof window === "undefined") return defaults;
  try {
    const saved = window.localStorage.getItem(catalogKey(slug));
    if (!saved) return defaults;
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return defaults;
    return (parsed as Product[]).filter((item) => item.active !== false);
  } catch {
    return defaults;
  }
}

export function useCatalogProducts(slug: string): Product[] {
  const [products, setProducts] = useState(() => getProducts(slug));
  useEffect(() => {
    const refresh = () => setProducts(getVisibleProducts(slug));
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [slug]);
  return products;
}

export function getProduct(slug: string, productId: string): Product | undefined {
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
