import { TrendingUp, Wallet, AlertCircle } from "lucide-react";

export function FinanceStrip() {
  return (
    <section className="px-5 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-semibold text-foreground">Financeiro</h3>
        <button className="text-[12px] text-muted-foreground font-medium">Detalhes</button>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl bg-surface border border-border p-3 shadow-soft">
          <Wallet className="h-4 w-4 text-primary" />
          <p className="mt-2 text-[10px] text-muted-foreground uppercase tracking-wide">Pago</p>
          <p className="text-[15px] font-semibold text-foreground mt-0.5">R$ 480</p>
        </div>
        <div className="rounded-2xl bg-surface border border-border p-3 shadow-soft">
          <TrendingUp className="h-4 w-4 text-info" />
          <p className="mt-2 text-[10px] text-muted-foreground uppercase tracking-wide">Próxima</p>
          <p className="text-[15px] font-semibold text-foreground mt-0.5">R$ 120</p>
        </div>
        <div className="rounded-2xl bg-warning/10 border border-warning/20 p-3">
          <AlertCircle className="h-4 w-4 text-warning" />
          <p className="mt-2 text-[10px] text-warning/80 uppercase tracking-wide font-medium">Diária extra</p>
          <p className="text-[15px] font-semibold text-foreground mt-0.5">R$ 45</p>
        </div>
      </div>
    </section>
  );
}
