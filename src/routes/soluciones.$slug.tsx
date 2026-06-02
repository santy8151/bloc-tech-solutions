import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSolution, solutions, type Solution } from "@/lib/solutions";

export const Route = createFileRoute("/soluciones/$slug")({
  loader: ({ params }): { sol: Solution } => {
    const sol = getSolution(params.slug);
    if (!sol) throw notFound();
    return { sol };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.sol.title} — Bloque Tech` },
          { name: "description", content: loaderData.sol.intro },
          { property: "og:title", content: `${loaderData.sol.title} — Bloque Tech` },
          { property: "og:description", content: loaderData.sol.intro },
          { property: "og:image", content: loaderData.sol.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Solución no encontrada</h1>
        <Link to="/soluciones" className="text-primary mt-3 inline-block">Ver todas las soluciones</Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen grid place-items-center bg-background text-foreground">
      <button onClick={reset} className="text-primary">Reintentar</button>
    </div>
  ),
  component: SolucionDetail,
});

function SolucionDetail() {
  const { slug } = Route.useParams();
  const sol = getSolution(slug);
  if (!sol) return null;
  const others = solutions.filter((s) => s.slug !== sol.slug).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${sol.image})` }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.16 0.03 200 / 0.7) 0%, oklch(0.16 0.03 200 / 0.95) 100%)" }} />
          <div className="relative container mx-auto px-6 py-24 md:py-32 max-w-5xl">
            <Link to="/soluciones" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="h-4 w-4" /> Soluciones
            </Link>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-primary/15 text-primary mb-5 backdrop-blur">
              <sol.icon className="h-7 w-7" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{sol.title}</h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-3xl">{sol.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/#contacto" className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-primary-foreground hover:opacity-90 transition" style={{ background: "var(--gradient-accent)" }}>
                Solicitar este servicio <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/tienda" className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold border border-border hover:border-primary hover:text-primary transition">
                Ver equipos
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">¿Qué incluye?</p>
              <h2 className="text-3xl font-bold mb-6">Características principales</h2>
              <ul className="space-y-3">
                {sol.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">¿Cómo lo hacemos?</p>
              <h2 className="text-3xl font-bold mb-6">Nuestro proceso</h2>
              <ol className="space-y-4">
                {sol.process.map((p, i) => (
                  <li key={p.step} className="relative pl-12 pb-4">
                    <span className="absolute left-0 top-0 h-9 w-9 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center">{i + 1}</span>
                    <h3 className="font-bold">{p.step}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="bg-card/30 border-t border-border py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <h3 className="text-2xl font-bold mb-8 text-center">Otras soluciones</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {others.map((o) => (
                <Link key={o.slug} to="/soluciones/$slug" params={{ slug: o.slug }} className="group relative rounded-xl overflow-hidden border border-border hover:border-primary/60 transition min-h-[200px] flex">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${o.image})` }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.16 0.03 200 / 0.55) 0%, oklch(0.16 0.03 200 / 0.92) 100%)" }} />
                  <div className="relative p-6 flex flex-col justify-end w-full">
                    <h4 className="font-bold uppercase tracking-wider">{o.title}</h4>
                    <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold mt-2 group-hover:gap-2 transition-all">Ver detalle <ArrowRight className="h-4 w-4" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}