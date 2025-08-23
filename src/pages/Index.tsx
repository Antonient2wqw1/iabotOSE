import { Sidebar } from "@/components/layout/Sidebar";
import { ChatContainer } from "@/components/chat/ChatContainer";

const Index = () => {
  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatContainer className="flex-1" />
      </div>
    </div>
  );
};

export default Index;