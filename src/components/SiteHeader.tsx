import { Link } from "@tanstack/react-router";
import { ShoppingCart, Menu } from "lucide-react";
import logo from "@/assets/logo.png";
import { useCart } from "@/lib/cart";
import { useState } from "react";

export function SiteHeader() {
  const { items } = useCart();
  const count = items.reduce((n, i) => n + i.qty, 0);
  const [open, setOpen] = useState(false);

  const nav = (
    <>
      <Link to="/" className="hover:text-primary transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Inicio</Link>
      <a href="/#servicios" className="hover:text-primary transition-colors">Servicios</a>
      <a href="/#asesor" className="hover:text-primary transition-colors">Asesor</a>
      <Link to="/tienda" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Tienda</Link>
      <a href="/#contacto" className="hover:text-primary transition-colors">Contacto</a>
    </>
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Bloque Tech" className="h-9 w-9" />
          <span className="font-bold tracking-tight text-lg">
            Bloque<span className="text-primary">Tech</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {nav}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/tienda" className="relative inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-secondary transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button onClick={() => setOpen(!open)} className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-secondary">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 px-6 py-4 flex flex-col gap-4 text-sm font-medium" onClick={() => setOpen(false)}>
          {nav}
        </div>
      )}
    </header>
  );
}