// Helpers server-only para el portal: verifica que el usuario sea empleado.
import type { SupabaseClient } from "@supabase/supabase-js";

export async function ensureEmpleado(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "empleado",
  });
  if (error) throw new Error("No se pudo verificar el rol: " + error.message);
  if (!data) throw new Error("Forbidden: se requiere rol de empleado");
}