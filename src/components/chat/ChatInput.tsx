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
  "Cuéntame qué necesitas",
  "Describe tu idea o pega texto",
];
const TYPE_SPEED = 50, ERASE_SPEED = 22, WAIT_BEFORE_ERASE = 700;

export function ChatInput({ onSendMessage, disabled, isGenerating }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // typewriter
  const [displayText, setDisplayText] = useState("");
  const [hintIndex, setHintIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const charIndex = useRef(0);

  useEffect(() => {
    if (message.trim().length > 0) { setDisplayText(""); return; }
    const t = HINTS[hintIndex]; let id: any;
    if (!isDeleting && charIndex.current < t.length) {
      id = setTimeout(() => setDisplayText(t.slice(0, ++charIndex.current)), TYPE_SPEED);
    } else if (!isDeleting && charIndex.current === t.length) {
      id = setTimeout(() => setIsDeleting(true), WAIT_BEFORE_ERASE);
    } else if (isDeleting && charIndex.current > 0) {
      id = setTimeout(() => setDisplayText(t.slice(0, --charIndex.current)), ERASE_SPEED);
    } else if (isDeleting && charIndex.current === 0) {
      setIsDeleting(false); setHintIndex((p) => (p + 1) % HINTS.length);
    }
    return () => clearTimeout(id);
  }, [displayText, isDeleting, hintIndex, message]);

  // autoresize
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
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }
  };

  return (
    <div className="chat-input-wrap">
      {/* compacta: menos padding y sin altura mínima grande */}
      <form onSubmit={handleSubmit} className="chat-input px-4 py-2">
        <div className="flex items-center gap-3">
          {/* adjuntar (ícono gris) */}
          <Button type="button" size="icon" variant="ghost" className="w-8 h-8 icon-ghost">
            <Paperclip className="w-4 h-4" />
          </Button>

          {/* textarea compacto */}
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder=""
              disabled={disabled}
              rows={1}
              className={cn(
                "w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 resize-none",
                "text-[14px] leading-[1.2] text-slate-900 placeholder:text-slate-400",
                // ↓ anulamos la min-height de shadcn y damos alto base pequeño
                "min-h-0 h-[22px]"
              )}
              style={{ minHeight: 0, maxHeight: 120 }}
              aria-label="Escribe tu mensaje"
            />
            {message.trim().length === 0 && displayText && (
              <span
                className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-slate-400/90 select-none"
                aria-hidden="true"
              >
                {displayText}
              </span>
            )}
          </div>

          {/* mic / enviar */}
          {message.trim() ? (
            <Button type="submit" size="icon" className="w-8 h-8 bg-slate-900 text-white hover:opacity-90">
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => setIsRecording(!isRecording)}
              className={cn("w-8 h-8", isRecording && "bg-red-500 text-white")}
            >
              {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </form>

      <div className="input-disclaimer">
        OSE AI puede contener errores; por favor valida la información.
      </div>
    </div>
  );
}