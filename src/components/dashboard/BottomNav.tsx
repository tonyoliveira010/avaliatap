import { Home, Package, Wallet, User, Plus } from "lucide-react";
import { motion } from "motion/react";
import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { RequestModal } from "./RequestModal";
import { CleanupModal } from "./CleanupModal";
import { RequestChoiceModal } from "./RequestChoiceModal";

type Tab = { id: string; to: string; icon: typeof Home; label: string; center?: boolean };

const tabs: Tab[] = [
  { id: "home", to: "/", icon: Home, label: "Início" },
  { id: "orders", to: "/pedidos", icon: Package, label: "Pedidos" },
  { id: "request", to: "#", icon: Plus, label: "Solicitar", center: true },
  { id: "finance", to: "/financeiro", icon: Wallet, label: "Financeiro" },
  { id: "profile", to: "/perfil", icon: User, label: "Perfil" },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [cleanupOpen, setCleanupOpen] = useState(false);


  return (
    <>
      <nav className="fixed bottom-0 inset-x-0 z-40">
        <div
          className="max-w-md mx-auto border-t border-white/8 px-2 pt-2 pb-[max(env(safe-area-inset-bottom),12px)]"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.13 0.012 162 / 0.96), oklch(0.07 0.006 160 / 0.98))",
            backdropFilter: "blur(32px) saturate(180%)",
          }}
        >
          <ul className="flex items-stretch justify-between">
            {tabs.map((t) => {
              const isActive = !t.center && pathname === t.to;
              if (t.center) {
                return (
                  <li key={t.id} className="flex-1 flex justify-center">
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setChoiceOpen(true)}
                      className="-mt-6 h-[58px] w-[58px] rounded-2xl bg-primary text-primary-foreground flex flex-col items-center justify-center shadow-glow border-2 border-background"
                      aria-label="Solicitar tambor"
                    >
                      <Plus className="h-5 w-5" strokeWidth={3} />
                      <span className="text-[8.5px] font-bold uppercase tracking-wider mt-0.5">
                        Pedido
                      </span>
                    </motion.button>
                  </li>
                );
              }
              return (
                <li key={t.id} className="flex-1">
                  <Link
                    to={t.to as "/"}
                    className="relative h-full flex flex-col items-center justify-center py-2 gap-0.5"
                  >
                    <motion.span whileTap={{ scale: 0.92 }} className="flex flex-col items-center gap-0.5">
                      <t.icon
                        className={`h-[20px] w-[20px] transition-colors ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`}
                        strokeWidth={isActive ? 2.6 : 2.1}
                      />
                      <span
                        className={`text-[10px] font-semibold transition-colors ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {t.label}
                      </span>
                    </motion.span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-bar-indicator"
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

      <RequestModal open={requestOpen} onClose={() => setRequestOpen(false)} />
    </>
  );
}
