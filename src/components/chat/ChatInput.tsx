import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isGenerating?: boolean;
}

/** 🔧 Config — Frases que rotan y tiempo (ms) */
const HINTS = [
  "Hola soy OSE Assitant :)",
  "¿Puedo ayudarte en algo?",
  "Estoy aquí para ayudarte...",
  "Puedes pedirme lo que quieras...",
  "Estoy listo para ayudarte :)",
];
const TYPE_SPEED = 50; // velocidad de escritura
const ERASE_SPEED = 20; // velocidad de borrado
const WAIT_BEFORE_ERASE = 500; // espera antes de borrar

export function ChatInput({ onSendMessage, disabled, isGenerating }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Estado del "typewriter"
  const [displayText, setDisplayText] = useState("");
  const [hintIndex, setHintIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const charIndex = useRef(0);

  // efecto typewriter
  useEffect(() => {
    if (message.trim().length > 0) {
      setDisplayText(""); // si usuario escribe, ocultamos sugerencia
      return;
    }

    const currentHint = HINTS[hintIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && charIndex.current < currentHint.length) {
      // escribir letras
      timeout = setTimeout(() => {
        setDisplayText(currentHint.slice(0, charIndex.current + 1));
        charIndex.current++;
      }, TYPE_SPEED);
    } else if (!isDeleting && charIndex.current === currentHint.length) {
      // esperar antes de borrar
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, WAIT_BEFORE_ERASE);
    } else if (isDeleting && charIndex.current > 0) {
      // borrar letras
      timeout = setTimeout(() => {
        setDisplayText(currentHint.slice(0, charIndex.current - 1));
        charIndex.current--;
      }, ERASE_SPEED);
    } else if (isDeleting && charIndex.current === 0) {
      // pasar a la siguiente frase
      setIsDeleting(false);
      setHintIndex((prev) => (prev + 1) % HINTS.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, hintIndex, message]);

  // Auto-resize del textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="glass border-t border-border/50 p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Area */}
        <div className="relative">
          <div className="flex items-end gap-3 glass rounded-xl p-3 border border-border/50">
            {/* Attachment Button */}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="w-8 h-8 flex-shrink-0 hover:bg-accent"
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            {/* Input con overlay dinámico */}
            <div className="relative flex-1">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="" // usamos overlay
                disabled={disabled}
                className={cn(
                  "flex-1 min-h-[20px] max-h-[200px] resize-none border-0 bg-transparent",
                  "focus-visible:ring-0 focus-visible:ring-offset-0 p-0",
                  "placeholder:text-muted-foreground"
                )}
                rows={1}
                aria-label="Escribe tu mensaje"
              />

              {/* Overlay animado */}
              {message.trim().length === 0 && displayText && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute left-0 top-1/2 -translate-y-1/2", // 👈 centrado vertical, alineado izquierda
                    "text-muted-foreground/90 select-none"
                  )}
                >
                  {displayText}
                </span>
              )}
            </div>

            {/* Voice/Send Button */}
            <div className="flex gap-2 flex-shrink-0">
              {message.trim() ? (
                <Button
                  type="submit"
                  size="icon"
                  disabled={disabled || !message.trim()}
                  className="w-8 h-8 bg-gradient-primary hover:opacity-90 glow"
                >
                  <Send className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsRecording(!isRecording)}
                  className={cn(
                    "w-8 h-8",
                    isRecording &&
                      "bg-destructive hover:bg-destructive text-destructive-foreground"
                  )}
                >
                  {isRecording ? (
                    <Square className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        {isGenerating && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100" />
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200" />
            </div>
            <span>La IA está escribiendo...</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Presiona{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
              Enter
            </kbd>{" "}
            para enviar,{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
              Shift + Enter
            </kbd>{" "}
            para nueva línea
          </span>
          <span>{message.length}/4000</span>
        </div>
      </form>
    </div>
  );
}