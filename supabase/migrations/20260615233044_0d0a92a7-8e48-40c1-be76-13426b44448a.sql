
-- Roles enum + tabla separada (patrón seguro)
CREATE TYPE public.app_role AS ENUM ('empleado', 'admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Trigger: primer usuario registrado se vuelve admin+empleado, demás solo empleado
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'empleado');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'empleado');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Trigger reutilizable updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- CLIENTES
CREATE TABLE public.clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  nit text,
  email text,
  telefono text,
  direccion text,
  ciudad text,
  notas text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clientes TO authenticated;
GRANT ALL ON public.clientes TO service_role;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "empleados gestionan clientes" ON public.clientes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'empleado'))
  WITH CHECK (public.has_role(auth.uid(), 'empleado'));
CREATE TRIGGER trg_clientes_updated BEFORE UPDATE ON public.clientes
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- PROVEEDORES
CREATE TABLE public.proveedores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  tipo text,
  contacto_nombre text,
  contacto_email text,
  contacto_telefono text,
  notas text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proveedores TO authenticated;
GRANT ALL ON public.proveedores TO service_role;
ALTER TABLE public.proveedores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "empleados gestionan proveedores" ON public.proveedores
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'empleado'))
  WITH CHECK (public.has_role(auth.uid(), 'empleado'));
CREATE TRIGGER trg_prov_updated BEFORE UPDATE ON public.proveedores
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- COMPRAS
CREATE TABLE public.compras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proveedor_id uuid REFERENCES public.proveedores(id) ON DELETE SET NULL,
  descripcion text NOT NULL,
  monto numeric(12,2) NOT NULL DEFAULT 0,
  fecha date NOT NULL DEFAULT CURRENT_DATE,
  estado text NOT NULL DEFAULT 'pendiente',
  factura_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.compras TO authenticated;
GRANT ALL ON public.compras TO service_role;
ALTER TABLE public.compras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "empleados gestionan compras" ON public.compras
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'empleado'))
  WITH CHECK (public.has_role(auth.uid(), 'empleado'));
CREATE TRIGGER trg_compras_updated BEFORE UPDATE ON public.compras
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ENTREGAS
CREATE TABLE public.entregas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES public.clientes(id) ON DELETE SET NULL,
  descripcion text NOT NULL,
  direccion text,
  fecha_programada date,
  estado text NOT NULL DEFAULT 'pendiente',
  tecnico text,
  notas text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.entregas TO authenticated;
GRANT ALL ON public.entregas TO service_role;
ALTER TABLE public.entregas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "empleados gestionan entregas" ON public.entregas
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'empleado'))
  WITH CHECK (public.has_role(auth.uid(), 'empleado'));
CREATE TRIGGER trg_entregas_updated BEFORE UPDATE ON public.entregas
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- CONTRATOS
CREATE TABLE public.contratos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES public.clientes(id) ON DELETE SET NULL,
  operador text NOT NULL,
  plan text,
  fecha_inicio date,
  fecha_vencimiento date,
  estado text NOT NULL DEFAULT 'activo',
  monto_mensual numeric(12,2),
  url_portal text,
  notas text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contratos TO authenticated;
GRANT ALL ON public.contratos TO service_role;
ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "empleados gestionan contratos" ON public.contratos
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'empleado'))
  WITH CHECK (public.has_role(auth.uid(), 'empleado'));
CREATE TRIGGER trg_contratos_updated BEFORE UPDATE ON public.contratos
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- CHAT IA
CREATE TABLE public.chat_mensajes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.chat_mensajes TO authenticated;
GRANT ALL ON public.chat_mensajes TO service_role;
ALTER TABLE public.chat_mensajes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user gestiona sus mensajes" ON public.chat_mensajes
  FOR ALL TO authenticated
  USING (auth.uid() = user_id AND public.has_role(auth.uid(), 'empleado'))
  WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'empleado'));

-- DIAGRAMAS
CREATE TABLE public.diagramas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.diagramas TO authenticated;
GRANT ALL ON public.diagramas TO service_role;
ALTER TABLE public.diagramas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user gestiona sus diagramas" ON public.diagramas
  FOR ALL TO authenticated
  USING (auth.uid() = user_id AND public.has_role(auth.uid(), 'empleado'))
  WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'empleado'));
