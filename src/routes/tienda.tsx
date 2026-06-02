import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingCart, ExternalLink, CreditCard, ShieldCheck, Truck, ArrowRight, Check } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/tienda")({
  head: () => ({
    meta: [
      { title: "Tienda — Bloque Tech | Telecomunicaciones y dispositivos" },
      { name: "description", content: "Tienda de equipos de telecomunicaciones, cámaras CCTV, routers, switches e impresoras. Conectada con Amazon, pago seguro desde nuestra app." },
      { property: "og:title", content: "Tienda Bloque Tech" },
      { property: "og:description", content: "Compra equipos de telecomunicaciones y tecnología con envío y pago seguro." },
    ],
  }),
  component: Tienda,
});

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  amazon: string;
};

const products: Product[] = [
  { id: "1", name: "Router WiFi 6 AX3000 Dual Band", category: "Conectividad", price: 459000, image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=600&q=80", amazon: "https://amazon.com" },
  { id: "2", name: "Cámara IP CCTV 4K con visión nocturna", category: "Seguridad", price: 329000, image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80", amazon: "https://amazon.com" },
  { id: "3", name: "Switch Gigabit 24 puertos administrable", category: "Redes", price: 1299000, image: "https://images.unsplash.com/photo-1551703599-6b3e8379aa8d?w=600&q=80", amazon: "https://amazon.com" },
  { id: "4", name: "Teléfono IP empresarial pantalla color", category: "Telefonía IP", price: 389000, image: "https://images.unsplash.com/photo-1592664474505-b66b54bbe2b3?w=600&q=80", amazon: "https://amazon.com" },
  { id: "5", name: "Impresora multifuncional láser color", category: "Periféricos", price: 1490000, image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=80", amazon: "https://amazon.com" },
  { id: "6", name: "NVR 8 canales + 4 cámaras kit completo", category: "Seguridad", price: 1899000, image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&q=80", amazon: "https://amazon.com" },
  { id: "7", name: "Access Point WiFi 6 PoE empresarial", category: "Conectividad", price: 549000, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80", amazon: "https://amazon.com" },
  { id: "8", name: "UPS 1500VA regulador para servidores", category: "Energía", price: 729000, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80", amazon: "https://amazon.com" },
];

const cats = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];

function Tienda() {
  const [active, setActive] = useState("Todos");
  const visible = active === "Todos" ? products : products.filter((p) => p.category === active);
  const { items, total } = useCart();
  const count = items.reduce((n, i) => n + i.qty, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative py-20 border-b border-border" style={{ background: "var(--gradient-hero)" }}>
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-widest uppercase mb-5">
              Tienda conectada con Amazon
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Equipos de <span className="text-primary">telecomunicaciones</span> y tecnología
            </h1>
            <p className="mt-5 text-muted-foreground max-w-2xl mx-auto">
              Cámaras, routers, switches, impresoras y más. Compra desde nuestra app con pago seguro o consigue el mejor precio en Amazon.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 py-12">
          <div className="flex flex-wrap gap-2 mb-10">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  active === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
            <Link
              to="/checkout"
              className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-md bg-secondary border border-border hover:border-primary transition text-sm font-medium"
            >
              <ShoppingCart className="h-4 w-4" /> Ir a pagar {count > 0 && <span className="bg-primary text-primary-foreground rounded-full px-2 text-xs">{count}</span>}
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visible.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>

        <PaymentMethods />
      </main>
      <SiteFooter />
      {count > 0 && (
        <Link
          to="/checkout"
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-3 px-6 py-4 rounded-full font-semibold text-primary-foreground shadow-2xl hover:opacity-90 transition"
          style={{ background: "var(--gradient-accent)", boxShadow: "var(--shadow-glow)" }}
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Pagar ${total.toLocaleString("es-CO")}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function ProductCard({ p }: { p: Product }) {
  const { add, items } = useCart();
  const inCart = items.find((i) => i.id === p.id);
  return (
    <div className="group rounded-xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="aspect-square bg-secondary overflow-hidden">
        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      </div>
      <div className="p-5">
        <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">{p.category}</p>
        <h3 className="font-semibold leading-snug mb-3 line-clamp-2 min-h-[3rem]">{p.name}</h3>
        <p className="text-2xl font-bold mb-4">
          ${p.price.toLocaleString("es-CO")}
          <span className="text-xs text-muted-foreground font-normal ml-1">COP</span>
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => add({ id: p.id, name: p.name, price: p.price, image: p.image })}
            className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-md font-semibold text-primary-foreground hover:opacity-90 transition text-sm"
            style={{ background: "var(--gradient-accent)" }}
          >
            {inCart ? <><Check className="h-4 w-4" /> En carrito ({inCart.qty})</> : <><ShoppingCart className="h-4 w-4" /> Agregar</>}
          </button>
          <a href={p.amazon} target="_blank" rel="noopener" className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-border hover:border-primary hover:text-primary transition" title="Ver en Amazon">
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

const payments = [
  { name: "Visa", color: "#1A1F71" },
  { name: "Mastercard", color: "#EB001B" },
  { name: "American Express", color: "#2E77BC" },
  { name: "PSE", color: "#00B5E2" },
  { name: "Nequi", color: "#DA0081" },
  { name: "Daviplata", color: "#ED1C27" },
  { name: "Bancolombia", color: "#FDDA24" },
  { name: "PayPal", color: "#003087" },
  { name: "Mercado Pago", color: "#00B1EA" },
  { name: "Apple Pay", color: "#000000" },
  { name: "Google Pay", color: "#4285F4" },
  { name: "Addi", color: "#7B61FF" },
];

function PaymentMethods() {
  return (
    <section className="py-20 border-t border-border bg-card/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Pago seguro</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Paga directamente desde la aplicación</h2>
          <p className="mt-3 text-muted-foreground">Múltiples métodos de pago disponibles para tu comodidad.</p>
        </div>

        <div className="relative overflow-hidden py-6">
          <div className="flex gap-4 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
            {[...payments, ...payments, ...payments].map((m, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-4 rounded-xl bg-card border border-border min-w-[200px]">
                <span className="h-3 w-3 rounded-full" style={{ background: m.color }} />
                <span className="font-semibold">{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          {[
            { icon: ShieldCheck, title: "Pago 100% seguro", desc: "Encriptación SSL y procesamiento PCI-DSS." },
            { icon: Truck, title: "Envío a toda Colombia", desc: "Entrega rápida desde Medellín y Amazon." },
            { icon: CreditCard, title: "Cuotas y financiación", desc: "Hasta 36 cuotas con tarjeta o Addi." },
          ].map((b) => (
            <div key={b.title} className="rounded-xl p-6 bg-card border border-border text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold mb-1">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, remove, update, total, clear } = useCart();
  const [checkout, setCheckout] = useState(false);
  const [paid, setPaid] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-background border-l border-border flex flex-col h-full">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2"><ShoppingCart className="h-5 w-5 text-primary" /> Tu carrito</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {paid ? (
            <div className="text-center py-12">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-bold mb-2">¡Pago exitoso!</h4>
              <p className="text-sm text-muted-foreground">Te enviaremos los detalles a tu correo.</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Tu carrito está vacío.</p>
            </div>
          ) : checkout ? (
            <CheckoutForm onPay={() => { setPaid(true); clear(); }} total={total} />
          ) : (
            <ul className="space-y-4">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3 p-3 rounded-lg bg-card border border-border">
                  <img src={it.image} alt={it.name} className="h-16 w-16 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{it.name}</p>
                    <p className="text-sm font-bold mt-1">${(it.price * it.qty).toLocaleString("es-CO")}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => update(it.id, it.qty - 1)} className="h-7 w-7 rounded border border-border hover:border-primary inline-flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                      <span className="text-sm w-6 text-center">{it.qty}</span>
                      <button onClick={() => update(it.id, it.qty + 1)} className="h-7 w-7 rounded border border-border hover:border-primary inline-flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                      <button onClick={() => remove(it.id)} className="ml-auto text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && !paid && !checkout && (
          <div className="p-6 border-t border-border space-y-3">
            <div className="flex items-center justify-between text-lg">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold">${total.toLocaleString("es-CO")} COP</span>
            </div>
            <button onClick={() => setCheckout(true)} className="w-full h-12 rounded-md font-semibold text-primary-foreground hover:opacity-90 transition" style={{ background: "var(--gradient-accent)" }}>
              Pagar ahora
            </button>
          </div>
        )}
        {paid && (
          <div className="p-6 border-t border-border">
            <Link to="/tienda" onClick={() => { setPaid(false); onClose(); }} className="block text-center w-full h-12 leading-[3rem] rounded-md font-semibold border border-border hover:border-primary">
              Seguir comprando
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckoutForm({ onPay, total }: { onPay: () => void; total: number }) {
  const [method, setMethod] = useState(payments[0].name);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onPay(); }} className="space-y-4">
      <h4 className="font-bold text-lg">Datos de pago</h4>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Método de pago</label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {payments.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setMethod(p.name)}
              className={`px-3 py-2 rounded-md text-xs whitespace-nowrap border transition ${
                method === p.name ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
      <input required placeholder="Nombre completo" className="w-full h-11 px-4 rounded-md bg-input border border-border focus:border-primary focus:outline-none" />
      <input required type="email" placeholder="Correo" className="w-full h-11 px-4 rounded-md bg-input border border-border focus:border-primary focus:outline-none" />
      <input required placeholder="Dirección de envío" className="w-full h-11 px-4 rounded-md bg-input border border-border focus:border-primary focus:outline-none" />
      <input required placeholder="Número de tarjeta" className="w-full h-11 px-4 rounded-md bg-input border border-border focus:border-primary focus:outline-none" />
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder="MM/AA" className="h-11 px-4 rounded-md bg-input border border-border focus:border-primary focus:outline-none" />
        <input required placeholder="CVC" className="h-11 px-4 rounded-md bg-input border border-border focus:border-primary focus:outline-none" />
      </div>
      <button type="submit" className="w-full h-12 rounded-md font-semibold text-primary-foreground hover:opacity-90 transition" style={{ background: "var(--gradient-accent)" }}>
        Confirmar pago · ${total.toLocaleString("es-CO")}
      </button>
      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1"><ShieldCheck className="h-3 w-3" /> Transacción segura con encriptación SSL</p>
    </form>
  );
}