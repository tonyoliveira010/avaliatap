import { Bell, MapPin, Coins } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { userCredits } from "@/lib/credits";

export function Header() {
  return (
    <header className="px-5 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative h-11 w-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold shadow-soft"
          >
            R
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-background" />
          </motion.div>
          <div>
            <p className="text-[13px] text-muted-foreground leading-tight">Olá, bom dia</p>
            <h2 className="text-base font-semibold text-foreground leading-tight">Rogério 👋</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/financeiro"
            className="relative inline-flex items-center gap-1.5 h-11 rounded-full bg-warning/15 border border-warning/40 pl-2.5 pr-3 text-warning hover:bg-warning/20 transition-colors active:scale-95"
            aria-label={`${userCredits.balance} créditos disponíveis`}
          >
            <span className="h-7 w-7 rounded-full bg-warning text-background flex items-center justify-center">
              <Coins className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
            <span className="text-[13px] font-bold tabular-nums leading-none">
              {userCredits.balance}
            </span>
          </Link>
          <button className="relative h-11 w-11 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-muted transition-colors active:scale-95">
            <Bell className="h-[18px] w-[18px] text-foreground" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-surface" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-[13px] text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" />
        <span>São Paulo · Vila Madalena</span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-primary-soft text-primary px-2.5 py-1 text-[11px] font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          2 pedidos ativos
        </span>
      </div>
    </header>
  );
}
