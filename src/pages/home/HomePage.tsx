import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CreateRoomModal from "@/components/CreateRoomModal";
import { useUser } from "@/context/UserContext";
import { getRankings } from "@/utils/api";
import RealTimeBattleCard from "./components/RealTimeBattleCard";
import WaitingRoomListCard from "./components/WaitingRoomListCard";
import ProfileSummaryCard from "./components/ProfileSummaryCard";
import TopRankingCard from "./components/TopRankingCard";
import { waitingRooms } from "./constants";

const HomePage = () => {
  const navigate = useNavigate();
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [topRanking, setTopRanking] = useState<any[]>([]);

  const { user, isLoading, isError } = useUser();

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const data = await getRankings("python3");
        setTopRanking(data.rankings.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };

    fetchRankings();
  }, []);

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (isError || !user) {
    return <div>Error loading user data or user not logged in.</div>;
  }

  return (
    <div className="min-h-screen cyber-grid">
      <Header />
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
                onJoinRoom={() => navigate("/waiting-room")}
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
        />
      )}
    </div>
  );
};

export default HomePage;