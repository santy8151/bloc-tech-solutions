import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, Truck, ShoppingBag, FileSignature, MessageSquare, Network, LogOut, Building, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import logo from "@/assets/logo.png";
import type { ReactNode } from "react";

type NavItem = { to: string; label: string; icon: typeof Users; exact?: boolean };
const nav: NavItem[] = [
  { to: "/portal", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/portal/clientes", label: "Clientes", icon: Users },
  { to: "/portal/proveedores", label: "Proveedores", icon: Building },
  { to: "/portal/compras", label: "Compras", icon: ShoppingBag },
  { to: "/portal/entregas", label: "Entregas", icon: Truck },
  { to: "/portal/contratos", label: "Contratos", icon: FileSignature },
  { to: "/portal/chat-ia", label: "Chat IA", icon: MessageSquare },
  { to: "/portal/diagramas", label: "Diagramas IA", icon: Network },
];

export function PortalShell({ children, title }: { children: ReactNode; title: string }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/40">
        <Link to="/" className="flex items-center gap-2 px-5 h-16 border-b border-border">
          <img src={logo} alt="Bloque Tech" className="h-8 w-8" />
          <div>
            <p className="font-bold leading-tight">Bloque<span className="text-primary">Tech</span></p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Portal interno</p>
          </div>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to as never}
                className={`flex items-center gap-3 px-3 h-10 rounded-md text-sm font-medium transition ${active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={signOut} className="m-3 inline-flex items-center justify-center gap-2 h-10 rounded-md text-sm font-semibold border border-border hover:border-destructive hover:text-destructive transition">
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/40 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Lock className="h-4 w-4 text-primary" />
            <h1 className="font-bold text-lg">{title}</h1>
          </div>
          <button onClick={signOut} className="lg:hidden inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </header>
        {/* mobile bottom nav */}
        <nav className="lg:hidden flex overflow-x-auto gap-1 px-3 py-2 border-b border-border bg-card/40">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to as never} className={`shrink-0 inline-flex items-center gap-1.5 px-3 h-9 rounded-md text-xs font-semibold transition ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                <n.icon className="h-3.5 w-3.5" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}