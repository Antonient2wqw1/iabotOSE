import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Plus,
  Settings,
  Menu,
  History,
  Trash2,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  isActive?: boolean;
}

const mockSessions: ChatSession[] = [
  { id: "1", title: "Explicación de React hooks", timestamp: "Hace 2 horas", isActive: true },
  { id: "2", title: "Optimización de rendimiento", timestamp: "Ayer", isActive: false },
  { id: "3", title: "Patrones de diseño en JS", timestamp: "Hace 3 días", isActive: false },
  { id: "4", title: "Testing con Jest", timestamp: "Hace 1 semana", isActive: false },
];

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sessions] = useState<ChatSession[]>(mockSessions);

  return (
    <div
      className={cn(
        "glass border-r flex flex-col h-full smooth transition-all duration-300",
        isCollapsed ? "w-16" : "w-80",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          {/* Logo + título */}
          <div className="flex items-center gap-3">
            <img
              src="/logo-ose-ia.png"
              alt="AI Chat"
              className={cn(
                "object-contain glow",
                isCollapsed ? "h-8 w-8 rounded-lg" : "h-7 w-7 rounded-md"
              )}
            />
            {!isCollapsed && (
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AI Chat
              </h1>
            )}
          </div>

          {/* Botón de colapsar/expandir */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-accent"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          className={cn(
            "w-full justify-start gap-3 bg-gradient-primary hover:opacity-90 glow",
            isCollapsed && "px-2"
          )}
        >
          <Plus className="w-4 h-4" />
          {!isCollapsed && "Nueva conversación"}
        </Button>
      </div>

      {/* Chat History */}
      {!isCollapsed && (
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <History className="w-4 h-4" />
              <span>Historial</span>
            </div>
          </div>

          <ScrollArea className="flex-1 px-2">
            <div className="space-y-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "group flex items-center gap-3 p-3 rounded-lg smooth cursor-pointer",
                    session.isActive
                      ? "bg-accent border border-primary/20"
                      : "hover:bg-accent/50"
                  )}
                >
                  <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {session.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.timestamp}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1 smooth">
                    <Button size="icon" variant="ghost" className="w-6 h-6">
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-6 h-6 hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Settings */}
      <div className="p-4 border-t border-border/50">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
            isCollapsed && "px-2"
          )}
        >
          <Settings className="w-4 h-4" />
          {!isCollapsed && "Configuración"}
        </Button>
      </div>
    </div>
  );
}
