import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const Input = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().min(1).max(200),
  tipo: z.string().max(100).optional().nullable(),
  contacto_nombre: z.string().max(200).optional().nullable(),
  contacto_email: z.string().email().optional().nullable().or(z.literal("")),
  contacto_telefono: z.string().max(50).optional().nullable(),
  notas: z.string().max(2000).optional().nullable(),
});

export const listProveedores = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("proveedores").select("*").order("nombre");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const saveProveedor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data, context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);
    const payload = { ...data, contacto_email: data.contacto_email || null };
    if (data.id) {
      const { id, ...rest } = payload;
      const { data: row, error } = await context.supabase
        .from("proveedores").update(rest).eq("id", id as string).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { id: _omit, ...insert } = payload;
    void _omit;
    const { data: row, error } = await context.supabase
      .from("proveedores").insert(insert).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteProveedor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);
    const { error } = await context.supabase.from("proveedores").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });