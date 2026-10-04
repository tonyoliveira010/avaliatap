import { useState } from "react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  Check,
  User,
  Phone,
  FileText,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  MapPin,
  CalendarCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type Merchant } from "@/lib/merchants";

export type BookingService = {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  category?: string;
};

const defaultServices: BookingService[] = [
  {
    id: "limpeza-profunda",
    name: "Limpeza de Pele Profunda & Detox",
    duration: "60 min",
    price: 160,
    description: "Higienização profunda, vapor de ozônio, extração sem marcas e máscara calmante.",
    category: "Facial",
  },
  {
    id: "glow-revitalizante",
    name: "Protocolo Facial Glow & Vitamina C",
    duration: "50 min",
    price: 190,
    description: "Peeling de diamante, ionização de ativos iluminadores e hidratação com ácido hialurônico.",
    category: "Facial",
  },
  {
    id: "drenagem-corporal",
    name: "Drenagem Linfática Corporal",
    duration: "60 min",
    price: 150,
    description: "Manobras suaves e ritmadas para redução de retenção líquida e alívio do inchaço.",
    category: "Corporal",
  },
  {
    id: "massagem-relaxante",
    name: "Massagem Relaxante com Aromaterapia",
    duration: "50 min",
    price: 170,
    description: "Técnica integrativa com óleos essenciais aquecidos para relaxamento muscular total.",
    category: "Bem-estar",
  },
  {
    id: "design-sobrancelhas",
    name: "Design de Sobrancelhas & Alinhamento",
    duration: "35 min",
    price: 75,
    description: "Visagismo facial personalizado, higienização e acabamento de alta precisão.",
    category: "Express",
  },
];

const availableTimeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "13:30",
  "14:30",
  "15:30",
  "16:30",
  "17:30",
  "18:30",
];

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchant: Merchant;
}

