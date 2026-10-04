import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ChevronRight,
  Plus,
  Search,
  Ticket,
  UserRound,
  X,
  Phone,
  Mail,
  MessageCircle,
  Sparkles,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Send,
  FileCheck,
  Filter,
  Check,
  ExternalLink,
  ChevronDown,
  Layers,
  Star,
  Settings,
  Flame,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { defaultMerchantSlug, getMerchant } from "@/lib/merchants";
import { usePublicSettings } from "@/lib/public-settings";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Tipos do CRM de Clientes
export type ClientBooking = {
  id: string;
  code: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
  status: "Confirmado" | "Concluído" | "Cancelado";
};

export type ClientCoupon = {
  code: string;
  title: string;
  discount: string;
  status: "Disponível" | "Usado" | "Expirado";
  claimedAt: string;
  usedAt?: string;
};

export type ClientFormResponse = {
  id: string;
  formTitle: string;
  date: string;
  answers: { question: string; answer: string }[];
  score?: string;
};

export type ClientCampaign = {
  id: string;
  name: string;
  channel: "WhatsApp" | "Email";
  sentAt: string;
  status: "Enviado" | "Lido" | "Convertido";
};

export type Client = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  coupon: string;
  status: "Disponível" | "Usado" | "Expirado";
  createdAt: string;
  tags: string[];
  notes?: string;
  bookings: ClientBooking[];
  coupons: ClientCoupon[];
  formResponses: ClientFormResponse[];
  campaigns: ClientCampaign[];
};

