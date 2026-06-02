import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Briefcase, GraduationCap, Building2, ArrowRight, CheckCircle2,
  Mail, MessageSquareText, Send, Headset, Lock, AppWindow,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import asesor from "@/assets/asesor.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { solutions } from "@/lib/solutions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bloque Tech — Bloque Soluciones en Telecomunicaciones y Ciberseguridad" },
      { name: "description", content: "Conectamos empresas con proveedores y técnicos expertos en telecomunicaciones, ciberseguridad, CCTV y periféricos. Suscripciones e instalaciones a la medida." },
      { property: "og:title", content: "Bloque Tech — Bloque Soluciones" },
      { property: "og:description", content: "Un solo bloque, todas las soluciones tecnológicas que tu empresa necesita." },
    ],
  }),
  component: Index,
});

const isps = ["Movistar", "Tigo", "Claro", "ETB", "WOM", "EPM"];

function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Services />
        <Subscriptions />
        <RemoteSupport />
        <Advisor />
        <InstallForm />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)", opacity: 0.85 }} />
      <div className="relative container mx-auto px-6 py-28 md:py-40 max-w-5xl text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-widest uppercase mb-6">
          Bloque Soluciones
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
          Un <span className="text-primary">bloque</span>, todas las{" "}
          <span className="text-primary">soluciones</span> de tu empresa.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Conectamos empresas con los mejores proveedores y técnicos en telecomunicaciones,
          ciberseguridad, CCTV, impresoras y más. Suscripciones e instalaciones a tu medida.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#contacto" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90 transition" style={{ background: "var(--gradient-accent)" }}>
            Solicitar asesoría <ArrowRight className="h-4 w-4" />
          </a>
          <Link to="/tienda" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md font-semibold border border-border hover:border-primary hover:text-primary transition">
            Ver tienda
          </Link>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const featured = solutions.filter((s) => !["ciberseguridad", "software"].includes(s.slug));
  return (
    <section id="servicios" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Soluciones</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Soluciones integrales para tu negocio
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((s) => (
            <Link
              key={s.slug}
              to="/soluciones/$slug"
              params={{ slug: s.slug }}
              className="group relative rounded-xl overflow-hidden border border-border hover:border-primary/60 transition-all duration-300 hover:-translate-y-1 min-h-[280px] flex"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${s.image})` }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.16 0.03 200 / 0.45) 0%, oklch(0.16 0.03 200 / 0.95) 100%)" }} />
              <div className="relative p-7 flex flex-col justify-end w-full">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-lg bg-primary/15 text-primary mb-5 backdrop-blur group-hover:scale-110 transition-transform">
                  <s.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wider mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.short}</p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
                  Conocer más <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Subscriptions() {
  const subs = [
    {
      slug: "ciberseguridad",
      icon: Lock,
      title: "Ciberseguridad",
      desc: "Antivirus next-gen, EDR, firewall y backup en la nube con monitoreo 24/7.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80",
      bullets: ["Kaspersky · Bitdefender · ESET", "Firewall y SD-WAN seguro", "Backup cloud IDrive / Acronis"],
    },
    {
      slug: "software",
      icon: AppWindow,
      title: "Soporte a Herramientas",
      desc: "Office, Adobe, AutoCAD y antivirus con licencias gestionadas y soporte L1/L2.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1600&q=80",
      bullets: ["Microsoft 365 Business", "Adobe Creative Cloud", "AutoCAD · SketchUp · Diseño"],
    },
  ];
  return (
    <section id="suscripciones" className="py-24 bg-card/30 border-y border-border">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Modelo recurrente</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Suscripciones gestionadas</h2>
          <p className="mt-4 text-muted-foreground">Paga mensual o anual y olvídate de licencias, parches y renovaciones. Nosotros nos encargamos.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {subs.map((s) => (
            <Link
              key={s.slug}
              to="/soluciones/$slug"
              params={{ slug: s.slug }}
              className="group relative rounded-2xl overflow-hidden border border-border hover:border-primary/60 transition-all hover:-translate-y-1 min-h-[340px] flex"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${s.image})` }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.16 0.03 200 / 0.55) 0%, oklch(0.16 0.03 200 / 0.95) 100%)" }} />
              <div className="relative p-8 flex flex-col justify-end w-full">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary/15 text-primary mb-5 backdrop-blur">
                  <s.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
                <ul className="space-y-2 mb-5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> {b}</li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                  Ver planes y precios <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function RemoteSupport() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[40%] opacity-30 blur-3xl" style={{ background: "var(--gradient-accent)" }} />
            <div className="relative rounded-[40%] overflow-hidden border-2 border-primary/30 aspect-square max-w-md mx-auto" style={{ boxShadow: "var(--shadow-card)" }}>
              <img
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=900&q=80"
                alt="Técnico realizando soporte remoto"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">SOPORTE REMOTO</h2>
              <div className="flex-1 h-px bg-primary/40" />
            </div>
            <p className="text-lg font-semibold mb-3">¿Tienes alguna duda?</p>
            <p className="text-muted-foreground max-w-md mb-8">
              Contacta uno de nuestros asesores en tiempo real para juntos encontrar la mejor solución.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/573009130535?text=Hola%20Bloque%20Tech%2C%20necesito%20asesor%C3%ADa"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold border border-border hover:border-primary hover:text-primary transition"
              >
                <Headset className="h-4 w-4" /> Te asesoramos
              </a>
              <Link
                to="/soluciones"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-primary-foreground hover:opacity-90 transition"
                style={{ background: "var(--gradient-accent)" }}
              >
                Ver paquetes <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Advisor() {
  return (
    <section id="asesor" className="py-24 relative bg-card/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl opacity-30 blur-2xl" style={{ background: "var(--gradient-accent)" }} />
            <div className="relative rounded-2xl overflow-hidden border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
              <img src={asesor} alt="Juan Pablo Suárez Rodríguez" className="w-full h-[520px] object-cover" />
            </div>
          </div>
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Tu asesor comercial</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Juan Pablo<br /><span className="text-primary">Suárez Rodríguez</span>
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Técnico en telecomunicaciones y logística industrial, actualmente estudiando
              Tecnología en Gestión Industrial en la <strong className="text-foreground">CUN</strong>.
              Con experiencia sólida atendiendo a clientes corporativos y residenciales.
            </p>
            <div className="mt-6 space-y-3">
              {[
                { icon: GraduationCap, label: "Técnico en Telecomunicaciones · Logística Industrial" },
                { icon: Building2, label: "DIS Soluciones · Emtelco · Luval Comunicaciones" },
                { icon: Briefcase, label: "Asesor comercial de Bloque Tech" },
              ].map((it) => (
                <div key={it.label} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/40 border border-border">
                  <it.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{it.label}</span>
                </div>
              ))}
            </div>
            <a href="#contacto" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90 transition" style={{ background: "var(--gradient-accent)" }}>
              Hablar con Juan Pablo <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstallForm() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    provider: "Movistar",
    type: "Hogar",
  });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola, soy ${form.email}. Quisiera saber en qué pueden ayudarme con planes de ${form.provider} para ${form.type}.`;
    // WhatsApp deep link with predefined message
    const wa = `https://wa.me/${form.phone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
    const mailto = `mailto:${form.email}?subject=${encodeURIComponent(`Planes ${form.provider} ${form.type} — Bloque Tech`)}&body=${encodeURIComponent(`Hola, te enviamos los planes disponibles de ${form.provider} para ${form.type}. Un asesor de Bloque Tech te contactará pronto.`)}`;
    window.open(wa, "_blank");
    window.open(mailto, "_blank");
    setSent(true);
  };

  return (
    <section id="contacto" className="py-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Instalaciones</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Solicita tu instalación de internet</h2>
          <p className="mt-4 text-muted-foreground">Trabajamos con los mejores proveedores de Medellín y Colombia.</p>
        </div>

        {/* ISP carousel */}
        <div className="relative overflow-hidden mb-12 py-6 border-y border-border">
          <div className="flex gap-12 animate-[scroll_25s_linear_infinite] whitespace-nowrap">
            {[...isps, ...isps, ...isps].map((isp, i) => (
              <div key={i} className="text-2xl md:text-3xl font-extrabold text-muted-foreground hover:text-primary transition-colors tracking-wide">
                {isp}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="rounded-2xl bg-card border border-border p-8" style={{ boxShadow: "var(--shadow-card)" }}>
            <h3 className="text-2xl font-bold mb-2">Te ayudamos a elegir tu plan</h3>
            <p className="text-sm text-muted-foreground mb-6">Recibe los planes en tu correo y un mensaje directo en WhatsApp.</p>
            {sent ? (
              <div className="p-6 rounded-lg bg-primary/10 border border-primary/30 flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <span>Solicitud enviada. Te contactaremos pronto.</span>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-2"><Mail className="h-4 w-4" /> Correo electrónico</label>
                  <input
                    required type="email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="tu@correo.com"
                    className="w-full h-11 px-4 rounded-md bg-input border border-border focus:border-primary focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-2"><MessageSquareText className="h-4 w-4" /> Número WhatsApp</label>
                  <input
                    required type="tel" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+57 300 000 0000"
                    className="w-full h-11 px-4 rounded-md bg-input border border-border focus:border-primary focus:outline-none transition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Proveedor</label>
                    <select
                      value={form.provider}
                      onChange={(e) => setForm({ ...form, provider: e.target.value })}
                      className="w-full h-11 px-3 rounded-md bg-input border border-border focus:border-primary focus:outline-none transition"
                    >
                      {isps.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Tipo</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full h-11 px-3 rounded-md bg-input border border-border focus:border-primary focus:outline-none transition"
                    >
                      <option>Hogar</option>
                      <option>Empresa</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-md font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90 transition" style={{ background: "var(--gradient-accent)" }}>
                  Enviar solicitud <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-card border border-border p-8">
              <h3 className="text-xl font-bold mb-3">¿Por qué con nosotros?</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  "Comparativa imparcial entre proveedores",
                  "Instalación realizada por técnicos certificados",
                  "Atención antes, durante y después del servicio",
                  "Planes para hogar y empresas en toda Medellín",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" /> {t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl p-8 text-primary-foreground" style={{ background: "var(--gradient-accent)" }}>
              <h3 className="text-xl font-bold mb-2">¿Necesitas equipos?</h3>
              <p className="text-sm opacity-90 mb-4">Compra cámaras, routers, switches, impresoras y más en nuestra tienda conectada con Amazon.</p>
              <Link to="/tienda" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold bg-background text-foreground hover:opacity-90 transition">
                Ir a la tienda <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return null;
}
