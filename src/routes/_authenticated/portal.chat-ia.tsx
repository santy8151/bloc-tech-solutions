import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { PortalShell } from "@/components/PortalShell";
import { listChatMensajes, sendChatMessage, clearChat } from "@/lib/portal/ai.functions";
import { Send, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/portal/chat-ia" as never)({ component: Page });

function Page() {
  const list = useServerFn(listChatMensajes);
  const send = useServerFn(sendChatMessage);
  const clr = useServerFn(clearChat);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["chat"], queryFn: () => list() });
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [data]);

  const mut = useMutation({
    mutationFn: (content: string) => send({ data: { content } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["chat"] }); setInput(""); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutClr = useMutation({
    mutationFn: () => clr(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chat"] }),
  });

  return (
    <PortalShell title="Chat IA">
      <div className="rounded-xl border border-border bg-card h-[calc(100vh-220px)] flex flex-col">
        <div className="px-5 h-14 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold"><Sparkles className="h-4 w-4 text-primary" /> Asistente Bloque Tech</div>
          <button onClick={() => { if (confirm("¿Borrar historial?")) mutClr.mutate(); }} className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1"><Trash2 className="h-3.5 w-3.5" /> Limpiar</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {(data as { id: string; role: string; content: string }[]).length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-12">Empieza la conversación. Pregunta sobre planes, redacta correos, compara proveedores.</div>
          )}
          {(data as { id: string; role: string; content: string }[]).map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{m.content}</div>
            </div>
          ))}
          {mut.isPending && <div className="text-xs text-muted-foreground">Pensando...</div>}
          <div ref={endRef} />
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) mut.mutate(input.trim()); }} className="border-t border-border p-3 flex gap-2">
          <input autoFocus value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe tu mensaje..."
            className="flex-1 h-11 px-4 rounded-md bg-input border border-border focus:border-primary focus:outline-none text-sm" />
          <button type="submit" disabled={mut.isPending || !input.trim()} className="h-11 px-5 rounded-md font-semibold text-primary-foreground disabled:opacity-50" style={{ background: "var(--gradient-accent)" }}>
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </PortalShell>
  );
}