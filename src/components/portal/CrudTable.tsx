import { Pencil, Trash2, Plus } from "lucide-react";
import type { ReactNode } from "react";

export function CrudHeader({ title, desc, onNew }: { title: string; desc?: string; onNew: () => void }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {desc && <p className="text-sm text-muted-foreground mt-1">{desc}</p>}
      </div>
      <button onClick={onNew} className="inline-flex items-center gap-2 h-10 px-4 rounded-md font-semibold text-primary-foreground hover:opacity-90 transition" style={{ background: "var(--gradient-accent)" }}>
        <Plus className="h-4 w-4" /> Nuevo
      </button>
    </div>
  );
}

export function DataTable<T extends { id: string }>({
  rows, columns, onEdit, onDelete, empty,
}: {
  rows: T[];
  columns: { key: string; label: string; render: (row: T) => ReactNode }[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  empty?: string;
}) {
  if (rows.length === 0) {
    return <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">{empty ?? "Sin registros. Crea el primero con el botón Nuevo."}</div>;
  }
  return (
    <div className="rounded-xl border border-border bg-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-secondary/50">
          <tr>
            {columns.map((c) => (<th key={c.key} className="text-left font-semibold px-4 py-3 whitespace-nowrap">{c.label}</th>))}
            <th className="px-4 py-3 w-1" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border hover:bg-secondary/30">
              {columns.map((c) => (<td key={c.key} className="px-4 py-3 align-top">{c.render(r)}</td>))}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex gap-1">
                  <button onClick={() => onEdit(r)} className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-secondary" title="Editar"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => onDelete(r)} className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-destructive/10 text-destructive" title="Eliminar"><Trash2 className="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-card border border-border rounded-xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export const inputClass = "w-full h-10 px-3 rounded-md bg-input border border-border focus:border-primary focus:outline-none text-sm";
export const textareaClass = "w-full min-h-[80px] px-3 py-2 rounded-md bg-input border border-border focus:border-primary focus:outline-none text-sm";