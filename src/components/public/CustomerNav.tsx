import { Link, useParams } from "@tanstack/react-router";
import { Home, Sparkles, Vote, Coins } from "lucide-react";

const items = [
  { to: "/c/$slug", label: "Início", icon: Home, exact: true },
  { to: "/c/$slug/beneficios", label: "Benefícios", icon: Sparkles, exact: false },
  { to: "/c/$slug/enquetes", label: "Enquetes", icon: Vote, exact: false },
  { to: "/c/$slug/creditos", label: "Créditos", icon: Coins, exact: false },
] as const;

export function CustomerNav() {
  const { slug } = useParams({ from: "/c/$slug" });

  return (
    <nav className="fixed inset-x-0 bottom-3.5 z-30 mx-auto grid w-[min(394px,calc(100vw-36px))] grid-cols-4 items-center rounded-[22px] bg-surface shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          params={{ slug }}
          activeOptions={{ exact: item.exact }}
          activeProps={{ className: "text-foreground" }}
          inactiveProps={{ className: "text-muted-foreground" }}
          className="flex h-[66px] flex-col items-center justify-center gap-1 text-[9px] font-bold"
        >
          <item.icon className="h-[19px] w-[19px]" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
