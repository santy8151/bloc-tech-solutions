import { Network, Shield, Home, Phone, Radio, Wrench, Lock, AppWindow, type LucideIcon } from "lucide-react";

export type Solution = {
  slug: string;
  title: string;
  short: string;
  icon: LucideIcon;
  image: string;
  intro: string;
  features: string[];
  process: { step: string; desc: string }[];
  cta?: string;
  plans?: { name: string; tagline?: string; monthly: number; annual: number; highlight?: boolean; perks: string[] }[];
};

export const solutions: Solution[] = [
  {
    slug: "conectividad",
    title: "Conectividad Empresarial",
    short: "Redes rápidas y seguras: WiFi, cableado e internet dedicado.",
    icon: Network,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80",
    intro: "Diseñamos, instalamos y mantenemos redes empresariales de alto rendimiento. WiFi 6 corporativo, cableado estructurado certificado y enlaces dedicados con SLA.",
    features: [
      "Internet dedicado simétrico con SLA garantizado",
      "WiFi 6 / WiFi 6E para alta densidad de usuarios",
      "Cableado estructurado Cat6A / fibra óptica",
      "Segmentación por VLAN y QoS para voz y video",
      "Monitoreo 24/7 y alertas proactivas",
    ],
    process: [
      { step: "Diagnóstico", desc: "Visita técnica y site survey de cobertura." },
      { step: "Diseño", desc: "Topología, equipos y proveedor óptimo." },
      { step: "Instalación", desc: "Cableado, configuración y certificación." },
      { step: "Operación", desc: "Monitoreo, mantenimiento y soporte." },
    ],
  },
  {
    slug: "seguridad",
    title: "Seguridad Electrónica",
    short: "Protección integral con CCTV, alarmas y accesos inteligentes.",
    icon: Shield,
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1600&q=80",
    intro: "Sistemas de seguridad física integrados: videovigilancia IP 4K, control de acceso biométrico y alarmas con monitoreo central.",
    features: [
      "Cámaras IP 4K con visión nocturna y analítica IA",
      "Control de acceso biométrico y tarjetas RFID",
      "Alarmas perimetrales con sensores inalámbricos",
      "Grabación NVR redundante + respaldo en la nube",
      "App móvil para monitoreo remoto en vivo",
    ],
    process: [
      { step: "Levantamiento", desc: "Análisis de riesgos y zonas críticas." },
      { step: "Propuesta", desc: "Equipos, ubicaciones y cobertura." },
      { step: "Instalación", desc: "Cámaras, NVR, sensores y pruebas." },
      { step: "Soporte", desc: "Mantenimiento preventivo y correctivo." },
    ],
  },
  {
    slug: "automatizacion",
    title: "Automatización y Domótica",
    short: "Convierte tu hogar u oficina en un espacio 100% inteligente.",
    icon: Home,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=1600&q=80",
    intro: "Integramos iluminación, climatización, persianas, sonido y seguridad bajo un único panel inteligente, controlable por voz y app.",
    features: [
      "Iluminación inteligente con escenas programables",
      "Control de clima y persianas automatizadas",
      "Asistentes de voz: Alexa, Google y Apple Home",
      "Cerraduras inteligentes y videoportero IP",
      "Audio multi-zona y home cinema",
    ],
    process: [
      { step: "Ideación", desc: "Diseñamos contigo la experiencia ideal." },
      { step: "Selección", desc: "Marcas compatibles y escalables." },
      { step: "Instalación", desc: "Cableado, integración y pruebas." },
      { step: "Entrenamiento", desc: "Te enseñamos a operar todo." },
    ],
  },
  {
    slug: "telefonia",
    title: "Telefonía IP",
    short: "Telefonía IP avanzada: extensiones, movilidad y ahorro en costos.",
    icon: Phone,
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80",
    intro: "Centrales telefónicas en la nube o on-premise con extensiones ilimitadas, IVR, grabación de llamadas y movilidad total.",
    features: [
      "PBX en la nube con extensiones ilimitadas",
      "IVR multinivel y colas de atención",
      "Grabación de llamadas y métricas en vivo",
      "Softphone para móvil y escritorio",
      "Integración con CRM y WhatsApp Business",
    ],
    process: [
      { step: "Análisis", desc: "Tráfico, extensiones y reportes." },
      { step: "Configuración", desc: "Planes de marcación e IVR." },
      { step: "Portabilidad", desc: "Migramos tus números actuales." },
      { step: "Soporte", desc: "Atención 24/7 y mejoras continuas." },
    ],
  },
  {
    slug: "electricos",
    title: "Proyectos Eléctricos",
    short: "Infraestructura eléctrica segura, eficiente y lista para tu operación.",
    icon: Radio,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&q=80",
    intro: "Diseño e instalación eléctrica certificada bajo norma RETIE: tableros, UPS, plantas y sistemas regulados para misión crítica.",
    features: [
      "Diseño eléctrico bajo norma RETIE",
      "Tableros regulados y UPS para servidores",
      "Plantas eléctricas con transferencia automática",
      "Puesta a tierra y sistemas de apantallamiento",
      "Mantenimiento preventivo certificado",
    ],
    process: [
      { step: "Estudio", desc: "Cargas, demanda y normativa." },
      { step: "Diseño", desc: "Planos eléctricos certificados." },
      { step: "Ejecución", desc: "Instalación con personal calificado." },
      { step: "Certificación", desc: "RETIE y puesta en marcha." },
    ],
  },
  {
    slug: "soporte-ti",
    title: "Soporte TI",
    short: "Soporte TI confiable para mantener tus sistemas siempre disponibles.",
    icon: Wrench,
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1600&q=80",
    intro: "Mesa de ayuda, soporte remoto y presencial, administración de servidores y respaldos. Tu departamento de TI extendido.",
    features: [
      "Mesa de ayuda con SLA por prioridad",
      "Soporte remoto y visitas presenciales",
      "Administración de servidores Windows / Linux",
      "Backups automáticos en la nube",
      "Hardening, parches y monitoreo proactivo",
    ],
    process: [
      { step: "Diagnóstico", desc: "Inventario y baseline de tu TI." },
      { step: "Plan", desc: "SLA, horarios y cobertura." },
      { step: "Operación", desc: "Atención de tickets y mejoras." },
      { step: "Reportes", desc: "Indicadores mensuales y revisiones." },
    ],
  },
  {
    slug: "ciberseguridad",
    title: "Ciberseguridad",
    short: "Antivirus, EDR, firewall, backup y formación para tu equipo.",
    icon: Lock,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80",
    intro: "Protege tu información con suscripciones gestionadas: antivirus next-gen, EDR, firewall, backup en la nube y simulacros de phishing.",
    features: [
      "Antivirus / EDR Kaspersky, Bitdefender y SentinelOne",
      "Firewall perimetral y SD-WAN seguro",
      "Backup en la nube con IDrive y Acronis",
      "Microsoft 365 Defender y políticas Zero Trust",
      "Concientización y simulacros de phishing",
    ],
    process: [
      { step: "Auditoría", desc: "Identificamos brechas y riesgos." },
      { step: "Despliegue", desc: "Instalamos y configuramos licencias." },
      { step: "Monitoreo", desc: "Alertas y respuesta a incidentes." },
      { step: "Mejora", desc: "Reportes y endurecimiento continuo." },
    ],
    plans: [
      { name: "Starter", tagline: "Hasta 10 equipos", monthly: 19900, annual: 199000, perks: ["Antivirus EDR gestionado", "Backup 50 GB en la nube", "Soporte L1 horario laboral"] },
      { name: "Business", tagline: "Hasta 50 equipos", monthly: 49900, annual: 499000, highlight: true, perks: ["EDR + firewall gestionado", "Backup 500 GB cloud", "Monitoreo 24/7 + SLA 4h"] },
      { name: "Enterprise", tagline: "Hasta 200 equipos", monthly: 129900, annual: 1299000, perks: ["XDR + Zero Trust", "Backup 5 TB + DRP", "SOC dedicado + simulacros phishing"] },
      { name: "Ultra", tagline: "Infraestructura crítica", monthly: 249900, annual: 2499000, perks: ["SOC 24/7 con respuesta", "Backup ilimitado geo-redundante", "Pentest semestral incluido"] },
    ],
  },
  {
    slug: "software",
    title: "Soporte a Herramientas y Software",
    short: "Office, Adobe, software de diseño y antivirus con suscripción gestionada.",
    icon: AppWindow,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1600&q=80",
    intro: "Suscripciones empresariales con soporte: Microsoft 365, Adobe Creative Cloud, AutoCAD, antivirus y herramientas de diseño y productividad.",
    features: [
      "Microsoft 365 Business y Enterprise",
      "Adobe Creative Cloud para equipos",
      "AutoCAD, SketchUp y software de diseño",
      "Kaspersky, Bitdefender, ESET y más",
      "Instalación, licenciamiento y soporte L1/L2",
    ],
    process: [
      { step: "Asesoría", desc: "Te ayudamos a elegir el plan ideal." },
      { step: "Compra", desc: "Licenciamiento legal y facturación." },
      { step: "Despliegue", desc: "Instalación y migración de datos." },
      { step: "Soporte", desc: "Resolvemos cualquier incidencia." },
    ],
    plans: [
      { name: "Microsoft 365 Business", tagline: "Por usuario / mes", monthly: 29900, annual: 299000, perks: ["Word, Excel, PowerPoint", "Teams + Outlook empresarial", "1 TB OneDrive por usuario"] },
      { name: "Adobe Creative Cloud", tagline: "Por usuario / mes", monthly: 119900, annual: 1199000, highlight: true, perks: ["Photoshop, Illustrator, Premiere", "100 GB cloud + Adobe Fonts", "Soporte e instalación incluida"] },
      { name: "AutoCAD LT", tagline: "Por usuario / mes", monthly: 89900, annual: 899000, perks: ["AutoCAD 2D + apps web/móvil", "25 GB de almacenamiento", "Soporte técnico premium"] },
      { name: "Pack Productividad", tagline: "Office + Antivirus", monthly: 39900, annual: 399000, perks: ["Microsoft 365 incluido", "Antivirus + backup básico", "Mesa de ayuda dedicada"] },
    ],
  },
];

export const getSolution = (slug: string) => solutions.find((s) => s.slug === slug);