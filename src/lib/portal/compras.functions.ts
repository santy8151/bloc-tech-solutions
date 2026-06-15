import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const Input = z.object({
  id: z.string().uuid().optional(),
  proveedor_id: z.string().uuid().optional().nullable(),
  descripcion: z.string().min(1).max(500),
  monto: z.number().min(0).max(99999999999),
  fecha: z.string(),
  estado: z.enum(["pendiente", "pagada", "anulada"]),
  factura_url: z.string().url().optional().nullable().or(z.literal("")),
});

export const listCompras = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("compras").select("*, proveedores(nombre)").order("fecha", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const saveCompra = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data, context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);
    const payload = { ...data, factura_url: data.factura_url || null, proveedor_id: data.proveedor_id || null };
    if (data.id) {
      const { id, ...rest } = payload;
      const { data: row, error } = await context.supabase
        .from("compras").update(rest).eq("id", id as string).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { id: _omit, ...insert } = payload;
    void _omit;
    const { data: row, error } = await context.supabase
      .from("compras").insert(insert).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteCompra = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);
    const { error } = await context.supabase.from("compras").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });