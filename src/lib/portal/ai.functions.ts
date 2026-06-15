// Adaptador para Lovable AI Gateway: chat conversacional + generación de diagramas.
// Aísla la dependencia externa (gateway) detrás de server functions con auth.
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export const listChatMensajes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("chat_mensajes").select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const sendChatMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ content: z.string().min(1).max(4000) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY no configurada");

    // Guarda mensaje del usuario
    await context.supabase.from("chat_mensajes").insert({
      user_id: context.userId,
      role: "user",
      content: data.content,
    });

    // Historial (últimos 20)
    const { data: history } = await context.supabase
      .from("chat_mensajes").select("role, content")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true })
      .limit(20);

    const messages = [
      {
        role: "system",
        content:
          "Eres el asistente interno de Bloque Tech, una empresa que conecta proveedores y técnicos de telecomunicaciones y ciberseguridad. Ayudas al empleado a redactar correos, comparar planes (Claro/Tigo/Movistar), calcular precios, dar consejos técnicos sobre cableado, redes, CCTV y software. Responde siempre en español, breve y útil.",
      },
      ...(history ?? []).map((m) => ({ role: m.role, content: m.content })),
    ];

    const res = await fetch(LOVABLE_AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (res.status === 429) throw new Error("Demasiadas solicitudes. Intenta en un momento.");
    if (res.status === 402) throw new Error("Créditos de IA agotados. Recarga en el espacio de trabajo.");
    if (!res.ok) throw new Error(`Error IA: ${res.status} ${await res.text()}`);

    const json = await res.json() as { choices?: { message?: { content?: string } }[] };
    const reply = json.choices?.[0]?.message?.content ?? "(sin respuesta)";

    await context.supabase.from("chat_mensajes").insert({
      user_id: context.userId,
      role: "assistant",
      content: reply,
    });

    return { reply };
  });

export const clearChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("chat_mensajes").delete().eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listDiagramas = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("diagramas").select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const generateDiagram = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ prompt: z.string().min(5).max(1000) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY no configurada");

    const fullPrompt = `Diagrama técnico profesional, estilo blueprint isométrico claro, líneas limpias, etiquetas en español, fondo blanco con grilla suave. Diagrama de cableado de red/instalación: ${data.prompt}. Muestra dispositivos (router, switch, AP, cámaras, PCs), conexiones rotuladas (Cat6, fibra, PoE), distancias aproximadas. Sin texto borroso.`;

    const res = await fetch(LOVABLE_AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: fullPrompt }],
        modalities: ["image", "text"],
      }),
    });

    if (res.status === 429) throw new Error("Demasiadas solicitudes. Intenta en un momento.");
    if (res.status === 402) throw new Error("Créditos de IA agotados. Recarga en el espacio de trabajo.");
    if (!res.ok) throw new Error(`Error IA: ${res.status} ${await res.text()}`);

    const json = await res.json() as {
      choices?: { message?: { images?: { image_url?: { url?: string } }[] } }[];
    };
    const imageUrl = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!imageUrl) throw new Error("La IA no devolvió una imagen.");

    await context.supabase.from("diagramas").insert({
      user_id: context.userId,
      prompt: data.prompt,
      image_url: imageUrl,
    });

    return { image_url: imageUrl };
  });

export const deleteDiagrama = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { ensureEmpleado } = await import("./auth-helpers.server");
    await ensureEmpleado(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("diagramas").delete().eq("id", data.id).eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });