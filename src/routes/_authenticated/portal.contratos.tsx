import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { CrudHeader, DataTable, Modal, Field, inputClass, textareaClass } from "@/components/portal/CrudTable";
import { listContratos, saveContrato, deleteContrato } from "@/lib/portal/contratos.functions";
import { listClientes } from "@/lib/portal/clientes.functions";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/portal/contratos" as never)({ component: Page });

const PORTALES: Record<string, string> = {
  Claro: "https://www.claro.com.co/negocios/atencion-cliente/",
  Tigo: "https://www.tigo.com.co/atencion-al-cliente",
  Movistar: "https://www.movistar.co/atencion-al-cliente",
  ETB: "https://www.etb.com/clientes/",
  WOM: "https://www.wom.co/atencion-al-cliente",
};

type Row = { id: string; cliente_id: string | null; operador: string; plan: string | null; fecha_inicio: string | null; fecha_vencimiento: string | null; estado: string; monto_mensual: number | null; url_portal: string | null; notas: string | null; clientes?: { nombre: string } | null };

function Page() {
  const list = useServerFn(listContratos);
  const listCli = useServerFn(listClientes);
  const save = useServerFn(saveContrato);
  const del = useServerFn(deleteContrato);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["contratos"], queryFn: () => list() });
  const { data: clientes = [] } = useQuery({ queryKey: ["clientes"], queryFn: () => listCli() });
  const [editing, setEditing] = useState<Partial<Row> | null>(null);

  const mutSave = useMutation({
    mutationFn: (v: Partial<Row>) => save({ data: { ...v, monto_mensual: v.monto_mensual ? Number(v.monto_mensual) : null, estado: (v.estado as never) || "activo" } as never }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["contratos"] }); setEditing(null); toast.success("Guardado"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutDel = useMutation({ mutationFn: (id: string) => del({ data: { id } }), onSuccess: () => qc.invalidateQueries({ queryKey: ["contratos"] }), onError: (e: Error) => toast.error(e.message) });

  return (
    <PortalShell title="Contratos">
      <CrudHeader title="Contratos" desc="Seguimiento de planes y vencimientos. Accesos rápidos a portales de operadores." onNew={() => setEditing({ estado: "activo", operador: "Claro" })} />

      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(PORTALES).map(([name, url]) => (
          <a key={name} href={url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-border text-sm hover:border-primary hover:text-primary transition">
            <ExternalLink className="h-3.5 w-3.5" /> Portal {name}
          </a>
        ))}
      </div>

      <DataTable<Row>
        rows={data as Row[]}
        columns={[
          { key: "op", label: "Operador", render: (r) => <span className="font-semibold">{r.operador}</span> },
          { key: "cli", label: "Cliente", render: (r) => r.clientes?.nombre ?? "—" },
          { key: "plan", label: "Plan", render: (r) => r.plan ?? "—" },
          { key: "venc", label: "Vencimiento", render: (r) => r.fecha_vencimiento ?? "—" },
          { key: "monto", label: "$ Mensual", render: (r) => r.monto_mensual ? `$${Number(r.monto_mensual).toLocaleString("es-CO")}` : "—" },
          { key: "est", label: "Estado", render: (r) => <span className="text-xs uppercase font-semibold px-2 py-1 rounded bg-primary/10 text-primary">{r.estado}</span> },
        ]}
        onEdit={(r) => setEditing(r)}
        onDelete={(r) => { if (confirm("¿Eliminar?")) mutDel.mutate(r.id); }}
      />

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Editar contrato" : "Nuevo contrato"}>
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); mutSave.mutate(editing); }} className="space-y-3">
            <Field label="Cliente">
              <select className={inputClass} value={editing.cliente_id ?? ""} onChange={(e) => setEditing({ ...editing, cliente_id: e.target.value || null })}>
                <option value="">(sin asignar)</option>
                {(clientes as { id: string; nombre: string }[]).map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Operador *">
                <select className={inputClass} value={editing.operador ?? "Claro"} onChange={(e) => setEditing({ ...editing, operador: e.target.value })}>
                  {Object.keys(PORTALES).map((p) => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Plan"><input className={inputClass} value={editing.plan ?? ""} onChange={(e) => setEditing({ ...editing, plan: e.target.value })} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Fecha inicio"><input type="date" className={inputClass} value={editing.fecha_inicio ?? ""} onChange={(e) => setEditing({ ...editing, fecha_inicio: e.target.value })} /></Field>
              <Field label="Vencimiento"><input type="date" className={inputClass} value={editing.fecha_vencimiento ?? ""} onChange={(e) => setEditing({ ...editing, fecha_vencimiento: e.target.value })} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="$ Mensual"><input type="number" min={0} className={inputClass} value={editing.monto_mensual ?? 0} onChange={(e) => setEditing({ ...editing, monto_mensual: Number(e.target.value) })} /></Field>
              <Field label="Estado">
                <select className={inputClass} value={editing.estado ?? "activo"} onChange={(e) => setEditing({ ...editing, estado: e.target.value })}>
                  <option value="activo">Activo</option><option value="por_vencer">Por vencer</option><option value="vencido">Vencido</option><option value="cancelado">Cancelado</option>
                </select>
              </Field>
            </div>
            <Field label="URL portal (opcional)"><input className={inputClass} value={editing.url_portal ?? ""} onChange={(e) => setEditing({ ...editing, url_portal: e.target.value })} /></Field>
            <Field label="Notas"><textarea className={textareaClass} value={editing.notas ?? ""} onChange={(e) => setEditing({ ...editing, notas: e.target.value })} /></Field>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setEditing(null)} className="h-10 px-4 rounded-md border border-border text-sm">Cancelar</button>
              <button type="submit" disabled={mutSave.isPending} className="h-10 px-4 rounded-md font-semibold text-primary-foreground" style={{ background: "var(--gradient-accent)" }}>Guardar</button>
            </div>
          </form>
        )}
      </Modal>
    </PortalShell>
  );
}