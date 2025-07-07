
import CyberCard from "@/components/CyberCard";
import { TrendingUp } from "lucide-react";

interface Props {
  totalBattles: number;
  wins: number;
  losses: number;
  winRate: string;
  averageTime: string;
  bestTime: string;
  currentStreak: number;
  bestStreak: number;
}

const GameStatsCard = ({
  totalBattles,
  wins,
  losses,
  winRate,
  averageTime,
  bestTime,
  currentStreak,
  bestStreak,
}: Props) => (
  <CyberCard className="flex-1 flex flex-col">
    <div className="flex items-center space-x-2 mb-4">
      <TrendingUp className="h-5 w-5 text-pink-400" />
      <h2 className="text-lg font-bold text-white">게임 통계</h2>
    </div>
    <div className="grid grid-cols-2 gap-4 text-center">
      <div className="bg-black/20 p-4 rounded-lg">
        <div className="text-xl font-bold text-white">{totalBattles}</div>
        <div className="text-sm text-gray-400">총게임</div>
      </div>
      <div className="bg-black/20 p-4 rounded-lg">
        <div className="text-xl font-bold text-green-400">{wins}</div>
        <div className="text-sm text-gray-400">승리</div>
      </div>
      <div className="bg-black/20 p-4 rounded-lg">
        <div className="text-xl font-bold text-red-400">{losses}</div>
        <div className="text-sm text-gray-400">패배</div>
      </div>
      <div className="bg-black/20 p-4 rounded-lg">
        <div className="text-xl font-bold text-yellow-400">{winRate}%</div>
        <div className="text-sm text-gray-400">승률</div>
      </div>
      <div className="bg-black/20 p-4 rounded-lg">
        <div className="text-xl font-bold text-purple-400">{averageTime}</div>
        <div className="text-sm text-gray-400">평균 시간</div>
      </div>
      <div className="bg-black/20 p-4 rounded-lg">
        <div className="text-xl font-bold text-cyan-400">{bestTime}</div>
        <div className="text-sm text-gray-400">최단 시간</div>
      </div>
      <div className="bg-black/20 p-4 rounded-lg">
        <div className="text-xl font-bold text-orange-400">{currentStreak}</div>
        <div className="text-sm text-gray-400">현재 연승</div>
      </div>
      <div className="bg-black/20 p-4 rounded-lg">
        <div className="text-xl font-bold text-pink-400">{bestStreak}</div>
        <div className="text-sm text-gray-400">최고 연승</div>
      </div>
    </div>
  </CyberCard>
);

export default GameStatsCard;