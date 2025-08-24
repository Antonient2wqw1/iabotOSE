import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import type { Card } from "../cards/RichCards";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  cards?: Card[];
};

export function ChatContainer({ className = "" }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Altura REAL del input flotante para reservar espacio
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerH, setFooterH] = useState<number>(120);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    setFooterH(el.getBoundingClientRect().height);

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries) => {
        const box = entries[0]?.contentRect;
        if (box) setFooterH(box.height);
      });
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, []);

  const now = () =>
    new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });

  // ─────────────────────────────
  // Intents helpers
  // ─────────────────────────────
  const has = (text: string, re: RegExp) => re.test(text.toLowerCase());

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: now(),
    };
    setMessages((p) => [...p, userMessage]);
    setIsGenerating(true);

    // Simulación de "pensando…"
    setTimeout(() => {
      const t = content.toLowerCase();

      let assistant: Message | null = null;

      // — Citas médicas / agenda
      if (has(t, /(citas?|agenda|calenda|turno|m[eé]dic)/)) {
        assistant = {
          id: (Date.now() + 1).toString(),
          content: "Te muestro tus próximas citas:",
          role: "assistant",
          timestamp: now(),
          cards: [
            {
              type: "appointments",
              appointments: [
                {
                  date: "Lun, 24 Mar",
                  time: "09:30",
                  title: "Consulta médica general",
                  location: "Clínica San Felipe",
                },
                {
                  date: "Jue, 27 Mar",
                  time: "16:00",
                  title: "Odontología",
                  location: "Centro OdontoCare",
                },
              ],
              calendarUrl: "https://calendar.google.com",
            },
          ],
        };
      }

      // — Ruta de senderismo / montaña
      else if (
        has(t, /(ruta|sender|trail|camino)/) &&
        has(t, /(monta[nñ]a|cerro|andes|bosque)/)
      ) {
        assistant = {
          id: (Date.now() + 1).toString(),
          content: "Aquí tienes una ruta recomendada:",
          role: "assistant",
          timestamp: now(),
          cards: [
            {
              type: "route",
              title: "Quebrada del Cóndor — Mirador",
              imageUrl:
                "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop",
              stats: { distance: "12.4 km", elevation: "870 m", duration: "4 h 45 m" },
              directionsUrl:
                "https://www.google.com/maps/search/?api=1&query=trailhead",
              chip: "Directions",
              rating: "4.8",
            },
          ],
        };
      }

      // — Club de lectura / lectura del mes
      else if (has(t, /(club|lectura|leer|book club)/)) {
        assistant = {
          id: (Date.now() + 1).toString(),
          content: "Te dejo el club de lectura del mes:",
          role: "assistant",
          timestamp: now(),
          cards: [
            {
              type: "readingClub",
              imageUrl:
                "https://images.unsplash.com/photo-1526312426976-593c2ebd6513?q=80&w=1400&auto=format&fit=crop",
              month: "NOV",
              day: "12",
              weekday: "Wed",
              title: "The Lotus Reading Club",
              subtitle:
                "Este mes: «Klara and the Sun» de Kazuo Ishiguro. Únete y comenta con la comunidad.",
              cta: { label: "Join the club", href: "#" },
              shareHref: "#",
            },
          ],
        };
      }

      // — Hero promocional
      else if (has(t, /(promo|lanzamiento|vision pro|hero)/)) {
        assistant = {
          id: (Date.now() + 1).toString(),
          content: "Lanzamiento destacado:",
          role: "assistant",
          timestamp: now(),
          cards: [
            {
              type: "promoHero",
              imageUrl:
                "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop",
              title: "Vision Pro",
              subtitle: "Personal computing a un nuevo nivel.",
              cta: { label: "Buy Now", href: "#" },
              logoEmoji: "",
            },
          ],
        };
      }

      // — Producto (Ice Matcha)
      else if (has(t, /(matcha|bebida|café|te|ordenar|comprar)/)) {
        assistant = {
          id: (Date.now() + 1).toString(),
          content: "Te puede interesar:",
          role: "assistant",
          timestamp: now(),
          cards: [
            {
              type: "product",
              imageUrl:
                "https://images.unsplash.com/photo-1559718062-36114586c21b?q=80&w=1200&auto=format&fit=crop",
              title: "Ice Matcha",
              price: "10$",
              tags: ["Matcha", "Ice Cubes", "Honey", "Milk"],
              subline: "Free Delivery until 16/06/2026",
              orderHref: "#",
            },
          ],
        };
      }

      // — Hoteles / viaje
      else if (has(t, /(hotel|viaje|destino|banff|reserva|turismo)/)) {
        assistant = {
          id: (Date.now() + 1).toString(),
          content: "Opciones para tu viaje:",
          role: "assistant",
          timestamp: now(),
          cards: [
            {
              type: "travelListing",
              title: "Banff, Canada",
              datesLine: "June 22 – 26 · Local host",
              price: "$172 / night",
              imageUrl:
                "https://images.unsplash.com/photo-1509644851169-2acc08aa25b9?q=80&w=1400&auto=format&fit=crop",
              rating: "4.8",
              tags: ["Adventure", "Ancient Monuments"],
              badge: "Top rated",
              cta: { label: "Book Now", href: "#" },
            },
          ],
        };
      }

      // — Bienvenida / registro
      else if (has(t, /(registr|cuenta|bienvenida|signup|crear cuenta)/)) {
        assistant = {
          id: (Date.now() + 1).toString(),
          content: "¡Bienvenido! Configura tu perfil:",
          role: "assistant",
          timestamp: now(),
          cards: [
            {
              type: "welcomeSignup",
              imageUrl:
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
              headline: "You're starting your first journey here!",
              subline:
                "Agrega tu avatar y elige un nombre de usuario para empezar rápido.",
              cta: { label: "Create an account", href: "#" },
            },
          ],
        };
      }

      // — Clima
      else if (has(t, /(clima|tiempo|weather)/)) {
        assistant = {
          id: (Date.now() + 1).toString(),
          content: "Resumen del clima:",
          role: "assistant",
          timestamp: now(),
          cards: [
            {
              type: "weatherStack",
              items: [
                { city: "Cupertino", temp: "47° F", note: "Sunny", time: "07:04 AM" },
                { city: "Istanbul", temp: "48° F", note: "Cloudy" },
                { city: "Boston", temp: "49° F", note: "Sunny" },
              ],
            },
          ],
        };
      }

      // — Calendario glass
      else if (has(t, /(calendario visual|mes|vista de calendario)/)) {
        const days: { label: string; isMuted?: boolean; isToday?: boolean; isSelected?: boolean }[] =
          [];
        // Relleno 42 celdas de demo (1..31 centradas y vacíos al inicio/fin)
        const lead = 6; // casillas en blanco del mes previo
        for (let i = 0; i < lead; i++) days.push({ label: String(i + 25), isMuted: true });
        for (let d = 1; d <= 31; d++)
          days.push({ label: String(d), isSelected: d === 12 });
        while (days.length < 42) days.push({ label: String(days.length - 30), isMuted: true });

        assistant = {
          id: (Date.now() + 1).toString(),
          content: "Vista rápida de tu mes:",
          role: "assistant",
          timestamp: now(),
          cards: [
            {
              type: "calendarGlass",
              monthLabel: "March",
              days,
            },
          ],
        };
      }

      // — Evento / teaser
      else if (has(t, /(evento|conferencia|setup|teaser)/)) {
        assistant = {
          id: (Date.now() + 1).toString(),
          content: "Configuración de tu evento:",
          role: "assistant",
          timestamp: now(),
          cards: [
            {
              type: "eventTeaser",
              imageUrl:
                "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
              kicker: "CARD 1",
              title: "Set up your event in minutes:",
              body: " name it, date it, ",
              highlight: "done.",
            },
          ],
        };
      }

      // — Feature hero con badges
      else if (has(t, /(estr[eé]s|analytics|monitor|badge|feature hero)/)) {
        assistant = {
          id: (Date.now() + 1).toString(),
          content: "Módulo destacado:",
          role: "assistant",
          timestamp: now(),
          cards: [
            {
              type: "featureHero",
              imageUrl:
                "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1400&auto=format&fit=crop",
              badges: [
                "24/7 Monitoring",
                "⚡ AI-Powered Alerts",
                "🔒 End-to-End Encryption",
                "Stress Forecasting",
                "❤️ Custom Thresholds",
              ],
              title: "Real Time Stress Analytics",
              body:
                "Integra con tus herramientas para ofrecer insights y estrategias personalizadas.",
              primary: { label: "Start free trial", href: "#" },
              secondary: { label: "Watch Demo", href: "#" },
            },
          ],
        };
      }

      // — Fallback
      else {
        assistant = {
          id: (Date.now() + 1).toString(),
          content:
            "Esta es una respuesta simulada de la IA. (Prueba: “citas médicas”, “ruta de montaña”, “club de lectura”, “clima”, “hotel”, “promo”, “calendario visual”, “evento”, “matcha”, “estrés analytics”).",
          role: "assistant",
          timestamp: now(),
        };
      }

      setMessages((p) => [...p, assistant!]);
      setIsGenerating(false);
    }, 950);
  };

  // autoscroll
  useEffect(() => {
    const vp = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement | null;
    if (vp) vp.scrollTop = vp.scrollHeight;
  }, [messages, isGenerating, footerH]);

  const SAFE = 96;
  const reserveH = Math.ceil(footerH + SAFE);

  useEffect(() => {
    const vp = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement | null;
    if (vp) {
      vp.style.paddingBottom = `${reserveH}px`;
    }
  }, [reserveH]);

  const topPadClass = isGenerating ? "pt-40" : "pt-28";

  return (
    <div className={`relative flex flex-col h-full min-h-0 ${className}`}>
      {/* Header con swap y gradiente EN el texto (tu CSS lo maneja) */}
      <div className="header-top">
        <h2>
          <span className="header-status-wrap">
            <span className="header-status-swap">
              <span className={`header-title ${!isGenerating ? "is-active" : ""}`}>
                Conversación con OSE AI
              </span>
              <span
                className={`header-title thinking ${isGenerating ? "is-active" : ""}`}
                data-text="Pensando…"
              >
                Pensando…
              </span>
            </span>
          </span>
        </h2>

        <p>
          {isGenerating
            ? "preparando la mejor respuesta"
            : messages.length > 0
            ? `${messages.length} mensajes`
            : "Nueva conversación"}
        </p>
      </div>

      <div className="top-fade" />

      {/* Espaciador: reserva altura del header */}
      <div aria-hidden className="h-24 md:h-28 shrink-0" />

      {/* Hero cuando no hay mensajes */}
      {messages.length === 0 && !isGenerating && (
        <div className="pointer-events-none absolute inset-x-0 top-24 flex justify-center z-10">
          <div className="w-full max-w-[980px] px-6">
            <h1 className="welcome-poster text-left">
              {"Hola\nSoy OSE AI\nme da gusto\nverte."}
            </h1>
          </div>
        </div>
      )}

      {/* Lista de mensajes */}
      <div className="relative flex-1 min-h-0">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className={`mx-auto max-w-4xl ${topPadClass} space-y-6 px-4`}>
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {/* Spacer físico extra bajo el último mensaje */}
            <div aria-hidden style={{ height: reserveH }} />
          </div>
        </ScrollArea>
      </div>

      {/* Input flotante */}
      <div
        ref={footerRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full px-4"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto w-full max-w-4xl pointer-events-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isGenerating}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
}