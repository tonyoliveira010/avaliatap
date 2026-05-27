export type WorkTypeId = "reforma" | "demolicao" | "limpeza" | "planos";

export interface WorkType {
  id: WorkTypeId;
  label: string;
  description: string;
  benefits: string[];
  /** Multiplicador da diária */
  dailyMultiplier: number;
  /** Desconto extra na logística (0..1) */
  logisticsDiscount: number;
  /** Volume mínimo (qty) a partir do qual a Garantia Tambor é dispensada */
  garantiaFreeFromQty: number;
}

export const workTypes: Record<WorkTypeId, WorkType> = {
  reforma: {
    id: "reforma",
    label: "Reforma",
    description: "Reformas residenciais e comerciais leves",
    benefits: [
      "Tambores 240L compactos",
      "Janelas flexíveis sábado/domingo",
      "Suporte por chat dedicado",
    ],
    dailyMultiplier: 1,
    logisticsDiscount: 0,
    garantiaFreeFromQty: 8,
  },
  demolicao: {
    id: "demolicao",
    label: "Demolição",
    description: "Alta rotatividade, retirada rápida",
    benefits: [
      "Trocas expressas em até 4h",
      "10% off em conjuntos a partir de 3 tambores",
      "Equipe extra de carregamento",
    ],
    dailyMultiplier: 1.15,
    logisticsDiscount: 0.1,
    garantiaFreeFromQty: 5,
  },
  limpeza: {
    id: "limpeza",
    label: "Limpeza",
    description: "Limpeza bruta, faxina pós-obra e jardim",
    benefits: [
      "Equipe de limpeza inclusa opcional",
      "Sacos resistentes incluídos",
      "Retirada no mesmo dia para volumes pequenos",
    ],
    dailyMultiplier: 0.9,
    logisticsDiscount: 0.05,
    garantiaFreeFromQty: 6,
  },
  planos: {
    id: "planos",
    label: "Planos",
    description: "Mensal, recorrente e corporativo",
    benefits: [
      "Faturamento mensal disponível",
      "Garantia Tambor isenta para o ciclo",
      "Gestor de conta exclusivo",
    ],
    dailyMultiplier: 1.05,
    logisticsDiscount: 0.12,
    garantiaFreeFromQty: 3,
  },
};
