import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Settings2, QrCode, Lock, Smartphone, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultMerchantSlug, getMerchant } from "@/lib/merchants";
import { usePublicSettings, type PublicSettings } from "@/lib/public-settings";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configuração da Página Pública · AvaliaTap" },
      {
        name: "description",
        content: "Configure as experiências, módulos ativos e regras de slug da sua placa NFC.",
      },
      { property: "og:title", content: "Configuração da Página Pública · AvaliaTap" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

const options: {
  key: keyof PublicSettings;
  label: string;
  detail: string;
  to?: "/catalogo" | "/campanhas" | "/beneficiarios";
}[] = [
  {
    key: "booking",
    label: "Agendamento de serviços",
    detail: "Exiba o banner de agendamento online e horários na página pública.",
  },
  {
    key: "referrals",
    label: "Indique e ganhe",
    detail: "Mostre a página de indicação aos clientes.",
  },
  {
    key: "benefits",
    label: "Benefícios",
    detail: "Exiba ofertas e experiências.",
    to: "/campanhas",
  },
  {
    key: "coupons",
    label: "Cupons",
    detail: "Permita que clientes vejam e raspem cupons de desconto.",
    to: "/campanhas",
  },
  {
    key: "products",
    label: "Produtos e serviços",
    detail: "Mostre os itens ativos da sua vitrine.",
    to: "/catalogo",
  },
  {
    key: "club",
    label: "Clube de fidelidade",
    detail: "Mostre o cartão digital de carimbos aos clientes.",
    to: "/beneficiarios",
  },
  {
    key: "polls",
    label: "Enquetes",
    detail: "Exiba as enquetes e pesquisas de opinião na página pública.",
  },
];

function SettingsPage() {
  const { settings, update } = usePublicSettings();
  const merchant = getMerchant(defaultMerchantSlug)!;

  return (
    <main className="px-5 pb-32 pt-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground active:scale-95"
      >
        <ChevronLeft className="h-4 w-4" /> Início
      </Link>

      <h1 className="mt-4 flex items-center gap-2 text-2xl font-black text-foreground">
        <Settings2 className="h-6 w-6 text-primary" /> Página Pública & NFC
      </h1>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Configure os recursos visíveis e gerencie a integridade da sua placa NFC.
      </p>

      {/* REGRA DE SLUG ÚNICA & INTEGRIDADE NFC */}
      <section className="mt-5 rounded-3xl border border-border bg-surface p-5 shadow-sm space-y-3">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-secondary text-secondary-foreground shrink-0">
            <Lock className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
              Identificador Permanente NFC
            </span>
            <h3 className="text-[15px] font-bold text-foreground">
              Slug Única: /c/{merchant.slug}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Esta URL é gravada fisicamente no chip da sua placa de balcão. Você pode atualizar banners, fotos de serviços, textos e produtos à vontade: <b>a placa física continuará funcionando perfeitamente sem qualquer interferência</b>.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Placa Física Vinculada</span>
          <Link
            to="/c/$slug"
            params={{ slug: merchant.slug }}
            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
          >
            Abrir Página Pública <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* UPGRADE MULTI-SLUG & NOVAS PLACAS */}
      <section className="mt-4 rounded-3xl border border-primary/30 bg-primary/5 p-5 shadow-sm space-y-3">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground shrink-0">
            <Smartphone className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-bold text-foreground">Upgrade Multi-Slug (Até 5 Ações)</h3>
              <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-extrabold uppercase text-primary-foreground">
                Upgrade
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Deseja criar páginas com slugs diferentes para ações específicas (ex.: uma placa de balcão para <b>agendamento</b>, uma placa de mesa para <b>clube de fidelidade</b> e outra para <b>avaliações</b>)?
              Você pode ter até 5 slugs independentes vinculadas a novas placas NFC físicas programadas sob medida.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/5511999990000?text=Olá!%20Gostaria%20de%20solicitar%20o%20upgrade%20Multi-Slug%20e%20novas%20placas%20NFC%20para%20meu%20estabelecimento."
          target="_blank"
          rel="noreferrer"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-xs font-black text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          Entrar em contato para Upgrade Multi-Slug & Novas Placas
        </a>
      </section>

      {/* TOGGLES DOS MÓDULOS NA PÁGINA PÚBLICA */}
      <h2 className="mt-7 text-[16px] font-bold text-foreground">
        Experiências na Página Pública
      </h2>
      <div className="mt-3 divide-y divide-border rounded-3xl border border-border bg-surface px-4 shadow-sm">
        {options.map((o) => (
          <div key={o.key} className="flex items-center gap-3 py-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-foreground">{o.label}</h3>
              <p className="text-xs text-muted-foreground">{o.detail}</p>
              {o.to && (
                <Link to={o.to} className="mt-1 inline-block text-xs font-bold text-primary hover:underline">
                  Gerenciar dados →
                </Link>
              )}
            </div>
            <Button
              type="button"
              variant={settings[o.key] ? "default" : "outline"}
              role="switch"
              aria-checked={settings[o.key]}
              aria-label={`${o.label}: ${settings[o.key] ? "ativado" : "desativado"}`}
              onClick={() => update({ ...settings, [o.key]: !settings[o.key] })}
              className="w-20 shrink-0 rounded-xl text-xs font-bold"
            >
              {settings[o.key] ? "Ativo" : "Inativo"}
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}
