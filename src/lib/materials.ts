import {
  Trash2,
  TreePine,
  Recycle,
  Mountain,
  Boxes,
  Sprout,
  Hammer,
  type LucideIcon,
} from "lucide-react";

export const materialIcons: Record<string, LucideIcon> = {
  Entulho: Trash2,
  Madeira: TreePine,
  Recicláveis: Recycle,
  Pedra: Mountain,
  Areia: Mountain,
  Gesso: Boxes,
  Terra: Sprout,
};

export function getMaterialIcon(material: string): LucideIcon {
  return materialIcons[material] ?? Hammer;
}

/** Gera um título amigável para o tambor / conjunto. */
export function getOrderTitle(material: string, qty: number): string {
  if (qty >= 2) return `Conjunto ${material}`;
  return `Tambor ${material}`;
}
