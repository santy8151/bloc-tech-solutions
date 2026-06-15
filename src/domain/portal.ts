// Núcleo de dominio — sin dependencias externas.
// Entidades y puertos (interfaces) para el portal interno.

export interface Cliente {
  id: string;
  nombre: string;
  nit: string | null;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  ciudad: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  tipo: string | null;
  contacto_nombre: string | null;
  contacto_email: string | null;
  contacto_telefono: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface Compra {
  id: string;
  proveedor_id: string | null;
  descripcion: string;
  monto: number;
  fecha: string;
  estado: string;
  factura_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Entrega {
  id: string;
  cliente_id: string | null;
  descripcion: string;
  direccion: string | null;
  fecha_programada: string | null;
  estado: string;
  tecnico: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contrato {
  id: string;
  cliente_id: string | null;
  operador: string;
  plan: string | null;
  fecha_inicio: string | null;
  fecha_vencimiento: string | null;
  estado: string;
  monto_mensual: number | null;
  url_portal: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMensaje {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface Diagrama {
  id: string;
  prompt: string;
  image_url: string;
  created_at: string;
}

// Puertos (los adaptadores en infrastructure/ los implementan)
export interface Repository<T, TCreate, TUpdate> {
  list(): Promise<T[]>;
  create(data: TCreate): Promise<T>;
  update(id: string, data: TUpdate): Promise<T>;
  remove(id: string): Promise<void>;
}