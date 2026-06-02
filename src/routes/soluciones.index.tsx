import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { solutions } from "@/lib/solutions";

export const Route = createFileRoute("/soluciones/")({
  head: () => ({
    meta: [
      { title: "Soluciones — Bloque Tech" },
      { name: "description", content: "Telecomunicaciones, ciberseguridad, CCTV, telefonía IP, automatización, soporte TI y software por suscripción." },
      { property: "og:title", content: "Soluciones — Bloque Tech" },
      { property: "og:description", content: "Un bloque, todas las soluciones tecnológicas para tu empresa." },
    ],
  }),
  component: SolucionesIndex,
});

function SolucionesIndex() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative py-20 border-b border-border" style={{ background: "var(--gradient-hero)" }}>
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-widest uppercase mb-5">
              Bloque Soluciones
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Nuestras <span className="text-primary">soluciones</span>
            </h1>
            <p className="mt-5 text-muted-foreground max-w-2xl mx-auto">
              Servicios e instalaciones, más suscripciones gestionadas para software, ciberseguridad y herramientas de productividad.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((s) => (
              <Link
                key={s.slug}
                to="/soluciones/$slug"
                params={{ slug: s.slug }}
                className="group relative rounded-xl overflow-hidden border border-border hover:border-primary/60 transition-all hover:-translate-y-1 min-h-[260px] flex"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${s.image})` }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.16 0.03 200 / 0.55) 0%, oklch(0.16 0.03 200 / 0.92) 100%)" }} />
                <div className="relative p-7 flex flex-col justify-end w-full">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary mb-4 backdrop-blur">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-bold uppercase tracking-wider">{s.title}</h2>
                  <p className="text-sm text-muted-foreground mt-2">{s.short}</p>
                  <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
                    Ver detalle <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}