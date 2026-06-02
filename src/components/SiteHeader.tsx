import { Link } from "@tanstack/react-router";
import { ShoppingCart, Menu, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import { solutions } from "@/lib/solutions";

export function SiteHeader() {
  const { items } = useCart();
  const count = items.reduce((n, i) => n + i.qty, 0);
  const [open, setOpen] = useState(false);
  const [solOpen, setSolOpen] = useState(false);

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
          <Link to="/" className="hover:text-primary transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Inicio</Link>
          <div
            className="relative"
            onMouseEnter={() => setSolOpen(true)}
            onMouseLeave={() => setSolOpen(false)}
          >
            <Link to="/soluciones" className="inline-flex items-center gap-1 hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>
              Soluciones <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            {solOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[640px]">
                <div className="grid grid-cols-2 gap-1 p-3 rounded-xl bg-popover border border-border shadow-2xl">
                  {solutions.map((s) => (
                    <Link
                      key={s.slug}
                      to="/soluciones/$slug"
                      params={{ slug: s.slug }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary flex-shrink-0">
                        <s.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm">{s.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{s.short}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <a href="/#suscripciones" className="hover:text-primary transition-colors">Suscripciones</a>
          <Link to="/tienda" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Tienda</Link>
          <a href="/#contacto" className="hover:text-primary transition-colors">Contacto</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/checkout" className="relative inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-secondary transition-colors" title="Ir a pagar">
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
        <div className="md:hidden border-t border-border bg-background/95 px-6 py-4 flex flex-col gap-3 text-sm font-medium" onClick={() => setOpen(false)}>
          <Link to="/">Inicio</Link>
          <Link to="/soluciones">Soluciones</Link>
          {solutions.map((s) => (
            <Link key={s.slug} to="/soluciones/$slug" params={{ slug: s.slug }} className="pl-3 text-muted-foreground text-xs">
              — {s.title}
            </Link>
          ))}
          <a href="/#suscripciones">Suscripciones</a>
          <Link to="/tienda">Tienda</Link>
          <a href="/#contacto">Contacto</a>
        </div>
      )}
    </header>
  );
}