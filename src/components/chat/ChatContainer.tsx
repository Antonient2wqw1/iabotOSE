import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
};

export function ChatContainer({ className = "" }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  /** Altura REAL del input flotante para reservar espacio */
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerH, setFooterH] = useState<number>(120);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    // Valor inicial
    setFooterH(el.getBoundingClientRect().height);

    // Observar cambios de tamaño
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver((entries) => {
        const box = entries[0]?.contentRect;
        if (box) setFooterH(box.height);
      });
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, []);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date().toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((p) => [...p, userMessage]);
    setIsGenerating(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Esta es una respuesta simulada de la IA. En una implementación real, aquí se conectaría con tu modelo.",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((p) => [...p, assistantMessage]);
      setIsGenerating(false);
    }, 1300);
  };

  /** autoscroll (incluye footerH para que baje si el input crece) */
  useEffect(() => {
    const vp = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement | null;
    if (vp) vp.scrollTop = vp.scrollHeight;
  }, [messages, isGenerating, footerH]);

  /** Reserva de espacio al final del viewport (anti-cruce) */
  const SAFE = 96; // ↑ margen de seguridad mayor para separar bien del input
  const reserveH = Math.ceil(footerH + SAFE);

  useEffect(() => {
    const vp = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement | null;
    if (vp) {
      vp.style.paddingBottom = `${reserveH}px`;
    }
  }, [reserveH]);

  // padding top para que no se peguen arriba; si está pensando, un poco más
  const topPadClass = isGenerating ? "pt-40" : "pt-28";

  return (
    <div className={`relative flex flex-col h-full min-h-0 ${className}`}>
      {/* Header centrado */}
      <div className="header-top">
        <h2>Conversación con OSE AI</h2>
        <p>{messages.length > 0 ? `${messages.length} mensajes` : "Nueva conversación"}</p>
      </div>
      <div className="top-fade" />

      {/* Espaciador: reserva altura del header */}
      <div aria-hidden className="h-24 md:h-28 shrink-0" />

      {/* Overlay “Pensando…” */}
      {isGenerating && (
        <div className="thinking-overlay">
          <div className="thinking-card">
            <div className="thinking-aurora">
              <div className="blob a"></div>
              <div className="blob b"></div>
              <div className="blob c"></div>
            </div>
            <div className="relative z-10 grid place-items-center h-full">
              <div className="thinking-title">Pensando…</div>
              <div className="thinking-sub">preparando la mejor respuesta</div>
            </div>
          </div>
        </div>
      )}

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

      {/* Input flotante CENTRADO (un poco más alto del borde inferior) */}
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