import { createFileRoute, Link } from "@tanstack/react-router";
import { Nfc, CreditCard, Smartphone, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { defaultMerchantSlug, merchants } from "@/lib/merchants";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/nfc")({
  head: () => ({
    meta: [
      { title: "Placas NFC · AvaliaTap" },
      { name: "description", content: "Gerencie suas placas NFC e veja como o cliente chega à sua página." },
      { property: "og:title", content: "Placas NFC · AvaliaTap" },
      { property: "og:description", content: "Placas, cartões e adesivos NFC do seu comércio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NfcPage,
});

const devices = [
  { id: "placa", icon: Nfc, name: "Placa de balcão", state: "Ativa", taps: 1284 },
  { id: "cartao", icon: CreditCard, name: "Cartão NFC", state: "Ativa", taps: 342 },
  { id: "adesivo", icon: Smartphone, name: "Adesivo de vitrine", state: "Inativa", taps: 0 },
];
const models = [
  { id: "balcao", icon: Nfc, name: "Placa de balcão", detail: "Para recepção e caixa" },
  { id: "cartao", icon: CreditCard, name: "Cartão digital", detail: "Para levar com você" },
  { id: "vitrine", icon: Smartphone, name: "Adesivo NFC", detail: "Para vitrine e mesas" },
];

function NfcPage() {
  const merchant = merchants[defaultMerchantSlug]!;

  return (
    <div className="px-5 pb-10 pt-6">
      <Link to="/perfil" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Perfil</Link>
      <h1 className="text-[26px] font-extrabold tracking-tight text-foreground">Placas NFC</h1>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Cada dispositivo abre a sua página pública ao ser aproximado do celular.
      </p>

      <div className="mt-5 rounded-3xl bg-secondary p-5 text-secondary-foreground">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] opacity-60">Destino dos toques</p>
        <p className="mt-2 text-[16px] font-semibold">avaliatap.com/c/{merchant.slug}</p>
        <Link
          to="/c/$slug"
          params={{ slug: merchant.slug }}
          className="mt-4 flex items-center justify-center rounded-2xl bg-primary py-3.5 text-[13px] font-extrabold text-primary-foreground"
        >
          Testar experiência
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {devices.map((d) => (
          <div key={d.id} className="flex items-center gap-3 rounded-3xl border border-border bg-surface p-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-muted">
              <d.icon className="h-5 w-5 text-foreground" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-semibold text-foreground">{d.name}</p>
              <p className="text-[12px] text-muted-foreground">{d.taps} toques registrados</p>
            </div>
            <span
              className={`shrink-0 rounded-xl px-2.5 py-1.5 text-[11px] font-extrabold ${
                d.state === "Ativa"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {d.state === "Ativa" ? (
                <span className="inline-flex items-center gap-1">
                  <Check className="h-3 w-3" /> Ativa
                </span>
              ) : (
                "Inativa"
              )}
            </span>
          </div>
        ))}
      </div>

      <h2 className="mt-7 text-lg font-bold">Novos modelos disponíveis</h2>
      <div className="-mx-5 mt-3 flex snap-x gap-3 overflow-x-auto px-5 pb-3">
        {models.map((model) => <article key={model.id} className="flex h-[350px] w-[150px] shrink-0 snap-start flex-col border border-border bg-surface p-3"><div className="grid flex-1 place-items-center bg-primary-soft"><model.icon className="h-14 w-14 text-foreground" /></div><h3 className="mt-3 text-sm font-bold leading-tight">{model.name}</h3><p className="mt-1 min-h-9 text-xs text-muted-foreground">{model.detail}</p><Button onClick={() => toast("Solicitação disponível em breve") } className="mt-3 w-full px-1 text-xs">Solicitar</Button></article>)}
      </div>
    </div>
  );
}
