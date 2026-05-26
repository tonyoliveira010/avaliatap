import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { OrderData, OrderStatus } from "@/components/dashboard/ActiveOrderCard";

const statusLabel: Record<OrderStatus, string> = {
  active: "Em uso",
  in_delivery: "Em entrega",
  near_expiration: "Vencendo",
  pickup_requested: "Coleta solicitada",
  completed: "Finalizado",
};

/**
 * Notifica quando o status de qualquer pedido muda (entre renders).
 * Como usamos mock, comparamos contra o snapshot anterior em memória.
 */
export function useOrderStatusNotifications(orders: OrderData[]) {
  const prev = useRef<Map<string, OrderStatus>>(new Map());
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      orders.forEach((o) => prev.current.set(o.id, o.status));
      initialized.current = true;
      return;
    }
    orders.forEach((o) => {
      const old = prev.current.get(o.id);
      if (old && old !== o.status) {
        toast(`Pedido #${o.id} agora está ${statusLabel[o.status]}`, {
          description: `Antes: ${statusLabel[old]} → ${statusLabel[o.status]}`,
        });
      }
      prev.current.set(o.id, o.status);
    });
  }, [orders]);
}
