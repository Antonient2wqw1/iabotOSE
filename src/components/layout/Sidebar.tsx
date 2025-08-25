// sidebar.tsx
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  Plus,
  Settings,
  History,
  Trash2,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ================== KILL SWITCH ==================
   Pon esto en true si quieres volver a mostrar el sidebar.
   En false, el componente Sidebar retorna null (no se pinta).
=================================================== */
const SIDEBAR_ENABLED = false;

interface SidebarProps {
  className?: string;
  onNewChat?: () => void;
  onSelectChat?: (id: string) => void;
  onRenameChat?: (id: string) => void;
  onDeleteChat?: (id: string) => void;
  onStarToggle?: (id: string) => void;
}

interface ChatSession {
  id: string;
  title: string;
  timestampISO: string;
  isActive?: boolean;
  starred?: boolean;
  unread?: number;
  preview?: string;
  folder?: string | null;
}

// DEMO: nadie activo al inicio
const mockSessions: ChatSession[] = [
  { id: "1", title: "Explicación de React hooks", preview: "useState, useEffect, custom hooks…", timestampISO: new Date().toISOString(), starred: false, unread: 2 },
  { id: "2", title: "Optimización de rendimiento", preview: "Memorizar componentes y memoization…", timestampISO: new Date(Date.now() - 3 * 3600e3).toISOString(), starred: true },
  { id: "3", title: "Patrones de diseño en JS", preview: "Factory, Strategy y Observer…", timestampISO: new Date(Date.now() - 2 * 86400e3).toISOString() },
  { id: "4", title: "Testing con Jest", preview: "Matchers, spies y coverage…", timestampISO: new Date(Date.now() - 7 * 86400e3).toISOString() },
];

type Section = { label: "Hoy" | "Anteriores"; items: ChatSession[] };

// Solo HOY y ANTERIORES
function groupByDate(items: ChatSession[]): Section[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const today = items.filter((i) => new Date(i.timestampISO).getTime() >= startOfToday);
  const older = items.filter((i) => new Date(i.timestampISO).getTime() < startOfToday);

  const sections: Section[] = [];
  if (today.length) sections.push({ label: "Hoy", items: today });
  if (older.length) sections.push({ label: "Anteriores", items: older });
  return sections;
}

/* ======== EXPORT PÚBLICO: apaga/enciende el sidebar ======== */
export function Sidebar(props: SidebarProps) {
  if (!SIDEBAR_ENABLED) return null; // 🔇 apagado total
  return <LegacySidebar {...props} />;
}

