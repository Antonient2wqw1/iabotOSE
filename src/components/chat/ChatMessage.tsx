import { cn } from "@/lib/utils";
import { Card, renderCard } from "@/components/cards/RichCards";


type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  cards?: Card[];            
};

export function ChatMessage({
  message,
  onReply,
}: {
  message: Message;
  onReply?: (m: { id: string; content: string }) => void;
}) {
  const isUser = message.role === "user";

  return (
    <div className={cn("msg-in flex w-full", isUser ? "justify-end" : "justify-start")}>
      {/* Avatar IA — esfera animada */}
      {!isUser && (
        <div className="mr-2 mt-1 shrink-0">
          <div className="avatar-sphere" aria-hidden>
            <span className="avatar-core" />
          </div>
        </div>
      )}

      {/* Columna: burbuja + hora + chip + cards */}
      <div className={cn("flex flex-col flex-1 min-w-0", isUser ? "items-end" : "items-start")}>
        {/* Burbuja de texto (si hay) */}
        {message.content && (
          <div
            className={cn(
              "relative bubble transition-transform duration-300",
              "inline-flex flex-none w-auto max-w-[86%] sm:max-w-[70%] px-4 py-3",
              isUser ? "bubble-user rounded-br-md" : "bubble-ai rounded-bl-md"
            )}
          >
            <div className="text-sm leading-relaxed whitespace-pre-wrap break-words selection:bg-slate-200">
              {message.content}
            </div>
            <span className="bubble-sheen" />
          </div>
        )}

        {/* Hora */}
        <div
          className={cn(
            "mt-1 text-[11px] tracking-wide text-slate-400",
            isUser ? "self-end pr-1" : "self-start pl-1"
          )}
        >
          {message.timestamp}
        </div>

        {/* Botón Responder (solo IA) */}
        {!isUser && (
          <button
            type="button"
            className="reply-chip mt-1 ml-1"
            onClick={() => onReply?.({ id: message.id, content: message.content })}
            aria-label="Responder a este mensaje"
          >
            ↩︎ Responder
          </button>
        )}

        {/* Cards ricas (solo si vienen) */}
        {!isUser && message.cards && message.cards.length > 0 && (
          <div className="mt-3 flex flex-col gap-3 w-full max-w-[760px]">
            {message.cards.map((c, i) => (
              <div key={i}>{renderCard(c)}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}