import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home,
  Kanban,
  Users,
  ShoppingBag,
  Package,
  MessageSquare,
  Smartphone,
  Award,
  CheckSquare,
  Trophy,
  BarChart3,
  HelpCircle,
  Shield,
  CreditCard,
  Settings,
  Search,
  Plus,
  Bell,
  Menu,
  QrCode,
  X,
  TrendingUp,
  ExternalLink,
  Lock,
  Sparkles,
  LogOut,
  ChevronDown,
  ArrowLeft,
  CalendarCheck,
} from "lucide-react";
import { toast } from "sonner";
import { merchants, defaultMerchantSlug } from "@/lib/merchants";

export const Route = createFileRoute("/adm")({
  head: () => ({
    meta: [
      { title: "Painel Admin OS · AvaliaTap" },
      {
        name: "description",
        content: "CRM, Commerce, Gestão de Slugs NFC e Inteligência Operacional.",
      },
      { property: "og:title", content: "Painel Admin OS · AvaliaTap" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AdmPage,
});

type NavItem = {
  id: string;
  label: string;
  icon: any;
  section: "workspace" | "growth" | "ops" | "nfc";
};

const navItems: NavItem[] = [
  // Workspace
  { id: "dashboard", label: "Visão geral", icon: Home, section: "workspace" },
  { id: "pipeline", label: "Funil de vendas", icon: Kanban, section: "workspace" },
  { id: "contacts", label: "Contatos CRM", icon: Users, section: "workspace" },
  { id: "orders", label: "Pedidos", icon: ShoppingBag, section: "workspace" },
  { id: "products", label: "Produtos & Serviços", icon: Package, section: "workspace" },
  { id: "conversations", label: "Conversas", icon: MessageSquare, section: "workspace" },
  { id: "whatsapp", label: "WhatsApp & Instâncias", icon: Smartphone, section: "workspace" },

  // Crescimento
  { id: "ambassadors", label: "Embaixadores", icon: Award, section: "growth" },
  { id: "tasks", label: "Tarefas", icon: CheckSquare, section: "growth" },
  { id: "gamification", label: "Metas & Conquistas", icon: Trophy, section: "growth" },
  { id: "reports", label: "Relatórios & ROAS", icon: BarChart3, section: "growth" },

  // Hardware & Slugs NFC
  { id: "slugs_nfc", label: "Slugs & Placas NFC", icon: QrCode, section: "nfc" },

  // Operação
  { id: "support", label: "Suporte interno", icon: HelpCircle, section: "ops" },
  { id: "team", label: "Equipe & Permissões", icon: Shield, section: "ops" },
  { id: "billing", label: "Planos & Faturamento", icon: CreditCard, section: "ops" },
  { id: "settings", label: "Configurações", icon: Settings, section: "ops" },
];

function AdmPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");

  const merchant = merchants[defaultMerchantSlug]!;

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(false);
    toast.success("Registro adicionado com sucesso ao sistema!");
  };

  return (
    <div className="flex min-h-screen bg-[#0b0b0c] text-[#f7f7f7] font-sans">
      {/* SIDEBAR DESKTOP */}
      <aside
        className={`hidden md:flex flex-col border-r border-[#28282b] bg-[#0d0d0e] p-4 transition-all duration-300 ${
          sidebarCollapsed ? "w-[80px]" : "w-[260px]"
        }`}
      >
        {/* Brand */}
        <div className="flex h-12 items-center gap-3 px-2 mb-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-black font-black text-sm shrink-0">
            A
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <span className="block font-black text-[16px] tracking-tight leading-none text-white">
                AvaliaTap OS
              </span>
              <span className="text-[10.5px] font-bold text-[#888]">CRM & Commerce</span>
            </div>
          )}
        </div>

        {/* Current Org */}
        <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-[#28282b] bg-[#151516] p-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#222] font-black text-xs shrink-0 text-white">
            {merchant.name.charAt(0)}
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <b className="block truncate text-xs text-white">{merchant.name}</b>
              <small className="block truncate text-[10px] text-[#96969b]">
                avaliatap.com/c/{merchant.slug}
              </small>
            </div>
          )}
        </div>

        {/* Nav Sections */}
        <div className="flex-1 overflow-y-auto space-y-4 scrollbar-none pr-1">
          {/* Workspace */}
          <div>
            {!sidebarCollapsed && (
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#5e5e64]">
                Workspace
              </p>
            )}
            <div className="space-y-1">
              {navItems
                .filter((item) => item.section === "workspace")
                .map((item) => {
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                        active
                          ? "bg-[#1a1a1c] text-white shadow-sm ring-1 ring-[#0066ff]/40"
                          : "text-[#a7a7ac] hover:bg-[#151517] hover:text-white"
                      }`}
                      title={item.label}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Crescimento */}
          <div>
            {!sidebarCollapsed && (
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#5e5e64]">
                Crescimento
              </p>
            )}
            <div className="space-y-1">
              {navItems
                .filter((item) => item.section === "growth")
                .map((item) => {
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                        active
                          ? "bg-[#1a1a1c] text-white shadow-sm ring-1 ring-[#0066ff]/40"
                          : "text-[#a7a7ac] hover:bg-[#151517] hover:text-white"
                      }`}
                      title={item.label}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Slugs & NFC */}
          <div>
            {!sidebarCollapsed && (
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#5e5e64]">
                Hardware & Slugs
              </p>
            )}
            <div className="space-y-1">
              {navItems
                .filter((item) => item.section === "nfc")
                .map((item) => {
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                        active
                          ? "bg-[#1a1a1c] text-white shadow-sm ring-1 ring-[#0066ff]/40"
                          : "text-[#a7a7ac] hover:bg-[#151517] hover:text-white"
                      }`}
                      title={item.label}
                    >
                      <item.icon className="h-4 w-4 shrink-0 text-[#ff75aa]" />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Operação */}
          <div>
            {!sidebarCollapsed && (
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#5e5e64]">
                Operação & Sistema
              </p>
            )}
            <div className="space-y-1">
              {navItems
                .filter((item) => item.section === "ops")
                .map((item) => {
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                        active
                          ? "bg-[#1a1a1c] text-white shadow-sm ring-1 ring-[#0066ff]/40"
                          : "text-[#a7a7ac] hover:bg-[#151517] hover:text-white"
                      }`}
                      title={item.label}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Profile Footer */}
        <div className="mt-auto border-t border-[#28282b] pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#29292c] font-black text-xs text-white shrink-0">
              RL
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <b className="block truncate text-xs text-white">Rogério Lima</b>
                <small className="block truncate text-[10px] text-[#96969b]">
                  Administrador Geral
                </small>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <Link
              to="/perfil"
              title="Voltar ao App"
              className="text-[#888] hover:text-white p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#28282b] bg-[#0b0b0c]/95 px-4 sm:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth < 768) {
                  setMobileMenuOpen(!mobileMenuOpen);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              className="grid h-9 w-9 place-items-center rounded-xl border border-[#28282b] bg-[#151516] text-white hover:bg-[#1e1e21]"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="relative hidden sm:block">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar pedidos, leads, slugs..."
                className="h-9 w-64 rounded-full border border-[#28282b] bg-[#171719] px-4 text-xs text-white outline-none placeholder:text-[#666] focus:border-[#0066ff]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/perfil"
              className="inline-flex items-center gap-1 rounded-full border border-[#28282b] bg-[#151516] px-3.5 py-1.5 text-xs font-semibold text-[#ddd] hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Voltar ao App</span>
            </Link>

            <button
              onClick={() => toast.info("3 notificações recentes do sistema")}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#28282b] bg-[#151516] text-[#ddd] hover:text-white"
            >
              <Bell className="h-4 w-4" />
            </button>

            <button
              onClick={handleOpenModal}
              className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-black text-black hover:bg-white/90 active:scale-95 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5 stroke-[3]" />
              <span>Novo</span>
            </button>
          </div>
        </header>

        {/* DRAWER MOBILE NAVIGATION */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex bg-black/70 backdrop-blur-sm">
            <div className="w-[280px] bg-[#0d0d0e] p-5 h-full flex flex-col border-r border-[#28282b] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="font-black text-base text-white">Menu Administrativo</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-[#888]">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                      activeTab === item.id ? "bg-[#1a1a1c] text-white" : "text-[#888]"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: VISÃO GERAL (DASHBOARD) */}
        {activeTab === "dashboard" && (
          <div className="p-4 sm:p-8 max-w-[1500px] w-full mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#96969b]">
                  Visão Geral · Hoje
                </span>
                <h1 className="text-[32px] sm:text-[38px] font-black tracking-tight leading-none text-white mt-1">
                  O que está acontecendo.
                </h1>
                <p className="text-xs sm:text-sm text-[#96969b] mt-1.5">
                  Uma visão operacional de vendas, atendimento, afiliados, agendamentos e NFC.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toast("Filtro de período atualizado")}
                  className="rounded-full border border-[#28282b] bg-[#151516] px-4 py-2 text-xs font-bold text-[#ddd]"
                >
                  Últimos 30 dias ⌄
                </button>
                <button
                  onClick={handleOpenModal}
                  className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black"
                >
                  + Criar
                </button>
              </div>
            </div>

            {/* 4 KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-[#28282b] bg-[#111112] p-5">
                <div className="flex items-center justify-between text-xs text-[#96969b]">
                  <span>Faturamento</span>
                  <TrendingUp className="h-4 w-4 text-[#37d67a]" />
                </div>
                <h2 className="text-[26px] sm:text-[30px] font-black text-white mt-4">
                  R$ 48.920
                </h2>
                <span className="text-[11px] font-bold text-[#37d67a] block mt-1">
                  +18,4% vs. anterior
                </span>
              </div>

              <div className="rounded-2xl border border-[#28282b] bg-[#111112] p-5">
                <div className="flex items-center justify-between text-xs text-[#96969b]">
                  <span>Pedidos & Serviços</span>
                  <ShoppingBag className="h-4 w-4 text-[#0066ff]" />
                </div>
                <h2 className="text-[26px] sm:text-[30px] font-black text-white mt-4">684</h2>
                <span className="text-[11px] font-bold text-[#37d67a] block mt-1">
                  +12,8% vs. anterior
                </span>
              </div>

              <div className="rounded-2xl border border-[#28282b] bg-[#111112] p-5">
                <div className="flex items-center justify-between text-xs text-[#96969b]">
                  <span>Conversão NFC</span>
                  <QrCode className="h-4 w-4 text-[#f4c95d]" />
                </div>
                <h2 className="text-[26px] sm:text-[30px] font-black text-white mt-4">8,7%</h2>
                <span className="text-[11px] font-bold text-[#37d67a] block mt-1">
                  +1,2 p.p. de toques
                </span>
              </div>

              <div className="rounded-2xl border border-[#28282b] bg-[#111112] p-5">
                <div className="flex items-center justify-between text-xs text-[#96969b]">
                  <span>Comissão Afiliados</span>
                  <Award className="h-4 w-4 text-[#ff75aa]" />
                </div>
                <h2 className="text-[26px] sm:text-[30px] font-black text-white mt-4">
                  R$ 7.384
                </h2>
                <span className="text-[11px] font-bold text-[#96969b] block mt-1">
                  15,1% da receita
                </span>
              </div>
            </div>

            {/* Charts & Meta */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2 rounded-2xl border border-[#28282b] bg-[#111112] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">Receita & Pedidos Diários</h3>
                  <div className="flex items-center gap-3 text-xs text-[#888]">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#0066ff]" /> Receita
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#777]" /> Pedidos
                    </span>
                  </div>
                </div>

                <div className="h-56 relative overflow-hidden">
                  <svg viewBox="0 0 700 245" preserveAspectRatio="none" className="w-full h-full">
                    <path
                      d="M0 205 C70 190 90 170 150 180 S240 125 300 145 S390 70 450 110 S535 45 590 75 S650 30 700 50"
                      fill="none"
                      stroke="#0066ff"
                      strokeWidth="3"
                    />
                    <path
                      d="M0 225 C75 220 105 210 160 215 S250 185 305 198 S390 165 450 178 S540 150 600 165 S660 130 700 145"
                      fill="none"
                      stroke="#777"
                      strokeWidth="2"
                    />
                    <line x1="0" y1="55" x2="700" y2="55" stroke="#222" strokeWidth="1" />
                    <line x1="0" y1="115" x2="700" y2="115" stroke="#222" strokeWidth="1" />
                    <line x1="0" y1="175" x2="700" y2="175" stroke="#222" strokeWidth="1" />
                  </svg>
                </div>
              </div>

              {/* Meta do Mês */}
              <div className="rounded-2xl border border-[#28282b] bg-[#111112] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Meta do Mês</h3>
                    <span className="text-xs text-[#888]">R$ 60 mil</span>
                  </div>
                  <div className="text-[38px] font-black text-white mt-4">81,5%</div>
                  <p className="text-xs text-[#888] mt-1">
                    R$ 11.080 restantes para atingir a meta operacional.
                  </p>
                  <div className="mt-4 h-2 w-full rounded-full bg-[#222] overflow-hidden">
                    <div className="h-full bg-[#0066ff] rounded-full" style={{ width: "81.5%" }} />
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-[#222] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#888]">Equipe Comercial</span>
                    <strong className="text-white">92%</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#888]">Afiliados & Embaixadores</span>
                    <strong className="text-white">74%</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#888]">Toques NFC Convertidos</span>
                    <strong className="text-white">88%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Pedidos Recentes & Equipe */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2 rounded-2xl border border-[#28282b] bg-[#111112] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">Pedidos Recentes</h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-[#0066ff] hover:underline"
                  >
                    Ver todos
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#28282b] text-[#5e5e64] uppercase text-[10px]">
                        <th className="pb-2.5">Cliente</th>
                        <th className="pb-2.5">Pedido</th>
                        <th className="pb-2.5">Valor</th>
                        <th className="pb-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1e21]">
                      <tr>
                        <td className="py-3 font-semibold text-white">Ana Martins</td>
                        <td className="py-3 text-[#888]">#AT-6841</td>
                        <td className="py-3 font-bold text-white">R$ 189,90</td>
                        <td className="py-3">
                          <span className="rounded-full bg-[#37d67a]/20 px-2 py-0.5 text-[10px] font-bold text-[#37d67a]">
                            Pago
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-semibold text-white">João Silva</td>
                        <td className="py-3 text-[#888]">#AT-6840</td>
                        <td className="py-3 font-bold text-white">R$ 129,90</td>
                        <td className="py-3">
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white">
                            Separando
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-semibold text-white">Camila Lopes</td>
                        <td className="py-3 text-[#888]">#AT-6839</td>
                        <td className="py-3 font-bold text-white">R$ 249,80</td>
                        <td className="py-3">
                          <span className="rounded-full bg-[#f4c95d]/20 px-2 py-0.5 text-[10px] font-bold text-[#f4c95d]">
                            Aguardando PIX
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-semibold text-white">Mariana Costa</td>
                        <td className="py-3 text-[#888]">#AT-8219</td>
                        <td className="py-3 font-bold text-white">R$ 160,00</td>
                        <td className="py-3">
                          <span className="rounded-full bg-[#0066ff]/20 px-2 py-0.5 text-[10px] font-bold text-[#0066ff]">
                            Agendado
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Atividade da Equipe */}
              <div className="rounded-2xl border border-[#28282b] bg-[#111112] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">Atividade em Tempo Real</h3>
                  <span className="text-[10px] font-bold text-[#37d67a] flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#37d67a] animate-pulse" /> Ao vivo
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-[#252528] font-bold text-white text-[10px]">
                      MA
                    </div>
                    <div className="flex-1">
                      <b className="text-white block">Marina Alves</b>
                      <span className="text-[#888] text-[11px]">fechou venda de R$ 420 via WhatsApp</span>
                    </div>
                    <span className="text-[10px] text-[#555]">2m</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-[#252528] font-bold text-white text-[10px]">
                      CA
                    </div>
                    <div className="flex-1">
                      <b className="text-white block">Carlos Almeida</b>
                      <span className="text-[#888] text-[11px]">concluiu validação de 5 cupons NFC</span>
                    </div>
                    <span className="text-[10px] text-[#555]">8m</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-[#252528] font-bold text-white text-[10px]">
                      BR
                    </div>
                    <div className="flex-1">
                      <b className="text-white block">Bruna Ribeiro</b>
                      <span className="text-[#888] text-[11px]">confirmou agendamento para sexta</span>
                    </div>
                    <span className="text-[10px] text-[#555]">14m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SLUGS & PLACAS NFC (MÓDULO CRÍTICO SOLICITADO PELO USUÁRIO) */}
        {activeTab === "slugs_nfc" && (
          <div className="p-4 sm:p-8 max-w-[1400px] w-full mx-auto space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff75aa]">
                Arquitetura de Slugs & Hardware NFC
              </span>
              <h1 className="text-[30px] sm:text-[36px] font-black tracking-tight leading-none text-white mt-1">
                Gestão de Slugs Únicas & Placas NFC
              </h1>
              <p className="text-xs sm:text-sm text-[#96969b] mt-1.5 max-w-2xl">
                A URL slug do estabelecimento é gravada permanentemente no chip físico da placa NFC. Atualizações de conteúdo, banners, serviços ou produtos não interferem na placa.
              </p>
            </div>

            {/* Banner de Regra de Negócio & Segurança */}
            <div className="rounded-3xl border border-[#28282b] bg-gradient-to-br from-[#121215] to-[#0a0a0c] p-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ff75aa]/15 text-[#ff75aa] shrink-0">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Proteção de Integridade das Placas NFC
                  </h3>
                  <p className="mt-1 text-xs text-[#888] leading-relaxed max-w-3xl">
                    Cada placa NFC possui um link absoluto fixo gravado por indução magnética (ex.: <code className="text-[#ff75aa] bg-white/5 px-2 py-0.5 rounded">https://avaliatap.com/c/{merchant.slug}</code>).
                    O comerciante pode alterar produtos, fotos de procedimentos, preços, horários de agendamento e banners à vontade sem nunca quebrar a placa física existente.
                  </p>
                </div>
              </div>
            </div>

            {/* Upgrade Multi-Slug e Venda de Novas Placas NFC */}
            <div className="rounded-3xl border border-[#ff75aa]/30 bg-gradient-to-r from-[#170e14] via-[#101012] to-[#0b0b0d] p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <span className="inline-block rounded-full bg-[#ff75aa] px-3 py-1 text-[10px] font-black uppercase text-black">
                    Upgrade Comercial: Multi-Páginas & Placas Extras
                  </span>
                  <h2 className="mt-3 text-[24px] sm:text-[28px] font-black text-white leading-tight">
                    Tenha até 5 Slugs com Placas NFC Independentes
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#aaa] max-w-xl leading-relaxed">
                    Precisa de uma placa específica para o caixa (avaliações Google), outra para a recepção (agendamento online) e outra para as mesas (clube de fidelidade)?
                    Adquira novas placas físicas já programadas para cada ação exclusiva.
                  </p>
                </div>

                <div className="shrink-0 flex flex-col gap-2.5">
                  <a
                    href="https://wa.me/5511999990000?text=Olá!%20Gostaria%20de%20solicitar%20o%20upgrade%20para%20Multi-Slugs%20e%20novas%20placas%20NFC%20físicas."
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#ff75aa] px-6 py-4 text-xs font-black text-black shadow-lg hover:bg-[#ff5c9c] transition-all"
                  >
                    <Smartphone className="h-4 w-4" />
                    Solicitar Novas Placas & Slugs no WhatsApp
                  </a>
                  <span className="text-[11px] text-center text-[#777]">
                    Até 5 páginas personalizadas por comércio
                  </span>
                </div>
              </div>

              {/* Tabela de Slugs do Comércio */}
              <div className="mt-6 border-t border-[#28282b] pt-5">
                <h4 className="text-xs font-bold text-white mb-3">Slugs Vinculadas a este Comércio:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-[#333] bg-[#141416] p-4">
                    <span className="rounded-full bg-[#37d67a]/20 px-2 py-0.5 text-[9px] font-bold text-[#37d67a] uppercase">
                      Slug Principal (Ativa)
                    </span>
                    <b className="block text-sm text-white mt-2">/c/{merchant.slug}</b>
                    <small className="block text-[#777] text-[11px] mt-1">
                      Placa Balcão · Destino Geral
                    </small>
                  </div>

                  <div className="rounded-2xl border border-dashed border-[#333] bg-[#0e0e10] p-4 flex flex-col justify-between">
                    <div>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold text-[#888] uppercase">
                        Slot 2 Disponível
                      </span>
                      <b className="block text-xs text-[#888] mt-2">/c/{merchant.slug}-agendamento</b>
                      <small className="block text-[#666] text-[10.5px] mt-0.5">
                        Para placa exclusiva de procedimentos
                      </small>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-[#333] bg-[#0e0e10] p-4 flex flex-col justify-between">
                    <div>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold text-[#888] uppercase">
                        Slot 3 Disponível
                      </span>
                      <b className="block text-xs text-[#888] mt-2">/c/{merchant.slug}-clube</b>
                      <small className="block text-[#666] text-[10.5px] mt-0.5">
                        Para totem de carimbos fidelidade
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PIPELINE (FUNIL DE VENDAS) */}
        {activeTab === "pipeline" && (
          <div className="p-4 sm:p-8 max-w-[1500px] w-full mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#96969b]">
                  Comercial & Conversão
                </span>
                <h1 className="text-[32px] sm:text-[38px] font-black tracking-tight leading-none text-white mt-1">
                  Funil de Vendas.
                </h1>
                <p className="text-xs sm:text-sm text-[#96969b] mt-1.5">
                  Visualize oportunidades e movimente negócios sem perder contexto.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleOpenModal}
                  className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black"
                >
                  + Nova Oportunidade
                </button>
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none">
              <div className="min-w-[260px] rounded-2xl border border-[#28282b] bg-[#111112] p-3.5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <b className="text-white">Novos leads NFC</b>
                  <span className="text-[#888]">12 · R$ 4,8k</span>
                </div>
                <div className="rounded-xl border border-[#242427] bg-[#161618] p-3 space-y-2">
                  <b className="text-xs text-white block">Juliana Costa</b>
                  <small className="text-[#888] block text-[11px]">Toque NFC no balcão · Combo</small>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="rounded-md bg-[#222] px-2 py-0.5 text-[9.5px] text-[#aaa]">NFC Balcão</span>
                    <strong className="text-white">R$ 249</strong>
                  </div>
                </div>
                <div className="rounded-xl border border-[#242427] bg-[#161618] p-3 space-y-2">
                  <b className="text-xs text-white block">Rafael Mendes</b>
                  <small className="text-[#888] block text-[11px]">Landing page · Primeiro agendamento</small>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="rounded-md bg-[#222] px-2 py-0.5 text-[9.5px] text-[#aaa]">Online</span>
                    <strong className="text-white">R$ 160</strong>
                  </div>
                </div>
              </div>

              <div className="min-w-[260px] rounded-2xl border border-[#28282b] bg-[#111112] p-3.5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <b className="text-white">Qualificação</b>
                  <span className="text-[#888]">8 · R$ 3,2k</span>
                </div>
                <div className="rounded-xl border border-[#242427] bg-[#161618] p-3 space-y-2">
                  <b className="text-xs text-white block">Beatriz Alves</b>
                  <small className="text-[#888] block text-[11px]">Interessada no protocolo facial</small>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="rounded-md bg-[#222] px-2 py-0.5 text-[9.5px] text-[#aaa]">WhatsApp</span>
                    <strong className="text-white">R$ 190</strong>
                  </div>
                </div>
              </div>

              <div className="min-w-[260px] rounded-2xl border border-[#28282b] bg-[#111112] p-3.5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <b className="text-white">Horário Marcado</b>
                  <span className="text-[#888]">6 · R$ 5,6k</span>
                </div>
                <div className="rounded-xl border border-[#242427] bg-[#161618] p-3 space-y-2">
                  <b className="text-xs text-white block">Carolina Dias</b>
                  <small className="text-[#888] block text-[11px]">Sexta-feira 14h · Confirmado</small>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="rounded-md bg-[#0066ff]/20 px-2 py-0.5 text-[9.5px] text-[#0066ff]">Agendado</span>
                    <strong className="text-white">R$ 380</strong>
                  </div>
                </div>
              </div>

              <div className="min-w-[260px] rounded-2xl border border-[#28282b] bg-[#111112] p-3.5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <b className="text-white">Ganho / Fidelizado</b>
                  <span className="text-[#888]">19 · R$ 12,4k</span>
                </div>
                <div className="rounded-xl border border-[#242427] bg-[#161618] p-3 space-y-2">
                  <b className="text-xs text-white block">Mariana Costa</b>
                  <small className="text-[#888] block text-[11px]">Cliente VIP · 8 carimbos no clube</small>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="rounded-md bg-[#37d67a]/20 px-2 py-0.5 text-[9.5px] text-[#37d67a]">Recorrente</span>
                    <strong className="text-white">R$ 699</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTATOS CRM */}
        {activeTab === "contacts" && (
          <div className="p-4 sm:p-8 max-w-[1500px] w-full mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#96969b]">
                  Base Central
                </span>
                <h1 className="text-[30px] font-black text-white">Contatos & Leads</h1>
              </div>
              <button
                onClick={handleOpenModal}
                className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black"
              >
                + Novo Contato
              </button>
            </div>

            <div className="rounded-2xl border border-[#28282b] bg-[#111112] p-5">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#28282b] text-[#5e5e64] uppercase text-[10px]">
                    <th className="pb-3">Contato</th>
                    <th className="pb-3">Origem</th>
                    <th className="pb-3">Última Interação</th>
                    <th className="pb-3">Valor Total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e21]">
                  <tr>
                    <td className="py-3.5">
                      <b className="text-white block">Mariana Costa</b>
                      <span className="text-[#888] text-[11px]">(11) 98881-2201</span>
                    </td>
                    <td className="py-3.5 text-[#aaa]">Placa NFC Balcão</td>
                    <td className="py-3.5 text-[#888]">Hoje, 14:32</td>
                    <td className="py-3.5 font-bold text-white">R$ 1.289</td>
                    <td className="py-3.5">
                      <span className="rounded-full bg-[#37d67a]/20 px-2 py-0.5 text-[10px] font-bold text-[#37d67a]">
                        Cliente VIP
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5">
                      <b className="text-white block">Rafael Souza</b>
                      <span className="text-[#888] text-[11px]">(11) 97712-8430</span>
                    </td>
                    <td className="py-3.5 text-[#aaa]">Agendamento Online</td>
                    <td className="py-3.5 text-[#888]">Hoje, 09:18</td>
                    <td className="py-3.5 font-bold text-white">R$ 349</td>
                    <td className="py-3.5">
                      <span className="rounded-full bg-[#0066ff]/20 px-2 py-0.5 text-[10px] font-bold text-[#0066ff]">
                        Agendado
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5">
                      <b className="text-white block">Carolina Mendes</b>
                      <span className="text-[#888] text-[11px]">(11) 99123-4567</span>
                    </td>
                    <td className="py-3.5 text-[#aaa]">Indicação Embaixador</td>
                    <td className="py-3.5 text-[#888]">Ontem</td>
                    <td className="py-3.5 font-bold text-white">R$ 790</td>
                    <td className="py-3.5">
                      <span className="rounded-full bg-[#f4c95d]/20 px-2 py-0.5 text-[10px] font-bold text-[#f4c95d]">
                        Cupom Ativo
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: WHATSAPP & CONVERSAS */}
        {(activeTab === "whatsapp" || activeTab === "conversations") && (
          <div className="p-4 sm:p-8 max-w-[1500px] w-full mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#37d67a]">
                  Atendimento Multicanal
                </span>
                <h1 className="text-[30px] font-black text-white">
                  WhatsApp & Instâncias Integradas
                </h1>
              </div>
              <button
                onClick={() => toast.success("Nova instância conectada!")}
                className="rounded-full bg-[#37d67a] px-4 py-2 text-xs font-bold text-black"
              >
                + Conectar Instância
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-[#28282b] bg-[#111112] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">API Oficial Meta Cloud</h3>
                  <span className="rounded-full bg-[#37d67a]/20 px-2 py-0.5 text-[10px] font-bold text-[#37d67a]">
                    Conectado
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{merchant.whatsapp}</h2>
                <p className="text-xs text-[#888]">Qualidade alta · templates aprovados</p>
                <div className="pt-2 border-t border-[#222] text-xs text-[#aaa] space-y-1">
                  <div className="flex justify-between">
                    <span>Mensagens hoje</span>
                    <strong className="text-white">1.248</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Fluxos ativos</span>
                    <strong className="text-white">18</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#28282b] bg-[#111112] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Automações Ativas</h3>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white">
                    3 regras
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#161618]">
                    <span>Boas-vindas NFC</span>
                    <span className="text-[#37d67a] font-bold">Ativo</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#161618]">
                    <span>Lembrete de Agendamento</span>
                    <span className="text-[#37d67a] font-bold">Ativo</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#161618]">
                    <span>Aviso de Cupom a Vencer</span>
                    <span className="text-[#37d67a] font-bold">Ativo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PROGRAMA DE EMBAIXADORES */}
        {activeTab === "ambassadors" && (
          <div className="p-4 sm:p-8 max-w-[1500px] w-full mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff75aa]">
                  Afiliados & Recompensa
                </span>
                <h1 className="text-[30px] font-black text-white">
                  Programa de Embaixadores
                </h1>
              </div>
              <button
                onClick={handleOpenModal}
                className="rounded-full bg-[#ff75aa] px-4 py-2 text-xs font-bold text-black"
              >
                + Convidar Embaixador
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-[#28282b] bg-[#111112] p-4">
                <span className="text-xs text-[#888]">Embaixadores Ativos</span>
                <h3 className="text-2xl font-black text-white mt-1">148</h3>
                <span className="text-[10.5px] text-[#37d67a]">+22 este mês</span>
              </div>
              <div className="rounded-2xl border border-[#28282b] bg-[#111112] p-4">
                <span className="text-xs text-[#888]">Vendas Indicadas</span>
                <h3 className="text-2xl font-black text-white mt-1">R$ 38.740</h3>
                <span className="text-[10.5px] text-[#37d67a]">+27,8%</span>
              </div>
              <div className="rounded-2xl border border-[#28282b] bg-[#111112] p-4">
                <span className="text-xs text-[#888]">Comissões Pagas</span>
                <h3 className="text-2xl font-black text-white mt-1">R$ 7.384</h3>
                <span className="text-[10.5px] text-[#888]">19,1% do total</span>
              </div>
              <div className="rounded-2xl border border-[#28282b] bg-[#111112] p-4">
                <span className="text-xs text-[#888]">Taxa de Conversão</span>
                <h3 className="text-2xl font-black text-white mt-1">11,4%</h3>
                <span className="text-[10.5px] text-[#37d67a]">+2,1 p.p.</span>
              </div>
            </div>
          </div>
        )}

        {/* OUTRAS ABAS COM FEEDBACK VISUAL LIMPO */}
        {!["dashboard", "pipeline", "contacts", "whatsapp", "conversations", "ambassadors", "slugs_nfc"].includes(activeTab) && (
          <div className="p-4 sm:p-8 max-w-[1400px] w-full mx-auto space-y-6">
            <h1 className="text-[28px] font-black text-white capitalize">
              {navItems.find((n) => n.id === activeTab)?.label ?? activeTab}
            </h1>
            <div className="rounded-2xl border border-[#28282b] bg-[#111112] p-8 text-center space-y-3">
              <Sparkles className="mx-auto h-8 w-8 text-[#0066ff]" />
              <p className="text-sm text-[#aaa]">
                Módulo sincronizado e operando no backend da plataforma.
              </p>
              <button
                onClick={handleOpenModal}
                className="rounded-full bg-white px-5 py-2.5 text-xs font-bold text-black"
              >
                + Registrar Ação neste Módulo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL UNIVERSAL DINÂMICO */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSaveModal}
            className="w-full max-w-md rounded-3xl border border-[#303034] bg-[#121214] p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Criar Novo Registro</h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#222] text-[#aaa] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#888] mb-1 font-semibold">Título / Nome</label>
                <input
                  required
                  placeholder="Ex.: Novo Contrato ou Lead"
                  className="w-full h-11 rounded-xl border border-[#2b2b2e] bg-[#19191b] px-3 text-white outline-none focus:border-[#0066ff]"
                />
              </div>

              <div>
                <label className="block text-[#888] mb-1 font-semibold">Valor Estimado (R$)</label>
                <input
                  placeholder="R$ 250,00"
                  className="w-full h-11 rounded-xl border border-[#2b2b2e] bg-[#19191b] px-3 text-white outline-none focus:border-[#0066ff]"
                />
              </div>

              <div>
                <label className="block text-[#888] mb-1 font-semibold">Observações</label>
                <textarea
                  rows={3}
                  placeholder="Detalhes operacionais..."
                  className="w-full rounded-xl border border-[#2b2b2e] bg-[#19191b] p-3 text-white outline-none focus:border-[#0066ff]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="h-10 px-4 rounded-xl border border-[#28282b] bg-[#171719] text-xs font-bold text-[#888]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="h-10 px-5 rounded-xl bg-white text-xs font-bold text-black hover:bg-white/90"
              >
                Salvar Registro
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
