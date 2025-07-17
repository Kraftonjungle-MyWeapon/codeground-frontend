import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";
import { FC } from "react";

export interface ChatMessage {
  type: "system" | "user" | "chat"; // Add 'chat' type
  message: string;
  user: string;
}

interface Props {
  messages: ChatMessage[];
  messageInput: string;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onEnter: (e: React.KeyboardEvent) => void;
}

const ChatPanel: FC<Props> = ({
  messages,
  messageInput,
  onMessageChange,
  onSend,
  onEnter,
}) => (
  <CyberCard>
    <div className="flex items-center mb-4">
      <MessageCircle className="mr-2 h-5 w-5 text-cyber-blue" />
      <h3 className="text-xl font-bold text-cyber-blue">채팅</h3>
    </div>
    <div className="space-y-3 h-64 overflow-y-auto mb-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`text-sm ${msg.type === "system" ? "text-gray-400 italic" : "text-white"}`}
        >
          {msg.user}: {msg.message}
        </div>
      ))}
    </div>
    <div className="flex space-x-2">
      <Input
        value={messageInput}
        onChange={(e) => onMessageChange(e.target.value)}
        onKeyPress={onEnter}
        placeholder="메시지를 입력하세요..."
        className="bg-black/30 border-gray-600 text-white flex-1"
      />
      <CyberButton size="sm" onClick={onSend}>
        <Send className="h-4 w-4" />
      </CyberButton>
    </div>
  </CyberCard>
);

export default ChatPanel;