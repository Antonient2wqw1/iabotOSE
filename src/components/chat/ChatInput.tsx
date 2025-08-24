import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";       // 👈 correcto
import { Textarea } from "../ui/textarea";   // 👈 correcto
import { Send, Paperclip, X } from "lucide-react";
import { cn } from "../../lib/utils";        // 👈 correcto

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isGenerating?: boolean;
  replyTo?: { id: string; content: string } | null;
  onCancelReply?: () => void;
}

const HINTS = [
  "Estoy aquí para ayudarte…",
  "Cuéntame qué necesitas",
  "Describe tu idea o pega texto",
];
const TYPE_SPEED = 50, ERASE_SPEED = 22, WAIT_BEFORE_ERASE = 700;

export function ChatInput({
  onSendMessage, disabled, isGenerating, replyTo, onCancelReply
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // --- Typewriter del placeholder ---
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

  // --- Auto-resize ---
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // --- Focus cuando se habilita ---
  useEffect(() => {
    if (!disabled) requestAnimationFrame(() => textareaRef.current?.focus());
  }, [disabled]);

  // Autofocus al montar
  useEffect(() => { textareaRef.current?.focus(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim();
    if (!text || disabled) return;
    onSendMessage(text);
    setMessage("");
    onCancelReply?.(); // limpia el preview
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }
  };

  return (
    <div className="chat-input-wrap">
      {/* Preview “Respondiendo a …” */}
      {replyTo && (
        <div className="reply-preview mb-2">
          <div>
            <div className="rp-title">Respondiendo a la IA</div>
            <div className="rp-text">{replyTo.content}</div>
          </div>
          <button
            type="button"
            className="rp-close"
            aria-label="Cancelar respuesta"
            onClick={onCancelReply}
            title="Cancelar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="chat-input px-4 py-2">
        <div className="flex items-center gap-3">
          <Button type="button" size="icon" variant="ghost" className="w-8 h-8 icon-ghost">
            <Paperclip className="w-4 h-4" />
          </Button>

          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder=""
              disabled={disabled}
              rows={1}
              className={cn(
                "w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 resize-none",
                "text-[14px] leading-[1.2] text-slate-900 placeholder:text-slate-400",
                "min-h-0 h-[22px]"
              )}
              style={{ minHeight: 0, maxHeight: 120 }}
              aria-label="Escribe tu mensaje"
            />
            {message.trim().length === 0 && displayText && (
              <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-slate-400/90 select-none">
                {displayText}
              </span>
            )}
          </div>

          <Button
            type="submit"
            size="icon"
            disabled={disabled || !message.trim()}
            aria-label="Enviar mensaje"
            onMouseDown={(e) => e.preventDefault()}
            className={cn(
              "relative w-9 h-9 p-0 rounded-full bg-transparent hover:bg-transparent focus-visible:ring-0",
              "disabled:opacity-60 disabled:cursor-not-allowed"
            )}
          >
            <span className="send-sphere" aria-hidden="true">
              <span className="send-core"></span>
            </span>
            <Send className="relative z-10 w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,.35)]" />
          </Button>
        </div>
      </form>

      <div className="input-disclaimer">
        OSE AI puede contener errores; por favor valida la información.
      </div>
    </div>
  );
}