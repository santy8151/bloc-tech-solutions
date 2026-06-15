import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const Input = z.object({
  id: z.string().uuid().optional(),
  cliente_id: z.string().uuid().optional().nullable(),
  operador: z.string().min(1).max(100),
  plan: z.string().max(200).optional().nullable(),
  fecha_inicio: z.string().optional().nullable(),
  fecha_vencimiento: z.string().optional().nullable(),
  estado: z.enum(["activo", "por_vencer", "vencido", "cancelado"]),
  monto_mensual: z.number().min(0).optional().nullable(),
  url_portal: z.string().url().optional().nullable().or(z.literal("")),
  notas: z.string().max(2000).optional().nullable(),
});

export const listContratos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("contratos").select("*, clientes(nombre)").order("fecha_vencimiento", { ascending: true, nullsFirst: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const saveContrato = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data, context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);
    const payload = {
      ...data,
      cliente_id: data.cliente_id || null,
      fecha_inicio: data.fecha_inicio || null,
      fecha_vencimiento: data.fecha_vencimiento || null,
      url_portal: data.url_portal || null,
    };
    if (data.id) {
      const { id, ...rest } = payload;
      const { data: row, error } = await context.supabase
        .from("contratos").update(rest).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { id: _omit, ...insert } = payload;
    void _omit;
    const { data: row, error } = await context.supabase
      .from("contratos").insert(insert).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteContrato = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);
    const { error } = await context.supabase.from("contratos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });