import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, CornerUpLeft, X } from "lucide-react";

type Props = {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  isGenerating?: boolean;
  replyingTo?: { id: string; content: string } | null;
  onClearReply?: () => void;
};

export function ChatInput({
  onSendMessage,
  disabled,
  isGenerating,
  replyingTo,
  onClearReply,
}: Props) {
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    const resize = () => {
      ta.style.height = "0px";
      ta.style.height = Math.min(200, ta.scrollHeight) + "px";
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(ta);
    return () => ro.disconnect();
  }, [value]);

  useEffect(() => {
    taRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isGenerating) requestAnimationFrame(() => taRef.current?.focus());
  }, [isGenerating]);

  const send = () => {
    const text = value.trim();
    if (!text || disabled || isGenerating) return;
    onSendMessage(text);
    setValue("");
    requestAnimationFrame(() => taRef.current?.focus());
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handlePickFile = () => fileRef.current?.click();

  const preview =
    (replyingTo?.content?.replace(/\s+/g, " ").slice(0, 240) ?? "") +
    (replyingTo && replyingTo.content.length > 240 ? "…" : "");

  return (
    <div
      className="
        chat-input w-full
        rounded-[9999px] overflow-hidden         /* pill total + recorta hijos */
        bg-white/95 dark:bg-slate-900/95
        shadow-xl ring-1 ring-black/5 dark:ring-white/10
        backdrop-blur
        px-3 py-2.5                              /* un pelín más alto */
      "
      role="group"
      aria-label="Caja de mensaje"
    >
      {replyingTo && (
        <div
          className="
            mb-2 flex items-start gap-2
            rounded-xl
            bg-slate-100/70 dark:bg-slate-800/60
            ring-1 ring-slate-200/70 dark:ring-slate-700/60
            px-3 py-2
          "
        >
          <CornerUpLeft className="h-4 w-4 mt-0.5 opacity-70" />
          <div className="text-sm leading-snug text-slate-800 dark:text-slate-100 flex-1 min-w-0">
            <span className="block truncate">{preview}</span>
          </div>
          <button
            type="button"
            onClick={onClearReply}
            className="p-1 rounded-md hover:bg-slate-200/70 dark:hover:bg-slate-700/60"
            aria-label="Cancelar respuesta"
            title="Cancelar respuesta"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Fila principal */}
      <div className="flex items-end gap-2">
        {/* Adjuntar */}
        <button
          type="button"
          onClick={handlePickFile}
          className="shrink-0 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Adjuntar"
          title="Adjuntar"
        >
          <Paperclip className="h-5 w-5 opacity-70" />
        </button>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={() => {}}
        />

        {/* Textarea */}
        <div className="flex-1 min-w-0">
          <textarea
            ref={taRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Pregunta lo que quieras"
            className="
              w-full resize-none bg-transparent outline-none
              text-[15px] leading-6
              placeholder:text-slate-400 dark:placeholder:text-slate-500
            "
            disabled={disabled || isGenerating}
          />
        </div>

        {/* Enviar */}
        <button
          type="button"
          onClick={send}
          disabled={!value.trim() || disabled || isGenerating}
          className="
            shrink-0 h-9 w-9 rounded-full
            flex items-center justify-center
            transition
            disabled:opacity-50 disabled:cursor-not-allowed
            bg-gradient-to-br from-rose-300 to-pink-400 text-white
            hover:saturate-125
          "
          aria-label="Enviar"
          title="Enviar"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;