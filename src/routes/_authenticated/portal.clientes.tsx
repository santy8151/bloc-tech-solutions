import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { CrudHeader, DataTable, Modal, Field, inputClass, textareaClass } from "@/components/portal/CrudTable";
import { listClientes, saveCliente, deleteCliente } from "@/lib/portal/clientes.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/portal/clientes" as never)({ component: Page });

type Row = { id: string; nombre: string; nit: string | null; email: string | null; telefono: string | null; ciudad: string | null; direccion: string | null; notas: string | null };

function Page() {
  const list = useServerFn(listClientes);
  const save = useServerFn(saveCliente);
  const del = useServerFn(deleteCliente);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["clientes"], queryFn: () => list() });
  const [editing, setEditing] = useState<Partial<Row> | null>(null);

  const mutSave = useMutation({
    mutationFn: (v: Partial<Row>) => save({ data: v as never }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["clientes"] }); setEditing(null); toast.success("Cliente guardado"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutDel = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["clientes"] }); toast.success("Cliente eliminado"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <PortalShell title="Clientes">
      <CrudHeader title="Clientes" desc="Empresas y personas que atendemos." onNew={() => setEditing({})} />
      <DataTable<Row>
        rows={data as Row[]}
        columns={[
          { key: "nombre", label: "Nombre", render: (r) => <span className="font-medium">{r.nombre}</span> },
          { key: "nit", label: "NIT/Doc", render: (r) => r.nit ?? "—" },
          { key: "email", label: "Email", render: (r) => r.email ?? "—" },
          { key: "telefono", label: "Teléfono", render: (r) => r.telefono ?? "—" },
          { key: "ciudad", label: "Ciudad", render: (r) => r.ciudad ?? "—" },
        ]}
        onEdit={(r) => setEditing(r)}
        onDelete={(r) => { if (confirm("¿Eliminar " + r.nombre + "?")) mutDel.mutate(r.id); }}
      />
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Editar cliente" : "Nuevo cliente"}>
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); mutSave.mutate(editing); }} className="space-y-3">
            <Field label="Nombre *"><input required className={inputClass} value={editing.nombre ?? ""} onChange={(e) => setEditing({ ...editing, nombre: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="NIT / Documento"><input className={inputClass} value={editing.nit ?? ""} onChange={(e) => setEditing({ ...editing, nit: e.target.value })} /></Field>
              <Field label="Ciudad"><input className={inputClass} value={editing.ciudad ?? ""} onChange={(e) => setEditing({ ...editing, ciudad: e.target.value })} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email"><input type="email" className={inputClass} value={editing.email ?? ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></Field>
              <Field label="Teléfono"><input className={inputClass} value={editing.telefono ?? ""} onChange={(e) => setEditing({ ...editing, telefono: e.target.value })} /></Field>
            </div>
            <Field label="Dirección"><input className={inputClass} value={editing.direccion ?? ""} onChange={(e) => setEditing({ ...editing, direccion: e.target.value })} /></Field>
            <Field label="Notas"><textarea className={textareaClass} value={editing.notas ?? ""} onChange={(e) => setEditing({ ...editing, notas: e.target.value })} /></Field>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setEditing(null)} className="h-10 px-4 rounded-md border border-border text-sm">Cancelar</button>
              <button type="submit" disabled={mutSave.isPending} className="h-10 px-4 rounded-md font-semibold text-primary-foreground" style={{ background: "var(--gradient-accent)" }}>{mutSave.isPending ? "Guardando..." : "Guardar"}</button>
            </div>
          </form>
        )}
      </Modal>
    </PortalShell>
  );
}