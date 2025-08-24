import { useState } from "react";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
};

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "a1",
      content: "¡Hola! Soy OSE AI. ¿En qué te ayudo?",
      role: "assistant",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // Preview del mensaje al que vas a responder
  const [replyTo, setReplyTo] = useState<{ id: string; content: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleReply = (m: { id: string; content: string }) => setReplyTo(m);

  const handleSendMessage = async (text: string) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [
      ...prev,
      { id, content: text, role: "user", timestamp: now },
    ]);

    // Aquí podrías enviar replyTo?.id a tu backend si lo necesitas
    setReplyTo(null);

    setIsGenerating(true);
    // ... llamada a tu backend / streaming ...
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