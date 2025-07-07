import { useState, useRef, useEffect, useCallback } from 'react';
import useWebSocketStore from '@/stores/websocketStore';

interface UseBattleChatProps {
  // 필요한 경우 BattlePage에서 전달할 props 추가
}

export const useBattleChat = (props?: UseBattleChatProps) => {
  const { sendMessage } = useWebSocketStore();
  const [chatMessages, setChatMessages] = useState<
    { user: string; message: string; type: 'chat' | 'system' }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim()) return;
    const msgObj = { type: "chat", message: newMessage };
    sendMessage(JSON.stringify(msgObj));
    setChatMessages((prev) => [...prev, { user: '나', message: newMessage, type: 'chat' }]);
    setNewMessage("");
  }, [newMessage, sendMessage]);

  return {
    chatMessages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    chatEndRef,
    setChatMessages, // useBattleWebSocket에서 setChatMessages를 사용하므로 반환
  };
};
