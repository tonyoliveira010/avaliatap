import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Loader2, Mail, Lock, User as UserIcon, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar · AvaliaTap" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/admin",
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu e-mail para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate({ to: "/admin" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo deu errado");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/admin",
      });
    } catch {
      toast.error("Não foi possível entrar com Google");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 py-10">
      <Link
        to="/landing"
        className="absolute top-5 left-5 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-success flex items-center justify-center text-primary-foreground text-xl font-bold">
            T
          </div>
          <div>
            <h1 className="text-[22px] font-semibold text-foreground tracking-tight">AvaliaTap</h1>
            <p className="text-[12px] text-muted-foreground">Painel de gestão e pedidos</p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-6 shadow-elegant">
          <div className="inline-flex bg-muted rounded-full p-1 w-full mb-5">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-[12.5px] font-semibold rounded-full transition-all ${
                  mode === m ? "bg-surface text-foreground shadow-soft" : "text-muted-foreground"
                }`}
              >
                {m === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <Input icon={UserIcon} placeholder="Nome completo" value={name} onChange={setName} />
            )}
            <Input
              icon={Mail}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={setEmail}
              required
            />
            <Input
              icon={Lock}
              type="password"
              placeholder="Senha"
              value={password}
              onChange={setPassword}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-primary text-primary-foreground py-3.5 text-[14px] font-semibold active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] text-muted-foreground">ou</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full rounded-2xl border border-border bg-surface py-3.5 text-[14px] font-semibold text-foreground active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <GoogleIcon /> Continuar com Google
          </button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-5">
          Administradores acessam o painel em <strong className="text-foreground">/admin</strong>
        </p>
      </motion.div>
    </div>
  );
}

function Input({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  icon: typeof Mail;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-background px-3.5 py-3 focus-within:border-primary/50 transition-colors">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-[14px] text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}
