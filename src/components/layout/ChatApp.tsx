// src/components/ChatApp.tsx
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";                 // ajusta si tu Sidebar está en otra ruta
import { ChatContainer } from "./chat/ChatContainer";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";

export default function ChatApp() {
  // 👈 Oculto por defecto
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cerrar con ESC por UX
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  // Al seleccionar chat, avisamos al ChatContainer y cerramos overlay
  const handleSelectChat = (id: string) => {
    window.dispatchEvent(new CustomEvent("ose:select-chat", { detail: { id } }));
    setSidebarOpen(false);
  };

  // Al crear chat nuevo, cerramos overlay (Sidebar ya emite ose:new-chat)
  const handleNewChat = () => setSidebarOpen(false);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Botón flotante mostrar/ocultar historial */}
      <Button
        variant="ghost"
        size="icon"
        aria-label={sidebarOpen ? "Ocultar historial" : "Mostrar historial"}
        className="fixed top-3 left-3 z-50 h-8 w-8 rounded-full bg-white/80 hover:bg-white backdrop-blur shadow-md border border-slate-200"
        onClick={() => setSidebarOpen((v) => !v)}
      >
        {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
      </Button>

      {/* Sidebar como overlay (no empuja el chat) */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 md:w-72">
            <Sidebar
              onNewChat={handleNewChat}
              onSelectChat={handleSelectChat}
            />
          </aside>
        </>
      )}

      {/* Área principal */}
      <main className="h-full">
        <ChatContainer className="h-full" />
      </main>
    </div>
  );
}