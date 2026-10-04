import { useState, useEffect } from "react";

export type AppointmentClient = {
  id: string;
  name: string;
  vip: boolean;
  phone: string;
  dob: string;
  since: string;
  service: string;
  duration: string;
  price: string;
  status: "Confirmado" | "Concluído" | "Cancelado";
  time: string; // e.g. "Hoje, 09:00 — 10:00" or "Sex 11, 09:00"
  timeOnly: string; // e.g. "09:00"
  body: string;
  blood: string;
  skin: string;
  allergies: string;
  meds: string;
  history: string;
  surgery: string;
  pregnant: string;
  spf: string;
  routine: string;
  habits: string;
  prev: string;
  notes: string;
  consent: string;
};

export type DaySlot = {
  time: string;
  type: "client" | "free" | "blocked";
  id?: string;
};

export const defaultAppointments: AppointmentClient[] = [
  {
    id: "c1",
    name: "Ana Ferreira",
    vip: true,
    phone: "(11) 98221-4470",
    dob: "14/03/1991",
    since: "jan/2024",
    service: "Limpeza de pele profunda",
    duration: "60 min",
    price: "R$ 180",
    status: "Confirmado",
    time: "Hoje, 09:00 — 10:00",
    timeOnly: "09:00",
    body: "62kg / 1,68m",
    blood: "O+",
    skin: "Mista, sensível na zona T",
    allergies: "Ácido salicílico",
    meds: "Nenhum",
    history: "Dermatite leve na infância",
    surgery: "Nenhuma",
    pregnant: "Não",
    spf: "Diário, FPS 50",
    routine: "Limpeza + hidratante + protetor solar",
    habits: "Não fuma, consome álcool socialmente",
    prev: "Peeling de diamante (2x), microagulhamento (1x)",
    notes: "Prefere produtos sem fragrância. Evitar extração manual intensa.",
    consent: "Assinado em 03/01/2024",
  },
  {
    id: "c2",
    name: "Renata Lopes",
    vip: false,
    phone: "(11) 97765-2298",
    dob: "02/09/1988",
    since: "jun/2025",
    service: "Design de sobrancelhas",
    duration: "30 min",
    price: "R$ 70",
    status: "Confirmado",
    time: "Hoje, 11:30 — 12:00",
    timeOnly: "11:30",
    body: "58kg / 1,63m",
    blood: "A+",
    skin: "Normal",
    allergies: "Nenhuma relatada",
    meds: "Nenhum",
    history: "Nenhum relato",
    surgery: "Nenhuma",
    pregnant: "Não",
    spf: "Uso ocasional",
    routine: "Rotina básica, sem produtos ativos",
    habits: "Não fuma, não consome álcool",
    prev: "Nenhum procedimento anterior registrado",
    notes: "Primeira visita — confirmar formato desejado antes de iniciar.",
    consent: "Assinado em 12/06/2025",
  },
  {
    id: "c3",
    name: "Bianca Souza",
    vip: true,
    phone: "(11) 99034-1187",
    dob: "27/11/1995",
    since: "mar/2023",
    service: "Massagem relaxante",
    duration: "60 min",
    price: "R$ 150",
    status: "Confirmado",
    time: "Hoje, 16:00 — 17:00",
    timeOnly: "16:00",
    body: "70kg / 1,71m",
    blood: "B-",
    skin: "—",
    allergies: "Óleo de amêndoas",
    meds: "Anti-inflamatório (uso ocasional)",
    history: "Tensão muscular crônica nos ombros",
    surgery: "Cirurgia no joelho (2021)",
    pregnant: "Não",
    spf: "Não aplicável",
    routine: "Não aplicável",
    habits: "Não fuma, consome álcool socialmente",
    prev: "Massagem relaxante mensal",
    notes: "Cliente recorrente. Prefere ambiente com pouca luz e silêncio.",
    consent: "Assinado em 08/03/2023",
  },
];

export const defaultDaySlots: DaySlot[] = [
  { time: "08:00", type: "free" },
  { time: "09:00", type: "client", id: "c1" },
  { time: "10:00", type: "free" },
  { time: "11:30", type: "client", id: "c2" },
  { time: "13:00", type: "free" },
  { time: "14:00", type: "free" },
  { time: "16:00", type: "client", id: "c3" },
  { time: "17:30", type: "free" },
  { time: "18:30", type: "free" },
];

