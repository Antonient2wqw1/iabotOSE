import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

interface ChatContainerProps {
  className?: string;
}

export function ChatContainer({ className }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    // Simulación de respuesta
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Esta es una respuesta simulada de la IA. En una implementación real, aquí se conectaría con tu modelo.",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsGenerating(false);
    }, 1600);
  };

  const clearChat = () => setMessages([]);
  const regenerateLastResponse = () => {
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      setMessages((prev) => prev.slice(0, -1));
      setIsGenerating(true);
      setTimeout(() => {
        const newResponse: Message = {
          id: Date.now().toString(),
          content: "Esta es una nueva respuesta regenerada...",
          role: "assistant",
          timestamp: new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, newResponse]);
        setIsGenerating(false);
      }, 1400);
    }
  };

  // Auto-scroll al fondo
  useEffect(() => {
    if (scrollAreaRef.current) {
      const sc = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (sc) (sc as HTMLElement).scrollTop = (sc as HTMLElement).scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className={`relative flex flex-col h-full min-h-0 overflow-hidden bg-white text-slate-900 ${className || ""}`}
    >
      {/* Header sin barra (transparente sobre fondo blanco) */}
      <div className="relative z-10 px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <div className="text-center">
            <h2 className="text-sm font-semibold opacity-90">Conversación con IA</h2>
            <p className="text-xs text-muted-foreground">
              {messages.length > 0 ? `${messages.length} mensajes` : "Nueva conversación"}
            </p>
          </div>
          <div className="flex-1 flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={regenerateLastResponse}
              disabled={
                messages.length === 0 ||
                messages[messages.length - 1].role !== "assistant"
              }
              className="hover:bg-black/5"
              aria-label="Regenerar última respuesta"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChat}
              disabled={messages.length === 0}
              className="hover:bg-black/5"
              aria-label="Limpiar chat"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay “Pensando” — cuadrado, más pequeño y un poco arriba */}
      {isGenerating && (
        <div className="thinking-overlay">
          <div className="thinking-card animate-think-in">
            <div className="thinking-aurora">
              <div className="blob a" />
              <div className="blob b" />
              <div className="blob c" />
            </div>
            <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center">
              <span className="text-sm font-semibold text-neutral-800">Pensando…</span>
              <div className="mt-2 flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#9297DB] animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-[#D8AADB] animate-pulse delay-150" />
                <span className="w-2 h-2 rounded-full bg-[#CCC9DC] animate-pulse delay-300" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensajes / Hero */}
      <div className="relative z-10 flex-1 min-h-0">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="space-y-0">
            {messages.length === 0 ? (
              <div className="relative h-[calc(100vh-240px)] flex items-center justify-center px-6">
                <div className="relative max-w-2xl text-center">
                  <div className="inline-flex items-center justify-center mb-6">
                    <img
                      src="/logo-ose-ia.png"
                      alt="OSE IA"
                      className="h-12 w-12 rounded-xl mr-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                    />
                    <span className="text-sm text-slate-500 tracking-wider">
                      OSE · AI Assistant
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-[#9297DB] via-[#D8AADB] to-[#CCC9DC] bg-clip-text text-transparent">
                    El futuro de la asistencia&nbsp;IA
                  </h1>
                  <p className="mt-4 text-base md:text-lg text-slate-500">
                    Bienvenido a OSE IA. Tu conocimiento al alcance de un chat
                    claro, rápido y confiable.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input flotante, centrado y con márgenes laterales más pequeños */}
      <div className="relative z-10">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isGenerating}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}