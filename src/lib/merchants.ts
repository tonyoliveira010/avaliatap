export type Offer = {
  id: string;
  emoji: string;
  tag: string;
  title: string;
  description: string;
  action: string;
};

export type Merchant = {
  slug: string;
  name: string;
  category: string;
  greeting: string;
  headline: string;
  subtitle: string;
  whatsapp: string;
  instagram: string;
  address: string;
  googleReview: string;
  campaign: {
    label: string;
    title: string;
    text: string;
    cta: string;
    discount: string;
    code: string;
    rules: string;
  };
  offers: Offer[];
  news: Offer[];
};

export const merchants: Record<string, Merchant> = {
  "barbearia-alpha": {
    slug: "barbearia-alpha",
    name: "Barbearia Alpha",
    category: "Barbearia · Vila Madalena",
    greeting: "Olá, seja bem-vindo 👋",
    headline: "Descubra o que preparamos para você.",
    subtitle: "Ofertas, benefícios e novidades do estabelecimento.",
    whatsapp: "https://wa.me/5511999999999",
    instagram: "https://instagram.com/barbeariaalpha",
    address: "Rua Harmonia, 421 · São Paulo",
    googleReview: "https://g.page/r/exemplo/review",
    campaign: {
      label: "Benefício exclusivo",
      title: "Raspe e descubra sua surpresa.",
      text: "Um benefício especial pode estar esperando por você.",
      cta: "Raspar meu cupom",
      discount: "20% OFF",
      code: "BEMVINDO20",
      rules: "Válido por 7 dias, apresente o código no balcão.",
    },
    offers: [
      {
        id: "review",
        emoji: "⭐",
        tag: "Experiência",
        title: "Sua opinião importa",
        description: "Avalie nosso atendimento no Google.",
        action: "Avaliar",
      },
      {
        id: "today",
        emoji: "🎁",
        tag: "Hoje",
        title: "10% OFF na próxima visita",
        description: "Disponível por tempo limitado.",
        action: "Pegar",
      },
      {
        id: "combo",
        emoji: "✂️",
        tag: "Combo",
        title: "Corte + barba por R$ 69",
        description: "De segunda a quinta, com hora marcada.",
        action: "Pegar",
      },
    ],
    news: [
      {
        id: "club",
        emoji: "👑",
        tag: "Clube",
        title: "Clube Alpha",
        description: "A cada 5 cortes, o 6º é por nossa conta.",
        action: "Entrar",
      },
      {
        id: "hours",
        emoji: "🕘",
        tag: "Novidade",
        title: "Agora abrimos aos domingos",
        description: "Das 9h às 15h, só com agendamento.",
        action: "Ver",
      },
    ],
  },
  "cafe-lumiere": {
    slug: "cafe-lumiere",
    name: "Café Lumière",
    category: "Cafeteria · Pinheiros",
    greeting: "Que bom te ver por aqui ☕",
    headline: "Um mimo esperando por você.",
    subtitle: "Benefícios exclusivos para quem aproximou o celular.",
    whatsapp: "https://wa.me/5511988888888",
    instagram: "https://instagram.com/cafelumiere",
    address: "Rua dos Pinheiros, 88 · São Paulo",
    googleReview: "https://g.page/r/exemplo2/review",
    campaign: {
      label: "Só hoje",
      title: "Raspe e ganhe seu café.",
      text: "Pode ser um café grátis. Pode ser mais que isso.",
      cta: "Raspar agora",
      discount: "CAFÉ GRÁTIS",
      code: "LUMIERE1",
      rules: "Um por cliente, na compra de qualquer doce.",
    },
    offers: [
      {
        id: "review",
        emoji: "⭐",
        tag: "Experiência",
        title: "Conta pra gente como foi",
        description: "Sua avaliação no Google ajuda muito.",
        action: "Avaliar",
      },
      {
        id: "today",
        emoji: "🥐",
        tag: "Hoje",
        title: "Croissant por R$ 9,90",
        description: "Até as 11h, todos os dias.",
        action: "Pegar",
      },
    ],
    news: [
      {
        id: "menu",
        emoji: "🍰",
        tag: "Novidade",
        title: "Nova linha de sobremesas",
        description: "Feitas na casa, todos os dias.",
        action: "Ver",
      },
    ],
  },
};

export const defaultMerchantSlug = "barbearia-alpha";

export function getMerchant(slug: string): Merchant | undefined {
  return merchants[slug];
}
