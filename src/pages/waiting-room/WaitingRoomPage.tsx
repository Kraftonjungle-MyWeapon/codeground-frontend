import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import RoomSettingsModal from "@/components/RoomSettingsModal";
import usePreventNavigation from "@/hooks/usePreventNavigation";
import GameExitModal from "@/components/GameExitModal";
import { useUser } from "@/context/UserContext";
import RoomInfoCard from "./components/RoomInfoCard";
import PlayerCard from "./components/PlayerCard";
import ChatPanel, { ChatMessage } from "./components/ChatPanel";

const apiUrl = import.meta.env.VITE_API_URL;
const wsUrl = apiUrl.replace(/^http/, "ws");

const WaitingRoomPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("gameId");
  const { user } = useUser();
  const wsRef = useRef<WebSocket | null>(null);
  const [isHost, setIsHost] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { type: "system", message: "CyberCoder님이 대기실을 생성했습니다." },
    { type: "system", message: "Player2님이 입장했습니다." },
  ]);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [confirmExitCallback, setConfirmExitCallback] = useState<
    (() => void) | null
  >(null);
  const [cancelExitCallback, setCancelExitCallback] = useState<
    (() => void) | null
  >(null);
  const isConfirmedExitRef = useRef(false);

  usePreventNavigation({
    shouldPrevent: true,
    onAttemptNavigation: (confirm, cancel) => {
      setIsExitModalOpen(true);
      setConfirmExitCallback(() => confirm);
      setCancelExitCallback(() => cancel);
    },
  });

  const [roomSettings] = useState({
    title: "알고리즘 기초 대결",
    language: "Python",
    category: "자료구조",
    difficulty: "초급",
  });

  useEffect(() => {
    if (!gameId || !user?.user_id) return;

    const ws = new WebSocket(
      `${wsUrl}/api/v1/game/ws/waiting-room/${gameId}?user_id=${user.user_id}`,
    );
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WaitingRoomPage WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received WS message:", data);
      } catch (e) {
        console.error("ws message parse error", e);
      }
    };

    ws.onclose = () => {
      console.log("WaitingRoomPage WebSocket disconnected");
    };

    return () => {
      if (wsRef.current) {
        console.log(
          "WaitingRoomPage Websocket cleanup triggered. isConfirmedExit:",
          isConfirmedExitRef.current,
        );
        if (isConfirmedExitRef.current) {
          wsRef.current.close();
        }
      }
    };
  }, [gameId, user]);

  const handleLeaveRoom = useCallback(() => {
    isConfirmedExitRef.current = true;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    navigate("/home");
  }, [navigate]);

  const handleConfirmExit = useCallback(() => {
    setIsExitModalOpen(false);
    if (confirmExitCallback) {
      handleLeaveRoom();
      confirmExitCallback();
    }
  }, [confirmExitCallback, handleLeaveRoom]);

  const handleCancelExit = useCallback(() => {
    setIsExitModalOpen(false);
    if (cancelExitCallback) {
      cancelExitCallback();
    }
  }, [cancelExitCallback]);

  const handleReady = () => {
    setIsReady(!isReady);
    const message = isReady
      ? "CyberCoder님이 준비를 취소했습니다."
      : "CyberCoder님이 준비 완료했습니다.";
    setChatMessages((prev) => [...prev, { type: "system", message }]);
  };

  const handleGameStart = () => {
    navigate("/battle");
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages((prev) => [
        ...prev,
        { type: "user", message: `CyberCoder: ${chatMessage}` },
      ]);
      setChatMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen cyber-grid">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <RoomInfoCard
            settings={roomSettings}
            isHost={isHost}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PlayerCard
                  name="CyberCoder"
                  mmr={1847}
                  role="host"
                  isHostView={isHost}
                  isReady={isReady}
                  onGameStart={handleGameStart}
                />
                <PlayerCard
                  name="Player2"
                  mmr={1623}
                  role="player"
                  isHostView={isHost}
                  isReady={isReady}
                  onToggleReady={handleReady}
                />
              </div>
            </div>

            <div className="space-y-6">
              <ChatPanel
                messages={chatMessages}
                messageInput={chatMessage}
                onMessageChange={setChatMessage}
                onSend={handleSendMessage}
                onEnter={handleKeyPress}
              />
            </div>
          </div>
        </div>
      </main>

      <RoomSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentSettings={roomSettings}
      />

      <GameExitModal
        isOpen={isExitModalOpen}
        onConfirmExit={handleConfirmExit}
        onCancelExit={handleCancelExit}
      />
    </div>
  );
};

export default WaitingRoomPage;