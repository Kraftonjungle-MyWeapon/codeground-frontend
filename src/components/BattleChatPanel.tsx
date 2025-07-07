import CyberCard from "@/components/CyberCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

export type ChatMessage = {
  user: string;
  message: string;
  type: "chat" | "system";
};

type BattleChatPanelProps = {
  chatMessages: ChatMessage[];
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleSendMessage: () => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
};

const BattleChatPanel = ({
  chatMessages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  chatEndRef,
}: BattleChatPanelProps) => {
  return (
    <CyberCard className="p-3 flex flex-col h-full">
      <h3 className="text-sm font-semibold text-cyber-blue mb-2">채팅</h3>
      <ScrollArea className="flex-1 mb-2">
        <div className="space-y-2 pr-3">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`text-xs ${msg.type === "system" ? "text-red-400" : "text-gray-400"}`}
            >
              <div>{msg.user}: {msg.message}</div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="메시지 입력..."
          className="flex-1 text-xs bg-black/30 border border-gray-600 rounded-l px-2 py-1 text-white"
        />
        <button
          onClick={handleSendMessage}
          className="bg-cyber-blue px-2 py-1 rounded-r"
        >
          <Send className="h-3 w-3" />
        </button>
      </div>
    </CyberCard>
  );
};

export default BattleChatPanel;
