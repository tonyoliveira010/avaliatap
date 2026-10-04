import { useState } from "react";
import { X, Gift, Sparkles, ShieldCheck, Check, Phone, User, Calendar } from "lucide-react";
import { toast } from "sonner";
import { registerTenantCustomer } from "@/lib/customer";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  merchantName: string;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export function LeadCaptureModal({
  isOpen,
  onClose,
  slug,
  merchantName,
  onSuccess,
  title,
  description,
}: LeadCaptureModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const formatPhone = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 11);
    if (raw.length <= 2) return raw;
    if (raw.length <= 7) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Por favor, informe seu nome.");
      return;
    }
    const rawPhone = phone.replace(/\D/g, "");
    if (rawPhone.length < 10) {
      toast.error("Informe um WhatsApp válido com DDD.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      registerTenantCustomer(slug, {
        name,
        phone: rawPhone,
        birthDate: birthDate || undefined,
      });
      setLoading(false);
      toast.success(`🎉 Bem-vindo(a), ${name}! Você ganhou +100 créditos no ${merchantName}!`);
      onClose();
      if (onSuccess) onSuccess();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-t-[32px] sm:rounded-[32px] bg-background border border-border p-6 shadow-2xl">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-56 rounded-full bg-primary/20 blur-2xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header with Gift Icon */}
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Gift className="h-7 w-7" />
          </div>

          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-[11px] font-extrabold text-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> +100 CRÉDITOS DE BOAS-VINDAS
          </span>

          <h2 className="mt-2 text-[22px] font-extrabold tracking-tight text-foreground">
            {title || `Faça seu cadastro no ${merchantName}`}
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            {description ||
              "Cadastre-se em 20 segundos para liberar seus créditos, cupons exclusivos e participar do Clube de Fidelidade."}
          </p>
        </div>

        {/* Lead Capture Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          <div>
            <label className="flex items-center gap-1.5 text-[11.5px] font-bold text-foreground">
              <User className="h-3.5 w-3.5 text-primary" /> Seu Nome Completo <span className="text-primary">*</span>
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João da Silva"
              className="mt-1 h-12 w-full rounded-2xl border border-border bg-surface px-4 text-[14px] text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[11.5px] font-bold text-foreground">
              <Phone className="h-3.5 w-3.5 text-primary" /> WhatsApp / Celular com DDD <span className="text-primary">*</span>
            </label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(11) 99999-9999"
              className="mt-1 h-12 w-full rounded-2xl border border-border bg-surface px-4 text-[14px] text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[11.5px] font-bold text-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" /> Data de Aniversário <small className="text-muted-foreground font-normal">(opcional)</small>
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="mt-1 h-12 w-full rounded-2xl border border-border bg-surface px-4 text-[13px] text-foreground outline-none focus:border-primary"
            />
            <span className="mt-1 block text-[10.5px] text-muted-foreground">
              🎂 Para ganhar presentes e créditos surpresa no seu mês!
            </span>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-2.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <span>
              Cadastro exclusivo e confidencial para <strong>{merchantName}</strong>. Não compartilhado com terceiros ou outras empresas.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-[14px] font-extrabold text-primary-foreground shadow-md transition active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Cadastrar e Ganhar 100 Créditos"}
          </button>
        </form>
      </div>
    </div>
  );
}
