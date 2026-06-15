import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { PortalShell } from "@/components/PortalShell";
import { getDashboardStats } from "@/lib/portal/dashboard.functions";
import { Users, Truck, FileSignature, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/_authenticated/portal/" as never)({
  component: Dashboard,
});

function Dashboard() {
  const fn = useServerFn(getDashboardStats);
  const { data } = useQuery({ queryKey: ["dashboard"], queryFn: () => fn() });
  const cards = [
    { label: "Clientes", value: data?.clientes ?? "—", icon: Users },
    { label: "Entregas pendientes", value: data?.entregasPendientes ?? "—", icon: Truck },
    { label: "Contratos activos", value: data?.contratosActivos ?? "—", icon: FileSignature },
    { label: "Compras por pagar", value: data ? `$${data.comprasPendientesMonto.toLocaleString("es-CO")}` : "—", icon: ShoppingBag },
  ];
  return (
    <PortalShell title="Dashboard">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</span>
              <c.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-bold mb-2">Bienvenido al portal interno</h3>
        <p className="text-sm text-muted-foreground">Usa el menú lateral para gestionar clientes, proveedores, compras, entregas y contratos. El Chat IA y el generador de diagramas usan Lovable AI.</p>
      </div>
    </PortalShell>
  );
}