export const agendaCategories = [
  { key: "facial", label: "Estética facial", emoji: "💆", soft: "#ffe3ec" },
  { key: "sobrancelha", label: "Sobrancelhas", emoji: "✂️", soft: "#f0e3ff" },
  { key: "massagem", label: "Massagem", emoji: "🤲", soft: "#e0fff2" },
  { key: "depilacao", label: "Depilação", emoji: "✨", soft: "#fff3d9" },
  { key: "cabelo", label: "Cabelo", emoji: "💇", soft: "#e3edff" },
];

export const agendaServicesList = [
  { id: "s1", name: "Limpeza de pele profunda", duration: "60 min", price: "R$ 180", cat: "facial", badge: "Mais pedido" },
  { id: "s2", name: "Peeling de diamante", duration: "45 min", price: "R$ 150", cat: "facial" },
  { id: "s3", name: "Microagulhamento", duration: "50 min", price: "R$ 220", cat: "facial", badge: "Novo" },
  { id: "s4", name: "Design de sobrancelhas", duration: "30 min", price: "R$ 70", cat: "sobrancelha" },
  { id: "s5", name: "Henna para sobrancelhas", duration: "40 min", price: "R$ 90", cat: "sobrancelha", badge: "Favorito" },
  { id: "s6", name: "Massagem relaxante", duration: "50 min", price: "R$ 150", cat: "massagem", badge: "Mais pedido" },
  { id: "s7", name: "Massagem modeladora", duration: "60 min", price: "R$ 170", cat: "massagem" },
  { id: "s8", name: "Depilação axilas", duration: "20 min", price: "R$ 50", cat: "depilacao" },
  { id: "s9", name: "Depilação pernas completas", duration: "40 min", price: "R$ 110", cat: "depilacao" },
  { id: "s10", name: "Escova modelada", duration: "40 min", price: "R$ 90", cat: "cabelo" },
  { id: "s11", name: "Hidratação capilar", duration: "50 min", price: "R$ 130", cat: "cabelo" },
];

// Hook de configuração da Navbar (Plano Agenda Ativo e Agenda na Navbar)
export function useAgendaNavConfig() {
  const [hasAgendaPlan, setHasAgendaPlan] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const plan = localStorage.getItem("avaliatap-has-agenda-plan");
    return plan === null ? true : plan === "true"; // default ativo
  });

  const [useAgendaInNav, setUseAgendaInNav] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const opt = localStorage.getItem("avaliatap-opt-agenda-navbar");
    return opt === null ? true : opt === "true"; // default optado
  });

  const toggleAgendaPlan = (active: boolean) => {
    setHasAgendaPlan(active);
    if (typeof window !== "undefined") {
      localStorage.setItem("avaliatap-has-agenda-plan", String(active));
      window.dispatchEvent(new CustomEvent("avaliatap-agenda-nav-update"));
    }
  };

  const toggleAgendaInNav = (opt: boolean) => {
    setUseAgendaInNav(opt);
    if (typeof window !== "undefined") {
      localStorage.setItem("avaliatap-opt-agenda-navbar", String(opt));
      window.dispatchEvent(new CustomEvent("avaliatap-agenda-nav-update"));
    }
  };

  useEffect(() => {
    const handleUpdate = () => {
      const plan = localStorage.getItem("avaliatap-has-agenda-plan");
      const opt = localStorage.getItem("avaliatap-opt-agenda-navbar");
      setHasAgendaPlan(plan === null ? true : plan === "true");
      setUseAgendaInNav(opt === null ? true : opt === "true");
    };
    window.addEventListener("avaliatap-agenda-nav-update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("avaliatap-agenda-nav-update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Agenda só aparece na barra se tiver o plano de agenda ativo E optar para a agenda estar na navbar
  const isAgendaOnNav = hasAgendaPlan && useAgendaInNav;

  return {
    hasAgendaPlan,
    useAgendaInNav,
    isAgendaOnNav,
    toggleAgendaPlan,
    toggleAgendaInNav,
  };
}
