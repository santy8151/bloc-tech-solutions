import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { listDiagramas, generateDiagram, deleteDiagrama } from "@/lib/portal/ai.functions";
import { Wand2, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/portal/diagramas" as never)({ component: Page });

function Page() {
  const list = useServerFn(listDiagramas);
  const gen = useServerFn(generateDiagram);
  const del = useServerFn(deleteDiagrama);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["diagramas"], queryFn: () => list() });
  const [prompt, setPrompt] = useState("");

  const mut = useMutation({
    mutationFn: (p: string) => gen({ data: { prompt: p } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["diagramas"] }); setPrompt(""); toast.success("Diagrama generado"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutDel = useMutation({ mutationFn: (id: string) => del({ data: { id } }), onSuccess: () => qc.invalidateQueries({ queryKey: ["diagramas"] }) });

  return (
    <PortalShell title="Diagramas IA">
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <h2 className="font-bold text-lg mb-1 flex items-center gap-2"><Wand2 className="h-5 w-5 text-primary" /> Generador de diagramas de cableado</h2>
        <p className="text-sm text-muted-foreground mb-4">Describe la instalación y la IA crea un diagrama técnico. Ej: "Oficina 200m² con 12 puntos de red, 4 cámaras IP, 1 servidor y WiFi 6 dual band".</p>
        <form onSubmit={(e) => { e.preventDefault(); if (prompt.trim()) mut.mutate(prompt.trim()); }} className="space-y-3">
          <textarea required value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} placeholder="Describe la instalación..."
            className="w-full px-4 py-3 rounded-md bg-input border border-border focus:border-primary focus:outline-none text-sm" />
          <button type="submit" disabled={mut.isPending || prompt.trim().length < 5} className="inline-flex items-center gap-2 h-11 px-5 rounded-md font-semibold text-primary-foreground disabled:opacity-50" style={{ background: "var(--gradient-accent)" }}>
            <Wand2 className="h-4 w-4" /> {mut.isPending ? "Generando..." : "Generar diagrama"}
          </button>
        </form>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data as { id: string; prompt: string; image_url: string; created_at: string }[]).map((d) => (
          <div key={d.id} className="rounded-xl border border-border bg-card overflow-hidden">
            <img src={d.image_url} alt={d.prompt} className="w-full aspect-square object-contain bg-white" />
            <div className="p-3">
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{d.prompt}</p>
              <div className="flex gap-1">
                <a href={d.image_url} download className="flex-1 inline-flex items-center justify-center gap-1 h-8 rounded text-xs font-semibold border border-border hover:border-primary"><Download className="h-3 w-3" /> Descargar</a>
                <button onClick={() => { if (confirm("¿Borrar?")) mutDel.mutate(d.id); }} className="h-8 w-8 inline-flex items-center justify-center rounded text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PortalShell>
  );
}