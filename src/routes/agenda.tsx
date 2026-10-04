import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  User,
  Users,
  X,
  Check,
  CreditCard,
  QrCode,
  DollarSign,
  ShieldCheck,
  SlidersHorizontal,
  ExternalLink,
  Copy,
  MessageCircle,
  FileText,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { defaultMerchantSlug, merchants } from "@/lib/merchants";
import {
  type AppointmentClient,
  type DaySlot,
  defaultAppointments,
  defaultDaySlots,
  agendaServicesList,
} from "@/lib/agenda-state";
import { useInfinitePay, generateInfinitePayLink } from "@/lib/infinitepay";
import { InfinitePayCheckoutModal } from "@/components/public/InfinitePayCheckoutModal";
import { InfinitePayConfigModal } from "@/components/app/InfinitePayConfigModal";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda de Atendimentos · AvaliaTap" },
      {
        name: "description",
        content: "Agenda completa de atendimentos: visão de dia, semana e mês.",
      },
      { property: "og:title", content: "Agenda de Atendimentos · AvaliaTap" },
      {
        property: "og:description",
        content: "Agenda completa por dia, semana e mês com cobrança InfinitePay.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AgendaOnlyPage,
});

export default function AgendaOnlyPage() {
  const merchant = merchants[defaultMerchantSlug]!;
  const { config: infinitePayConfig } = useInfinitePay(defaultMerchantSlug);

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

  // Current view: "dia" | "semana" | "mes"
  const [activeView, setActiveView] = useState<"dia" | "semana" | "mes">("dia");

  // Selected date reference (day, month, year)
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDayOfMonth, setSelectedDayOfMonth] = useState<number>(new Date().getDate());

  // Modals
  const [selectedClient, setSelectedClient] = useState<AppointmentClient | null>(null);
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [infinitePayModalOpen, setInfinitePayModalOpen] = useState(false);
  const [infinitePayConfigOpen, setInfinitePayConfigOpen] = useState(false);
  const [billingItem, setBillingItem] = useState<{ name: string; price: number } | null>(null);

  // New booking form state
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newService, setNewService] = useState(agendaServicesList[0].name);
  const [newTime, setNewTime] = useState("10:00");
  const [newPrice, setNewPrice] = useState(agendaServicesList[0].price);
  const [newVip, setNewVip] = useState(false);
  const [newNotes, setNewNotes] = useState("");

  // Reschedule form
  const [rescheduleDay, setRescheduleDay] = useState("Hoje");
  const [rescheduleTime, setRescheduleTime] = useState("14:00");

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

  // Helper for initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Date Navigation handlers
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (activeView === "dia") {
      d.setDate(d.getDate() - 1);
    } else if (activeView === "semana") {
      d.setDate(d.getDate() - 7);
    } else {
      d.setMonth(d.getMonth() - 1);
    }
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (activeView === "dia") {
      d.setDate(d.getDate() + 1);
    } else if (activeView === "semana") {
      d.setDate(d.getDate() + 7);
    } else {
      d.setMonth(d.getMonth() + 1);
    }
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDayOfMonth(new Date().getDate());
  };

  // Date label string based on active view
  const formattedDateLabel = useMemo(() => {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

    if (activeView === "dia") {
      const isToday = new Date().toDateString() === currentDate.toDateString();
      const dayName = weekdays[currentDate.getDay()];
      const dayNum = currentDate.getDate();
      const monthName = months[currentDate.getMonth()];
      return `${isToday ? "Hoje" : dayName}, ${dayNum} de ${monthName}`;
    }

    if (activeView === "semana") {
      // Find Monday of the current week
      const d = new Date(currentDate);
      const day = d.getDay();
      const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diffToMonday));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return `${monday.getDate()} ${months[monday.getMonth()].slice(0, 3)} — ${sunday.getDate()} ${months[sunday.getMonth()].slice(0, 3)} ${sunday.getFullYear()}`;
    }

    return `${months[currentDate.getMonth()]} de ${currentDate.getFullYear()}`;
  }, [currentDate, activeView]);

  // Handle New Booking Submission
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      toast.error("Por favor, preencha o nome e o telefone do cliente.");
      return;
    }

    const newId = "c-" + Date.now();
    const newAppointment: AppointmentClient = {
      id: newId,
      name: newName.trim(),
      vip: newVip,
      phone: newPhone.trim(),
      dob: "—",
      since: "Hoje",
      service: newService,
      duration: "45 min",
      price: newPrice.startsWith("R$") ? newPrice : `R$ ${newPrice}`,
      status: "Confirmado",
      time: `Hoje, ${newTime}`,
      timeOnly: newTime,
      body: "—",
      blood: "—",
      skin: "Normal",
      allergies: "Nenhuma relatada",
      meds: "Nenhum",
      history: "Agendamento registrado no painel de agenda.",
      surgery: "Nenhuma",
      pregnant: "Não",
      spf: "Uso diário",
      routine: "Básica",
      habits: "—",
      prev: "Primeiro atendimento",
      notes: newNotes.trim() || "Agendado via painel de agenda.",
      consent: `Assinado em ${new Date().toLocaleDateString("pt-BR")}`,
    };

    saveClients([newAppointment, ...clients]);

    // Check if slot exists or create
    const slotExists = daySlots.some((s) => s.time === newTime);
    let nextSlots: DaySlot[];
    if (slotExists) {
      nextSlots = daySlots.map((s) =>
        s.time === newTime ? { time: s.time, type: "client" as const, id: newId } : s
      );
    } else {
      nextSlots = [...daySlots, { time: newTime, type: "client" as const, id: newId }].sort((a, b) =>
        a.time.localeCompare(b.time)
      );
    }
    saveDaySlots(nextSlots);

    setNewName("");
    setNewPhone("");
    setNewNotes("");
    setNewBookingModalOpen(false);
    toast.success(`Agendamento de ${newAppointment.name} confirmado às ${newTime}!`);
  };

  // Toggle slot block
  const handleToggleBlock = (time: string, currentType: "free" | "client" | "blocked") => {
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
    toast(currentType === "free" ? `Horário ${time} bloqueado.` : `Horário ${time} liberado.`);
  };

  // Cancel Appointment
  const handleCancelAppointment = () => {
    if (!selectedClient) return;
    const clientId = selectedClient.id;

    const nextSlots = daySlots.map((s) => (s.id === clientId ? { time: s.time, type: "free" as const } : s));
    saveDaySlots(nextSlots);

    const nextClients = clients.map((c) =>
      c.id === clientId ? { ...c, status: "Cancelado" as const } : c
    );
    saveClients(nextClients);

    setSelectedClient(null);
    toast.success("Agendamento marcado como cancelado.");
  };

  // Mark Completed
  const handleCompleteAppointment = () => {
    if (!selectedClient) return;
    const clientId = selectedClient.id;
    const nextClients = clients.map((c) =>
      c.id === clientId ? { ...c, status: "Concluído" as const } : c
    );
    saveClients(nextClients);
    setSelectedClient(null);
    toast.success("Atendimento marcado como concluído!");
  };

  // Reschedule
  const handleReschedule = () => {
    if (!selectedClient) return;
    const clientId = selectedClient.id;

    const nextClients = clients.map((c) => {
      if (c.id === clientId) {
        return {
          ...c,
          time: `${rescheduleDay}, ${rescheduleTime}`,
          timeOnly: rescheduleTime,
          status: "Confirmado" as const,
        };
      }
      return c;
    });
    saveClients(nextClients);

    const nextSlots = daySlots.map((s) => {
      if (s.id === clientId) return { time: s.time, type: "free" as const };
      if (s.time === rescheduleTime) return { time: s.time, type: "client" as const, id: clientId };
      return s;
    });
    saveDaySlots(nextSlots);

    setRescheduleModalOpen(false);
    setSelectedClient(null);
    toast.success(`Agendamento remarcado para ${rescheduleDay} às ${rescheduleTime}!`);
  };

  // Open InfinitePay payment modal for an appointment
  const handleOpenInfinitePayForClient = (client: AppointmentClient) => {
    const numericPrice = parseFloat(client.price.replace(/[^\d,.-]/g, "").replace(",", ".")) || 100;
    setBillingItem({
      name: `${client.service} (${client.name})`,
      price: numericPrice,
    });
    setInfinitePayModalOpen(true);
  };

  // Send WhatsApp message with InfinitePay Link
  const handleSendWhatsAppWithPayment = (client: AppointmentClient) => {
    const numericPrice = parseFloat(client.price.replace(/[^\d,.-]/g, "").replace(",", ".")) || 100;
    const { checkoutUrl } = generateInfinitePayLink(defaultMerchantSlug, client.service, numericPrice);
    const cleanPhone = client.phone.replace(/\D/g, "");

    const msg = `Olá ${client.name}! Tudo bem?\n\nPassando para confirmar o seu agendamento de *${client.service}* na *${merchant.name}* (${client.time}).\n\n💳 Para facilitar, você pode efetuar o pagamento com antecedência via *InfinitePay* (Pix com confirmação instantânea ou em até 12x no cartão de crédito):\n👉 ${checkoutUrl}\n\nQualquer dúvida, estamos à disposição!`;

    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // KPI Calculations
  const totalRevenue = clients.reduce((acc, c) => {
    const raw = parseInt(c.price.replace(/\D/g, "")) || 0;
    return acc + raw;
  }, 0);
  const confirmedCount = clients.filter((c) => c.status === "Confirmado").length;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-[#0066ff] selection:text-white pb-32 font-sans transition-colors duration-200">
      {/* ==================== AGENDA TOPBAR & CONTROLS ==================== */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur-md px-4 pt-5 pb-3.5 space-y-3">
        {/* Row 1: Brand & Top Actions */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[24px] font-extrabold tracking-tight text-foreground">Agenda</h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                InfinitePay Ativo
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground truncate mt-0.5">
              {merchant.name} · Atendimentos e Horários
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setInfinitePayConfigOpen(true)}
              title="Configurar InfinitePay"
              className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-2 text-[11.5px] font-bold text-foreground hover:border-emerald-500/50 hover:bg-muted/40 transition active:scale-95 shadow-sm"
            >
              <span className="font-extrabold text-[12px] text-emerald-500">∞</span> InfinitePay
            </button>
            <button
              onClick={() => setNewBookingModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-[12px] font-extrabold text-primary-foreground hover:opacity-90 transition active:scale-95 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Novo
            </button>
          </div>
        </div>

        {/* Row 2: Fluid Date Navigator */}
        <div className="flex items-center justify-between rounded-full border border-border bg-surface px-2.5 py-1.5 shadow-sm">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              aria-label="Data anterior"
              className="grid h-7 w-7 place-items-center rounded-full border border-border bg-muted/50 text-foreground hover:bg-muted active:scale-95 transition"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleToday}
              className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-bold text-foreground hover:bg-muted transition"
            >
              Hoje
            </button>
            <button
              onClick={handleNext}
              aria-label="Próxima data"
              className="grid h-7 w-7 place-items-center rounded-full border border-border bg-muted/50 text-foreground hover:bg-muted active:scale-95 transition"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 min-w-0 px-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-[13px] font-bold text-foreground truncate text-center">
              {formattedDateLabel}
            </span>
          </div>

          <div className="w-[60px] text-right">
            <span className="rounded-full bg-muted px-2 py-0.5 text-[9.5px] font-extrabold text-muted-foreground uppercase tracking-wider">
              {activeView}
            </span>
          </div>
        </div>

        {/* Row 3: Segmented View Switcher (Dia | Semana | Mês) */}
        <div className="rounded-full border border-border bg-muted p-1 grid grid-cols-3 gap-1 shadow-inner">
          {(["dia", "semana", "mes"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className={`rounded-full py-1.5 text-[12px] font-extrabold transition-all capitalize ${
                activeView === v
                  ? "bg-surface text-foreground shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v === "mes" ? "Mês" : v === "semana" ? "Semana" : "Dia"}
            </button>
          ))}
        </div>

        {/* Row 4: Unified Summary Bar (3 agendamento(s) · 3 confirmados · Previsão: R$ 400) */}
        <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-surface/80 px-3.5 py-2.5 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-2 text-[12px] min-w-0">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-bold text-foreground truncate">
              {clients.length} agendamento(s) · <span className="text-emerald-500 font-extrabold">{confirmedCount} confirmados</span>
            </span>
          </div>

          <div className="text-right shrink-0 pl-2">
            <span className="text-[11.5px] text-muted-foreground">
              Previsão: <strong className="text-[13.5px] font-black text-foreground">R$ {totalRevenue}</strong>
            </span>
          </div>
        </div>
      </header>

      {/* ==================== VIEWS CONTENT ==================== */}
      <main className="px-4 mt-4">
        {/* ================= VIEW 1: DIA ================= */}
        {activeView === "dia" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[14px] font-bold text-muted-foreground">Linha do Tempo (Horários)</h2>
              <span className="text-[11px] text-muted-foreground/70">Toque no cliente para detalhes e cobrança</span>
            </div>

            <div className="space-y-2.5">
              {daySlots.map((slot) => {
                const client = slot.id ? clients.find((c) => c.id === slot.id) : null;

                if (slot.type === "client" && client) {
                  return (
                    <div
                      key={slot.time}
                      className="group flex flex-col rounded-2xl border border-border bg-surface p-3.5 transition hover:border-primary/40 hover:bg-muted/30 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div
                          onClick={() => setSelectedClient(client)}
                          className="flex flex-1 items-center gap-3 cursor-pointer min-w-0"
                        >
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-[13px] font-bold text-secondary-foreground shadow-sm">
                            {getInitials(client.name)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[14px] font-bold text-foreground truncate">
                                {client.name}
                              </span>
                              {client.vip && (
                                <span className="rounded-full bg-[#ffb020] px-1.5 py-0.2 text-[9px] font-extrabold text-black">
                                  VIP
                                </span>
                              )}
                              <span
                                className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold ${
                                  client.status === "Confirmado"
                                    ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                                    : client.status === "Concluído"
                                    ? "bg-blue-500/15 text-blue-500"
                                    : "bg-red-500/15 text-red-500"
                                }`}
                              >
                                {client.status}
                              </span>
                            </div>
                            <p className="text-[12px] text-muted-foreground truncate">
                              {client.service} · {client.duration}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="rounded-full bg-muted px-2.5 py-1 text-[12px] font-bold text-foreground">
                            {slot.time}
                          </span>
                          <p className="mt-1 text-[12px] font-bold text-emerald-500">{client.price}</p>
                        </div>
                      </div>

                      {/* Quick Action Footer */}
                      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSendWhatsAppWithPayment(client)}
                            title="Cobrar via WhatsApp com link InfinitePay"
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-500 hover:bg-emerald-500/20 transition active:scale-95"
                          >
                            <MessageCircle className="h-3 w-3" /> Cobrar InfinitePay
                          </button>
                          <button
                            onClick={() => handleOpenInfinitePayForClient(client)}
                            title="Abrir Checkout Pix / Cartão InfinitePay"
                            className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[11px] font-bold text-foreground hover:bg-muted/80 transition active:scale-95"
                          >
                            <QrCode className="h-3 w-3" /> Pix / 12x
                          </button>
                        </div>

                        <button
                          onClick={() => setSelectedClient(client)}
                          className="text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                        >
                          Ver ficha &gt;
                        </button>
                      </div>
                    </div>
                  );
                }

                if (slot.type === "blocked") {
                  return (
                    <div
                      key={slot.time}
                      className="flex items-center justify-between rounded-2xl border border-dashed border-red-500/30 bg-red-500/5 px-4 py-3"
                    >
                      <div className="flex items-center gap-2 text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-[12.5px] font-semibold">Horário Bloqueado ({slot.time})</span>
                      </div>
                      <button
                        onClick={() => handleToggleBlock(slot.time, "blocked")}
                        className="rounded-full bg-muted px-3 py-1 text-[11px] font-bold text-foreground hover:bg-muted/80 transition"
                      >
                        Desbloquear
                      </button>
                    </div>
                  );
                }

                // Free slot
                return (
                  <div
                    key={slot.time}
                    className="flex items-center justify-between rounded-2xl border border-dashed border-border bg-muted/20 px-4 py-3 transition hover:border-primary/40 hover:bg-muted/40"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[12px] font-bold text-muted-foreground">{slot.time}</span>
                      <span className="text-[12.5px] text-muted-foreground">Horário livre</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setNewTime(slot.time);
                          setNewBookingModalOpen(true);
                        }}
                        className="rounded-full bg-surface border border-border px-3 py-1 text-[11px] font-bold text-foreground hover:bg-muted transition flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="h-3 w-3" /> Encaixar
                      </button>
                      <button
                        onClick={() => handleToggleBlock(slot.time, "free")}
                        className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground transition"
                      >
                        Bloquear
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= VIEW 2: SEMANA ================= */}
        {activeView === "semana" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-muted-foreground">Grade Semanal de Atendimentos</h2>
              <span className="text-[11px] text-muted-foreground/70">Segunda a Domingo</span>
            </div>

            {/* 7 Days Cards */}
            <div className="space-y-3">
              {[
                { day: "Segunda-feira", short: "Seg", date: "14 Out", count: 2, total: "R$ 250" },
                { day: "Terça-feira", short: "Ter", date: "15 Out", count: 4, total: "R$ 510" },
                { day: "Quarta-feira", short: "Qua", date: "16 Out", count: 1, total: "R$ 90" },
                { day: "Quinta-feira", short: "Qui", date: "17 Out", count: 3, total: "R$ 370" },
                { day: "Sexta-feira", short: "Sex", date: "18 Out", count: 5, total: "R$ 680", isToday: true },
                { day: "Sábado", short: "Sáb", date: "19 Out", count: 6, total: "R$ 890" },
                { day: "Domingo", short: "Dom", date: "20 Out", count: 0, total: "R$ 0", closed: true },
              ].map((w, idx) => (
                <div
                  key={w.day}
                  className={`rounded-2xl border p-4 transition shadow-sm ${
                    w.isToday
                      ? "border-emerald-500/50 bg-emerald-500/10"
                      : "border-border bg-surface"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`grid h-8 w-8 place-items-center rounded-xl text-[12px] font-black ${
                          w.isToday ? "bg-emerald-500 text-black" : "bg-muted text-foreground"
                        }`}
                      >
                        {w.short}
                      </span>
                      <div>
                        <p className="text-[13px] font-bold text-foreground">{w.day}</p>
                        <p className="text-[11px] text-muted-foreground">{w.date}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      {w.closed ? (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          Fechado
                        </span>
                      ) : (
                        <>
                          <p className="text-[12px] font-bold text-foreground">{w.count} atendimentos</p>
                          <p className="text-[11px] font-bold text-emerald-500">{w.total}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW 3: MÊS ================= */}
        {activeView === "mes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-muted-foreground">Calendário Mensal</h2>
              <span className="text-[11px] text-muted-foreground/70">Selecione um dia</span>
            </div>

            {/* Calendar Grid */}
            <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
                  <span key={d} className="text-[11px] font-bold text-muted-foreground">
                    {d}
                  </span>
                ))}
              </div>

              {/* Days numbers */}
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {/* Empty offset days for month alignment */}
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-10 rounded-xl bg-transparent" />
                ))}

                {Array.from({ length: 31 }).map((_, i) => {
                  const dayNum = i + 1;
                  const isSelected = selectedDayOfMonth === dayNum;
                  const isToday = dayNum === new Date().getDate();
                  const hasAppointments = [3, 7, 10, 11, 14, 15, 18, 22, 25, 29].includes(dayNum);

                  return (
                    <button
                      key={dayNum}
                      onClick={() => setSelectedDayOfMonth(dayNum)}
                      className={`relative flex flex-col items-center justify-center h-11 rounded-xl transition ${
                        isSelected
                          ? "bg-primary text-primary-foreground font-black shadow-md scale-105 z-10"
                          : isToday
                          ? "border border-emerald-500/60 bg-emerald-500/10 text-emerald-500 font-bold"
                          : "bg-muted/40 text-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="text-[13px]">{dayNum}</span>
                      {hasAppointments && (
                        <span
                          className={`mt-0.5 h-1.5 w-1.5 rounded-full ${
                            isSelected ? "bg-primary-foreground" : "bg-emerald-500"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Day Agenda Preview */}
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3 border-b border-border pb-2.5">
                <div>
                  <h3 className="text-[14px] font-bold text-foreground">
                    Dia {selectedDayOfMonth} selecionado
                  </h3>
                  <p className="text-[11px] text-muted-foreground">3 clientes agendados para esta data</p>
                </div>
                <button
                  onClick={() => {
                    setActiveView("dia");
                  }}
                  className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground hover:opacity-90 transition shadow-sm"
                >
                  Abrir no Dia
                </button>
              </div>

              <div className="space-y-2">
                {clients.slice(0, 2).map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-xl bg-white/5 p-2.5 text-[12px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{c.timeOnly}</span>
                      <span className="text-white/80">{c.name}</span>
                      <span className="text-white/40">({c.service})</span>
                    </div>
                    <span className="font-bold text-emerald-400">{c.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==================== MODAL: NOVO AGENDAMENTO ==================== */}
      {newBookingModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setNewBookingModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#121212] p-5 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-white text-black font-bold">
                  +
                </div>
                <h2 className="text-[16px] font-bold text-white">Novo Agendamento</h2>
              </div>
              <button
                onClick={() => setNewBookingModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[12px] font-bold text-white mb-1">
                  Nome do Cliente <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Amanda Silva"
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 px-3.5 text-[13px] text-white placeholder:text-white/30 focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-white mb-1">
                  WhatsApp do Cliente <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="(11) 98888-7777"
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 px-3.5 text-[13px] text-white placeholder:text-white/30 focus:border-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[12px] font-bold text-white mb-1">Horário</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 px-3 text-[13px] text-white focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-white mb-1">Valor (R$)</label>
                  <input
                    type="text"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="R$ 150"
                    className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 px-3 text-[13px] text-white focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-white mb-1">Serviço</label>
                <select
                  value={newService}
                  onChange={(e) => {
                    setNewService(e.target.value);
                    const found = agendaServicesList.find((s) => s.name === e.target.value);
                    if (found) setNewPrice(found.price);
                  }}
                  className="w-full rounded-xl border border-white/15 bg-[#1e1e1e] py-2.5 px-3 text-[13px] text-white focus:border-white focus:outline-none"
                >
                  {agendaServicesList.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white/5 p-3 border border-white/10">
                <span className="text-[12.5px] font-medium text-white">Cliente VIP / Prioritário</span>
                <input
                  type="checkbox"
                  checked={newVip}
                  onChange={(e) => setNewVip(e.target.checked)}
                  className="h-4 w-4 rounded accent-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-white mb-1">Observações</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Preferências, produtos ou histórico..."
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2 px-3 text-[12.5px] text-white placeholder:text-white/30 focus:border-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewBookingModalOpen(false)}
                  className="flex-1 rounded-xl border border-white/15 py-2.5 text-[12.5px] font-bold text-white hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-white py-2.5 text-[12.5px] font-bold text-black hover:bg-neutral-200 transition"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: DETALHES DO AGENDAMENTO ==================== */}
      {selectedClient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedClient(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#121212] p-5 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[#262626] font-bold text-white">
                  {getInitials(selectedClient.name)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-[15.5px] font-bold text-white">{selectedClient.name}</h2>
                    {selectedClient.vip && (
                      <span className="rounded-full bg-[#ffb020] px-1.5 py-0.2 text-[9px] font-extrabold text-black">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-white/50">{selectedClient.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Info Summary */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 space-y-2 text-[12.5px]">
              <div className="flex items-center justify-between">
                <span className="text-white/50">Serviço</span>
                <span className="font-bold text-white">{selectedClient.service}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Horário</span>
                <span className="font-bold text-white">{selectedClient.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Duração</span>
                <span className="font-bold text-white">{selectedClient.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Valor</span>
                <span className="font-bold text-emerald-400">{selectedClient.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Status atual</span>
                <span className="font-bold text-white">{selectedClient.status}</span>
              </div>
            </div>

            {/* InfinitePay Action Box */}
            <div className="mt-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/25 p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-extrabold text-base">∞</span>
                  <span className="text-[12.5px] font-bold text-white">Cobrança InfinitePay</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400">Pix 0% · Cartão 12x</span>
              </div>
              <p className="text-[11px] text-white/60 mb-3">
                Envie o link seguro para o cliente pagar antecipadamente ou no balcão.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSendWhatsAppWithPayment(selectedClient)}
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-500 py-2.5 text-[11.5px] font-bold text-black hover:bg-emerald-400 transition"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Enviar WhatsApp
                </button>
                <button
                  onClick={() => handleOpenInfinitePayForClient(selectedClient)}
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-white/15 py-2.5 text-[11.5px] font-bold text-white hover:bg-white/25 transition"
                >
                  <QrCode className="h-3.5 w-3.5" /> Gerar Pix / 12x
                </button>
              </div>
            </div>

            {/* Anamnese quick notes */}
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-[11.5px] text-white/70">
              <p className="font-bold text-white mb-1">Anotações do Cliente:</p>
              <p>{selectedClient.notes}</p>
            </div>

            {/* Action buttons */}
            <div className="mt-4 space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={handleCompleteAppointment}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-[12px] font-bold text-white hover:bg-blue-500 transition"
                >
                  Marcar como Concluído
                </button>
                <button
                  onClick={() => setRescheduleModalOpen(true)}
                  className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2.5 text-[12px] font-bold text-white hover:bg-white/15 transition"
                >
                  Remarcar Horário
                </button>
              </div>

              <button
                onClick={handleCancelAppointment}
                className="w-full rounded-xl border border-red-500/20 text-red-400 py-2 text-[11.5px] font-semibold hover:bg-red-500/10 transition"
              >
                Cancelar este agendamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: REMARCAR AGENDAMENTO ==================== */}
      {rescheduleModalOpen && selectedClient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setRescheduleModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#121212] p-5 text-white shadow-2xl"
          >
            <h3 className="text-[15px] font-bold mb-3">Remarcar Horário de {selectedClient.name}</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-white/50 mb-1">Dia</label>
                <select
                  value={rescheduleDay}
                  onChange={(e) => setRescheduleDay(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#1e1e1e] p-2.5 text-[13px] text-white"
                >
                  <option value="Hoje">Hoje</option>
                  <option value="Amanhã">Amanhã</option>
                  <option value="Segunda">Segunda-feira</option>
                  <option value="Terça">Terça-feira</option>
                  <option value="Quarta">Quarta-feira</option>
                  <option value="Quinta">Quinta-feira</option>
                  <option value="Sexta">Sexta-feira</option>
                  <option value="Sábado">Sábado</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-white/50 mb-1">Horário</label>
                <input
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 p-2.5 text-[13px] text-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalOpen(false)}
                  className="flex-1 rounded-xl border border-white/15 py-2 text-[12px] font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleReschedule}
                  className="flex-1 rounded-xl bg-white py-2 text-[12px] font-bold text-black hover:bg-neutral-200"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: INFINITEPAY CONFIG ==================== */}
      <InfinitePayConfigModal
        isOpen={infinitePayConfigOpen}
        onClose={() => setInfinitePayConfigOpen(false)}
        slug={defaultMerchantSlug}
      />

      {/* ==================== MODAL: INFINITEPAY CHECKOUT MODAL ==================== */}
      {billingItem && (
        <InfinitePayCheckoutModal
          isOpen={infinitePayModalOpen}
          onClose={() => {
            setInfinitePayModalOpen(false);
            setBillingItem(null);
          }}
          slug={defaultMerchantSlug}
          item={billingItem}
          merchantName={merchant.name}
        />
      )}
    </div>
  );
}
