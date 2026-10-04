import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  MapPin,
  MessageCircle,
  Instagram,
  Star,
  CheckCircle2,
  Sparkles,
  Car,
  ExternalLink,
  ShieldCheck,
  Award,
  Clock,
} from "lucide-react";
import { getMerchant } from "@/lib/merchants";
import { CustomerNav } from "@/components/public/CustomerNav";

export const Route = createFileRoute("/c/$slug/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a Especialista · AvaliaTap" },
      {
        name: "description",
        content: "Conheça a especialista, diferenciais, localização e canais de atendimento.",
      },
      { property: "og:title", content: "Sobre a Especialista · AvaliaTap" },
      {
        property: "og:description",
        content: "Trabalho com estética facial e corporal personalizada em São Paulo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutMerchant,
});

function AboutMerchant() {
  const { slug } = Route.useParams();
  const merchant = getMerchant(slug);

  if (!merchant) return null;

  const differentials = [
    { label: "Estética Avançada", detail: "Tecnologias e protocolos contemporâneos" },
    { label: "Biossegurança Rigorosa", detail: "Ambiente asséptico e materiais descartáveis" },
    { label: "Protocolos Personalizados", detail: "Diagnóstico individual para cada tipo de pele" },
    { label: "Cosméticos de Alta Performance", detail: "Ativos dermocosméticos de padrão médico" },
  ];

  const addressText = "Av. Paulista, 1000 · Bela Vista, São Paulo — SP";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    addressText
  )}`;

  return (
    <main className="min-h-screen bg-background px-5 pb-32 pt-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/c/$slug"
          params={{ slug }}
          aria-label="Voltar para início"
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-foreground/80 hover:text-foreground active:scale-95"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Link>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
          {merchant.category}
        </span>
      </div>

      {/* Header Profile / Specialist Banner */}
      <header className="mt-6 flex items-start gap-4">
        <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-secondary text-2xl font-extrabold text-secondary-foreground shadow-sm">
          <span>✨</span>
          <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
            ✓
          </span>
        </div>
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            Apresentação
          </span>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Sobre a Especialista
          </h1>
          <p className="text-[13px] font-medium text-muted-foreground">
            {merchant.name}
          </p>
        </div>
      </header>

      {/* SECTION 1: SOBRE A ESPECIALISTA */}
      <section className="mt-6 rounded-3xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center gap-2 text-primary font-bold text-[13px]">
          <Sparkles className="h-4 w-4" />
          <span>Trajetória & Propósito</span>
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-foreground/90">
          Trabalho há mais de 8 anos com estética facial e corporal em São Paulo. Meu foco é criar experiências de autocuidado personalizadas, sempre com escuta atenta e cuidado técnico em cada procedimento.
        </p>
      </section>

      {/* SECTION 2: DIFERENCIAIS & FORMAÇÃO */}
      <section className="mt-4 rounded-3xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center gap-2 text-foreground font-extrabold text-[16px]">
          <Award className="h-4 w-4 text-primary" />
          <span>Diferenciais & Formação</span>
        </div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
          Atendimento exclusivo e humanizado, unindo tecnologia de ponta, cosmetologia avançada e protocolos personalizados.
        </p>

        <div className="mt-4 space-y-2.5">
          {differentials.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-2xl bg-muted/40 p-3 transition-colors hover:bg-muted/70"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
              <div>
                <p className="text-[13.5px] font-bold text-foreground">
                  {item.label}
                </p>
                <p className="text-[11.5px] text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: LOCALIZAÇÃO & ATENDIMENTO */}
      <section className="mt-4 rounded-3xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center gap-2 text-foreground font-extrabold text-[16px]">
          <MapPin className="h-4 w-4 text-primary" />
          <span>Localização & Atendimento</span>
        </div>

        <div className="mt-3.5 space-y-2">
          <p className="text-[14px] font-bold text-foreground">
            {addressText}
          </p>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Atendimento individual com hora marcada · Próximo ao Metrô Trianon-Masp
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary py-3 px-4 text-[13px] font-extrabold text-secondary-foreground shadow-sm hover:opacity-95 active:scale-[0.99]"
          >
            Abrir no Google Maps <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <div className="flex items-center gap-2 rounded-2xl bg-muted/50 px-3.5 py-3 text-[12px] font-semibold text-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            <span>Estacionamento no local</span>
          </div>
        </div>
      </section>

      {/* SECTION 4: NO RODAPÉ - FALE COM A GENTE */}
      <section className="mt-6 rounded-3xl bg-secondary p-5 text-secondary-foreground shadow-md">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] opacity-60">
          Fale com a gente
        </p>
        <p className="mt-1 text-[16px] font-bold">
          {merchant.name}
        </p>
        <p className="mt-0.5 text-[12px] opacity-70">
          Tire dúvidas, envie sua mensagem ou agende uma avaliação personalizada.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] font-bold">
          <a
            href={merchant.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-primary-foreground shadow-sm active:scale-95"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href={merchant.instagram}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-white/10 py-3 active:scale-95"
          >
            <Instagram className="h-4 w-4" /> Instagram
          </a>
          <a
            href={merchant.googleReview}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-white/10 py-3 active:scale-95"
          >
            <Star className="h-4 w-4" /> Avaliar
          </a>
        </div>
      </section>

      {/* Public customer bottom navigation */}
      <CustomerNav />
    </main>
  );
}
