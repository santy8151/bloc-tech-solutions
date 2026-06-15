import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { CrudHeader, DataTable, Modal, Field, inputClass, textareaClass } from "@/components/portal/CrudTable";
import { listProveedores, saveProveedor, deleteProveedor } from "@/lib/portal/proveedores.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/portal/proveedores" as never)({ component: Page });

type Row = { id: string; nombre: string; tipo: string | null; contacto_nombre: string | null; contacto_email: string | null; contacto_telefono: string | null; notas: string | null };

function Page() {
  const list = useServerFn(listProveedores);
  const save = useServerFn(saveProveedor);
  const del = useServerFn(deleteProveedor);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["proveedores"], queryFn: () => list() });
  const [editing, setEditing] = useState<Partial<Row> | null>(null);

  const mutSave = useMutation({
    mutationFn: (v: Partial<Row>) => save({ data: v as never }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["proveedores"] }); setEditing(null); toast.success("Proveedor guardado"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutDel = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["proveedores"] }); toast.success("Eliminado"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <PortalShell title="Proveedores">
      <CrudHeader title="Proveedores" desc="Operadores, mayoristas y aliados técnicos." onNew={() => setEditing({})} />
      <DataTable<Row>
        rows={data as Row[]}
        columns={[
          { key: "nombre", label: "Proveedor", render: (r) => <span className="font-medium">{r.nombre}</span> },
          { key: "tipo", label: "Tipo", render: (r) => r.tipo ?? "—" },
          { key: "contacto", label: "Contacto", render: (r) => r.contacto_nombre ?? "—" },
          { key: "email", label: "Email", render: (r) => r.contacto_email ?? "—" },
          { key: "tel", label: "Teléfono", render: (r) => r.contacto_telefono ?? "—" },
        ]}
        onEdit={(r) => setEditing(r)}
        onDelete={(r) => { if (confirm("¿Eliminar " + r.nombre + "?")) mutDel.mutate(r.id); }}
      />
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Editar proveedor" : "Nuevo proveedor"}>
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); mutSave.mutate(editing); }} className="space-y-3">
            <Field label="Nombre *"><input required className={inputClass} value={editing.nombre ?? ""} onChange={(e) => setEditing({ ...editing, nombre: e.target.value })} /></Field>
            <Field label="Tipo (ISP, Mayorista, Software...)"><input className={inputClass} value={editing.tipo ?? ""} onChange={(e) => setEditing({ ...editing, tipo: e.target.value })} /></Field>
            <Field label="Contacto"><input className={inputClass} value={editing.contacto_nombre ?? ""} onChange={(e) => setEditing({ ...editing, contacto_nombre: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email"><input type="email" className={inputClass} value={editing.contacto_email ?? ""} onChange={(e) => setEditing({ ...editing, contacto_email: e.target.value })} /></Field>
              <Field label="Teléfono"><input className={inputClass} value={editing.contacto_telefono ?? ""} onChange={(e) => setEditing({ ...editing, contacto_telefono: e.target.value })} /></Field>
            </div>
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