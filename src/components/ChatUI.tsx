import { useEffect, useMemo, useState } from "react";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
};

const keyFor = (sid: string) => `ose:chat:${sid}`;

export default function ChatUI() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyTo, setReplyTo] = useState<{ id: string; content: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Cargar mensajes de una sesión
  const load = (sid: string) => {
    try {
      const raw = localStorage.getItem(keyFor(sid));
      const arr = raw ? (JSON.parse(raw) as Message[]) : [];
      setMessages(Array.isArray(arr) ? arr : []);
    } catch {
      setMessages([]);
    }
  };

  // Guardar mensajes de la sesión activa
  const persist = (sid: string, arr: Message[]) => {
    try {
      localStorage.setItem(keyFor(sid), JSON.stringify(arr));
    } catch {
      // noop
    }
  };

  // Escucha selección de chat desde el Sidebar
  useEffect(() => {
    const onSelect = (e: any) => {
      const id = e?.detail?.id as string;
      if (!id) return;
      setActiveSessionId(id);
      load(id);
      setReplyTo(null);
    };
    const onNew = (e: any) => {
      const id = e?.detail?.id as string;
      if (!id) return;
      setActiveSessionId(id);
      setMessages([]); // chat vacío
      persist(id, []);
      setReplyTo(null);
    };
    window.addEventListener("ose:select-chat", onSelect);
    window.addEventListener("ose:new-chat", onNew);
    return () => {
      window.removeEventListener("ose:select-chat", onSelect);
      window.removeEventListener("ose:new-chat", onNew);
    };
  }, []);

  // Persiste ante cambios
  useEffect(() => {
    if (activeSessionId) persist(activeSessionId, messages);
  }, [messages, activeSessionId]);

  const handleReply = (m: { id: string; content: string }) => setReplyTo(m);

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleSendMessage = async (text: string) => {
    if (!activeSessionId) {
      // si por alguna razón no hay sesión activa aún, crea una “fallBack”
      const newId = String(Date.now());
      setActiveSessionId(newId);
      window.dispatchEvent(new CustomEvent("ose:new-chat", { detail: { id: newId } }));
    }

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

    const timestamp = now();
    const userMsg: Message = { id, content: text, role: "user", timestamp };
    setMessages((prev) => [...prev, userMsg]);

    // si es el primer mensaje de usuario en esta sesión, renombra en el Sidebar
    const hadUserBefore = useMemo(
      () => messages.some((m) => m.role === "user"),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );
    if (!hadUserBefore) {
      const title = text.replace(/\s+/g, " ").trim();
      if (title) {
        const safe = title.length > 48 ? title.slice(0, 48) + "…" : title;
        window.dispatchEvent(
          new CustomEvent("ose:update-session-title", {
            detail: { id: activeSessionId ?? localStorage.getItem("ose:last") ?? "", title: safe },
          })
        );
      }
    }

    setReplyTo(null);
    setIsGenerating(true);
    // Aquí iría tu llamada a backend / streaming de AI...
    setIsGenerating(false);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-40">
      <div className="space-y-3">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} onReply={handleReply} />
        ))}
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isGenerating}
        isGenerating={isGenerating}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}