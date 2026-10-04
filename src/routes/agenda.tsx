import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Calendar,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Plus,
  Sparkles,
  TrendingUp,
  User,
  Users,
  X,
  Check,
  DollarSign,
  ShieldCheck,
  CreditCard,
  QrCode,
  Bell,
  SlidersHorizontal,
  Flame,
  ArrowRight,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { defaultMerchantSlug, merchants } from "@/lib/merchants";
import {
  type AppointmentClient,
  type DaySlot,
  defaultAppointments,
  defaultDaySlots,
  agendaCategories,
  agendaServicesList,
} from "@/lib/agenda-state";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda de Atendimentos · AvaliaTap" },
      {
        name: "description",
        content:
          "Gerencie seus agendamentos, clientes, horários disponíveis, ficha de anamnese e dashboard financeiro.",
      },
      { property: "og:title", content: "Agenda de Atendimentos · AvaliaTap" },
      {
        property: "og:description",
        content: "Agenda completa para profissionais e estabelecimentos com agendamento online.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AgendaPage,
});

export default function AgendaPage() {
  const merchant = merchants[defaultMerchantSlug]!;

  // Persisted state for appointments
  const [clients, setClients] = useState<AppointmentClient[]>(() => {
    if (typeof window === "undefined") return defaultAppointments;
    try {
      const saved = localStorage.getItem("avaliatap-agenda-appointments");
      return saved ? JSON.parse(saved) : defaultAppointments;
    } catch {
      return defaultAppointments;
    }
  });

  const [daySlots, setDaySlots] = useState<DaySlot[]>(() => {
    if (typeof window === "undefined") return defaultDaySlots;
    try {
      const saved = localStorage.getItem("avaliatap-agenda-slots");
      return saved ? JSON.parse(saved) : defaultDaySlots;
    } catch {
      return defaultDaySlots;
    }
  });

  const [hoursConfig, setHoursConfig] = useState<{
    days: string[];
    start: string;
    end: string;
  }>(() => {
    if (typeof window === "undefined") return { days: ["Seg", "Ter", "Qua", "Qui", "Sex"], start: "08:00", end: "19:00" };
    try {
      const saved = localStorage.getItem("avaliatap-agenda-hours");
      return saved ? JSON.parse(saved) : { days: ["Seg", "Ter", "Qua", "Qui", "Sex"], start: "08:00", end: "19:00" };
    } catch {
      return { days: ["Seg", "Ter", "Qua", "Qui", "Sex"], start: "08:00", end: "19:00" };
    }
  });

  // Active view: "dia" | "semana" | "mes"
  const [activeView, setActiveView] = useState<"dia" | "semana" | "mes">("dia");

  // Selected client for Anamnese modal
  const [selectedClient, setSelectedClient] = useState<AppointmentClient | null>(null);
  const [modalTab, setModalTab] = useState<"ficha" | "media">("ficha");

  // Other Modals
  const [manualBookingOpen, setManualBookingOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [hoursConfigOpen, setHoursConfigOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [paymentConfigOpen, setPaymentConfigOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  // Manual booking form state
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualTime, setManualTime] = useState("10:00");
  const [manualService, setManualService] = useState(agendaServicesList[0].name);
  const [manualVip, setManualVip] = useState(false);

  // Reschedule state
  const [rescheduleSelectedDay, setRescheduleSelectedDay] = useState("Sex 11");
  const [rescheduleSelectedTime, setRescheduleSelectedTime] = useState<string | null>(null);

  // Hours config temporary state
  const [tempHoursDays, setTempHoursDays] = useState<string[]>(hoursConfig.days);
  const [tempHoursStart, setTempHoursStart] = useState(hoursConfig.start);
  const [tempHoursEnd, setTempHoursEnd] = useState(hoursConfig.end);

  // Save changes to localStorage
  const saveClients = (newClients: AppointmentClient[]) => {
    setClients(newClients);
    if (typeof window !== "undefined") {
      localStorage.setItem("avaliatap-agenda-appointments", JSON.stringify(newClients));
    }
  };

  const saveDaySlots = (newSlots: DaySlot[]) => {
    setDaySlots(newSlots);
    if (typeof window !== "undefined") {
      localStorage.setItem("avaliatap-agenda-slots", JSON.stringify(newSlots));
    }
  };

  const saveHours = (config: { days: string[]; start: string; end: string }) => {
    setHoursConfig(config);
    if (typeof window !== "undefined") {
      localStorage.setItem("avaliatap-agenda-hours", JSON.stringify(config));
    }
  };

  // Helper for initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Cancel appointment
  const handleCancelAppointment = () => {
    if (!selectedClient) return;
    const clientId = selectedClient.id;

    // Free up slot
    const nextSlots = daySlots.map((s) => {
      if (s.id === clientId) {
        return { time: s.time, type: "free" as const };
      }
      return s;
    });
    saveDaySlots(nextSlots);

    // Remove from appointments
    const nextClients = clients.filter((c) => c.id !== clientId);
    saveClients(nextClients);

    setSelectedClient(null);
    toast.success("Agendamento cancelado com sucesso.");
  };

  // Confirm reschedule
  const handleConfirmReschedule = () => {
    if (!selectedClient || !rescheduleSelectedTime) {
      toast.error("Por favor, selecione um horário para reagendar.");
      return;
    }

    const clientId = selectedClient.id;

    // Update appointment
    const updatedClients = clients.map((c) => {
      if (c.id === clientId) {
        return {
          ...c,
          time: `${rescheduleSelectedDay}, ${rescheduleSelectedTime}`,
          timeOnly: rescheduleSelectedTime,
        };
      }
      return c;
    });
    saveClients(updatedClients);

    // Update slots
    const updatedSlots = daySlots.map((s) => {
      if (s.id === clientId) {
        return { time: s.time, type: "free" as const };
      }
      if (s.time === rescheduleSelectedTime) {
        return { time: s.time, type: "client" as const, id: clientId };
      }
      return s;
    });
    saveDaySlots(updatedSlots);

    setRescheduleOpen(false);
    setSelectedClient(null);
    toast.success(`Agendamento remarcado para ${rescheduleSelectedDay}, ${rescheduleSelectedTime}!`);
  };

  // Create manual appointment
  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim()) {
      toast.error("Preencha nome e WhatsApp do cliente.");
      return;
    }

    const matchedService = agendaServicesList.find((s) => s.name === manualService) || agendaServicesList[0];
    const newId = "c-" + Date.now();

    const newAppointment: AppointmentClient = {
      id: newId,
      name: manualName.trim(),
      vip: manualVip,
      phone: manualPhone.trim(),
      dob: "—",
      since: "Hoje",
      service: matchedService.name,
      duration: matchedService.duration,
      price: matchedService.price,
      status: "Confirmado",
      time: `Hoje, ${manualTime}`,
      timeOnly: manualTime,
      body: "—",
      blood: "—",
      skin: "Normal",
      allergies: "Nenhuma relatada",
      meds: "Nenhum",
      history: "Agendamento manual criado pela equipe.",
      surgery: "Nenhuma",
      pregnant: "Não",
      spf: "Uso diário",
      routine: "Básica",
      habits: "—",
      prev: "Primeiro atendimento",
      notes: "Encaixe manual realizado no painel de agenda.",
      consent: `Assinado em ${new Date().toLocaleDateString("pt-BR")}`,
    };

    saveClients([newAppointment, ...clients]);

    // Check slot
    const slotExists = daySlots.some((s) => s.time === manualTime);
    let nextSlots: DaySlot[];
    if (slotExists) {
      nextSlots = daySlots.map((s) => (s.time === manualTime ? { time: s.time, type: "client" as const, id: newId } : s));
    } else {
      nextSlots = [...daySlots, { time: manualTime, type: "client" as const, id: newId }].sort((a, b) =>
        a.time.localeCompare(b.time)
      );
    }
    saveDaySlots(nextSlots);

    // Reset and close
    setManualName("");
    setManualPhone("");
    setManualBookingOpen(false);
    toast.success(`Agendamento de ${newAppointment.name} confirmado às ${manualTime}!`);
  };

  // Save hours
  const handleSaveHours = () => {
    saveHours({
      days: tempHoursDays,
      start: tempHoursStart,
      end: tempHoursEnd,
    });
    setHoursConfigOpen(false);
    toast.success("Horários de atendimento atualizados com sucesso!");
  };

  // Toggle slot block
  const handleToggleSlotBlock = (time: string, currentType: "free" | "client" | "blocked") => {
    if (currentType === "client") return;
    const nextSlots = daySlots.map((s) => {
      if (s.time === time) {
        return {
          time: s.time,
          type: (s.type === "free" ? "blocked" : "free") as "free" | "blocked",
        };
      }
      return s;
    });
    saveDaySlots(nextSlots);
    toast(currentType === "free" ? `Horário ${time} bloqueado.` : `Horário ${time} liberado para agendamentos.`);
  };

  // KPI Calculations
  const totalRevenue = clients.reduce((acc, c) => {
    const raw = parseInt(c.price.replace(/\D/g, "")) || 0;
    return acc + raw;
  }, 0);
  const ticketMedio = clients.length > 0 ? Math.round(totalRevenue / clients.length) : 0;

  return (
    <div className="min-h-screen bg-[#000000] text-[#fafafa] selection:bg-[#ff5f8a] selection:text-black pb-28">
      {/* ============= TOPBAR ============= */}
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="relative grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-[#161616] text-[17px] font-black text-white shadow-sm">
            {merchant.name.charAt(0)}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black bg-[#2f7dff]" />
          </div>
          <div>
            <p className="text-[12px] font-normal text-white/55 leading-tight">Olá, bom dia 👋</p>
            <h1 className="text-[19px] font-bold text-white leading-tight">{merchant.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuickActionsOpen(true)}
            aria-label="Ações rápidas"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-[#161616] text-white hover:bg-[#262626] active:scale-95 transition"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            onClick={() => toast("Nenhuma nova notificação no momento")}
            aria-label="Notificações"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-[#161616] text-white hover:bg-[#262626] active:scale-95 transition"
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ============= HERO BANNER ============= */}
      <div className="px-5 mt-4">
        <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#ff5f8a] via-[#ef1f4d] to-[#8f0d24] p-6 text-white shadow-xl">
          <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/20 blur-xl" />

          <p className="relative z-10 text-[12px] font-bold uppercase tracking-wider text-white/85">
            SEU PERFIL ESTÁ NO AR
          </p>
          <h2 className="relative z-10 mt-2 max-w-[280px] text-[24px] font-black leading-tight tracking-tight">
            Um link só, com todos os seus serviços.
          </h2>
          <p className="relative z-10 mt-2 max-w-[310px] text-[13px] text-white/90 leading-relaxed font-light">
            Monte seu catálogo, compartilhe o link da sua placa NFC e receba agendamentos direto nesta agenda.
          </p>

          <div className="relative z-10 mt-5">
            <Link
              to="/c/$slug"
              params={{ slug: defaultMerchantSlug }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-bold text-black shadow-md hover:bg-neutral-100 active:scale-95 transition"
            >
              Ver meu site público <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ============= CATEGORIAS SCROLL ============= */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-bold text-white">Especialidades</h2>
          <span className="text-[12px] font-semibold text-white/55">5 categorias</span>
        </div>
        <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 scrollbar-none snap-x">
          {agendaCategories.map((c) => (
            <div
              key={c.key}
              className="flex w-[100px] shrink-0 snap-start flex-col items-start gap-3 rounded-2xl border border-white/10 bg-[#161616] p-3.5 text-white hover:border-white/20 hover:bg-[#1e1e1e] transition cursor-pointer"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#262626] text-base">
                {c.emoji}
              </span>
              <span className="text-[12px] font-semibold leading-tight">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ============= PRÓXIMOS AGENDAMENTOS (RESUMO) ============= */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-bold text-white">Próximos agendamentos</h2>
          <button
            onClick={() => setActiveView("dia")}
            className="text-[12px] font-semibold text-white/55 hover:text-white"
          >
            Ver todos ({clients.length})
          </button>
        </div>

        <div className="space-y-2.5">
          {clients.slice(0, 3).map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedClient(c);
                setModalTab("ficha");
              }}
              className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-[#161616] p-3.5 text-left transition hover:border-white/20 hover:bg-[#1e1e1e] active:scale-[0.99]"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#262626] text-[13px] font-bold text-white">
                {getInitials(c.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[14px] font-bold text-white truncate">{c.name}</span>
                  {c.vip && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ffb020] px-2 py-0.5 text-[9.5px] font-extrabold text-black">
                      VIP
                    </span>
                  )}
                </div>
                <p className="text-[11.5px] text-white/55 truncate">{c.service}</p>
                <p className="text-[11px] text-white/40">{c.phone}</p>
              </div>
              <div className="rounded-full bg-[#262626] px-3 py-1.5 text-[11.5px] font-bold text-white shrink-0">
                {c.timeOnly}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ============= AGENDA COMPLETA (SEGMENTED CONTROL: DIA / SEMANA / MÊS) ============= */}
      <div className="px-5 mt-8 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[20px] font-black text-white">Agenda Interativa</h2>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setDashboardOpen(true)}
              aria-label="Dashboard financeiro"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-[#161616] text-white hover:bg-[#262626]"
              title="Dashboard Financeiro"
            >
              <TrendingUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setTempHoursDays(hoursConfig.days);
                setTempHoursStart(hoursConfig.start);
                setTempHoursEnd(hoursConfig.end);
                setHoursConfigOpen(true);
              }}
              aria-label="Configurar horários"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-[#161616] text-white hover:bg-[#262626]"
              title="Configurar Horários"
            >
              <Clock className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Segmented Control */}
        <div className="inline-flex rounded-full border border-white/10 bg-[#161616] p-1 w-full">
          <button
            onClick={() => setActiveView("dia")}
            className={`flex-1 rounded-full py-2 text-[12.5px] font-bold transition ${
              activeView === "dia" ? "bg-white text-black shadow-sm" : "text-white/60 hover:text-white"
            }`}
          >
            Dia
          </button>
          <button
            onClick={() => setActiveView("semana")}
            className={`flex-1 rounded-full py-2 text-[12.5px] font-bold transition ${
              activeView === "semana" ? "bg-white text-black shadow-sm" : "text-white/60 hover:text-white"
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setActiveView("mes")}
            className={`flex-1 rounded-full py-2 text-[12.5px] font-bold transition ${
              activeView === "mes" ? "bg-white text-black shadow-sm" : "text-white/60 hover:text-white"
            }`}
          >
            Mês
          </button>
        </div>

        {/* Resumo de Horários */}
        <p className="mt-2.5 flex items-center gap-1.5 text-[11.5px] text-white/55">
          <Clock className="h-3.5 w-3.5" />
          Atendimento: {hoursConfig.days.join(", ")} · {hoursConfig.start} às {hoursConfig.end}
        </p>

        {/* ============= VIEW: DIA ============= */}
        {activeView === "dia" && (
          <div className="mt-4">
            {/* Date Nav */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#161616] p-3 mb-4">
              <button
                onClick={() => toast("Navegando para o dia anterior")}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#262626] text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-center">
                <span className="block text-[14px] font-bold text-white">Sexta-feira</span>
                <span className="text-[11px] text-white/55">11 de setembro</span>
              </div>
              <button
                onClick={() => toast("Navegando para o próximo dia")}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#262626] text-white hover:bg-white/20"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Slots List */}
            <div className="space-y-2.5">
              {daySlots.map((slot) => {
                if (slot.type === "client") {
                  const client = clients.find((c) => c.id === slot.id);
                  if (!client) return null;
                  return (
                    <button
                      key={slot.time}
                      onClick={() => {
                        setSelectedClient(client);
                        setModalTab("ficha");
                      }}
                      className="flex w-full flex-col gap-2 rounded-2xl border border-white/10 bg-[#161616] p-4 text-left hover:border-white/25 hover:bg-[#1e1e1e] transition active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#262626] text-[13px] font-bold text-white">
                          {getInitials(client.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[14px] font-bold text-white truncate">{client.name}</span>
                            {client.vip && (
                              <span className="inline-flex rounded-full bg-[#ffb020] px-2 py-0.5 text-[9px] font-extrabold text-black">
                                VIP
                              </span>
                            )}
                          </div>
                          <span className="text-[11.5px] text-white/55">{client.phone}</span>
                        </div>
                        <span className="rounded-full bg-[#262626] px-3 py-1 text-[12px] font-bold text-white">
                          {slot.time}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                        <div>
                          <b className="text-white block">{client.service}</b>
                          <span className="text-[11px] text-white/55">
                            {client.duration} · {client.price}
                          </span>
                        </div>
                        <span className="rounded-full bg-[#34c281]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#34c281]">
                          Confirmado
                        </span>
                      </div>
                    </button>
                  );
                }

                // Slot Livre ou Bloqueado
                return (
                  <div
                    key={slot.time}
                    className={`flex items-center justify-between rounded-xl p-3 border transition ${
                      slot.type === "blocked"
                        ? "border-red-900/40 bg-red-950/15 opacity-60"
                        : "border-dashed border-white/15 bg-transparent hover:border-white/30"
                    }`}
                  >
                    <span className="text-[13px] font-bold text-white/40 w-14">{slot.time}</span>
                    <span className="text-[12.5px] text-white/50 flex-1">
                      {slot.type === "blocked" ? "Horário Bloqueado" : "Disponível"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setManualTime(slot.time);
                          setManualBookingOpen(true);
                        }}
                        className="rounded-full bg-[#262626] px-3 py-1 text-[11px] font-semibold text-white hover:bg-white/20"
                      >
                        Encaixar
                      </button>
                      <button
                        onClick={() => handleToggleSlotBlock(slot.time, slot.type)}
                        className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/50 hover:text-white"
                      >
                        {slot.type === "blocked" ? "Desbloquear" : "Bloquear"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============= VIEW: SEMANA ============= */}
        {activeView === "semana" && (
          <div className="mt-4">
            <p className="text-xs text-white/55 mb-3">Arraste horizontalmente para visualizar os dias da semana:</p>
            <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-3 scrollbar-none snap-x">
              {[
                {
                  day: "Sex",
                  num: "11",
                  items: [
                    { time: "09:00", name: "Ana F.", id: "c1", free: false },
                    { time: "11:30", name: "Renata L.", id: "c2", free: false },
                    { time: "14:00", name: "Livre", id: undefined, free: true },
                    { time: "16:00", name: "Bianca S.", id: "c3", free: false },
                  ],
                },
                { day: "Sáb", num: "12", items: [{ time: "10:00", name: "Sem horários", id: undefined, free: true }] },
                { day: "Dom", num: "13", items: [{ time: "—", name: "Fechado", id: undefined, free: true }] },
                {
                  day: "Seg",
                  num: "14",
                  items: [
                    { time: "10:00", name: "Paula M.", id: undefined, free: false },
                    { time: "13:00", name: "Livre", id: undefined, free: true },
                    { time: "15:30", name: "Camila R.", id: undefined, free: false },
                  ],
                },
                { day: "Ter", num: "15", items: [{ time: "09:00", name: "Livre", id: undefined, free: true }] },
                { day: "Qua", num: "16", items: [{ time: "09:30", name: "Júlia R.", id: undefined, free: false }] },
                { day: "Qui", num: "17", items: [{ time: "11:00", name: "Livre", id: undefined, free: true }] },
              ].map((col) => (
                <div
                  key={col.day + col.num}
                  className="w-[130px] shrink-0 snap-start rounded-2xl border border-white/10 bg-[#161616] p-3 text-center"
                >
                  <div className="border-b border-white/10 pb-2 mb-3">
                    <span className="text-[11px] font-bold uppercase text-white/50 block">{col.day}</span>
                    <b className="text-[17px] font-black text-white">{col.num}</b>
                  </div>
                  <div className="space-y-1.5">
                    {col.items.map((it, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (it.id) {
                            const c = clients.find((x) => x.id === it.id);
                            if (c) {
                              setSelectedClient(c);
                              setModalTab("ficha");
                            }
                          }
                        }}
                        className={`rounded-xl p-2 text-left text-[11px] font-semibold transition ${
                          it.free
                            ? "border border-dashed border-white/15 text-white/40"
                            : "bg-[#262626] text-white hover:bg-[#333] cursor-pointer"
                        }`}
                      >
                        <span className="block text-[10px] text-white/50">{it.time}</span>
                        <span className="truncate block">{it.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============= VIEW: MÊS ============= */}
        {activeView === "mes" && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#161616] p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-white">Setembro de 2026</span>
              <span className="text-[11.5px] text-white/55">5 dias com agendamentos</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-[10.5px] font-bold text-white/40 uppercase">
              <span>D</span>
              <span>S</span>
              <span>T</span>
              <span>Q</span>
              <span>Q</span>
              <span>S</span>
              <span>S</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {/* Espaços vazios antes do dia 1 */}
              <div className="aspect-square" />
              <div className="aspect-square" />
              {Array.from({ length: 30 }).map((_, i) => {
                const dayNum = i + 1;
                const isToday = dayNum === 11;
                const hasAppt = [11, 14, 16, 21, 27].includes(dayNum);

                return (
                  <button
                    key={dayNum}
                    onClick={() => {
                      toast(`Dia ${dayNum} de setembro selecionado`);
                      setActiveView("dia");
                    }}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 text-[12px] font-semibold transition ${
                      isToday
                        ? "border-white bg-white text-black font-black"
                        : "border-white/5 bg-[#1e1e1e] text-white hover:border-white/20"
                    }`}
                  >
                    <span>{dayNum}</span>
                    {hasAppt && (
                      <span className={`h-1.5 w-1.5 rounded-full ${isToday ? "bg-black" : "bg-[#2f7dff]"}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ============= MODAL : FICHA DE ANAMNESE & MÍDIAS ============= */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-[32px] sm:rounded-[32px] bg-[#161616] border border-white/15 p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#262626] text-base font-bold text-white">
                  {getInitials(selectedClient.name)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[17px] font-bold text-white">{selectedClient.name}</h3>
                    {selectedClient.vip && (
                      <span className="rounded-full bg-[#ffb020] px-2 py-0.5 text-[9px] font-black text-black">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-white/55">{selectedClient.service}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                aria-label="Fechar"
                className="grid h-8 w-8 place-items-center rounded-full bg-[#262626] text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex rounded-full bg-[#1e1e1e] p-1 mb-5">
              <button
                onClick={() => setModalTab("ficha")}
                className={`flex-1 rounded-full py-2 text-[12px] font-bold transition ${
                  modalTab === "ficha" ? "bg-white text-black" : "text-white/60 hover:text-white"
                }`}
              >
                Ficha de Anamnese
              </button>
              <button
                onClick={() => setModalTab("media")}
                className={`flex-1 rounded-full py-2 text-[12px] font-bold transition ${
                  modalTab === "media" ? "bg-white text-black" : "text-white/60 hover:text-white"
                }`}
              >
                Mídias Inspiração
              </button>
            </div>

            {/* Content: Ficha */}
            {modalTab === "ficha" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-[#1e1e1e] p-3">
                    <span className="text-[10px] font-bold uppercase text-white/40 block">Telefone</span>
                    <strong className="text-white mt-0.5 block">{selectedClient.phone}</strong>
                  </div>
                  <div className="rounded-xl bg-[#1e1e1e] p-3">
                    <span className="text-[10px] font-bold uppercase text-white/40 block">Nascimento</span>
                    <strong className="text-white mt-0.5 block">{selectedClient.dob}</strong>
                  </div>
                  <div className="rounded-xl bg-[#1e1e1e] p-3">
                    <span className="text-[10px] font-bold uppercase text-white/40 block">Peso / Altura</span>
                    <strong className="text-white mt-0.5 block">{selectedClient.body}</strong>
                  </div>
                  <div className="rounded-xl bg-[#1e1e1e] p-3">
                    <span className="text-[10px] font-bold uppercase text-white/40 block">Tipo Sanguíneo</span>
                    <strong className="text-white mt-0.5 block">{selectedClient.blood}</strong>
                  </div>
                  <div className="rounded-xl bg-[#1e1e1e] p-3">
                    <span className="text-[10px] font-bold uppercase text-white/40 block">Horário Hoje</span>
                    <strong className="text-white mt-0.5 block">{selectedClient.time}</strong>
                  </div>
                  <div className="rounded-xl bg-[#1e1e1e] p-3">
                    <span className="text-[10px] font-bold uppercase text-white/40 block">Cliente Desde</span>
                    <strong className="text-white mt-0.5 block">{selectedClient.since}</strong>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#1e1e1e] p-4 space-y-3 text-xs">
                  <div>
                    <span className="text-[10.5px] font-bold uppercase text-white/40 block">Tipo de Pele</span>
                    <p className="text-white mt-0.5">{selectedClient.skin}</p>
                  </div>
                  <div>
                    <span className="text-[10.5px] font-bold uppercase text-white/40 block">Alergias Relatadas</span>
                    <p className="text-[#ff5f8a] font-semibold mt-0.5">{selectedClient.allergies}</p>
                  </div>
                  <div>
                    <span className="text-[10.5px] font-bold uppercase text-white/40 block">Medicamentos em Uso</span>
                    <p className="text-white mt-0.5">{selectedClient.meds}</p>
                  </div>
                  <div>
                    <span className="text-[10.5px] font-bold uppercase text-white/40 block">Observações do Profissional</span>
                    <p className="text-white/80 mt-0.5">{selectedClient.notes}</p>
                  </div>
                </div>

                {/* Consent */}
                <div className="flex items-center justify-between rounded-xl bg-[#1e1e1e] p-3.5 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-white/40 block">Termo de Consentimento</span>
                    <span className="text-white/80">{selectedClient.consent}</span>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[#34c281]">
                    <Check className="h-4 w-4" /> Assinado
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleCancelAppointment}
                    className="flex-1 rounded-2xl border border-white/15 bg-transparent py-3 text-[13px] font-bold text-white hover:bg-white/10 active:scale-95"
                  >
                    Cancelar Agendamento
                  </button>
                  <button
                    onClick={() => {
                      setRescheduleSelectedTime(null);
                      setRescheduleOpen(true);
                    }}
                    className="flex-1 rounded-2xl bg-white py-3 text-[13px] font-bold text-black hover:bg-neutral-200 active:scale-95 shadow-md"
                  >
                    Reagendar
                  </button>
                </div>
              </div>
            ) : (
              /* Content: Mídias */
              <div>
                <p className="text-xs text-white/55 mb-3">
                  Referências enviadas pela cliente para a realização deste procedimento:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "from-[#ff5f8a] to-[#ef1f4d]",
                    "from-[#8f7bff] to-[#4a2fc9]",
                    "from-[#6cd4b0] to-[#0e8f6a]",
                    "from-[#ffb84d] to-[#e0662b]",
                    "from-[#2f7dff] to-[#0a4a9a]",
                    "from-[#ef1f4d] to-[#8f0d24]",
                  ].map((grad, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-2xl bg-gradient-to-br ${grad} p-2 flex flex-col justify-end shadow-inner relative overflow-hidden`}
                    >
                      <span className="text-[10px] font-bold text-white drop-shadow">Ref #{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============= MODAL : REAGENDAR ============= */}
      {rescheduleOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
          <div className="relative w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-[#161616] border border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[17px] font-bold text-white">Reagendar Atendimento</h3>
              <button
                onClick={() => setRescheduleOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#262626] text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-white/55 mb-3">Cliente: <b>{selectedClient.name}</b></p>

            <label className="text-[11px] font-bold uppercase tracking-wider text-white/40 block mb-2">
              Escolha o dia
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {["Sex 11", "Sáb 12", "Seg 14", "Ter 15", "Qua 16", "Qui 17"].map((d) => (
                <button
                  key={d}
                  onClick={() => setRescheduleSelectedDay(d)}
                  className={`rounded-2xl px-4 py-2.5 text-xs font-bold shrink-0 transition ${
                    rescheduleSelectedDay === d ? "bg-white text-black" : "bg-[#262626] text-white hover:bg-[#333]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <label className="text-[11px] font-bold uppercase tracking-wider text-white/40 block mt-4 mb-2">
              Escolha o novo horário
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "17:00", "18:00"].map((t) => (
                <button
                  key={t}
                  onClick={() => setRescheduleSelectedTime(t)}
                  className={`rounded-xl py-2.5 text-xs font-bold transition ${
                    rescheduleSelectedTime === t ? "bg-white text-black" : "bg-[#262626] text-white hover:bg-[#333]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setRescheduleOpen(false)}
                className="flex-1 rounded-2xl border border-white/15 bg-transparent py-3 text-xs font-bold text-white hover:bg-white/10"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="flex-1 rounded-2xl bg-white py-3 text-xs font-bold text-black hover:bg-neutral-200 shadow-md"
              >
                Confirmar Reagendamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============= MODAL : AGENDAMENTO MANUAL (ENCAIXE) ============= */}
      {manualBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
          <div className="relative w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-[#161616] border border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[17px] font-bold text-white">Agendamento Manual</h3>
              <button
                onClick={() => setManualBookingOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#262626] text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualBooking} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold uppercase text-white/40 block mb-1">
                  Nome da Cliente *
                </label>
                <input
                  required
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Ex: Carla Mendes"
                  className="w-full rounded-2xl border border-white/10 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold uppercase text-white/40 block mb-1">
                    WhatsApp *
                  </label>
                  <input
                    required
                    type="tel"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="(11) 98888-7777"
                    className="w-full rounded-2xl border border-white/10 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-white/40 block mb-1">
                    Horário *
                  </label>
                  <input
                    required
                    type="time"
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-white/40 block mb-1">
                  Serviço Desejado
                </label>
                <select
                  value={manualService}
                  onChange={(e) => setManualService(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none focus:border-white"
                >
                  {agendaServicesList.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.duration} · {s.price})
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={manualVip}
                  onChange={(e) => setManualVip(e.target.checked)}
                  className="rounded h-4 w-4 accent-[#ff5f8a]"
                />
                <span>Marcar cliente como VIP</span>
              </label>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setManualBookingOpen(false)}
                  className="flex-1 rounded-2xl border border-white/15 bg-transparent py-3.5 text-xs font-bold text-white hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-white py-3.5 text-xs font-bold text-black hover:bg-neutral-200 shadow-md"
                >
                  Confirmar Encaixe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============= MODAL : CONFIGURAR HORÁRIOS DE ATENDIMENTO ============= */}
      {hoursConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
          <div className="relative w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-[#161616] border border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[17px] font-bold text-white">Horário de Atendimento</h3>
              <button
                onClick={() => setHoursConfigOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#262626] text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-white/55 mb-4">
              Defina os dias da semana e horários em que seu comércio atende e recebe agendamentos online:
            </p>

            <label className="text-[11px] font-bold uppercase text-white/40 block mb-2">
              Dias de Atendimento
            </label>
            <div className="flex gap-1.5 flex-wrap mb-4">
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => {
                const active = tempHoursDays.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      if (active) {
                        setTempHoursDays(tempHoursDays.filter((x) => x !== d));
                      } else {
                        setTempHoursDays([...tempHoursDays, d]);
                      }
                    }}
                    className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${
                      active ? "bg-white text-black" : "bg-[#262626] text-white/60 hover:text-white"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-white/40 block mb-1">
                  Início
                </label>
                <input
                  type="time"
                  value={tempHoursStart}
                  onChange={(e) => setTempHoursStart(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#1e1e1e] px-4 py-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-white/40 block mb-1">
                  Fim
                </label>
                <input
                  type="time"
                  value={tempHoursEnd}
                  onChange={(e) => setTempHoursEnd(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#1e1e1e] px-4 py-3 text-sm text-white"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setHoursConfigOpen(false)}
                className="flex-1 rounded-2xl border border-white/15 bg-transparent py-3.5 text-xs font-bold text-white hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveHours}
                className="flex-1 rounded-2xl bg-white py-3.5 text-xs font-bold text-black hover:bg-neutral-200 shadow-md"
              >
                Salvar Horários
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============= MODAL : DASHBOARD FINANCEIRO ============= */}
      {dashboardOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-[32px] sm:rounded-[32px] bg-[#161616] border border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[17px] font-bold text-white">Dashboard Financeiro</h3>
              <button
                onClick={() => setDashboardOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#262626] text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
              <div className="rounded-2xl bg-[#1e1e1e] p-3 text-center">
                <span className="text-[10px] font-bold uppercase text-white/40 block">Faturamento</span>
                <strong className="text-[16px] font-black text-white mt-1 block">R$ {totalRevenue}</strong>
              </div>
              <div className="rounded-2xl bg-[#1e1e1e] p-3 text-center">
                <span className="text-[10px] font-bold uppercase text-white/40 block">Atendimentos</span>
                <strong className="text-[16px] font-black text-white mt-1 block">{clients.length}</strong>
              </div>
              <div className="rounded-2xl bg-[#1e1e1e] p-3 text-center">
                <span className="text-[10px] font-bold uppercase text-white/40 block">Ticket Médio</span>
                <strong className="text-[16px] font-black text-white mt-1 block">R$ {ticketMedio}</strong>
              </div>
            </div>

            {/* Simulated Chart SVG */}
            <div className="rounded-2xl border border-white/10 bg-[#1e1e1e] p-4 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 block mb-2">
                Desempenho da Semana
              </span>
              <svg viewBox="0 0 320 120" className="w-full h-28">
                <polyline
                  fill="none"
                  stroke="#ff5f8a"
                  strokeWidth="3"
                  points="20,90 70,60 120,75 170,30 220,50 270,20 300,35"
                />
                <circle cx="20" cy="90" r="4" fill="#ff5f8a" />
                <circle cx="70" cy="60" r="4" fill="#ff5f8a" />
                <circle cx="120" cy="75" r="4" fill="#ff5f8a" />
                <circle cx="170" cy="30" r="4" fill="#ff5f8a" />
                <circle cx="220" cy="50" r="4" fill="#ff5f8a" />
                <circle cx="270" cy="20" r="4" fill="#ff5f8a" />
                <circle cx="300" cy="35" r="4" fill="#ff5f8a" />
              </svg>
              <div className="flex justify-between text-[10px] text-white/40 mt-1">
                <span>Seg</span>
                <span>Ter</span>
                <span>Qua</span>
                <span>Qui</span>
                <span>Sex</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#1e1e1e] p-4 mb-4">
              <span className="text-[10px] font-bold uppercase text-white/40 block">
                Previsão para o próximo período
              </span>
              <p className="text-[15px] font-bold text-white mt-1">R$ {(totalRevenue * 1.35).toFixed(0)} estimado</p>
              <p className="text-[11px] text-white/50 mt-0.5">Com base no fluxo médio de agendamentos e toques na placa NFC.</p>
            </div>

            <button
              onClick={() => setDashboardOpen(false)}
              className="w-full rounded-2xl bg-white py-3.5 text-xs font-bold text-black hover:bg-neutral-200"
            >
              Fechar Dashboard
            </button>
          </div>
        </div>
      )}

      {/* ============= MODAL : AÇÕES RÁPIDAS ( + ) ============= */}
      {quickActionsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
          <div className="relative w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-[#161616] border border-white/15 p-6 shadow-2xl space-y-2.5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[17px] font-bold text-white">Ações da Agenda</h3>
              <button
                onClick={() => setQuickActionsOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#262626] text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => {
                setQuickActionsOpen(false);
                setManualBookingOpen(true);
              }}
              className="flex w-full items-center gap-3.5 rounded-2xl border border-white/10 bg-[#1e1e1e] p-3.5 text-left hover:bg-[#262626]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#262626] text-white">
                <CalendarCheck className="h-5 w-5" />
              </span>
              <div>
                <b className="text-[13.5px] text-white block">Agendamento Manual</b>
                <span className="text-[11.5px] text-white/50">Encaixar uma cliente com horário</span>
              </div>
            </button>

            <button
              onClick={() => {
                setQuickActionsOpen(false);
                setDashboardOpen(true);
              }}
              className="flex w-full items-center gap-3.5 rounded-2xl border border-white/10 bg-[#1e1e1e] p-3.5 text-left hover:bg-[#262626]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#262626] text-white">
                <TrendingUp className="h-5 w-5" />
              </span>
              <div>
                <b className="text-[13.5px] text-white block">Dashboard Financeiro</b>
                <span className="text-[11.5px] text-white/50">Faturamento, atendimentos e previsão</span>
              </div>
            </button>

            <button
              onClick={() => {
                setQuickActionsOpen(false);
                setHoursConfigOpen(true);
              }}
              className="flex w-full items-center gap-3.5 rounded-2xl border border-white/10 bg-[#1e1e1e] p-3.5 text-left hover:bg-[#262626]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#262626] text-white">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <b className="text-[13.5px] text-white block">Configurar Horários</b>
                <span className="text-[11.5px] text-white/50">Definir dias e horário de funcionamento</span>
              </div>
            </button>

            <button
              onClick={() => {
                setQuickActionsOpen(false);
                setPaymentConfigOpen(true);
              }}
              className="flex w-full items-center gap-3.5 rounded-2xl border border-white/10 bg-[#1e1e1e] p-3.5 text-left hover:bg-[#262626]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#262626] text-white">
                <CreditCard className="h-5 w-5" />
              </span>
              <div>
                <b className="text-[13.5px] text-white block">Configurar Pagamentos</b>
                <span className="text-[11.5px] text-white/50">Pix via API SyncPayments, InfinitePay ou local</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ============= MODAL : CONFIGURAR PAGAMENTOS ============= */}
      {paymentConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
          <div className="relative w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-[#161616] border border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[17px] font-bold text-white">Configurar Pagamentos</h3>
              <button
                onClick={() => setPaymentConfigOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#262626] text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-white/55 mb-4">
              Escolha como você quer receber pelos agendamentos e serviços:
            </p>

            <div className="space-y-3 mb-5">
              <div className="rounded-2xl border border-white/15 bg-[#1e1e1e] p-4 flex items-center justify-between">
                <div>
                  <b className="text-[13.5px] text-white block">Pix via API (SyncPayments)</b>
                  <span className="text-[11.5px] text-white/55">Recebimento instantâneo com baixa automática</span>
                </div>
                <span className="rounded-full bg-[#34c281]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#34c281]">
                  Ativo
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#1e1e1e] p-4 flex items-center justify-between">
                <div>
                  <b className="text-[13.5px] text-white block">InfinitePay</b>
                  <span className="text-[11.5px] text-white/55">Checkout com cartão de crédito, Pix e boleto</span>
                </div>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white/60">
                  Opcional
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#1e1e1e] p-4 flex items-center justify-between">
                <div>
                  <b className="text-[13.5px] text-white block">Pagamento no Local</b>
                  <span className="text-[11.5px] text-white/55">Cliente paga após a realização do procedimento</span>
                </div>
                <span className="rounded-full bg-[#34c281]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#34c281]">
                  Padrão
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setPaymentConfigOpen(false);
                toast.success("Configurações de pagamento salvas!");
              }}
              className="w-full rounded-2xl bg-white py-3.5 text-xs font-bold text-black hover:bg-neutral-200"
            >
              Concluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
