import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: string;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn(
      "flex gap-4 p-6 smooth",
      isUser ? "bg-chat-user/5" : "bg-chat-assistant"
    )}>
      {/* Avatar */}
      <Avatar className={cn(
        "w-8 h-8 flex-shrink-0",
        isUser ? "order-2" : "order-1"
      )}>
        <AvatarImage src={isUser ? undefined : "/ai-avatar.png"} />
        <AvatarFallback className={cn(
          isUser 
            ? "bg-gradient-primary text-white" 
            : "bg-muted text-muted-foreground"
        )}>
          {isUser ? "TU" : "IA"}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn(
        "flex-1 space-y-3",
        isUser ? "order-1" : "order-2"
      )}>
        <div className={cn(
          "prose prose-sm max-w-none",
          isUser ? "text-right" : "text-left"
        )}>
          <div className={cn(
            "inline-block p-4 rounded-xl max-w-[85%]",
            isUser 
              ? "bg-gradient-primary text-white ml-auto" 
              : "bg-card border border-border/50 text-foreground"
          )}>
            <p className="m-0 leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </div>

        {/* Message Actions */}
        {!isUser && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{message.timestamp}</span>
            <div className="flex gap-1 ml-auto">
              <Button size="icon" variant="ghost" className="w-6 h-6 hover:text-foreground">
                <Copy className="w-3 h-3" />
              </Button>
              <Button size="icon" variant="ghost" className="w-6 h-6 hover:text-green-500">
                <ThumbsUp className="w-3 h-3" />
              </Button>
              <Button size="icon" variant="ghost" className="w-6 h-6 hover:text-red-500">
                <ThumbsDown className="w-3 h-3" />
              </Button>
              <Button size="icon" variant="ghost" className="w-6 h-6 hover:text-foreground">
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}