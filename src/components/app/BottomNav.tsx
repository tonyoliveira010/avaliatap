import { Home, Megaphone, Nfc, User, Users, Package } from "lucide-react";
import { motion } from "motion/react";
import { Link, useLocation } from "@tanstack/react-router";

const tabs = [
  { id: "home", to: "/", icon: Home, label: "Início" },
  { id: "campanhas", to: "/campanhas", icon: Megaphone, label: "Campanhas" },
  { id: "catalogo", to: "/catalogo", icon: Package, label: "Vitrine" },
  { id: "beneficiarios", to: "/beneficiarios", icon: Users, label: "Clientes" },
  { id: "nfc", to: "/nfc", icon: Nfc, label: "NFC" },
  { id: "perfil", to: "/perfil", icon: User, label: "Perfil" },
] as const;


export function BottomNav() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/c/") || pathname === "/auth" || pathname === "/landing") return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40">
      <div
        className="mx-auto max-w-md border-t px-2 pt-2 pb-[max(env(safe-area-inset-bottom),12px)]"
        style={{
          background: "var(--nav-gradient)",
          borderColor: "var(--nav-border)",
          backdropFilter: "blur(32px) saturate(180%)",
        }}
      >
        <ul className="flex items-stretch justify-between">
          {tabs.map((t) => {
            const active = pathname === t.to;
            return (
              <li key={t.id} className="flex-1">
                <Link to={t.to} className="relative flex h-full flex-col items-center justify-center gap-0.5 py-2">
                  <motion.span whileTap={{ scale: 0.92 }} className="flex flex-col items-center gap-0.5">
                    <t.icon
                      className={`h-5 w-5 ${active ? "text-foreground" : "text-muted-foreground"}`}
                      strokeWidth={active ? 2.6 : 2}
                    />
                    <span className={`text-[10px] font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>
                      {t.label}
                    </span>
                  </motion.span>
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute top-0 h-0.5 w-8 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
