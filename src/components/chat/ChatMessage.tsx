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
      {/* Avatar IA */}
      {!isUser && (
        <div className="mr-2 mt-1 shrink-0">
          <img src="/logo-ose-ia.png" alt="OSE IA" className="h-8 w-8 rounded-lg shadow-md" />
        </div>
      )}

      {/* Burbuja (estilo previo) */}
      <div
        className={cn(
          "relative px-4 py-3 max-w-[78%] bubble transition-transform duration-300",
          isUser ? "bubble-user rounded-br-md" : "bubble-ai rounded-bl-md"
        )}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words selection:bg-slate-200">
          {message.content}
        </div>

        <div
          className={cn(
            "absolute -bottom-5 text-[11px] tracking-wide",
            isUser ? "right-1 text-slate-400" : "left-1 text-slate-400"
          )}
        >
          {message.timestamp}
        </div>

        <span className="bubble-sheen" />
      </div>

      {/* Avatar USER */}
      {isUser && (
        <div className="ml-2 mt-1 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-slate-900 text-white grid place-items-center text-[11px] font-semibold">
            TU
          </div>
        </div>
      )}
    </div>
  );
}