/* ======== IMPLEMENTACIÓN ORIGINAL (preservada) ======== */
function LegacySidebar({
  className,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onStarToggle,
}: SidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(mockSessions);
  const [q, setQ] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Renombrar cuando ChatContainer avisa el primer mensaje del usuario
  useEffect(() => {
    const onTitle = (e: any) => {
      const { id, title } = e?.detail || {};
      if (!id || !title) return;
      setSessions((prev) =>
        prev.map((s) => (s.id === id && s.title === "Nueva conversación" ? { ...s, title } : s))
      );
    };
    window.addEventListener("ose:update-session-title", onTitle);
    return () => window.removeEventListener("ose:update-session-title", onTitle);
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return sessions;
    return sessions.filter(
      (s) =>
        s.title.toLowerCase().includes(needle) ||
        (s.preview?.toLowerCase().includes(needle) ?? false)
    );
  }, [q, sessions]);

  const sections = useMemo(() => groupByDate(filtered), [filtered]);

  // Selecciona por id y deselecciona el resto
  const setActiveById = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => ({
        ...s,
        isActive: s.id === id,
      }))
    );
  };

  const handleSelectChat = (id: string) => {
    setActiveById(id);
    onSelectChat?.(id);
    window.dispatchEvent(new CustomEvent("ose:select-chat", { detail: { id } }));
  };

  // Si la conversación saliente aún se llama "Nueva conversación", intenta renombrarla con el 1er mensaje
  const titleFromStorage = (sid: string): string | null => {
    try {
      const raw = localStorage.getItem(`ose:chat:${sid}`);
      if (!raw) return null;
      const msgs = JSON.parse(raw) as { role: string; content: string }[];
      const firstUser = msgs.find((m) => m.role === "user");
      if (!firstUser?.content) return null;
      const t = firstUser.content.replace(/\s+/g, " ").trim();
      return t ? (t.length > 48 ? t.slice(0, 48) + "…" : t) : null;
    } catch {
      return null;
    }
  };

  // NUEVA CONVERSACIÓN
  const handleNewChat = () => {
    const nowISO = new Date().toISOString();
    const newId = String(Date.now());

    setSessions((prev) => {
      // desactivar la actual y actualizar timestamp; renombrar si procede
      const updated = prev.map((s) => {
        if (!s.isActive) return s;
        let nextTitle = s.title;
        if (nextTitle === "Nueva conversación") {
          const fromStore = titleFromStorage(s.id);
          if (fromStore) nextTitle = fromStore;
        }
        return { ...s, isActive: false, timestampISO: nowISO, title: nextTitle };
      });

      const newChat: ChatSession = {
        id: newId,
        title: "Nueva conversación",
        timestampISO: nowISO,
        isActive: true,
        preview: "",
        starred: false,
        unread: 0,
      };

      return [newChat, ...updated];
    });

    onNewChat?.();
    onSelectChat?.(newId);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("ose:new-chat", { detail: { id: newId } }));
      window.dispatchEvent(new CustomEvent("ose:select-chat", { detail: { id: newId } }));
    }, 0);
  };

  const handleDelete = (id: string) => {
    setSessions((prev) => {
      const wasActive = prev.find((s) => s.id === id)?.isActive;
      const next = prev.filter((s) => s.id !== id);
      if (wasActive && next.length) {
        next[0] = { ...next[0], isActive: true };
        onSelectChat?.(next[0].id);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("ose:select-chat", { detail: { id: next[0].id } }));
        }, 0);
      }
      return next;
    });
    onDeleteChat?.(id);
  };

  const handleStarToggle = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, starred: !s.starred } : s))
    );
    onStarToggle?.(id);
  };

  return (
    <div
      className={cn(
        "border-r flex flex-col h-full transition-all duration-300",
        "bg-[hsl(var(--background))]/70 backdrop-blur-xl border-white/5",
        isCollapsed ? "w-14" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo-ose-ia.png"
              alt="AI Chat"
              className={cn("object-contain", isCollapsed ? "h-7 w-7 rounded-lg" : "h-6 w-6 rounded-md")}
            />
            {!isCollapsed && (
              <h1 className="text-[13px] font-semibold bg-gradient-primary bg-clip-text text-transparent leading-tight">
                AI Chat
              </h1>
            )}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCollapsed((v) => !v)}
                  className="h-7 w-7 hover:bg-white/5 rounded-xl"
                >
                  {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isCollapsed ? "Expandir" : "Colapsar"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* New Chat + Search */}
      <div className="px-3 py-2 space-y-1">
        <Button
          onClick={handleNewChat}
          className={cn(
            "w-full justify-start gap-2 bg-gradient-primary hover:opacity-90 rounded-lg shadow-sm h-8",
            isCollapsed && "px-2"
          )}
        >
          <Plus className="w-4 h-4" />
          {!isCollapsed && "Nueva conversación"}
        </Button>

        {!isCollapsed ? (
          <div className="relative">
            <Search className="absolute left-2 top-1.5 h-4 w-4 opacity-60" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar…"
              className="pl-7 h-8 rounded-md bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-[hsl(var(--primary))]"
            />
          </div>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full rounded-md h-8">
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Buscar</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Historial */}
      {!isCollapsed && (
        <div className="px-3 pb-0.5 mb-3">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 leading-none">
            <History className="w-3.5 h-3.5" />
            <span>Historial</span>
          </div>
        </div>
      )}

      <ScrollArea className={cn("flex-1", isCollapsed ? "px-1.5" : "px-2")}>
        <div className="pt-1 pb-2">
          {sections.map((section, si) => (
            <div key={si} className="mb-1">
              {!isCollapsed && (
                <div className="text-[10px] uppercase tracking-wide text-slate-500 px-0.5 mb-1">
                  {section.label}
                </div>
              )}

              {/* Lista compacta */}
              <div className="space-y-0">
                {section.items.map((s) =>
                  isCollapsed ? (
                    <CollapsedRow
                      key={s.id}
                      item={s}
                      onSelect={() => handleSelectChat(s.id)}
                      onRename={() => onRenameChat?.(s.id)}
                      onDelete={() => handleDelete(s.id)}
                      onStarToggle={() => handleStarToggle(s.id)}
                    />
                  ) : (
                    <FullRow
                      key={s.id}
                      item={s}
                      onSelect={() => handleSelectChat(s.id)}
                      onRename={() => onRenameChat?.(s.id)}
                      onDelete={() => handleDelete(s.id)}
                      onStarToggle={() => handleStarToggle(s.id)}
                    />
                  )
                )}
              </div>
            </div>
          ))}

          {!sections.length && (
            <div className="text-sm text-slate-500 px-1 py-6">
              {q ? "Sin resultados." : "Aún no hay conversaciones. Crea tu primer chat."}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Settings */}
      <div className="px-3 py-2 border-t border-white/5">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-slate-500 hover:text-white rounded-lg h-8",
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

function FullRow({
  item,
  onSelect,
  onRename,
  onDelete,
  onStarToggle,
}: {
  item: ChatSession;
  onSelect?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onStarToggle?: () => void;
}) {
  const LeftIcon = item.starred ? Star : MessageSquare;
  const leftClass = item.starred ? "text-yellow-400" : "text-white/60";

  return (
    <div
      className={cn(
        "relative isolate group overflow-hidden hover:z-20 w-full rounded-md text-left leading-tight",
        item.isActive
          ? "bg-white/10 border border-white/15"
          : "bg-white/5 hover:bg-white/10 border border-white/10"
      )}
    >
      {/* Luces altas (vertical) */}
      <span className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="spectra-bg absolute inset-x-4 -inset-y-8 rotate-6" />
      </span>

      <button
        onClick={onSelect}
        className="relative z-10 w-full flex items-center gap-2 py-[0.475rem] px-2 rounded-md"
      >
        <LeftIcon className={cn("h-4 w-4", leftClass)} />
        <div className="min-w-0 flex-1 flex items-center gap-2">
          <div className="text-[12px] font-medium truncate leading-tight">{item.title}</div>
          {item.folder && (
            <Badge variant="secondary" className="bg-white/10 border-white/10 rounded-xl h-4 px-1 text-[10px]">
              {item.folder}
            </Badge>
          )}
        </div>
        {item.unread ? (
          <Badge className="h-4 px-1.5 rounded-full text-[10px] leading-none">{item.unread}</Badge>
        ) : null}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="absolute right-1 top-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10"
            aria-label="Opciones"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-52">
          <DropdownMenuItem onClick={onRename}>Renombrar</DropdownMenuItem>
          <DropdownMenuItem onClick={onStarToggle}>
            {item.starred ? "Quitar destacado" : "Marcar como destacado"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-red-500">
            <Trash2 className="h-4 w-4 mr-2" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function CollapsedRow({
  item,
  onSelect,
  onRename,
  onDelete,
  onStarToggle,
}: {
  item: ChatSession;
  onSelect?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onStarToggle?: () => void;
}) {
  const LeftIcon = item.starred ? Star : MessageSquare;
  const leftClass = item.starred ? "text-yellow-400" : "text-white/60";

  return (
    <div
      className={cn(
        "relative isolate group overflow-hidden hover:z-20 w-full rounded-md",
        item.isActive
          ? "bg-white/10 border border-white/15"
          : "bg-white/5 hover:bg-white/10 border border-white/10"
      )}
    >
      <span className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="spectra-bg absolute inset-x-3 -inset-y-8 rotate-6" />
      </span>

      <button
        onClick={onSelect}
        title={item.title}
        className="relative z-10 w-full flex items-center justify-center py-[0.475rem] px-2 rounded-md"
      >
        <LeftIcon className={cn("h-4 w-4", leftClass)} />
        {!!item.unread && (
          <span className="absolute -right-1 -top-1">
            <Badge className="px-1 py-0 h-4 text-[10px] rounded-full">{item.unread}</Badge>
          </span>
        )}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="absolute right-0.5 top-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10"
            aria-label="Opciones"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-44">
          <DropdownMenuItem onClick={onRename}>Renombrar</DropdownMenuItem>
          <DropdownMenuItem onClick={onStarToggle}>
            {item.starred ? "Quitar destacado" : "Destacar"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-red-500">
            <Trash2 className="h-4 w-4 mr-2" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}