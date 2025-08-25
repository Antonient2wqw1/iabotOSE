import { cn } from "@/lib/utils";
import { Card, renderCard } from "@/components/cards/RichCards";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CornerUpLeft } from "lucide-react";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  cards?: Card[];
  replyToId?: string;
};

type ReplyRef = { id: string; content: string; role: "user" | "assistant" } | null;

export function ChatMessage({
  message,
  repliedTo,
  onReply,
}: {
  message: Message;
  repliedTo?: ReplyRef;
  onReply?: (m: { id: string; content: string }) => void;
}) {
  const isUser = message.role === "user";

  // === Markdown “revista” para IA (sin marco/fondo)
  const mdComponents = {
    h1: (props: any) => (
      <h1
        {...props}
        className={cn(
          "text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.08] tracking-tight uppercase",
          "bg-gradient-to-b from-slate-100 to-slate-300/80 dark:from-white dark:to-slate-300/80 bg-clip-text text-transparent mb-3"
        )}
      />
    ),
    h2: (props: any) => (
      <h2
        {...props}
        className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight uppercase bg-gradient-to-b from-slate-100 to-slate-300/80 bg-clip-text text-transparent mt-6 mb-2"
      />
    ),
    h3: (props: any) => (
      <h3 {...props} className="text-lg md:text-xl font-semibold leading-snug mt-5 mb-2 text-slate-100" />
    ),
    p: (props: any) => (
      <p {...props} className="text-[15px] md:text-[16px] leading-7 text-slate-200/95 mb-3 whitespace-pre-wrap" />
    ),
    ul: (props: any) => <ul {...props} className="my-3 pl-5 space-y-1 text-slate-200/95 list-disc" />,
    ol: (props: any) => <ol {...props} className="my-3 pl-5 space-y-1 text-slate-200/95 list-decimal" />,
    li: (props: any) => <li {...props} className="leading-7" />,
    a: (props: any) => (
      <a {...props} className="underline decoration-dotted underline-offset-4 hover:decoration-solid text-slate-100" target="_blank" rel="noreferrer" />
    ),
    blockquote: (props: any) => (
      <blockquote {...props} className="my-4 border-l-2 pl-3 italic text-slate-200/90 border-slate-500/30" />
    ),
    hr: () => <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />,
    code: ({ inline, className, children, ...rest }: any) => {
      if (inline) {
        return (
          <code {...rest} className={cn("rounded px-1.5 py-0.5 text-[12.5px] bg-white/10 text-slate-100", className)}>
            {children}
          </code>
        );
      }
      return (
        <pre className="my-3 rounded-lg overflow-x-auto bg-white/5 ring-1 ring-white/10">
          <code className={cn("block text-[13px] leading-6 p-3 text-slate-100", className)} {...rest}>
            {children}
          </code>
        </pre>
      );
    },
  };

  // === util: snippet una línea (estilo ChatGPT)
  const oneLine = (t: string, n = 240) => {
    const s = t.replace(/\s+/g, " ").trim();
    return s.length > n ? s.slice(0, n) + "…" : s;
  };

  // === auto-headline (si primer párrafo parece título)
  const autoHeadline = (() => {
    if (isUser) return null;
    const raw = message.content || "";
    if (raw.trimStart().startsWith("#")) return null;
    const paras = raw.trim().split(/\n{2,}/);
    const first = (paras[0] || "").trim();
    const isCandidate = first.length >= 12 && first.length <= 60 && !/[.!?]$/.test(first);
    if (!isCandidate || paras.length < 2) return null;
    return { headline: first.toUpperCase(), body: paras.slice(1).join("\n\n") };
  })();

  // === componente: “En respuesta a …” plano (sin pill)
  const ReplyInline = ({ text, className = "" }: { text: string; className?: string }) => (
    <div className={cn("mb-2 text-xs text-slate-300/80 flex items-start gap-2 min-w-0", className)}>
      <CornerUpLeft className="h-4 w-4 mt-0.5 opacity-60 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap" title={text}>
          {text}
        </div>
      </div>
    </div>
  );

  // ===== USUARIO =====
  if (isUser) {
    const replying = Boolean(repliedTo);

    // RESPONDIENDO a la IA → burbuja compacta, legible, con radio un poco mayor (18px)
    if (replying) {
      return (
        <div className="msg-in flex w-full justify-end">
          <div className="flex flex-col flex-1 min-w-0 items-end">
            <div
              className={cn(
                "relative inline-block align-top w-auto max-w-[86%] sm:max-w-[70%] px-4 py-3",
                "bg-gradient-to-b from-slate-900/85 to-slate-800/70 ring-1 ring-white/10",
                "rounded-[18px]", // ⬅️ más redondeado, sin llegar a pill
                "overflow-hidden"
              )}
            >
              <div className="text-sm leading-relaxed break-words selection:bg-slate-200 min-w-0 text-slate-100">
                {repliedTo && <ReplyInline text={oneLine(repliedTo!.content, 200)} className="mb-1" />}
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>

            <div className="mt-1 text-[11px] tracking-wide text-slate-400 self-end pr-1">
              {message.timestamp}
            </div>
          </div>
        </div>
      );
    }

    // NO es respuesta → burbuja original
    return (
      <div className="msg-in flex w-full justify-end">
        <div className="flex flex-col flex-1 min-w-0 items-end">
          {message.content && (
            <div
              className={cn(
                "relative bubble transition-transform duration-300",
                "inline-flex flex-none w-auto max-w-[86%] sm:max-w-[70%] px-4 py-3",
                "bubble-user rounded-br-md"
              )}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap break-words selection:bg-slate-200">
                {message.content}
              </div>
              <span className="bubble-sheen" />
            </div>
          )}
          <div className="mt-1 text-[11px] tracking-wide text-slate-400 self-end pr-1">
            {message.timestamp}
          </div>
        </div>
      </div>
    );
  }

  // ===== ASISTENTE → artículo + reply inline arriba (sin contornos) + cards
  const bodyForMd = autoHeadline ? autoHeadline.body : message.content;

  return (
    <div className="msg-in flex w-full justify-start">
      <div className="flex flex-col flex-1 min-w-0 items-start w-full">
        <div className="w-full">
          <div className="max-w-3xl">
            {repliedTo && <ReplyInline text={oneLine(repliedTo.content, 200)} className="pl-0" />}

            <article
              className={cn(
                "ai-article relative bg-transparent border-0 shadow-none text-slate-200",
                "first:[&>p]:text-[16px] md:first:[&>p]:text-[17px] first:[&>p]:leading-7 first:[&>p]:text-slate-100"
              )}
            >
              {autoHeadline && (
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.08] tracking-tight uppercase bg-gradient-to-b from-slate-100 to-slate-300/80 bg-clip-text text-transparent mb-3">
                  {autoHeadline.headline}
                </h1>
              )}
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {bodyForMd}
              </ReactMarkdown>
            </article>

            <div className="mt-2 flex items-center gap-3">
              <div className="text-[11px] tracking-wide text-slate-400 pl-1">{message.timestamp}</div>
              <button
                type="button"
                className="reply-chip"
                onClick={() => onReply?.({ id: message.id, content: message.content })}
                aria-label="Responder a este mensaje"
              >
                ↩︎ Responder
              </button>
            </div>

            {message.cards && message.cards.length > 0 && (
              <div className="mt-4 flex flex-col gap-3 w-full max-w-[760px] not-prose relative isolate overflow-visible">
                {message.cards.map((c, i) => (
                  <div key={i}>{renderCard(c)}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}