export function BookingModal({ open, onOpenChange, merchant }: BookingModalProps) {
  // Step 1: Select & Form, Step 2: Summary & Confirmation, Step 3: Success
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Selections
  const [selectedServiceId, setSelectedServiceId] = useState<string>(defaultServices[0].id);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<string>("14:30");

  // Client form
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [protocolCode, setProtocolCode] = useState("");

  // Dates for next 14 days
  const today = new Date();
  const availableDates = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  const selectedService = defaultServices.find((s) => s.id === selectedServiceId) ?? defaultServices[0];
  const selectedDate = availableDates[selectedDateIndex] ?? today;

  const handleAdvanceToSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      toast.error("Por favor, digite seu nome completo.");
      return;
    }
    if (!clientPhone.trim() || clientPhone.replace(/\D/g, "").length < 8) {
      toast.error("Por favor, informe seu WhatsApp ou telefone válido.");
      return;
    }
    if (!selectedTime) {
      toast.error("Por favor, selecione um horário disponível.");
      return;
    }
    setStep(2);
  };

  const handleConfirmBooking = () => {
    const code = `AT-${Math.floor(1000 + Math.random() * 9000)}`;
    setProtocolCode(code);

    const bookingData = {
      code,
      merchantSlug: merchant.slug,
      merchantName: merchant.name,
      service: selectedService,
      date: selectedDate.toISOString(),
      time: selectedTime,
      clientName,
      clientPhone,
      notes,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem(`avaliatap-bookings-${merchant.slug}`) ?? "[]");
      localStorage.setItem(
        `avaliatap-bookings-${merchant.slug}`,
        JSON.stringify([bookingData, ...existing])
      );
    } catch {
      // ignore
    }

    toast.success("Agendamento confirmado com sucesso!");
    setStep(3);
  };

  const formattedDate = format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const getWhatsAppBookingLink = () => {
    const message = encodeURIComponent(
      `Olá, ${merchant.name}! Gostaria de confirmar meu agendamento:\n\n` +
      `📌 *Serviço:* ${selectedService.name} (${selectedService.duration})\n` +
      `📅 *Data:* ${capitalizedDate}\n` +
      `⏰ *Horário:* ${selectedTime}\n` +
      `👤 *Nome:* ${clientName}\n` +
      `📞 *Telefone:* ${clientPhone}\n` +
      (notes ? `📝 *Observação:* ${notes}\n` : "") +
      `🔖 *Protocolo:* ${protocolCode}\n\n` +
      `Agradeço e aguardo a confirmação!`
    );
    const digits = merchant.whatsapp.replace(/\D/g, "");
    return `https://wa.me/${digits}?text=${message}`;
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after closing animation
    setTimeout(() => {
      setStep(1);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[92vh] w-[calc(100vw-32px)] max-w-lg overflow-y-auto rounded-[28px] border-border bg-background p-5 text-foreground sm:p-6 shadow-2xl">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
              <CalendarCheck className="h-3.5 w-3.5" />
              Agendamento Online
            </span>
            <span className="text-xs text-muted-foreground">· {merchant.name}</span>
          </div>

          <DialogTitle className="mt-2 text-xl font-extrabold tracking-tight text-foreground">
            {step === 1 && "Escolha seu serviço & horário"}
            {step === 2 && "Resumo do agendamento"}
            {step === 3 && "Horário Confirmado!"}
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground">
            {step === 1 && "Selecione o procedimento, a data desejada e informe seus dados de contato."}
            {step === 2 && "Revise as informações antes de finalizar seu agendamento."}
            {step === 3 && "Seu atendimento foi agendado com sucesso no sistema."}
          </DialogDescription>
        </DialogHeader>

        {/* STEP 1: SELECT SERVICE, DATE, TIME & CONTACT FORM */}
        {step === 1 && (
          <form onSubmit={handleAdvanceToSummary} className="mt-2 space-y-6">
            {/* Top: List of services */}
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <label className="text-[13px] font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  1. Selecione o serviço
                </label>
                <span className="text-[11px] text-muted-foreground">
                  {defaultServices.length} disponíveis
                </span>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {defaultServices.map((service) => {
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`relative flex cursor-pointer items-start justify-between gap-3 rounded-2xl border p-3.5 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                          : "border-border bg-surface hover:border-primary/40 hover:bg-muted/40"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-bold text-foreground leading-tight">
                            {service.name}
                          </p>
                          {service.category && (
                            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9.5px] font-semibold text-muted-foreground">
                              {service.category}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[11.5px] text-muted-foreground line-clamp-2">
                          {service.description}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {service.duration}
                          </span>
                          <span className="font-bold text-foreground">
                            R$ {service.price.toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background"
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calendar: Select Date */}
            <div>
              <label className="mb-2.5 text-[13px] font-bold text-foreground flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                2. Escolha o dia
              </label>

              <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
                {availableDates.map((date, idx) => {
                  const isSelected = selectedDateIndex === idx;
                  const isToday = idx === 0;
                  const weekday = isToday ? "Hoje" : format(date, "EEE", { locale: ptBR });
                  const dayNum = format(date, "dd");
                  const monthName = format(date, "MMM", { locale: ptBR });

                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      onClick={() => setSelectedDateIndex(idx)}
                      className={`flex min-w-[62px] flex-col items-center justify-center rounded-2xl border py-2.5 px-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-md scale-[1.02]"
                          : "border-border bg-surface text-foreground hover:bg-muted"
                      }`}
                    >
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                        isSelected ? "text-primary-foreground/90" : "text-muted-foreground"
                      }`}>
                        {weekday}
                      </span>
                      <span className="text-[17px] font-black leading-tight my-0.5">
                        {dayNum}
                      </span>
                      <span className={`text-[10px] font-medium uppercase ${
                        isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}>
                        {monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pills of Available Hours */}
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <label className="text-[13px] font-bold text-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  3. Horários disponíveis
                </label>
                <span className="text-[11px] text-muted-foreground">
                  {selectedTime ? `Selecionado: ${selectedTime}` : "Selecione um"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {availableTimeSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`flex items-center justify-center rounded-xl border py-2.5 text-[13px] font-bold transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-sm scale-102"
                          : "border-border bg-surface text-foreground hover:border-primary/50 hover:bg-muted"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
              <label className="text-[13px] font-bold text-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                4. Seus dados de contato
              </label>

              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  Nome completo *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex.: Mariana Silva"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 pl-9 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <User className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  WhatsApp / Telefone com DDD *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 pl-9 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Phone className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  Observações ou preferências (opcional)
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex.: Primeira vez, pele sensível, preferência de profissional..."
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 pl-9 text-[12.5px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <FileText className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Advance button */}
            <Button
              type="submit"
              className="w-full h-13 rounded-2xl bg-primary text-[14px] font-extrabold text-primary-foreground shadow-md hover:bg-primary/90"
            >
              Avançar para Resumo
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </form>
        )}

        {/* STEP 2: SUMMARY & CONFIRMATION */}
        {step === 2 && (
          <div className="mt-3 space-y-5">
            <div className="rounded-2xl border border-border bg-surface p-4 space-y-4">
              <div className="flex items-start justify-between border-b border-border pb-3.5">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                    Procedimento
                  </span>
                  <h4 className="text-[16px] font-bold text-foreground mt-0.5">
                    {selectedService.name}
                  </h4>
                  <p className="text-[12px] text-muted-foreground mt-0.5">
                    Duração estimada: {selectedService.duration}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[15px] font-extrabold text-foreground">
                    R$ {selectedService.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[13px] border-b border-border pb-3.5">
                <div className="rounded-xl bg-muted/50 p-2.5">
                  <span className="text-[10.5px] font-semibold text-muted-foreground flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" /> Data
                  </span>
                  <p className="mt-1 font-bold text-foreground text-[12.5px] leading-tight">
                    {capitalizedDate}
                  </p>
                </div>

                <div className="rounded-xl bg-muted/50 p-2.5">
                  <span className="text-[10.5px] font-semibold text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Horário
                  </span>
                  <p className="mt-1 font-bold text-foreground text-[14px] leading-tight">
                    {selectedTime}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-[12.5px]">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Cliente:</span>
                  <strong className="text-foreground">{clientName}</strong>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>WhatsApp:</span>
                  <strong className="text-foreground">{clientPhone}</strong>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Local:</span>
                  <span className="text-right text-foreground font-medium">{merchant.name}</span>
                </div>
                {notes && (
                  <div className="pt-2 border-t border-border/60">
                    <span className="text-[11px] font-semibold text-muted-foreground">Observação:</span>
                    <p className="text-[12px] text-foreground italic mt-0.5">{notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-primary/10 p-3 text-[12px] text-foreground flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 shrink-0 text-primary" />
              <span>
                Horário reservado com carência de 10 min. Confirmação instantânea!
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 h-12 rounded-2xl text-[13px] font-bold"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Voltar e editar
              </Button>
              <Button
                type="button"
                onClick={handleConfirmBooking}
                className="flex-[1.4] h-12 rounded-2xl bg-primary text-[13px] font-extrabold text-primary-foreground shadow-md hover:bg-primary/90"
              >
                <Check className="mr-1 h-4 w-4" />
                Confirmar Agendamento
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS & WHATSAPP ACTION */}
        {step === 3 && (
          <div className="mt-3 text-center space-y-5">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary">
              <CheckCircle2 className="h-10 w-10 text-primary animate-in zoom-in-75 duration-300" />
            </div>

            <div>
              <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-mono font-bold text-muted-foreground">
                Protocolo: {protocolCode}
              </span>
              <h3 className="mt-2 text-xl font-extrabold text-foreground">
                Agendamento Confirmado!
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground max-w-xs mx-auto">
                Tudo pronto para receber você, <b>{clientName}</b>! Seu horário foi reservado em <b>{merchant.name}</b>.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span>{capitalizedDate} às {selectedTime}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>{selectedService.name} (R$ {selectedService.price.toFixed(2).replace(".", ",")})</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="truncate">{merchant.address}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={getWhatsAppBookingLink()}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-[13px] font-extrabold text-white shadow-md active:scale-[0.99]"
              >
                <MessageCircle className="h-4 w-4 fill-white" />
                Enviar confirmação no WhatsApp
              </a>

              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full h-11 rounded-2xl text-xs font-bold"
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
