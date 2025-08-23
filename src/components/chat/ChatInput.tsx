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

export function ChatInput({ onSendMessage, disabled, isGenerating }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="glass border-t border-border/50 p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Area */}
        <div className="relative">
          <div className="flex items-end gap-3 glass rounded-xl p-3 border border-border/50">
            {/* Attachment Button */}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="w-8 h-8 flex-shrink-0 hover:bg-accent"
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            {/* Text Input */}
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje aquí..."
              disabled={disabled}
              className={cn(
                "flex-1 min-h-[20px] max-h-[200px] resize-none border-0 bg-transparent",
                "focus-visible:ring-0 focus-visible:ring-offset-0 p-0",
                "placeholder:text-muted-foreground"
              )}
              rows={1}
            />

            {/* Voice/Send Button */}
            <div className="flex gap-2 flex-shrink-0">
              {message.trim() ? (
                <Button
                  type="submit"
                  size="icon"
                  disabled={disabled || !message.trim()}
                  className="w-8 h-8 bg-gradient-primary hover:opacity-90 glow"
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
                    "w-8 h-8",
                    isRecording && "bg-destructive hover:bg-destructive text-destructive-foreground"
                  )}
                >
                  {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        {isGenerating && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100" />
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200" />
            </div>
            <span>La IA está escribiendo...</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Presiona <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">Enter</kbd> para enviar, <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">Shift + Enter</kbd> para nueva línea
          </span>
          <span>{message.length}/4000</span>
        </div>
      </form>
    </div>
  );
}