const initialClients: Client[] = [
  {
    id: "1",
    name: "Mariana Costa",
    phone: "(11) 98881-2201",
    email: "mariana.costa@gmail.com",
    coupon: "BEMVINDO20",
    status: "Usado",
    createdAt: "10/09/2026",
    tags: ["Cliente VIP", "Estética Facial", "Agendamento Ativo"],
    notes: "Prefere atendimento no período da tarde. Pele sensível, evitar esfoliação química forte.",
    bookings: [
      {
        id: "b1",
        code: "AT-8219",
        serviceName: "Limpeza de Pele Profunda & Detox",
        date: "06/10/2026",
        time: "14:30",
        price: 160,
        status: "Confirmado",
      },
      {
        id: "b2",
        code: "AT-3102",
        serviceName: "Protocolo Facial Glow & Vitamina C",
        date: "12/09/2026",
        time: "15:00",
        price: 190,
        status: "Concluído",
      },
    ],
    coupons: [
      {
        code: "BEMVINDO20",
        title: "20% OFF Primeira Visita",
        discount: "20% OFF",
        status: "Usado",
        claimedAt: "10/09/2026 · 14:32",
        usedAt: "11/09/2026 · 16:08",
      },
      {
        code: "RETORNO10",
        title: "Bônus Fidelidade",
        discount: "10% OFF",
        status: "Disponível",
        claimedAt: "25/09/2026 · 10:15",
      },
    ],
    formResponses: [
      {
        id: "f1",
        formTitle: "Pesquisa de Satisfação Pós-Atendimento (NFC)",
        date: "12/09/2026",
        score: "⭐⭐⭐⭐⭐ 5.0",
        answers: [
          { question: "Como avalia o atendimento?", answer: "Excepcional! Muito atenciosa e cuidadosa." },
          { question: "Procedimentos de interesse futuro:", answer: "Protocolos faciais e massagem relaxante." },
        ],
      },
    ],
    campaigns: [
      {
        id: "c1",
        name: "Lembrete de Retorno 30 Dias",
        channel: "WhatsApp",
        sentAt: "28/09/2026",
        status: "Convertido",
      },
    ],
  },
  {
    id: "2",
    name: "Rafael Souza",
    phone: "(11) 97712-8430",
    email: "rafael.souza@outlook.com",
    coupon: "ALPHA10",
    status: "Disponível",
    createdAt: "11/09/2026",
    tags: ["Lead NFC", "Barbearia", "Cupom Ativo"],
    notes: "Aproximou celular na placa NFC do balcão. Interessado no corte + barba com hora marcada.",
    bookings: [
      {
        id: "b3",
        code: "AT-4491",
        serviceName: "Design & Alinhamento",
        date: "08/10/2026",
        time: "17:30",
        price: 75,
        status: "Confirmado",
      },
    ],
    coupons: [
      {
        code: "ALPHA10",
        title: "10% OFF no corte ou produto",
        discount: "10% OFF",
        status: "Disponível",
        claimedAt: "11/09/2026 · 09:15",
      },
    ],
    formResponses: [
      {
        id: "f2",
        formTitle: "Enquete de Preferências de Horário",
        date: "11/09/2026",
        answers: [
          { question: "Melhor dia para agendar?", answer: "Quinta ou sexta-feira após o trabalho." },
        ],
      },
    ],
    campaigns: [],
  },
  {
    id: "3",
    name: "Tainá Lima",
    phone: "(11) 96630-1198",
    email: "taina.lima@gmail.com",
    coupon: "FRETEGRATIS",
    status: "Expirado",
    createdAt: "01/09/2026",
    tags: ["Vitrine Online", "Drenagem"],
    notes: "Comprou produtos na vitrine digital e pediu informações sobre drenagem linfática.",
    bookings: [],
    coupons: [
      {
        code: "FRETEGRATIS",
        title: "Frete Grátis na Vitrine",
        discount: "Frete Grátis",
        status: "Expirado",
        claimedAt: "01/09/2026 · 18:20",
      },
    ],
    formResponses: [
      {
        id: "f3",
        formTitle: "Avaliação no Google Maps",
        date: "03/09/2026",
        score: "⭐⭐⭐⭐⭐ 5.0",
        answers: [
          { question: "Avaliou no Google?", answer: "Sim! Deixou comentário elogiando o espaço." },
        ],
      },
    ],
    campaigns: [
      {
        id: "c2",
        name: "Cupom Reativação Primavera",
        channel: "WhatsApp",
        sentAt: "22/09/2026",
        status: "Lido",
      },
    ],
  },
  {
    id: "4",
    name: "Carolina Mendes",
    phone: "(11) 99123-4567",
    email: "carol.mendes@uol.com.br",
    coupon: "BEMVINDO20",
    status: "Disponível",
    createdAt: "03/10/2026",
    tags: ["Novo Cliente", "Agendamento Ativo", "WhatsApp"],
    notes: "Agendou direto pelo novo banner na página pública.",
    bookings: [
      {
        id: "b4",
        code: "AT-9921",
        serviceName: "Massagem Relaxante com Aromaterapia",
        date: "05/10/2026",
        time: "11:00",
        price: 170,
        status: "Confirmado",
      },
    ],
    coupons: [
      {
        code: "BEMVINDO20",
        title: "20% OFF de Boas-vindas",
        discount: "20% OFF",
        status: "Disponível",
        claimedAt: "03/10/2026 · 16:40",
      },
    ],
    formResponses: [],
    campaigns: [],
  },
];

