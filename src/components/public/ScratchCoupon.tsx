import { useEffect, useRef, useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";

interface Props {
  discount: string;
  code: string;
  rules: string;
}

export function ScratchCoupon({ discount, code, rules }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [copied, setCopied] = useState(false);

  const paint = () => {
    const canvas = canvasRef.current;
    const box = boxRef.current;
    if (!canvas || !box) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const rect = box.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    g.addColorStop(0, "#d9d9d6");
    g.addColorStop(0.5, "#bcbcb8");
    g.addColorStop(1, "#e2e2de");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, rect.width, rect.height);
    for (let i = 0; i < 700; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.08})`;
      ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, 1, 1);
    }
    ctx.textAlign = "center";
    ctx.fillStyle = "#555";
    ctx.font = "800 17px system-ui";
    ctx.fillText("RASPE AQUI", rect.width / 2, rect.height / 2 - 2);
    ctx.font = "12px system-ui";
    ctx.fillStyle = "#666";
    ctx.fillText("para descobrir seu benefício", rect.width / 2, rect.height / 2 + 20);
  };

  useEffect(() => {
    paint();
    const onResize = () => {
      if (!revealed) paint();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    for (let i = 3; i < data.length; i += 16) if (data[i]! < 80) clear++;
    if (clear / (data.length / 16) > 0.5) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setRevealed(true);
    }
  };

  const point = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    const p = "touches" in e ? e.touches[0]! : e;
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  };

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current || revealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const p = point(e);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 38;
    ctx.beginPath();
    const from = last.current ?? p;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    progress();
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    drawing.current = true;
    last.current = null;
    scratch(e);
  };
  const stop = () => {
    drawing.current = false;
    last.current = null;
  };

  const reset = () => {
    setRevealed(false);
    setClaimed(false);
    setCopied(false);
    paint();
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
      <div
        ref={boxRef}
        className="relative h-40 overflow-hidden rounded-2xl bg-primary-soft"
        onMouseDown={start}
        onMouseMove={scratch}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchMove={scratch}
        onTouchEnd={stop}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 select-none">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
            Seu benefício
          </span>
          <span className="text-3xl font-extrabold tracking-tight text-foreground">{discount}</span>
          <span className="rounded-lg bg-secondary px-3 py-1 text-[12px] font-bold tracking-[0.14em] text-secondary-foreground">
            {code}
          </span>
        </div>
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 touch-none transition-opacity ${revealed ? "pointer-events-none opacity-0" : ""}`}
        />
      </div>

      <p className="mt-3 text-center text-[12px] text-muted-foreground">
        {revealed ? "✨ Você encontrou seu benefício!" : "👆 Passe o dedo para raspar"}
      </p>

      <button
        disabled={!revealed || claimed}
        onClick={() => setClaimed(true)}
        className="mt-3 w-full rounded-2xl bg-secondary px-4 py-3.5 text-[13px] font-extrabold uppercase tracking-wide text-secondary-foreground transition disabled:opacity-40"
      >
        {claimed ? "Cupom liberado ✓" : "Descobrir meu cupom"}
      </button>

      {claimed && (
        <div className="mt-3 rounded-2xl bg-primary px-4 py-3 text-center text-[12.5px] font-semibold text-primary-foreground">
          Cupom liberado! Apresente o código no estabelecimento.
          <p className="mt-1 text-[11px] font-medium opacity-70">{rules}</p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-center gap-4 text-[12px] text-muted-foreground">
        <button
          onClick={() => {
            navigator.clipboard?.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
          className="inline-flex items-center gap-1.5 font-medium"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Código copiado" : "Copiar código"}
        </button>
        <button onClick={reset} className="inline-flex items-center gap-1.5 font-medium">
          <RotateCcw className="h-3.5 w-3.5" />
          Testar novamente
        </button>
      </div>
    </div>
  );
}
