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