export const Route = createFileRoute("/beneficiarios")({
  head: () => ({
    meta: [
      { title: "CRM de Clientes & Agendamentos · AvaliaTap" },
      {
        name: "description",
        content: "Gestão inteligente de clientes, agendamentos, cupons e campanhas personalizadas.",
      },
      { property: "og:title", content: "CRM de Clientes & Agendamentos · AvaliaTap" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BeneficiariesPage,
});

const storageKey = "avaliatap-crm-clients";

function BeneficiariesPage() {
  const [people, setPeople] = useState<Client[]>(initialClients);
  const [query, setQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "bookings" | "coupons" | "forms" | "campaignable">("all");
  const [selected, setSelected] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<"bookings" | "coupons" | "forms" | "campaigns" | "notes">("bookings");
  const [formOpen, setFormOpen] = useState(false);
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [campaignRecipient, setCampaignRecipient] = useState<Client | null>(null);
  const [campaignMessage, setCampaignMessage] = useState("");

  const merchant = getMerchant(defaultMerchantSlug)!;
  const { settings, update: updateSettings } = usePublicSettings(defaultMerchantSlug);

  // Load clients and sync with public booking submissions in real-time
  const syncWithBookings = () => {
    let currentClients: Client[] = initialClients;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        currentClients = JSON.parse(saved) as Client[];
      }
    } catch {
      // fallback
    }

    // Check bookings from public page (avaliatap-bookings-${merchantSlug})
    try {
      const publicBookingsRaw = window.localStorage.getItem(`avaliatap-bookings-${defaultMerchantSlug}`);
      if (publicBookingsRaw) {
        const publicBookings = JSON.parse(publicBookingsRaw) as Array<{
          code: string;
          service: { id: string; name: string; price: number; duration: string };
          date: string;
          time: string;
          clientName: string;
          clientPhone: string;
          notes?: string;
          createdAt: string;
        }>;

        let hasNew = false;
        const updated = [...currentClients];

        for (const pb of publicBookings) {
          const digits = pb.clientPhone.replace(/\D/g, "");
          const existing = updated.find(
            (c) => c.phone.replace(/\D/g, "") === digits || c.name.toLowerCase() === pb.clientName.toLowerCase()
          );

          const newBooking: ClientBooking = {
            id: pb.code,
            code: pb.code,
            serviceName: pb.service.name,
            date: new Date(pb.date).toLocaleDateString("pt-BR"),
            time: pb.time,
            price: pb.service.price,
            status: "Confirmado",
          };

          if (existing) {
            if (!existing.bookings.some((b) => b.code === pb.code)) {
              existing.bookings.unshift(newBooking);
              if (pb.notes && !existing.notes?.includes(pb.notes)) {
                existing.notes = existing.notes ? `${existing.notes} | ${pb.notes}` : pb.notes;
              }
              hasNew = true;
            }
          } else {
            // Create new client in CRM from booking
            const newClient: Client = {
              id: crypto.randomUUID(),
              name: pb.clientName,
              phone: pb.clientPhone,
              coupon: "BEMVINDO20",
              status: "Disponível",
              createdAt: new Date().toLocaleDateString("pt-BR"),
              tags: ["Agendamento Online", "Novo Lead"],
              notes: pb.notes || "Agendou serviço pela página pública.",
              bookings: [newBooking],
              coupons: [
                {
                  code: "BEMVINDO20",
                  title: "Cupom de Boas-vindas",
                  discount: "20% OFF",
                  status: "Disponível",
                  claimedAt: new Date().toLocaleDateString("pt-BR"),
                },
              ],
              formResponses: [],
              campaigns: [],
            };
            updated.unshift(newClient);
            hasNew = true;
          }
        }

        if (hasNew) {
          currentClients = updated;
          window.localStorage.setItem(storageKey, JSON.stringify(currentClients));
        }
      }
    } catch {
      // ignore
    }

    setPeople(currentClients);
  };

  useEffect(() => {
    syncWithBookings();
    window.addEventListener("storage", syncWithBookings);
    return () => window.removeEventListener("storage", syncWithBookings);
  }, []);

  const save = (next: Client[]) => {
    setPeople(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  };

  // Form para novo cliente
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    coupon: "BEMVINDO20",
    tags: "Cliente",
    notes: "",
  });

  const submitNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const date = now.toLocaleDateString("pt-BR");
    const newPerson: Client = {
      id: crypto.randomUUID(),
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      coupon: form.coupon.toUpperCase(),
      status: "Disponível",
      createdAt: date,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      notes: form.notes,
      bookings: [],
      coupons: [
        {
          code: form.coupon.toUpperCase(),
          title: "Cupom Especial",
          discount: "15% OFF",
          status: "Disponível",
          claimedAt: date,
        },
      ],
      formResponses: [],
      campaigns: [],
    };
    save([newPerson, ...people]);
    setForm({ name: "", phone: "", email: "", coupon: "BEMVINDO20", tags: "Cliente", notes: "" });
    setFormOpen(false);
    toast.success("Cliente cadastrado no CRM!");
  };

  // Filtered clients
  const filtered = useMemo(() => {
    return people.filter((p) => {
      const matchQuery =
        `${p.name} ${p.phone} ${p.email ?? ""} ${p.coupon} ${p.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()) ||
        p.bookings.some((b) => b.serviceName.toLowerCase().includes(query.toLowerCase()));

      if (!matchQuery) return false;

      if (filterTab === "bookings") return p.bookings.length > 0;
      if (filterTab === "coupons") return p.coupons.some((c) => c.status === "Disponível");
      if (filterTab === "forms") return p.formResponses.length > 0;
      if (filterTab === "campaignable") return Boolean(p.phone && p.email);

      return true;
    });
  }, [people, query, filterTab]);

  // Total stats
  const totalBookingsCount = people.reduce((acc, c) => acc + c.bookings.length, 0);
  const activeCouponsCount = people.reduce(
    (acc, c) => acc + c.coupons.filter((cp) => cp.status === "Disponível").length,
    0
  );
  const formResponsesCount = people.reduce((acc, c) => acc + c.formResponses.length, 0);

  // Toggle booking upgrade
  const toggleBookingUpgrade = () => {
    const nextValue = !settings.booking;
    updateSettings({ ...settings, booking: nextValue });
    toast.success(
      nextValue
        ? "Módulo de Agendamentos Ativado! Já disponível na página pública."
        : "Módulo de Agendamentos desativado."
    );
  };

  // Open Campaign Sender
  const openCampaign = (client: Client) => {
    setCampaignRecipient(client);
    setCampaignMessage(
      `Olá, ${client.name}! 🌟 Temos novidades exclusivas em ${merchant.name}.\n\n` +
      `Você tem um benefício especial liberado: cupom *${client.coupon}*!\n` +
      (client.bookings.length > 0
        ? `Lembramos também do seu atendimento com a gente. Deseja agendar um novo procedimento essa semana?\n\n`
        : `Aproveite para agendar seu horário online com hora marcada pelo link:\n`) +
      `https://avaliatap.com/c/${merchant.slug}\n\n` +
      `Podemos reservar seu horário hoje?`
    );
    setCampaignModalOpen(true);
  };

  const sendCampaignWhatsApp = () => {
    if (!campaignRecipient) return;
    const digits = campaignRecipient.phone.replace(/\D/g, "");
    const encoded = encodeURIComponent(campaignMessage);
    window.open(`https://wa.me/${digits}?text=${encoded}`, "_blank");

    // Register campaign in client history
    const updated = people.map((p) => {
      if (p.id === campaignRecipient.id) {
        return {
          ...p,
          campaigns: [
            {
              id: crypto.randomUUID(),
              name: "Campanha Personalizada WhatsApp",
              channel: "WhatsApp" as const,
              sentAt: new Date().toLocaleDateString("pt-BR"),
              status: "Enviado" as const,
            },
            ...p.campaigns,
          ],
        };
      }
      return p;
    });
    save(updated);
    toast.success("Campanha registrada no histórico do cliente!");
    setCampaignModalOpen(false);
  };

  // Validate coupon in real-time
  const handleValidateCoupon = (client: Client, couponCode: string) => {
    const updated = people.map((p) => {
      if (p.id === client.id) {
        const updatedCoupons = p.coupons.map((c) =>
          c.code === couponCode ? { ...c, status: "Usado" as const, usedAt: new Date().toLocaleDateString("pt-BR") } : c
        );
        return { ...p, status: "Usado" as const, coupons: updatedCoupons };
      }
      return p;
    });
    save(updated);
    if (selected && selected.id === client.id) {
      setSelected({
        ...selected,
        status: "Usado",
        coupons: selected.coupons.map((c) =>
          c.code === couponCode ? { ...c, status: "Usado", usedAt: new Date().toLocaleDateString("pt-BR") } : c
        ),
      });
    }
    toast.success(`Cupom ${couponCode} validado como utilizado no balcão!`);
  };

  // Add quick booking to selected client
  const handleAddQuickBooking = () => {
    if (!selected) return;
    const code = `AT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: ClientBooking = {
      id: code,
      code,
      serviceName: "Procedimento em Gabinete",
      date: new Date().toLocaleDateString("pt-BR"),
      time: "15:00",
      price: 150,
      status: "Confirmado",
    };
    const updated = people.map((p) => (p.id === selected.id ? { ...p, bookings: [newBooking, ...p.bookings] } : p));
    save(updated);
    setSelected({ ...selected, bookings: [newBooking, ...selected.bookings] });
    toast.success("Novo agendamento adicionado à ficha do cliente!");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header com CRM Branding */}
      <header className="bg-secondary px-5 pb-6 pt-7 text-secondary-foreground shadow-md">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-[11px] font-extrabold text-primary uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> CRM & Fidelidade
          </span>
          <span className="text-xs text-secondary-foreground/70">
            {merchant.name}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight leading-tight">
              Clientes & Agendamentos
            </h1>
            <p className="mt-1 text-[13px] opacity-75">
              Histórico 360°, agendamentos, cupons e disparos de campanha.
            </p>
          </div>
          <button
            onClick={() => setFormOpen(true)}
            aria-label="Cadastrar novo cliente"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95"
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Upgrade Card: Sistema de Agendamento */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <CalendarCheck className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[13.5px] font-extrabold text-white">
                    Upgrade: Agendamento Online
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9.5px] font-extrabold uppercase ${
                      settings.booking
                        ? "bg-[#25D366] text-black"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    {settings.booking ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <p className="text-[11.5px] text-white/70">
                  {settings.booking
                    ? "Clientes agendam online e caem diretamente no seu CRM."
                    : "Ative para exibir o banner e formulário na página pública."}
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={toggleBookingUpgrade}
              variant={settings.booking ? "default" : "outline"}
              className={`h-9 px-3 text-xs font-bold rounded-xl ${
                settings.booking
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-white/30 text-white hover:bg-white/10"
              }`}
            >
              {settings.booking ? "Desativar" : "Ativar Upgrade"}
            </Button>
          </div>
        </div>
      </header>

      <main className="px-5 pt-5">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-2xl border border-border bg-surface p-3">
            <strong className="block text-[20px] font-black text-foreground">
              {people.length}
            </strong>
            <span className="text-[10px] text-muted-foreground font-medium">Clientes</span>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-3">
            <strong className="block text-[20px] font-black text-primary">
              {totalBookingsCount}
            </strong>
            <span className="text-[10px] text-muted-foreground font-medium">Agendamentos</span>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-3">
            <strong className="block text-[20px] font-black text-foreground">
              {activeCouponsCount}
            </strong>
            <span className="text-[10px] text-muted-foreground font-medium">Cupons Válidos</span>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-3">
            <strong className="block text-[20px] font-black text-foreground">
              {formResponsesCount}
            </strong>
            <span className="text-[10px] text-muted-foreground font-medium">Pesquisas</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="mt-4 flex h-12 items-center gap-2.5 rounded-2xl border border-border bg-surface px-4 shadow-sm">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar nome, WhatsApp, e-mail, serviço ou cupom..."
            className="w-full bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-xs text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold">
          {[
            { id: "all", label: `Todos (${people.length})` },
            { id: "bookings", label: `Com Agendamento (${people.filter((p) => p.bookings.length > 0).length})` },
            { id: "coupons", label: `Cupons Ativos (${people.filter((p) => p.coupons.some((c) => c.status === "Disponível")).length})` },
            { id: "forms", label: `Pesquisas (${people.filter((p) => p.formResponses.length > 0).length})` },
            { id: "campaignable", label: `WhatsApp + Email (${people.filter((p) => p.phone && p.email).length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as typeof filterTab)}
              className={`rounded-full px-3.5 py-1.5 whitespace-nowrap transition-all ${
                filterTab === tab.id
                  ? "bg-secondary text-secondary-foreground shadow-sm"
                  : "bg-surface border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Client List */}
        <div className="mt-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-muted/20 p-8 text-center">
              <UserRound className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-[14px] font-bold text-foreground">Nenhum cliente encontrado</p>
              <p className="text-xs text-muted-foreground">Tente alterar o termo da busca ou o filtro.</p>
            </div>
          ) : (
            filtered.map((person) => {
              const hasBookings = person.bookings.length > 0;
              const hasActiveCoupon = person.coupons.some((c) => c.status === "Disponível");

              return (
                <div
                  key={person.id}
                  onClick={() => setSelected(person)}
                  className="group flex cursor-pointer items-center gap-3.5 rounded-[22px] border border-border bg-surface p-3.5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md active:scale-[0.99]"
                >
                  {/* Avatar */}
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-[15px] font-black text-secondary-foreground">
                    {person.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")}
                  </span>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <b className="truncate text-[14.5px] font-bold text-foreground leading-tight">
                        {person.name}
                      </b>
                      {person.email && (
                        <span className="grid h-4 w-4 place-items-center rounded-full bg-primary/10 text-primary" title="E-mail cadastrado">
                          <Mail className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {person.phone}
                      </span>
                      {hasBookings && (
                        <span className="inline-flex items-center gap-0.5 rounded-md bg-primary/10 px-1.5 py-0.5 font-bold text-primary text-[10px]">
                          <CalendarCheck className="h-3 w-3" />
                          {person.bookings[0].serviceName.split(" ")[0]} ({person.bookings[0].date})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[9.5px] font-extrabold ${
                        hasActiveCoupon
                          ? "bg-primary text-primary-foreground"
                          : person.status === "Usado"
                          ? "bg-muted text-muted-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {hasActiveCoupon ? "Cupom Ativo" : person.status}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCampaign(person);
                      }}
                      title="Enviar Campanha WhatsApp"
                      className="grid h-7 w-7 place-items-center rounded-full bg-muted text-foreground hover:bg-[#25D366] hover:text-white transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* MODAL: NOVO CLIENTE */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
          <form
            onSubmit={submitNewClient}
            className="w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-background p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                  Novo Cadastro CRM
                </span>
                <h2 className="text-[20px] font-extrabold text-foreground">Adicionar Cliente</h2>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                aria-label="Fechar"
                className="grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  Nome completo *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex.: Juliana Paes"
                  className="h-12 w-full rounded-xl border border-border bg-surface px-3.5 text-[14px] text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  WhatsApp com DDD *
                </label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(11) 99999-8888"
                  className="h-12 w-full rounded-xl border border-border bg-surface px-3.5 text-[14px] text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  E-mail (para campanhas multicanal)
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="cliente@email.com"
                  className="h-12 w-full rounded-xl border border-border bg-surface px-3.5 text-[14px] text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  Cupom Inicial / Tag de Entrada
                </label>
                <input
                  value={form.coupon}
                  onChange={(e) => setForm({ ...form, coupon: e.target.value })}
                  placeholder="BEMVINDO20"
                  className="h-12 w-full rounded-xl border border-border bg-surface px-3.5 text-[14px] text-foreground uppercase outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  Observações e histórico inicial
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Preferências, histórico de compras ou anotações..."
                  className="w-full rounded-xl border border-border bg-surface p-3 text-[13px] text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="mt-6 w-full h-13 rounded-2xl bg-secondary text-[14px] font-extrabold text-secondary-foreground shadow-md hover:bg-secondary/90"
            >
              Salvar Cliente no CRM
            </Button>
          </form>
        </div>
      )}

      {/* MODAL: DETALHES 360° DO CLIENTE */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          onClick={() => setSelected(null)}
        >
          <section
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-[32px] sm:rounded-[32px] bg-background p-5 sm:p-6 shadow-2xl"
          >
            {/* Header com Avatar e Dados */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-[18px] font-black text-secondary-foreground shadow-sm">
                  {selected.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                    Perfil CRM 360°
                  </span>
                  <h2 className="text-[20px] font-black text-foreground leading-tight">
                    {selected.name}
                  </h2>
                  <p className="text-[12px] text-muted-foreground mt-0.5">
                    Cliente desde {selected.createdAt}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelected(null)}
                aria-label="Fechar"
                className="grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Contact Channels & Campaign Action */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-[12px]">
              <a
                href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366]/15 py-2.5 font-bold text-[#128C7E] hover:bg-[#25D366]/25 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                {selected.phone}
              </a>

              {selected.email ? (
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-2.5 font-bold text-primary hover:bg-primary/20 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  E-mail
                </a>
              ) : (
                <span className="flex items-center justify-center rounded-xl bg-muted py-2.5 text-[11px] text-muted-foreground font-medium">
                  Sem e-mail cadastrado
                </span>
              )}
            </div>

            <Button
              type="button"
              onClick={() => openCampaign(selected)}
              className="mt-2.5 w-full h-11 rounded-2xl bg-primary text-[13px] font-extrabold text-primary-foreground shadow-sm flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              Disparar Campanha Personalizada via WhatsApp
            </Button>

            {/* Navigation Tabs */}
            <div className="mt-5 flex gap-1 border-b border-border pb-1 overflow-x-auto scrollbar-none text-[12px] font-bold">
              {[
                { id: "bookings", label: `Agendamentos (${selected.bookings.length})`, icon: CalendarCheck },
                { id: "coupons", label: `Cupons (${selected.coupons.length})`, icon: Ticket },
                { id: "forms", label: `Pesquisas (${selected.formResponses.length})`, icon: FileCheck },
                { id: "notes", label: "Notas & CRM", icon: UserRound },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-1.5 px-3 py-2 border-b-2 whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: AGENDAMENTOS */}
            {activeTab === "bookings" && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[13px] font-bold text-foreground">Histórico de Horários</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddQuickBooking}
                    className="h-8 rounded-xl text-[11px] font-bold gap-1"
                  >
                    <Plus className="h-3 w-3" /> Novo Horário
                  </Button>
                </div>

                {selected.bookings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center text-xs text-muted-foreground">
                    <Calendar className="mx-auto h-6 w-6 text-muted-foreground/60 mb-1" />
                    Nenhum agendamento registrado ainda.
                  </div>
                ) : (
                  selected.bookings.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-2xl border border-border bg-surface p-3.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[14px] text-foreground">
                          {b.serviceName}
                        </span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold text-primary">
                          {b.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {b.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {b.time}
                        </span>
                        <span className="font-bold text-foreground">
                          R$ {b.price.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT: CUPONS */}
            {activeTab === "coupons" && (
              <div className="mt-4 space-y-2.5">
                <h4 className="text-[13px] font-bold text-foreground">Cupons Resgatados</h4>
                {selected.coupons.map((c) => (
                  <div
                    key={c.code}
                    className="flex items-center justify-between rounded-2xl border border-border bg-surface p-3.5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <b className="text-[14px] font-black text-foreground">{c.code}</b>
                        <span className="text-[11px] font-bold text-primary">{c.discount}</span>
                      </div>
                      <p className="text-[11.5px] text-muted-foreground">{c.title}</p>
                      <small className="text-[10px] text-muted-foreground">
                        Resgatado em: {c.claimedAt} {c.usedAt ? `· Usado em: ${c.usedAt}` : ""}
                      </small>
                    </div>

                    {c.status === "Disponível" ? (
                      <Button
                        size="sm"
                        onClick={() => handleValidateCoupon(selected, c.code)}
                        className="h-8 rounded-xl bg-primary text-[11px] font-extrabold text-primary-foreground shadow-sm"
                      >
                        Validar Uso
                      </Button>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground">
                        {c.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: PESQUISAS & ENQUETES */}
            {activeTab === "forms" && (
              <div className="mt-4 space-y-3">
                <h4 className="text-[13px] font-bold text-foreground">Respostas na Placa NFC</h4>
                {selected.formResponses.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center text-xs text-muted-foreground">
                    <FileCheck className="mx-auto h-6 w-6 text-muted-foreground/60 mb-1" />
                    Nenhuma pesquisa respondida por este cliente ainda.
                  </div>
                ) : (
                  selected.formResponses.map((f) => (
                    <div key={f.id} className="rounded-2xl border border-border bg-surface p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <b className="text-[13px] font-bold text-foreground">{f.formTitle}</b>
                        {f.score && (
                          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-extrabold text-primary">
                            {f.score}
                          </span>
                        )}
                      </div>
                      <small className="block text-[10.5px] text-muted-foreground">Data: {f.date}</small>
                      <div className="space-y-1.5 pt-1 text-xs">
                        {f.answers.map((ans, idx) => (
                          <div key={idx} className="rounded-xl bg-muted/40 p-2.5">
                            <span className="text-muted-foreground font-semibold block text-[11px]">
                              {ans.question}
                            </span>
                            <span className="text-foreground font-medium block mt-0.5">
                              {ans.answer}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT: NOTAS & CRM */}
            {activeTab === "notes" && (
              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    Tags do Cliente
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    Anotações Internas da Especialista
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={selected.notes || ""}
                    onBlur={(e) => {
                      const newNotes = e.target.value;
                      const updated = people.map((p) =>
                        p.id === selected.id ? { ...p, notes: newNotes } : p
                      );
                      save(updated);
                      setSelected({ ...selected, notes: newNotes });
                      toast.success("Anotação interna atualizada!");
                    }}
                    placeholder="Adicione preferências, observações técnicas ou histórico de atendimentos..."
                    className="w-full rounded-xl border border-border bg-surface p-3 text-[13px] text-foreground outline-none focus:border-primary"
                  />
                  <span className="text-[10px] text-muted-foreground">
                    As anotações são salvas automaticamente ao clicar fora.
                  </span>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* MODAL: DISPARO DE CAMPANHA PERSONALIZADA */}
      {campaignModalOpen && campaignRecipient && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-background p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                  Campanha Individual
                </span>
                <h3 className="text-[19px] font-extrabold text-foreground">
                  Enviar via WhatsApp
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCampaignModalOpen(false)}
                aria-label="Fechar"
                className="grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Destinatário: <b>{campaignRecipient.name}</b> ({campaignRecipient.phone})
            </p>

            <div className="mt-4">
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                Mensagem Personalizada:
              </label>
              <textarea
                rows={7}
                value={campaignMessage}
                onChange={(e) => setCampaignMessage(e.target.value)}
                className="w-full rounded-2xl border border-border bg-surface p-3.5 text-[12.5px] text-foreground outline-none focus:border-primary font-mono leading-relaxed"
              />
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCampaignModalOpen(false)}
                className="flex-1 h-12 rounded-2xl text-xs font-bold"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={sendCampaignWhatsApp}
                className="flex-[1.5] h-12 rounded-2xl bg-[#25D366] text-white text-[13px] font-extrabold shadow-md hover:bg-[#20ba5a]"
              >
                <Send className="mr-1.5 h-4 w-4" />
                Abrir WhatsApp e Enviar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
