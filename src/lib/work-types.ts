export type WorkTypeId = "residencial" | "demolicao" | "comercial";

export interface WorkType {
  id: WorkTypeId;
  label: string;
  description: string;
  benefits: string[];
  /** Multiplicador da diária */
  dailyMultiplier: number;
  /** Desconto extra na logística (0..1) */
  logisticsDiscount: number;
  /** Volume mínimo (qty) a partir do qual a caução é dispensada */
  cauçaoFreeFromQty: number;
}

export const workTypes: Record<WorkTypeId, WorkType> = {
  residencial: {
    id: "residencial",
    label: "Reforma residencial",
    description: "Volumes menores, entulho leve",
    benefits: [
      "Tambores 240L compactos",
      "Janelas flexíveis sábado/domingo",
      "Suporte por chat dedicado",
    ],
    dailyMultiplier: 1,
    logisticsDiscount: 0,
    cauçaoFreeFromQty: 8,
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
    cauçaoFreeFromQty: 5,
  },
  comercial: {
    id: "comercial",
    label: "Comercial / Outros",
    description: "Empresas e obras especiais",
    benefits: [
      "Faturamento mensal disponível",
      "Caução isenta a partir de 4 tambores",
      "Gestor de conta exclusivo",
    ],
    dailyMultiplier: 1.05,
    logisticsDiscount: 0.05,
    cauçaoFreeFromQty: 4,
  },
};
