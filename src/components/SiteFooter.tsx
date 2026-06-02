import { Link } from "@tanstack/react-router";
import { Mail, Phone, FileText, ShieldCheck, Facebook, Instagram, Linkedin, Twitter, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 text-foreground">
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(110deg, oklch(0.22 0.05 195) 0%, oklch(0.15 0.03 200) 55%)" }}>
        <div className="container mx-auto px-6 py-14 grid lg:grid-cols-4 gap-10 relative">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Bloque Tech" className="h-12 w-12" />
              <span className="text-3xl font-extrabold tracking-tight">
                Bloque<span className="text-primary">Tech</span>
              </span>
            </Link>
            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-primary font-semibold">
              Your tech<br />connection
            </p>
          </div>

          {/* Contact */}
          <div className="lg:border-l lg:border-r border-primary/30 lg:px-8">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3"><MessageCircle className="h-4 w-4 text-primary" /> +57 300 913 0535</li>
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> +57 (604) 322 9822</li>
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> hola@bloquetech.co</li>
              <li className="flex items-center gap-3"><FileText className="h-4 w-4 text-primary" /> Políticas y TyC</li>
              <li className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-primary" /> Tratamiento de Datos</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3"><Facebook className="h-4 w-4 text-primary" /> bloquetech</li>
              <li className="flex items-center gap-3"><Twitter className="h-4 w-4 text-primary" /> bloquetech</li>
              <li className="flex items-center gap-3"><Instagram className="h-4 w-4 text-primary" /> bloquetech</li>
              <li className="flex items-center gap-3"><Linkedin className="h-4 w-4 text-primary" /> bloquetech</li>
            </ul>
          </div>

          {/* Partners */}
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Partners</p>
            {[
              "Microsoft Partner",
              "Kaspersky Registered",
              "Adobe Reseller",
              "IDrive Cloud Backup",
            ].map((p) => (
              <div key={p} className="rounded-lg bg-background/60 border border-border px-4 py-3 text-sm font-semibold backdrop-blur">
                {p}
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-primary/20 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Bloque Tech · Bloque Soluciones. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}