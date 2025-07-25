import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AchievementNotifier from "@/components/AchievementNotifier";
import CreateRoomModal from "@/components/CreateRoomModal";
import { useUser } from "@/context/UserContext";
import useWebSocketStore from "@/stores/websocketStore";
import { localStream, remoteStream, peerConnection, setLocalStream, setRemoteStream, setPeerConnection } from "@/utils/webrtcStore";
import { getRankings, getRooms, getRoomInfo, joinRoom } from "@/utils/api";
import { useToast } from "@/components/ui/use-toast";
import RealTimeBattleCard from "./components/RealTimeBattleCard";
import WaitingRoomListCard from "./components/WaitingRoomListCard";
import ProfileSummaryCard from "./components/ProfileSummaryCard";
import TopRankingCard from "./components/TopRankingCard";
import { ResponseRoom, CustomRoom } from "@/types/room";


const HomePage = () => {
  const navigate = useNavigate();
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [topRanking, setTopRanking] = useState<any[]>([]);
  const [waitingRooms, setWaitingRooms] = useState<ResponseRoom[]>([]);
  const [hasMoreRooms, setHasMoreRooms] = useState(false);
  const [page, setPage] = useState(0);

  const { user, isLoading, isError } = useUser();
  const { disconnect } = useWebSocketStore();
  const { toast } = useToast();

  const handleRoomCreated = useCallback(async (roomId: number) => {
    // 1) 모달 닫기
    setShowCreateRoom(false);
    try {
      const roomInfo = await getRoomInfo(roomId);
      // 2) 대기실로 이동
      navigate(`/waiting-room/${roomId}`, { state: { roomInfo } });
    } catch (error) {
      console.error("Failed to fetch room info after creation:", error);
      // TODO: 사용자에게 에러 메시지 표시
      navigate("/home"); // 에러 발생 시 홈으로 돌아가기
    }
  }, [navigate]);

  const loadMoreRooms = async () => {
    const nextPage = page + 1;
    try {
      const newRooms = await getRooms(nextPage);
      setWaitingRooms(prevRooms => [...prevRooms, ...newRooms]);
      setHasMoreRooms(newRooms.length === 20);
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to fetch more rooms:", error);
    }
  };

  useEffect(() => {
    // 웹소켓 연결 끊기
    disconnect();

    // WebRTC 연결 정리
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }

    const fetchRankingsAndRooms = async () => {
      try {
        const rankingData = await getRankings("python3");
        setTopRanking(rankingData.rankings.slice(0, 5));

        const roomsData = await getRooms(0); // 첫 페이지(0)의 방 목록을 가져옴
        setWaitingRooms(roomsData);
        setHasMoreRooms(roomsData.length === 20);
        setPage(0);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchRankingsAndRooms();
  }, [disconnect]);

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (isError || !user) {
    return <div>Error loading user data or user not logged in.</div>;
  }

  return (
    <div>
      <Header />
      <AchievementNotifier />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-6">
              <RealTimeBattleCard
                onStartMatch={() =>
                  navigate("/matching", { state: { userId: user.user_id } })
                }
              />
              <WaitingRoomListCard
                waitingRooms={waitingRooms}
                onCreateRoom={() => setShowCreateRoom(true)}
                onJoinRoom={async (roomId: number) => {
                  if (!user?.user_id) {
                    console.error("User not logged in.");
                    return;
                  }
                  try {
                    const roomInfo = await joinRoom(roomId, user.user_id);
                    navigate(`/waiting-room/${roomId}`, { state: { roomInfo } });
                  } catch (error: any) {
                    console.error("Failed to join room:", error);
                    if (error.message && error.message.includes("No room found")) {
                      toast({
                        title: "방 참여 실패",
                        description: "이미 삭제된 방입니다. 방 목록을 새로고침합니다.",
                        variant: "destructive",
                      });
                      setTimeout(() => {
                        window.location.reload();
                      }, 500); // 0.5초 후 새로고침
                    } else {
                      toast({
                        title: "방 참여 실패",
                        description: "방 참여 중 알 수 없는 오류가 발생했습니다.",
                        variant: "destructive",
                      });
                    }
                  }
                }}
                onLoadMore={loadMoreRooms}
                hasMore={hasMoreRooms}
              />
            </div>
            <div className="flex flex-col space-y-6">
              <ProfileSummaryCard
                user={{
                  nickname: user.nickname || "CyberCoder",
                  totalScore: user.totalScore || 0,
                  win: user.win || 0,
                  loss: user.loss || 0,
                  win_rate: user.win_rate || 0,
                  rank: user.rank || 0,
                  profileImageUrl: user.profileImageUrl, // 프로필 이미지 URL 추가
                }}
                onViewProfile={() => navigate("/profile")}
              />
              <TopRankingCard
                topRanking={topRanking}
                onViewRanking={() => navigate("/ranking")}
              />
            </div>
          </div>
        </div>
      </main>
      {showCreateRoom && (
        <CreateRoomModal
          isOpen={showCreateRoom}
          onClose={() => setShowCreateRoom(false)}
          onRoomCreated={handleRoomCreated}
        />
      )}
    </div>
  );
};

export default HomePage;