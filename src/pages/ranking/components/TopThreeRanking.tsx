import CyberCard from "@/components/CyberCard";
import { parseTotalScore } from "@/utils/lpSystem";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import { FC } from "react";

export interface RankingEntry {
  user_id: number;
  nickname: string;
  mmr: number;
  rank: number;
  rank_diff: number;
}

interface Props {
  players: RankingEntry[];
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-400" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-300" />;
    case 3:
      return <Award className="h-6 w-6 text-orange-400" />;
    default:
      return <Trophy className="h-5 w-5 text-gray-400" />;
  }
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
    case 2:
      return "text-gray-300 bg-gray-300/10 border-gray-300/30";
    case 3:
      return "text-orange-400 bg-orange-400/10 border-orange-400/30";
    default:
      return "text-gray-400";
  }
};

const getRankDiffIcon = (diff: number) => {
  if (diff > 0) return <ArrowUp className="h-4 w-4 text-green-400" />;
  if (diff < 0) return <ArrowDown className="h-4 w-4 text-red-400" />;
  return <Minus className="h-4 w-4 text-gray-400" />;
};

const getRankDiffColor = (diff: number) => {
  if (diff > 0) return "text-green-400";
  if (diff < 0) return "text-red-400";
  return "text-gray-400";
};

const TopThreeRanking: FC<Props> = ({ players }) => (
  <div className="grid md:grid-cols-3 gap-6 mb-8">
    {players.map((player) => {
      const { tier, lp } = parseTotalScore(player.mmr);
      const TierIcon = tier.icon;
      return (
        <CyberCard
          key={player.rank}
          className={`text-center ${getRankColor(player.rank)}`}
        >
          <div className="mb-4">{getRankIcon(player.rank)}</div>
          <div className="text-2xl font-bold mb-1">{player.rank}위</div>
          <div className="text-lg font-semibold text-white mb-2">
            {player.nickname}
          </div>
          <div className="flex items-center justify-center mb-1">
            <TierIcon className={`h-4 w-4 mr-1 ${tier.color}`} />
            <span className={`text-sm ${tier.color}`}>{tier.name}</span>
          </div>
          <div className="text-xs text-gray-400 mb-2">{lp} LP</div>
          <div className="text-xs text-gray-500 flex items-center justify-center">
            순위 변동:
            <span className={`ml-1 flex items-center ${getRankDiffColor(player.rank_diff)}`}>
              {Math.abs(player.rank_diff)} {getRankDiffIcon(player.rank_diff)}
            </span>
          </div>
        </CyberCard>
      );
    })}
  </div>
);

export default TopThreeRanking;