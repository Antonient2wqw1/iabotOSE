import { cn } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
};

export function ChatMessage({ message }: { message: Message }) {
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

      {/* Columna: burbuja + hora */}
      <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
        {/* Burbuja con ancho mínimo y sin shrink */}
        <div
          className={cn(
            "relative px-4 py-3 bubble transition-transform duration-300",
            "shrink-0 min-w-[140px] sm:min-w-[160px] max-w-[78%]",
            isUser ? "bubble-user rounded-br-md" : "bubble-ai rounded-bl-md"
          )}
        >
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words selection:bg-slate-200">
            {message.content}
          </div>
          <span className="bubble-sheen" />
        </div>

        {/* Hora debajo, alineada al lado correspondiente */}
        <div
          className={cn(
            "mt-1 text-[11px] tracking-wide text-slate-400",
            isUser ? "self-end pr-1" : "self-start pl-1"
          )}
        >
          {message.timestamp}
        </div>
      </div>

      {/* (Avatar del usuario eliminado a pedido) */}
    </div>
  );
}