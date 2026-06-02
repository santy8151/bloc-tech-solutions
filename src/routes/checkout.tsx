import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShoppingBag, Trash2, Plus, Minus, MapPin, CreditCard, ShieldCheck,
  Truck, CheckCircle2, ArrowLeft, ArrowRight, Tag, Wallet,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Pagar — Bloque Tech" },
      { name: "description", content: "Portal de pago seguro. Tarjetas, PSE, Nequi, Daviplata y cuotas con Addi." },
    ],
  }),
  component: Checkout,
});

type Step = "cart" | "shipping" | "payment" | "done";

const methods = [
  { id: "card", label: "Tarjeta de crédito o débito", desc: "Visa, Mastercard, Amex", icon: CreditCard },
  { id: "pse", label: "PSE", desc: "Débito desde tu cuenta bancaria", icon: Wallet },
  { id: "nequi", label: "Nequi", desc: "Pago desde la app Nequi", icon: Wallet },
  { id: "daviplata", label: "Daviplata", desc: "Pago desde tu Daviplata", icon: Wallet },
  { id: "addi", label: "Cuotas con Addi", desc: "Hasta 24 cuotas sin tarjeta", icon: Tag },
  { id: "mercadopago", label: "Mercado Pago", desc: "Saldo, tarjeta y más", icon: Wallet },
];

