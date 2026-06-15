import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);
    const sb = context.supabase;
    const [clientes, entregas, contratos, compras] = await Promise.all([
      sb.from("clientes").select("*", { count: "exact", head: true }),
      sb.from("entregas").select("*", { count: "exact", head: true }).neq("estado", "entregada"),
      sb.from("contratos").select("*", { count: "exact", head: true }).in("estado", ["activo", "por_vencer"]),
      sb.from("compras").select("monto").eq("estado", "pendiente"),
    ]);
    const compraPendiente = (compras.data ?? []).reduce((s, r) => s + Number(r.monto ?? 0), 0);
    return {
      clientes: clientes.count ?? 0,
      entregasPendientes: entregas.count ?? 0,
      contratosActivos: contratos.count ?? 0,
      comprasPendientesMonto: compraPendiente,
    };
  });