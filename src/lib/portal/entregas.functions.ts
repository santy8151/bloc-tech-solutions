import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const Input = z.object({
  id: z.string().uuid().optional(),
  cliente_id: z.string().uuid().optional().nullable(),
  descripcion: z.string().min(1).max(500),
  direccion: z.string().max(300).optional().nullable(),
  fecha_programada: z.string().optional().nullable(),
  estado: z.enum(["pendiente", "en_ruta", "entregada", "cancelada"]),
  tecnico: z.string().max(200).optional().nullable(),
  notas: z.string().max(2000).optional().nullable(),
});

export const listEntregas = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("entregas").select("*, clientes(nombre)").order("fecha_programada", { ascending: true, nullsFirst: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const saveEntrega = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data, context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);
    const payload = { ...data, cliente_id: data.cliente_id || null, fecha_programada: data.fecha_programada || null };
    if (data.id) {
      const { id, ...rest } = payload;
      const { data: row, error } = await context.supabase
        .from("entregas").update(rest).eq("id", id as string).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { id: _omit, ...insert } = payload;
    void _omit;
    const { data: row, error } = await context.supabase
      .from("entregas").insert(insert).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteEntrega = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);
    const { error } = await context.supabase.from("entregas").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });