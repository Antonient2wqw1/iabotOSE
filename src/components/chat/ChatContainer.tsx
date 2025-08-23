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

const mockMessages: Message[] = [
  { id: "1", content: "Hola, soy tu asistente de IA. ¿En qué puedo ayudarte hoy?", role: "assistant", timestamp: "09:00" },
  { id: "2", content: "¿Podrías explicarme qué son los React hooks y cuáles son los más importantes?", role: "user", timestamp: "09:01" },
  { id: "3", content: "¡Por supuesto! ...", role: "assistant", timestamp: "09:02" }
];

export function ChatContainer({ className }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    };
    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    // Simulación de respuesta de IA
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Esta es una respuesta simulada de la IA. En una implementación real, aquí se conectaría con tu modelo de IA.",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsGenerating(false); // activa el fade-out suave por CSS
    }, 2000);
  };

  const clearChat = () => setMessages([]);
  const regenerateLastResponse = () => {
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      setMessages(prev => prev.slice(0, -1));
      setIsGenerating(true);
      setTimeout(() => {
        const newResponse: Message = {
          id: Date.now().toString(),
          content: "Esta es una nueva respuesta regenerada. ...",
          role: "assistant",
          timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
        };
        setMessages(prev => [...prev, newResponse]);
        setIsGenerating(false);
      }, 2000);
    }
  };

  // Auto-scroll al fondo
  useEffect(() => {
    if (scrollAreaRef.current) {
      const sc = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (sc) (sc as HTMLElement).scrollTop = (sc as HTMLElement).scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`relative flex flex-col h-full min-h-0 overflow-hidden ${className || ""}`}>
      {/* 🌌 AURORA CSS-ONLY (anti-banding). Se activa con isGenerating */}
      <div className={`aurora-css ${isGenerating ? "is-active" : ""}`}>
        <div className="aurora-css__layer aurora-css__layer--a" />
        <div className="aurora-css__layer aurora-css__layer--b" />
        <div className="aurora-css__layer aurora-css__layer--c" />
        <div className="aurora-css__grain" />
        <div className="aurora-css__film" />
        <div className="aurora-css__vignette" />
      </div>

      {/* Header */}
      <div className="relative z-10 glass border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Conversación con IA</h2>
            <p className="text-sm text-muted-foreground">
              {messages.length > 0 ? `${messages.length} mensajes` : "Nueva conversación"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={regenerateLastResponse}
              disabled={messages.length === 0 || messages[messages.length - 1].role !== "assistant"}
              className="hover:bg-accent"
              aria-label="Regenerar última respuesta"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChat}
              disabled={messages.length === 0}
              className="hover:bg-accent hover:text-destructive"
              aria-label="Limpiar chat"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="relative z-10 flex-1 min-h-0">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="space-y-0">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full p-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto glow">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">¡Hola! Soy tu asistente de IA</h3>
                    <p className="text-muted-foreground max-w-md">
                      Estoy aquí para ayudarte con cualquier pregunta o tarea. ¿En qué puedo asistirte hoy?
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => <ChatMessage key={message.id} message={message} />)
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
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