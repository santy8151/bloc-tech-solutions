import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { CrudHeader, DataTable, Modal, Field, inputClass, textareaClass } from "@/components/portal/CrudTable";
import { listEntregas, saveEntrega, deleteEntrega } from "@/lib/portal/entregas.functions";
import { listClientes } from "@/lib/portal/clientes.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/portal/entregas" as never)({ component: Page });

type Row = { id: string; cliente_id: string | null; descripcion: string; direccion: string | null; fecha_programada: string | null; estado: string; tecnico: string | null; notas: string | null; clientes?: { nombre: string } | null };

function Page() {
  const list = useServerFn(listEntregas);
  const listCli = useServerFn(listClientes);
  const save = useServerFn(saveEntrega);
  const del = useServerFn(deleteEntrega);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["entregas"], queryFn: () => list() });
  const { data: clientes = [] } = useQuery({ queryKey: ["clientes"], queryFn: () => listCli() });
  const [editing, setEditing] = useState<Partial<Row> | null>(null);

  const mutSave = useMutation({
    mutationFn: (v: Partial<Row>) => save({ data: { ...v, estado: (v.estado as never) || "pendiente" } as never }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["entregas"] }); setEditing(null); toast.success("Guardada"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutDel = useMutation({ mutationFn: (id: string) => del({ data: { id } }), onSuccess: () => qc.invalidateQueries({ queryKey: ["entregas"] }), onError: (e: Error) => toast.error(e.message) });

  return (
    <PortalShell title="Entregas">
      <CrudHeader title="Entregas / Instalaciones" desc="Programación de visitas técnicas y entregas." onNew={() => setEditing({ estado: "pendiente" })} />
      <DataTable<Row>
        rows={data as Row[]}
        columns={[
          { key: "fecha", label: "Fecha", render: (r) => r.fecha_programada ?? "—" },
          { key: "cli", label: "Cliente", render: (r) => r.clientes?.nombre ?? "—" },
          { key: "desc", label: "Descripción", render: (r) => r.descripcion },
          { key: "tec", label: "Técnico", render: (r) => r.tecnico ?? "—" },
          { key: "est", label: "Estado", render: (r) => <span className="text-xs uppercase font-semibold px-2 py-1 rounded bg-primary/10 text-primary">{r.estado}</span> },
        ]}
        onEdit={(r) => setEditing(r)}
        onDelete={(r) => { if (confirm("¿Eliminar?")) mutDel.mutate(r.id); }}
      />
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Editar entrega" : "Nueva entrega"}>
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); mutSave.mutate(editing); }} className="space-y-3">
            <Field label="Cliente">
              <select className={inputClass} value={editing.cliente_id ?? ""} onChange={(e) => setEditing({ ...editing, cliente_id: e.target.value || null })}>
                <option value="">(sin asignar)</option>
                {(clientes as { id: string; nombre: string }[]).map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </Field>
            <Field label="Descripción *"><input required className={inputClass} value={editing.descripcion ?? ""} onChange={(e) => setEditing({ ...editing, descripcion: e.target.value })} /></Field>
            <Field label="Dirección"><input className={inputClass} value={editing.direccion ?? ""} onChange={(e) => setEditing({ ...editing, direccion: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Fecha programada"><input type="date" className={inputClass} value={editing.fecha_programada ?? ""} onChange={(e) => setEditing({ ...editing, fecha_programada: e.target.value })} /></Field>
              <Field label="Técnico"><input className={inputClass} value={editing.tecnico ?? ""} onChange={(e) => setEditing({ ...editing, tecnico: e.target.value })} /></Field>
            </div>
            <Field label="Estado">
              <select className={inputClass} value={editing.estado ?? "pendiente"} onChange={(e) => setEditing({ ...editing, estado: e.target.value })}>
                <option value="pendiente">Pendiente</option><option value="en_ruta">En ruta</option><option value="entregada">Entregada</option><option value="cancelada">Cancelada</option>
              </select>
            </Field>
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