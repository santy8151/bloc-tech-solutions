import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso empleados — Bloque Tech" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/portal" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/portal" },
        });
        if (error) throw error;
        navigate({ to: "/portal" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/portal" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error de autenticación";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ background: "var(--gradient-hero)" }} />
      <div className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Volver al sitio
        </Link>
        <div className="rounded-2xl bg-card border border-border p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Acceso empleados</h1>
              <p className="text-xs text-muted-foreground">Portal interno · Bloque Tech</p>
            </div>
          </div>

          <div className="flex gap-1 p-1 bg-secondary rounded-md mb-6 text-sm font-medium">
            <button onClick={() => setMode("login")} className={`flex-1 h-9 rounded ${mode === "login" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>Iniciar sesión</button>
            <button onClick={() => setMode("signup")} className={`flex-1 h-9 rounded ${mode === "signup" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>Registrarme</button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> Correo</label>
              <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-md bg-input border border-border focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2"><Lock className="h-3.5 w-3.5" /> Contraseña</label>
              <div className="relative">
                <input required type={showPw ? "text" : "password"} minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-4 pr-11 rounded-md bg-input border border-border focus:border-primary focus:outline-none" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 inline-flex items-center justify-center text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Mínimo 6 caracteres. Cifrada con bcrypt en el servidor.</p>
            </div>
            {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded px-3 py-2">{error}</div>}
            <button type="submit" disabled={loading} className="w-full h-12 rounded-md font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
              style={{ background: "var(--gradient-accent)" }}>
              {loading ? "Cargando..." : mode === "login" ? "Entrar al portal" : "Crear cuenta"}
            </button>
          </form>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            Solo personal autorizado. El primer registro se asigna como administrador.
          </p>
        </div>
      </div>
    </div>
  );
}