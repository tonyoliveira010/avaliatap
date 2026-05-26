import { Bell, MapPin } from "lucide-react";
import { motion } from "motion/react";

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

        <button className="relative h-11 w-11 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-muted transition-colors active:scale-95">
          <Bell className="h-[18px] w-[18px] text-foreground" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-surface" />
        </button>
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
