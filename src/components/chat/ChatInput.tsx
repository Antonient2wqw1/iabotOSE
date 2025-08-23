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

const HINTS = [
  "Estoy aquí para ayudarte…",
  "¿Qué construimos hoy?",
  "Pregúntame lo que quieras…",
  "Hola, soy OSE Assistant :)",
];
const TYPE_SPEED = 50;
const ERASE_SPEED = 20;
const WAIT_BEFORE_ERASE = 500;

export function ChatInput({ onSendMessage, disabled, isGenerating }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [displayText, setDisplayText] = useState("");
  const [hintIndex, setHintIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const charIndex = useRef(0);

  useEffect(() => {
    if (message.trim().length > 0) {
      setDisplayText("");
      return;
    }
    const currentHint = HINTS[hintIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && charIndex.current < currentHint.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentHint.slice(0, charIndex.current + 1));
        charIndex.current++;
      }, TYPE_SPEED);
    } else if (!isDeleting && charIndex.current === currentHint.length) {
      timeout = setTimeout(() => setIsDeleting(true), WAIT_BEFORE_ERASE);
    } else if (isDeleting && charIndex.current > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentHint.slice(0, charIndex.current - 1));
        charIndex.current--;
      }, ERASE_SPEED);
    } else if (isDeleting && charIndex.current === 0) {
      setIsDeleting(false);
      setHintIndex((prev) => (prev + 1) % HINTS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, hintIndex, message]);

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
    <div className="px-4 pb-6 pt-2">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* caja flotante centrada y estrecha */}
        <div className="relative max-w-3xl mx-auto">
          <div
            className={cn(
              "flex items-end gap-3 rounded-2xl p-2 border",
              "bg-black/5 backdrop-blur-sm border-black/10",
              "shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            )}
            style={{ WebkitBackdropFilter: "blur(6px)" }}
          >
            {/* Adjuntos */}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="w-8 h-8 flex-shrink-0 hover:bg-black/10"
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            {/* Textarea + hint */}
            <div className="relative flex-1">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder=""
                disabled={disabled}
                className={cn(
                  "flex-1 min-h-[20px] max-h-[200px] resize-none border-0 bg-transparent",
                  "focus-visible:ring-0 focus-visible:ring-offset-0 p-0",
                  "text-slate-900 placeholder:text-slate-400"
                )}
                rows={1}
                aria-label="Escribe tu mensaje"
              />
              {message.trim().length === 0 && displayText && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute left-0 top-1/2 -translate-y-1/2",
                    "text-slate-400 select-none"
                  )}
                >
                  {displayText}
                </span>
              )}
            </div>

            {/* Voice / Send */}
            <div className="flex gap-2 flex-shrink-0">
              {message.trim() ? (
                <Button
                  type="submit"
                  size="icon"
                  disabled={disabled || !message.trim()}
                  className="w-8 h-8 bg-gradient-primary hover:opacity-90 shadow"
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
                    "w-8 h-8 hover:bg-black/10",
                    isRecording && "bg-destructive text-destructive-foreground"
                  )}
                >
                  {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer (mismo ancho que el input) */}
        <div className="max-w-3xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <span>
            Presiona{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
              Enter
            </kbd>{" "}
            para enviar,{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
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