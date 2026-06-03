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

products.push(
  { id: "9", name: "Router Mesh WiFi 6 Tri-Band 3-pack", category: "Conectividad", price: 1199000, image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=600&q=80", amazon: "https://amazon.com" },
  { id: "10", name: "Cámara PTZ exterior 4K zoom 30x", category: "Seguridad", price: 2490000, image: "https://images.unsplash.com/photo-1564594985645-4427056e22e2?w=600&q=80", amazon: "https://amazon.com" },
  { id: "11", name: "Switch PoE+ 48 puertos Gigabit", category: "Redes", price: 3290000, image: "https://images.unsplash.com/photo-1551703599-6b3e8379aa8d?w=600&q=80", amazon: "https://amazon.com" },
  { id: "12", name: "Diadema inalámbrica Bluetooth con micrófono", category: "Telefonía IP", price: 459000, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80", amazon: "https://amazon.com" },
  { id: "13", name: "Impresora térmica de etiquetas y código QR", category: "Periféricos", price: 689000, image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=80", amazon: "https://amazon.com" },
  { id: "14", name: "Scanner documental dúplex 60ppm", category: "Periféricos", price: 1390000, image: "https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=600&q=80", amazon: "https://amazon.com" },
  { id: "15", name: "Disco duro NAS 8TB Enterprise", category: "Almacenamiento", price: 1090000, image: "https://images.unsplash.com/photo-1597338820137-7d6c61bd84c0?w=600&q=80", amazon: "https://amazon.com" },
  { id: "16", name: "NAS 2 bahías para respaldo empresarial", category: "Almacenamiento", price: 1790000, image: "https://images.unsplash.com/photo-1601737487795-dab272f52420?w=600&q=80", amazon: "https://amazon.com" },
  { id: "17", name: "Firewall UTM SMB con licencia 1 año", category: "Seguridad", price: 2890000, image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80", amazon: "https://amazon.com" },
  { id: "18", name: "Patch panel Cat6A 24 puertos blindado", category: "Redes", price: 549000, image: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=600&q=80", amazon: "https://amazon.com" },
  { id: "19", name: "Lector biométrico de huella y RFID", category: "Seguridad", price: 459000, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80", amazon: "https://amazon.com" },
  { id: "20", name: "Proyector láser 4K para sala de juntas", category: "Periféricos", price: 4290000, image: "https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=600&q=80", amazon: "https://amazon.com" },
  { id: "21", name: "Pantalla interactiva 65\" para reuniones", category: "Periféricos", price: 7890000, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80", amazon: "https://amazon.com" },
  { id: "22", name: "Regleta inteligente WiFi con monitoreo", category: "Energía", price: 219000, image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80", amazon: "https://amazon.com" },
  { id: "23", name: "UPS online 3KVA doble conversión", category: "Energía", price: 3590000, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80", amazon: "https://amazon.com" },
  { id: "24", name: "Kit videoconferencia 4K USB plug & play", category: "Telefonía IP", price: 2190000, image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&q=80", amazon: "https://amazon.com" },
);

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
