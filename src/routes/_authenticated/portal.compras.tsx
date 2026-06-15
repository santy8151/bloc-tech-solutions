import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { CrudHeader, DataTable, Modal, Field, inputClass } from "@/components/portal/CrudTable";
import { listCompras, saveCompra, deleteCompra } from "@/lib/portal/compras.functions";
import { listProveedores } from "@/lib/portal/proveedores.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/portal/compras" as never)({ component: Page });

type Row = { id: string; proveedor_id: string | null; descripcion: string; monto: number; fecha: string; estado: string; factura_url: string | null; proveedores?: { nombre: string } | null };

function Page() {
  const list = useServerFn(listCompras);
  const listProv = useServerFn(listProveedores);
  const save = useServerFn(saveCompra);
  const del = useServerFn(deleteCompra);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["compras"], queryFn: () => list() });
  const { data: provs = [] } = useQuery({ queryKey: ["proveedores"], queryFn: () => listProv() });
  const [editing, setEditing] = useState<Partial<Row> | null>(null);

  const mutSave = useMutation({
    mutationFn: (v: Partial<Row>) => save({ data: { ...v, monto: Number(v.monto ?? 0), estado: (v.estado as never) || "pendiente", fecha: v.fecha || new Date().toISOString().slice(0, 10) } as never }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["compras"] }); setEditing(null); toast.success("Guardada"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const mutDel = useMutation({ mutationFn: (id: string) => del({ data: { id } }), onSuccess: () => { qc.invalidateQueries({ queryKey: ["compras"] }); }, onError: (e: Error) => toast.error(e.message) });

  return (
    <PortalShell title="Compras">
      <CrudHeader title="Compras" desc="Órdenes a proveedores y estado de pago." onNew={() => setEditing({ estado: "pendiente", fecha: new Date().toISOString().slice(0, 10) })} />
      <DataTable<Row>
        rows={data as Row[]}
        columns={[
          { key: "fecha", label: "Fecha", render: (r) => r.fecha },
          { key: "prov", label: "Proveedor", render: (r) => r.proveedores?.nombre ?? "—" },
          { key: "desc", label: "Descripción", render: (r) => r.descripcion },
          { key: "monto", label: "Monto", render: (r) => `$${Number(r.monto).toLocaleString("es-CO")}` },
          { key: "estado", label: "Estado", render: (r) => <span className="text-xs uppercase font-semibold px-2 py-1 rounded bg-primary/10 text-primary">{r.estado}</span> },
        ]}
        onEdit={(r) => setEditing(r)}
        onDelete={(r) => { if (confirm("¿Eliminar compra?")) mutDel.mutate(r.id); }}
      />
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Editar compra" : "Nueva compra"}>
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); mutSave.mutate(editing); }} className="space-y-3">
            <Field label="Proveedor">
              <select className={inputClass} value={editing.proveedor_id ?? ""} onChange={(e) => setEditing({ ...editing, proveedor_id: e.target.value || null })}>
                <option value="">(sin asignar)</option>
                {(provs as { id: string; nombre: string }[]).map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </Field>
            <Field label="Descripción *"><input required className={inputClass} value={editing.descripcion ?? ""} onChange={(e) => setEditing({ ...editing, descripcion: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Monto (COP)"><input type="number" min={0} className={inputClass} value={editing.monto ?? 0} onChange={(e) => setEditing({ ...editing, monto: Number(e.target.value) })} /></Field>
              <Field label="Fecha"><input type="date" className={inputClass} value={editing.fecha ?? ""} onChange={(e) => setEditing({ ...editing, fecha: e.target.value })} /></Field>
            </div>
            <Field label="Estado">
              <select className={inputClass} value={editing.estado ?? "pendiente"} onChange={(e) => setEditing({ ...editing, estado: e.target.value })}>
                <option value="pendiente">Pendiente</option><option value="pagada">Pagada</option><option value="anulada">Anulada</option>
              </select>
            </Field>
            <Field label="URL Factura"><input className={inputClass} value={editing.factura_url ?? ""} onChange={(e) => setEditing({ ...editing, factura_url: e.target.value })} /></Field>
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