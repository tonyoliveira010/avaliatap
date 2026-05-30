import type { LucideIcon } from "lucide-react";
import {
  ShoppingBag,
  HardHat,
  Hand,
  Layers,
  Tag,
  PackageOpen,
  Trash2,
  Box,
} from "lucide-react";

export interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  unit: string;
  icon: LucideIcon;
  category: "sacos" | "epi" | "protecao" | "extras";
  highlight?: string;
}

export const productCategories: { id: Product["category"]; label: string }[] = [
  { id: "sacos", label: "Sacos de entulho" },
  { id: "epi", label: "EPI & segurança" },
  { id: "protecao", label: "Proteção da obra" },
  { id: "extras", label: "Extras" },
];

export const products: Product[] = [
  // Sacos
  {
    id: "saco10",
    name: "Sacos 100L · pacote 10",
    desc: "Reforçado para entulho leve e poda.",
    price: 39,
    unit: "pacote",
    icon: ShoppingBag,
    category: "sacos",
  },
  {
    id: "saco25",
    name: "Sacos 100L · pacote 25",
    desc: "Melhor custo por saco para reformas.",
    price: 79,
    unit: "pacote",
    icon: ShoppingBag,
    category: "sacos",
    highlight: "Economia 19%",
  },
  {
    id: "saco50",
    name: "Sacos 200L · pacote 50",
    desc: "Industrial, aguenta concreto e gesso.",
    price: 169,
    unit: "pacote",
    icon: ShoppingBag,
    category: "sacos",
    highlight: "Mais vendido",
  },
  {
    id: "saco100",
    name: "Sacos 200L · pacote 100",
    desc: "Para demolições e grandes volumes.",
    price: 299,
    unit: "pacote",
    icon: ShoppingBag,
    category: "sacos",
    highlight: "Melhor R$/saco",
  },
  // EPI
  {
    id: "luva",
    name: "Luvas de proteção",
    desc: "Par de luvas pigmentadas anticorte.",
    price: 12,
    unit: "par",
    icon: Hand,
    category: "epi",
  },
  {
    id: "capacete",
    name: "Capacete de obra",
    desc: "Com carneira ajustável, certificado.",
    price: 29,
    unit: "un",
    icon: HardHat,
    category: "epi",
  },
  {
    id: "kit-epi",
    name: "Kit EPI completo",
    desc: "Capacete, luvas, óculos e máscara.",
    price: 69,
    unit: "kit",
    icon: HardHat,
    category: "epi",
    highlight: "Combo",
  },
  // Proteção
  {
    id: "lona",
    name: "Lona de proteção 4x5m",
    desc: "Cobertura impermeável para pisos.",
    price: 49,
    unit: "un",
    icon: Layers,
    category: "protecao",
  },
  {
    id: "fita",
    name: "Fita de demarcação",
    desc: "Rolo 200m zebrado de sinalização.",
    price: 18,
    unit: "rolo",
    icon: Tag,
    category: "protecao",
  },
  // Extras
  {
    id: "caixote",
    name: "Caixote dobrável",
    desc: "Para separar recicláveis na obra.",
    price: 35,
    unit: "un",
    icon: Box,
    category: "extras",
  },
  {
    id: "saco-rua",
    name: "Big bag 1m³",
    desc: "Saco grande para descarte na calçada.",
    price: 45,
    unit: "un",
    icon: PackageOpen,
    category: "extras",
    highlight: "Prático",
  },
  {
    id: "removedor",
    name: "Removedor de respingos",
    desc: "Tira respingos de cimento e tinta.",
    price: 27,
    unit: "un",
    icon: Trash2,
    category: "extras",
  },
];
