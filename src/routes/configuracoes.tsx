import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultMerchantSlug } from "@/lib/merchants";
import { usePublicSettings, type PublicSettings } from "@/lib/public-settings";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Página pública · AvaliaTap" }, { name: "description", content: "Configure as experiências disponíveis aos clientes do comércio." }, { property: "og:title", content: "Página pública · AvaliaTap" }, { property: "og:description", content: "Configure as experiências disponíveis aos clientes do comércio." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: SettingsPage,
});
const options: { key: keyof PublicSettings; label: string; detail: string; to?: "/catalogo" | "/campanhas" | "/beneficiarios" }[] = [
  { key: "booking", label: "Agendamento de serviços", detail: "Exiba o banner de agendamento online e horários na página pública." },
  { key: "referrals", label: "Indique e ganhe", detail: "Mostre a página de indicação aos clientes." },
  { key: "benefits", label: "Benefícios", detail: "Exiba ofertas e experiências.", to: "/campanhas" },
  { key: "coupons", label: "Cupons", detail: "Permita que clientes vejam os cupons.", to: "/campanhas" },
  { key: "products", label: "Produtos e serviços", detail: "Mostre os itens ativos da sua vitrine.", to: "/catalogo" },
  { key: "club", label: "Clube de fidelidade", detail: "Mostre o cartão digital aos clientes.", to: "/beneficiarios" },
  { key: "polls", label: "Enquetes", detail: "Exiba as enquetes na página pública." },
];
function SettingsPage() {
  const { settings, update } = usePublicSettings();
  return <main className="px-5 pb-28 pt-6"><Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ChevronLeft className="h-4 w-4" /> Início</Link><h1 className="mt-5 flex items-center gap-2 text-2xl font-extrabold"><Settings2 className="h-6 w-6" /> Página pública</h1><p className="mt-2 text-sm text-muted-foreground">Escolha o que aparece para seus clientes neste navegador.</p><div className="mt-6 divide-y divide-border">{options.map(o => <div key={o.key} className="flex items-center gap-3 py-4"><div className="min-w-0 flex-1"><h2 className="text-sm font-bold">{o.label}</h2><p className="text-xs text-muted-foreground">{o.detail}</p>{o.to && <Link to={o.to} className="mt-1 inline-block text-xs font-bold underline">Configurar</Link>}</div><Button type="button" variant={settings[o.key] ? "default" : "outline"} role="switch" aria-checked={settings[o.key]} aria-label={`${o.label}: ${settings[o.key] ? "ativado" : "desativado"}`} onClick={() => update({ ...settings, [o.key]: !settings[o.key] })} className="w-20 shrink-0">{settings[o.key] ? "Ativo" : "Inativo"}</Button></div>)}</div></main>;
}