function Checkout() {
  const { items, update, remove, total, clear } = useCart();
  const [step, setStep] = useState<Step>(items.length === 0 ? "cart" : "cart");
  const [shipping, setShipping] = useState({
    name: "", phone: "", email: "",
    address: "", city: "Medellín", dept: "Antioquia", zip: "",
  });
  const [method, setMethod] = useState("card");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvc: "", installments: 1 });

  const shippingCost = total > 200000 ? 0 : total === 0 ? 0 : 15000;
  const grand = total + shippingCost;

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30 text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Stepper step={step} />

          <div className="grid lg:grid-cols-[1fr_360px] gap-6 mt-6">
            <div className="space-y-4">
              {step === "cart" && (
                <CartStep items={items} update={update} remove={remove} onNext={() => items.length && setStep("shipping")} />
              )}
              {step === "shipping" && (
                <ShippingStep value={shipping} onChange={setShipping} onBack={() => setStep("cart")} onNext={() => setStep("payment")} />
              )}
              {step === "payment" && (
                <PaymentStep
                  method={method} setMethod={setMethod}
                  card={card} setCard={setCard}
                  total={grand}
                  onBack={() => setStep("shipping")}
                  onPay={() => { setStep("done"); clear(); }}
                />
              )}
              {step === "done" && <SuccessStep />}
            </div>

            {step !== "done" && (
              <OrderSummary
                items={items}
                subtotal={total}
                shipping={shippingCost}
                grand={grand}
              />
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps = [
    { id: "cart", label: "Productos" },
    { id: "shipping", label: "Envío" },
    { id: "payment", label: "Pago" },
    { id: "done", label: "Listo" },
  ];
  const idx = steps.findIndex((s) => s.id === step);
  return (
    <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-4">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2 flex-1">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${i <= idx ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
            {i < idx ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
          </div>
          <span className={`text-sm font-semibold ${i <= idx ? "text-foreground" : "text-muted-foreground"} hidden sm:inline`}>{s.label}</span>
          {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < idx ? "bg-primary" : "bg-border"}`} />}
        </div>
      ))}
    </div>
  );
}

function CartStep({ items, update, remove, onNext }: {
  items: ReturnType<typeof useCart>["items"];
  update: ReturnType<typeof useCart>["update"];
  remove: ReturnType<typeof useCart>["remove"];
  onNext: () => void;
}) {
  const navigate = useNavigate();
  if (items.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">Tu carrito está vacío</h2>
        <p className="text-sm text-muted-foreground mb-6">Agrega productos desde la tienda para continuar.</p>
        <button onClick={() => navigate({ to: "/tienda" })} className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-primary-foreground hover:opacity-90 transition" style={{ background: "var(--gradient-accent)" }}>
          Ir a la tienda <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h2 className="font-bold text-lg">Tus productos ({items.length})</h2>
        <Link to="/tienda" className="text-sm text-primary hover:underline">Seguir comprando</Link>
      </div>
      <ul className="divide-y divide-border">
        {items.map((it) => (
          <li key={it.id} className="p-5 flex gap-4">
            <img src={it.image} alt={it.name} className="h-24 w-24 rounded-lg object-cover bg-secondary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold leading-snug mb-1">{it.name}</p>
              <p className="text-xs text-primary mb-3">Envío disponible · 2-5 días</p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center border border-border rounded-md">
                  <button onClick={() => update(it.id, it.qty - 1)} className="h-8 w-8 inline-flex items-center justify-center hover:bg-secondary"><Minus className="h-3 w-3" /></button>
                  <span className="px-3 text-sm font-semibold">{it.qty}</span>
                  <button onClick={() => update(it.id, it.qty + 1)} className="h-8 w-8 inline-flex items-center justify-center hover:bg-secondary"><Plus className="h-3 w-3" /></button>
                </div>
                <button onClick={() => remove(it.id)} className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1">
                  <Trash2 className="h-3 w-3" /> Eliminar
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold whitespace-nowrap">${(it.price * it.qty).toLocaleString("es-CO")}</p>
              <p className="text-xs text-muted-foreground">${it.price.toLocaleString("es-CO")} c/u</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="p-5 border-t border-border flex justify-end">
        <button onClick={onNext} className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-primary-foreground hover:opacity-90 transition" style={{ background: "var(--gradient-accent)" }}>
          Continuar al envío <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ShippingStep({ value, onChange, onBack, onNext }: {
  value: { name: string; phone: string; email: string; address: string; city: string; dept: string; zip: string };
  onChange: (v: typeof value) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="bg-card border border-border rounded-xl">
      <div className="p-5 border-b border-border flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        <h2 className="font-bold text-lg">Datos de envío</h2>
      </div>
      <div className="p-5 grid sm:grid-cols-2 gap-4">
        {[
          { k: "name", label: "Nombre completo", placeholder: "Juan Pérez" },
          { k: "phone", label: "Teléfono", placeholder: "+57 300 000 0000" },
          { k: "email", label: "Correo", placeholder: "tu@correo.com", type: "email" },
          { k: "zip", label: "Código postal", placeholder: "050010" },
          { k: "address", label: "Dirección", placeholder: "Calle 10 # 20-30", full: true },
          { k: "city", label: "Ciudad" },
          { k: "dept", label: "Departamento" },
        ].map((f) => (
          <div key={f.k} className={f.full ? "sm:col-span-2" : ""}>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">{f.label}</label>
            <input
              required
              type={f.type ?? "text"}
              placeholder={f.placeholder}
              value={value[f.k as keyof typeof value] as string}
              onChange={(e) => onChange({ ...value, [f.k]: e.target.value })}
              className="w-full h-11 px-4 rounded-md bg-input border border-border focus:border-primary focus:outline-none"
            />
          </div>
        ))}
      </div>
      <div className="p-5 border-t border-border flex justify-between">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 px-5 py-3 rounded-md font-semibold border border-border hover:border-primary transition">
          <ArrowLeft className="h-4 w-4" /> Atrás
        </button>
        <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-primary-foreground hover:opacity-90 transition" style={{ background: "var(--gradient-accent)" }}>
          Continuar al pago <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

function PaymentStep({ method, setMethod, card, setCard, total, onBack, onPay }: {
  method: string;
  setMethod: (m: string) => void;
  card: { number: string; name: string; exp: string; cvc: string; installments: number };
  setCard: (c: typeof card) => void;
  total: number;
  onBack: () => void;
  onPay: () => void;
}) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onPay(); }} className="bg-card border border-border rounded-xl">
      <div className="p-5 border-b border-border flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-primary" />
        <h2 className="font-bold text-lg">Método de pago</h2>
      </div>

      <div className="p-5 space-y-2">
        {methods.map((m) => (
          <label key={m.id} className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition ${method === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
            <input type="radio" name="pm" checked={method === m.id} onChange={() => setMethod(m.id)} className="accent-primary" />
            <m.icon className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="font-semibold text-sm">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.desc}</p>
            </div>
          </label>
        ))}
      </div>

      {method === "card" && (
        <div className="p-5 border-t border-border space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Número de tarjeta</label>
            <input required value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="1234 5678 9012 3456" className="w-full h-11 px-4 rounded-md bg-input border border-border focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Nombre del titular</label>
            <input required value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder="Como aparece en la tarjeta" className="w-full h-11 px-4 rounded-md bg-input border border-border focus:border-primary focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Vencimiento</label>
              <input required value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} placeholder="MM/AA" className="w-full h-11 px-4 rounded-md bg-input border border-border focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">CVC</label>
              <input required value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} placeholder="123" className="w-full h-11 px-4 rounded-md bg-input border border-border focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Cuotas</label>
            <select value={card.installments} onChange={(e) => setCard({ ...card, installments: Number(e.target.value) })} className="w-full h-11 px-3 rounded-md bg-input border border-border focus:border-primary focus:outline-none">
              {[1, 3, 6, 12, 18, 24, 36].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? "cuota" : "cuotas"} de ${Math.round(total / n).toLocaleString("es-CO")}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="p-5 border-t border-border flex justify-between items-center">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 px-5 py-3 rounded-md font-semibold border border-border hover:border-primary transition">
          <ArrowLeft className="h-4 w-4" /> Atrás
        </button>
        <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-primary-foreground hover:opacity-90 transition" style={{ background: "var(--gradient-accent)" }}>
          <ShieldCheck className="h-4 w-4" /> Pagar ${total.toLocaleString("es-CO")}
        </button>
      </div>
    </form>
  );
}

function SuccessStep() {
  return (
    <div className="bg-card border border-border rounded-xl p-12 text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-primary mb-5">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold mb-2">¡Pago exitoso!</h2>
      <p className="text-sm text-muted-foreground mb-6">Te enviaremos un correo con los detalles de tu compra y la guía de envío.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/tienda" className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold border border-border hover:border-primary transition">
          Seguir comprando
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-primary-foreground hover:opacity-90 transition" style={{ background: "var(--gradient-accent)" }}>
          Ir al inicio <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function OrderSummary({ items, subtotal, shipping, grand }: {
  items: ReturnType<typeof useCart>["items"];
  subtotal: number; shipping: number; grand: number;
}) {
  return (
    <aside className="lg:sticky lg:top-20 self-start space-y-3">
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-bold mb-4">Resumen del pedido</h3>
        <ul className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {items.map((it) => (
            <li key={it.id} className="flex gap-3 text-sm">
              <img src={it.image} alt={it.name} className="h-12 w-12 rounded object-cover bg-secondary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="line-clamp-2 leading-tight">{it.name}</p>
                <p className="text-xs text-muted-foreground">x{it.qty}</p>
              </div>
              <span className="font-semibold whitespace-nowrap">${(it.price * it.qty).toLocaleString("es-CO")}</span>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 text-sm border-t border-border pt-4">
          <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>${subtotal.toLocaleString("es-CO")}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground inline-flex items-center gap-1"><Truck className="h-3 w-3" /> Envío</dt><dd className={shipping === 0 ? "text-primary font-semibold" : ""}>{shipping === 0 ? "Gratis" : `$${shipping.toLocaleString("es-CO")}`}</dd></div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-border"><dt>Total</dt><dd>${grand.toLocaleString("es-CO")} COP</dd></div>
        </dl>
      </div>
      <div className="bg-card border border-border rounded-xl p-5 text-xs text-muted-foreground space-y-2">
        <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Pago 100% seguro con encriptación SSL.</p>
        <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Envío gratis en compras superiores a $200.000.</p>
        <p className="flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /> Hasta 36 cuotas o financiación con Addi.</p>
      </div>
    </aside>
  );
}