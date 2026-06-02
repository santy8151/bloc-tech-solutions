import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card mt-24">
      <div className="container mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-3">Bloque<span className="text-primary">Tech</span></h3>
          <p className="text-sm text-muted-foreground">Soluciones tecnológicas que conectan, protegen y potencian tu negocio.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Navegación</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Inicio</Link></li>
            <li><Link to="/tienda" className="hover:text-primary">Tienda</Link></li>
            <li><a href="/#servicios" className="hover:text-primary">Servicios</a></li>
            <li><a href="/#contacto" className="hover:text-primary">Contacto</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Servicios</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Conectividad empresarial</li>
            <li>Seguridad electrónica</li>
            <li>Telefonía IP</li>
            <li>Soporte TI</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Contacto</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +57 300 000 0000</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> hola@bloquetech.co</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Medellín, Colombia</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Bloque Tech. Todos los derechos reservados.
      </div>
    </footer>
  );
}