export type Poll = {
  id: string;
  badge: string;
  deadline: string;
  question: string;
  description: string;
  options: { id: string; label: string; percent: number }[];
};

export type MiniPoll = {
  id: string;
  emoji: string;
  tag: string;
  title: string;
  description: string;
};

export type BenefitCard = {
  id: string;
  tag: string;
  title: string;
  description: string;
  tone: "orange" | "lilac" | "lime";
  category: string;
};

export type BenefitItem = {
  id: string;
  emoji: string;
  tag: string;
  title: string;
  description: string;
  action: string;
  tone: "lime" | "yellow" | "purple";
  category: string;
};

export const benefitCategories = ["Todos", "Ofertas", "Cupons", "Experiências", "Novidades"];

export const featuredBenefits: BenefitCard[] = [
  {
    id: "scratch",
    tag: "Surpresa",
    title: "Raspe e descubra seu benefício.",
    description: "Você pode ganhar até 20% OFF",
    tone: "orange",
    category: "Cupons",
  },
  {
    id: "coupon10",
    tag: "Cupom",
    title: "10% OFF na sua próxima compra.",
    description: "Válido por tempo limitado",
    tone: "lilac",
    category: "Cupons",
  },
  {
    id: "exclusive",
    tag: "Exclusivo",
    title: "Uma experiência especial esperando por você.",
    description: "Confira os detalhes",
    tone: "lime",
    category: "Experiências",
  },
];

export const benefitItems: BenefitItem[] = [
  {
    id: "off15",
    emoji: "🎟️",
    tag: "Oferta",
    title: "R$ 15 OFF",
    description: "Desconto em compras acima de R$ 80",
    action: "Pegar",
    tone: "lime",
    category: "Ofertas",
  },
  {
    id: "review",
    emoji: "⭐",
    tag: "Experiência",
    title: "Avalie e desbloqueie",
    description: "Deixe sua opinião e veja seu benefício",
    action: "Abrir",
    tone: "yellow",
    category: "Experiências",
  },
  {
    id: "members",
    emoji: "✨",
    tag: "Novidade",
    title: "Oferta exclusiva",
    description: "Disponível somente para clientes cadastrados",
    action: "Ver",
    tone: "purple",
    category: "Novidades",
  },
];

export const featuredPoll: Poll = {
  id: "produto",
  badge: "Nova",
  deadline: "encerra em 2 dias",
  question: "Qual produto você gostaria de ver por aqui?",
  description: "Seu voto pode virar a próxima novidade da loja.",
  options: [
    { id: "a", label: "Produto A — edição especial", percent: 42 },
    { id: "b", label: "Produto B — lançamento", percent: 35 },
    { id: "c", label: "Produto C — versão premium", percent: 23 },
  ],
};

export const miniPolls: MiniPoll[] = [
  {
    id: "atendimento",
    emoji: "⭐",
    tag: "Experiência",
    title: "Como foi seu atendimento hoje?",
    description: "Leva menos de 10 segundos.",
  },
  {
    id: "promo",
    emoji: "🎁",
    tag: "Benefício",
    title: "Qual promoção você prefere?",
    description: "Vote e concorra a créditos.",
  },
];

export const creditBalance = 1280;

export const creditActions = [
  { id: "indique", emoji: "👥", title: "Indique", value: "+200 créditos" },
  { id: "avalie", emoji: "⭐", title: "Avalie", value: "+50 créditos" },
  { id: "participe", emoji: "◇", title: "Participe", value: "+30 créditos" },
];

export const rewards = [
  { id: "off10", emoji: "🎁", title: "R$ 10 OFF", description: "Use em sua próxima compra", cost: 500 },
  { id: "cafe", emoji: "☕", title: "Café grátis", description: "Válido até 30/09", cost: 350 },
  { id: "kit", emoji: "🧴", title: "Kit cuidado", description: "Produto surpresa da casa", cost: 1500 },
];

export const nextPrize = {
  title: "Fone premium",
  current: 3600,
  target: 5000,
};

// =========================================================================
// MULTITENANT CUSTOMER LEAD & FIDELITY WALLET
// O cadastro do cliente é estritamente isolado por estabelecimento (slug).
// Um cliente cadastrado no estabelecimento A NÃO tem cadastro no B.
// =========================================================================

export type TenantCustomer = {
  id: string;
  slug: string;
  name: string;
  phone: string;
  email?: string;
  birthDate?: string;
  credits: number;
  tier: "Bronze" | "Prata" | "Ouro";
  createdAt: string;
};

export const tenantCustomerKey = (slug: string) => `avaliatap-customer-${slug}`;

export function getTenantCustomer(slug: string): TenantCustomer | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(tenantCustomerKey(slug));
    if (!saved) return null;
    return JSON.parse(saved) as TenantCustomer;
  } catch {
    return null;
  }
}

export function saveTenantCustomer(slug: string, customer: TenantCustomer) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(tenantCustomerKey(slug), JSON.stringify(customer));
  window.dispatchEvent(new CustomEvent("avaliatap-customer-update", { detail: { slug } }));
}

export function getTenantLeads(slug: string): TenantCustomer[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = window.localStorage.getItem(`avaliatap-leads-${slug}`);
    if (!saved) return [];
    return JSON.parse(saved) as TenantCustomer[];
  } catch {
    return [];
  }
}

export function registerTenantCustomer(
  slug: string,
  data: { name: string; phone: string; email?: string; birthDate?: string }
): TenantCustomer {
  const newCustomer: TenantCustomer = {
    id: "lead-" + Date.now(),
    slug,
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email?.trim() || undefined,
    birthDate: data.birthDate?.trim() || undefined,
    credits: 100, // Bônus de boas-vindas ao se cadastrar
    tier: "Bronze",
    createdAt: new Date().toISOString(),
  };
  saveTenantCustomer(slug, newCustomer);

  // Armazena na lista multitenant de leads captados do estabelecimento
  if (typeof window !== "undefined") {
    try {
      const existing = getTenantLeads(slug);
      const filtered = existing.filter((l) => l.phone !== newCustomer.phone);
      window.localStorage.setItem(`avaliatap-leads-${slug}`, JSON.stringify([newCustomer, ...filtered]));
      window.dispatchEvent(new CustomEvent("avaliatap-leads-update", { detail: { slug } }));
    } catch {
      // ignore
    }
  }

  return newCustomer;
}

export function logoutTenantCustomer(slug: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(tenantCustomerKey(slug));
  window.dispatchEvent(new CustomEvent("avaliatap-customer-update", { detail: { slug } }));
}

import { useState, useEffect } from "react";

export function useTenantCustomer(slug: string) {
  const [customer, setCustomer] = useState<TenantCustomer | null>(() => getTenantCustomer(slug));

  useEffect(() => {
    const refresh = () => setCustomer(getTenantCustomer(slug));
    refresh();

    const handleCustom = (e: Event) => {
      const customEvent = e as CustomEvent<{ slug?: string }>;
      if (!customEvent.detail || customEvent.detail.slug === slug) {
        refresh();
      }
    };

    window.addEventListener("avaliatap-customer-update", handleCustom);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("avaliatap-customer-update", handleCustom);
      window.removeEventListener("storage", refresh);
    };
  }, [slug]);

  return {
    customer,
    isRegistered: !!customer,
    register: (data: { name: string; phone: string; email?: string; birthDate?: string }) =>
      registerTenantCustomer(slug, data),
    logout: () => logoutTenantCustomer(slug),
  };
}
