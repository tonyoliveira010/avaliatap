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

/**
 * Multiplicador de diária por tipo de material descartado.
 * Materiais mais pesados/perigosos ou que exigem manuseio especial custam mais;
 * recicláveis e terra ganham incentivo de descarte sustentável.
 */
export const materialDailyMultipliers: Record<string, number> = {
  Entulho: 1,
  Areia: 0.85,
  Pedra: 1.1,
  Madeira: 0.95,
  Gesso: 1.2,
  Recicláveis: 0.7,
  Terra: 0.9,
};

export function getMaterialMultiplier(material: string): number {
  return materialDailyMultipliers[material] ?? 1;
}
