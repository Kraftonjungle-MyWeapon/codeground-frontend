import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import RoomSettingsModal from "@/components/RoomSettingsModal";
import usePreventNavigation from "@/hooks/usePreventNavigation";

import { useUser } from "@/context/UserContext";
import RoomInfoCard from "./components/RoomInfoCard";
import PlayerCard from "./components/PlayerCard";
import ChatPanel, { ChatMessage } from "./components/ChatPanel";
import { CustomRoom } from "@/types/room";
import useWebSocketStore from "@/stores/websocketStore"; // useWebSocketStore import
import { useToast } from "@/components/ui/use-toast";

import { authFetch, getRoomInfo, leaveRoom, fetchProblemForGame, getProblemById } from "@/utils/api";

const apiUrl = import.meta.env.VITE_API_URL;
const wsUrl = apiUrl.startsWith('https')
    ? apiUrl.replace(/^https/, 'wss')
    : apiUrl.replace(/^http/, 'ws');

const WaitingRoomPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get("gameId"); // gameId는 현재 사용되지 않지만, 혹시 몰라 남겨둡니다.
  const { user } = useUser();
  const { websocket, connect, disconnect, sendMessage } = useWebSocketStore(); // useWebSocketStore 사용
  const [isHost, setIsHost] = useState(false); // 초기값 false로 변경
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(
    []
  );
  const { toast } = useToast();
  
  
  const initialMessagesAddedRef = useRef(false); // 초기 메시지 추가 여부 플래그
  const isNavigatingToBattleRef = useRef(false); // 배틀 페이지로 이동 중인지 여부 플래그

  const initialRoomInfo = location.state?.roomInfo as CustomRoom | undefined;
  const [roomInfo, setRoomInfo] = useState<CustomRoom | undefined>(initialRoomInfo);

  usePreventNavigation({
    shouldPrevent: true,
    onAttemptNavigation: async (confirm, cancel) => {
      // 게임 시작으로 인한 정상적인 페이지 이동은 막지 않음
      if (isNavigatingToBattleRef.current) {
        confirm();
        return;
      }

      // 그 외의 경우 (헤더 로고 클릭 등) 방을 나가는 로직 실행
      if (roomInfo?.room_id && user?.user_id) {
        try {
          await leaveRoom(roomInfo.room_id, user.user_id);
          disconnect();
          confirm(); // API 호출 및 연결 끊기 성공 후 페이지 이동 허용
          navigate('/home'); // 명시적으로 홈으로 이동
        } catch (error) {
          console.error("Failed to leave room automatically on navigation:", error);
          // 실패 시에는 페이지 이동을 막음
          cancel();
        }
      } else {
        // 방 정보가 없는 등 예외적인 경우, 그냥 이동을 허용
        confirm();
        navigate('/home'); // 명시적으로 홈으로 이동
      }
    },
  });

  // roomSettings는 roomInfo에서 파생되도록 변경
  const roomSettings = roomInfo ? {
    title: roomInfo.title,
    language: roomInfo.use_language,
    category: roomInfo.category,
    difficulty: roomInfo.difficulty,
  } : {
    title: "",
    language: "",
    category: 0,
    difficulty: "",
  };

  // 방 정보 및 초기 메시지 설정을 위한 useEffect
  useEffect(() => {
    if (!roomInfo?.room_id || !user?.user_id) {
      navigate("/home");
      return;
    }

    // isHost 동적 설정
    setIsHost(roomInfo.maker.user_id === user.user_id);

    // roomInfo가 로드된 후 초기 메시지 추가
    if (roomInfo && !initialMessagesAddedRef.current) {
      setChatMessages((prev) => [
        ...prev,
        { type: "system", user: roomInfo.maker.nickname, message: `${roomInfo.maker.nickname}님이 대기실을 생성했습니다.` },
      ]);
      if (roomInfo.user) {
        setChatMessages((prev) => [
          ...prev,
          { type: "system", user: roomInfo.user.nickname, message: `${roomInfo.user.nickname}님이 입장했습니다.` },
        ]);
      }
      initialMessagesAddedRef.current = true;
    }
  }, [roomInfo, user, navigate]);

  // WebSocket 연결 및 해제를 위한 useEffect
  useEffect(() => {
    isNavigatingToBattleRef.current = false; // 컴포넌트 마운트 시 플래그 초기화
    if (!roomInfo?.room_id || !user?.user_id) {
      return;
    }

    const currentWsUrl = `${wsUrl}/api/v1/ws/custom_match/${roomInfo.room_id}?user_id=${user.user_id}`;
    connect(currentWsUrl);

    return () => {
      // 컴포넌트 언마운트 또는 의존성 변경 시 웹소켓 연결 정리
      // 게임 시작으로 인한 이동이 아닐 경우에만 disconnect
      if (!isNavigatingToBattleRef.current) {
        disconnect();
      }
    };
  }, [roomInfo?.room_id, user?.user_id, connect, disconnect]);

  useEffect(() => {
    if (!websocket) return;

    websocket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received WS message:", data);

        switch (data.type) {
          case 'room_info_update':
            if (roomInfo?.room_id) {
              try {
                const updatedRoom = await getRoomInfo(roomInfo.room_id);
                setRoomInfo(updatedRoom); // 방 정보 업데이트
              } catch (error) {
                console.error("Error fetching updated room info on room_info_update:", error);
              }
            }
            setChatMessages((prev) => [
              ...prev,
              { type: 'system', user: '시스템', message: data.message || '방 정보가 업데이트되었습니다.' },
            ]);
            break;
          case 'player_join':
            if (roomInfo?.room_id) {
              try {
                const updatedRoom = await getRoomInfo(roomInfo.room_id);
                setRoomInfo(updatedRoom); // 방 정보 업데이트

                let joinedPlayerNickname = '알 수 없는 유저';
                // 새로 입장한 플레이어를 식별 (user 필드가 채워졌는지 확인)
                if (updatedRoom.user && (!roomInfo.user || updatedRoom.user.user_id !== roomInfo.user.user_id)) {
                  joinedPlayerNickname = updatedRoom.user.nickname;
                } else if (updatedRoom.maker && (!roomInfo.maker || updatedRoom.maker.user_id !== roomInfo.maker.user_id)) {
                  // maker가 변경된 경우 (거의 없겠지만 혹시 모를 상황 대비)
                  joinedPlayerNickname = updatedRoom.maker.nickname;
                }

                setChatMessages((prev) => [
                  ...prev,
                  {
                    type: 'system',
                    user: joinedPlayerNickname,
                    message: `${joinedPlayerNickname}님이 입장했습니다.`,
                  },
                ]);
              } catch (error) {
                console.error("Error fetching updated room info on player_join:", error);
                setChatMessages((prev) => [
                  ...prev,
                  {
                    type: 'system',
                    user: '시스템',
                    message: '새로운 유저 입장 (방 정보 업데이트 실패)',
                  },
                ]);
              }
            }
            break;

          case 'opponent_left_waiting':
            if (roomInfo?.user) {
              const opponentNickname = roomInfo.user.nickname;
              setChatMessages((prev) => [
                ...prev,
                {
                  type: 'system',
                  user: opponentNickname,
                  message: `${opponentNickname}님이 퇴장했습니다.`,
                },
              ]);
            }
            if (roomInfo?.room_id) {
              try {
                const updatedRoom = await getRoomInfo(roomInfo.room_id);
                setRoomInfo(updatedRoom); // 방 정보 업데이트
              } catch (error) {
                console.error("Error fetching updated room info on opponent_left_waiting:", error);
                setChatMessages((prev) => [
                  ...prev,
                  {
                    type: 'system',
                    user: '시스템',
                    message: '방 정보 업데이트 실패 (상대방 퇴장)',
                  },
                ]);
              }
            }
            break;
          case 'opponent_rejoined':
                console.info('상대가 재접속');
                break;

          case 'player_leave':
            // API에서 최신 방 정보 가져오기
            if (roomInfo?.room_id) {
              try {
                const updatedRoom = await getRoomInfo(roomInfo.room_id);
                setRoomInfo(updatedRoom); // 방 정보 업데이트
              } catch (error) {
                console.error("Error fetching updated room info on player_leave:", error);
              }
            }
            setChatMessages((prev) => [
              ...prev,
              {
                type: 'system',
                user: data.player_nickname,
                message: `${data.player_nickname}님이 퇴장했습니다.`,
              },
            ]);
            break;
          case 'chat':
            setChatMessages((prev) => [
              ...prev,
              {
                user: (user?.user_id && Number(data.sender) === user.user_id) ? '나' : data.sender_nickname || '상대방',
                message: data.message,
                type: 'user',
              },
            ]);
            break;
          case 'user_update_ready':
            // API에서 최신 방 정보 가져오기
            if (roomInfo?.room_id) {
              try {
                const updatedRoom = await getRoomInfo(roomInfo.room_id);
                setRoomInfo(updatedRoom); // 방 정보 업데이트
                setChatMessages((prev) => [
                  ...prev,
                  { type: 'system', user: data.nickname, message: `${data.nickname}님이 ${data.ready ? '준비 완료' : '준비 취소'}했습니다.` },
                ]);
              } catch (error) {
                console.error("Error fetching updated room info on user_update_ready:", error);
              }
            }
            break;
          case 'game_start':
            isNavigatingToBattleRef.current = true; // 게임 시작으로 인한 이동임을 플래그 설정
            // 페이지 이동은 'get_problem' 메시지 수신 후 처리
            break;
          case 'get_problem':
            console.log("Received get_problem message:", data);
            if (roomInfo?.room_id && data.problem && data.problem.problem_id) {
              try {
                // 문제 정보를 sessionStorage에 저장 시도
                await fetchProblemForGame(data.problem, Number(roomInfo.room_id), data.problem.problem_id);
                const fetchedProblem = sessionStorage.getItem(`problem_${roomInfo.room_id}`);
                if (!fetchedProblem) {
                    throw new Error("Problem not saved to sessionStorage by fetchProblemForGame.");
                }
                sessionStorage.setItem("gameId", String(roomInfo.room_id)); // gameId를 sessionStorage에 저장
                setChatMessages((prev) => [
                  ...prev,
                  { type: 'system', user: '시스템', message: '게임이 시작됩니다!' }, // 메시지 위치 변경
                ]);
                navigate('/screen-share-setup?gameId=' + roomInfo.room_id + '&matchType=custom');
              } catch (error) {
                console.error("Error fetching problem on get_problem:", error);
                // 문제 가져오기 실패 시 로컬 문제로 폴백
                try {
                  const localProblem = await getProblemById(3); // 로컬 문제 ID 3 사용
                  sessionStorage.setItem(`problem_${roomInfo.room_id}`, JSON.stringify(localProblem));
                  setChatMessages((prev) => [
                    ...prev,
                    { type: 'system', user: '시스템', message: '문제 정보를 가져오는 데 실패하여 로컬 문제를 로드했습니다.' },
                  ]);
                  navigate('/screen-share-setup?gameId=' + roomInfo.room_id + '&matchType=custom');
                } catch (localError) {
                  console.error("Error fetching local problem as fallback:", localError);
                  setChatMessages((prev) => [
                    ...prev,
                    { type: 'system', user: '시스템', message: '문제 정보를 가져오는 데 최종적으로 실패했습니다.' },
                  ]);
                }
              }
            }
            break;
          case 'system':
            setChatMessages((prev) => [
              ...prev,
              {
                user: '시스템',
                message: data.message,
                type: 'system',
              },
            ]);
            break;
          case 'error':
            if (data.message === 'No problems exist') {
              toast({
                title: "문제 없음",
                description: "해당하는 문제가 없습니다. 방 설정을 변경해주세요.",
                variant: "destructive",
              });
            } else if (data.message === '403: Need all user ready.') {
              toast({
                title: "게임 시작 실패",
                description: "상대방이 아직 준비되지 않았습니다.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "오류 발생",
                description: data.message || "알 수 없는 오류가 발생했습니다.",
                variant: "destructive",
              });
            }
            break;
          default:
            console.warn('Unknown message type:', data.type);
        }
      } catch (e) {
        console.error("ws message parse error", e);
      }
    };
  }, [websocket, user, roomInfo, navigate, setChatMessages]);

  

  const handleReady = () => {
    // 웹소켓을 통해 준비 상태 메시지 전송
    sendMessage(JSON.stringify({ type: "custom_ready"}));
    // setChatMessages((prev) => [...prev, { type: "system", message: `${user?.nickname}님이 ${newReadyState ? '준비 완료' : '준비 취소'}했습니다.` }]); // 웹소켓 응답으로 시스템 메시지가 오므로 여기서 직접 추가하지 않음
  };

  const handleGameStart = () => {
    // 게임 시작 메시지 전송 (호스트만 가능)
    if (isHost) {
      sendMessage(JSON.stringify({ type: "game_start" }));
    }
    isNavigatingToBattleRef.current = true; // 배틀 페이지로 이동하기 전에 플래그 설정
    // 페이지 이동은 'get_problem' 메시지 수신 후 처리
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // 웹소켓을 통해 채팅 메시지 전송
      sendMessage(JSON.stringify({ type: "chat", message: chatMessage }));
      setChatMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <RoomInfoCard
            roomInfo={roomInfo}
            isHost={isHost}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roomInfo?.maker && (
                  <PlayerCard
                    name={roomInfo.maker.nickname}
                    mmr={roomInfo.maker.mmr}
                    profileImageUrl={roomInfo.maker.img_url}
                    role="host"
                    isHostView={isHost}
                    isReady={roomInfo.maker.ready} // 방장의 준비 상태
                    onGameStart={isHost ? handleGameStart : undefined} // 방장에게만 게임 시작 버튼 활성화
                  />
                )}
                {roomInfo?.user ? (
                  <PlayerCard
                    name={roomInfo.user.nickname}
                    mmr={roomInfo.user.mmr}
                    profileImageUrl={roomInfo.user.img_url}
                    role="player"
                    isHostView={isHost}
                    isReady={roomInfo.user.ready} // 상대방의 준비 상태
                    onToggleReady={!isHost ? handleReady : undefined} // 방장이 아닐 때만 준비 버튼 활성화
                  />
                ) : (
                  <PlayerCard
                    name="유저 대기 중"
                    mmr={0} // MMR은 0으로 설정하거나 적절한 기본값으로 설정
                    profileImageUrl="/placeholder.svg" // 적절한 플레이스홀더 이미지 경로
                    role="player"
                    isHostView={isHost}
                    isReady={false}
                  />
                )}
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
        roomId={roomInfo?.room_id || 0} // Pass roomId
        onSettingsSaved={(updatedRoom) => setRoomInfo(updatedRoom)} // Update roomInfo state
      />

      
    </div>
  );
};

export default WaitingRoomPage;