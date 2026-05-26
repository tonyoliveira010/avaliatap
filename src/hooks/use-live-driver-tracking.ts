import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface LiveTrackingState {
  /** ETA atual em minutos (atualizado dinamicamente) */
  etaMin: number;
  /** Distância restante em km */
  distanceKm: number;
  /** Velocidade simulada em km/h */
  speedKmh: number;
  /** Posição do veículo na rota (0..1) */
  progress: number;
  /** Última vez que o ETA foi atualizado */
  lastUpdate: Date;
}

interface Options {
  enabled: boolean;
  initialEtaMin: number;
  initialDistanceKm?: number;
  /** Dispara toast em mudanças relevantes */
  notify?: boolean;
  orderId?: string;
}

/**
 * Simula atualização em tempo real do motorista.
 * - Move a posição ao longo da rota
 * - Recalcula ETA com pequenas variações (trânsito)
 * - Notifica quando ETA muda significativamente (>= 2 min)
 */
export function useLiveDriverTracking({
  enabled,
  initialEtaMin,
  initialDistanceKm = 3.2,
  notify = true,
  orderId,
}: Options): LiveTrackingState {
  const [state, setState] = useState<LiveTrackingState>(() => ({
    etaMin: initialEtaMin,
    distanceKm: initialDistanceKm,
    speedKmh: 38,
    progress: 0.45,
    lastUpdate: new Date(),
  }));
  const lastNotifiedEta = useRef(initialEtaMin);

  useEffect(() => {
    if (!enabled) return;
    const tick = () => {
      setState((prev) => {
        // Avança no trajeto
        const progressStep = 0.015 + Math.random() * 0.02;
        const progress = Math.min(1, prev.progress + progressStep);
        // Variação de tráfego: -0.6..+0.4 min por tick
        const traffic = (Math.random() - 0.6) * 1.2;
        const baseEta = Math.max(1, Math.round((1 - progress) * initialEtaMin + traffic));
        const distanceKm = Math.max(0.1, +(initialDistanceKm * (1 - progress)).toFixed(1));
        const speedKmh = Math.round(28 + Math.random() * 22);

        // Notificação se mudança significativa
        if (notify && Math.abs(baseEta - lastNotifiedEta.current) >= 2) {
          const delta = baseEta - lastNotifiedEta.current;
          lastNotifiedEta.current = baseEta;
          if (delta < 0) {
            toast.success(`ETA atualizada: chega em ~${baseEta} min`, {
              description: orderId ? `Pedido #${orderId}` : "Motorista adiantado",
            });
          } else {
            toast(`ETA atualizada: ~${baseEta} min`, {
              description: orderId ? `Pedido #${orderId} · trânsito local` : "Pequeno atraso no trajeto",
            });
          }
        }

        return {
          etaMin: baseEta,
          distanceKm,
          speedKmh,
          progress,
          lastUpdate: new Date(),
        };
      });
    };

    const id = window.setInterval(tick, 6000);
    return () => window.clearInterval(id);
  }, [enabled, initialEtaMin, initialDistanceKm, notify, orderId]);

  return state;
}
