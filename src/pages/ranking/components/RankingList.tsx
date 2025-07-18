import CyberCard from "@/components/CyberCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  Trophy,
  Medal,
  Award,
  Crown,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import { parseTotalScore } from "@/utils/lpSystem";
import { FC } from "react";
import type { RankingEntry } from "./TopThreeRanking";
import { getAbsoluteUrl } from "@/lib/utils";

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

interface Props {
  players: RankingEntry[];
}

const RankingList: FC<Props> = ({ players }) => (
  <CyberCard>
    <h2 className="text-xl font-bold text-white mb-6">전체 랭킹</h2>
    <div className="h-96 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="space-y-3 pr-4">
          {players.map((player) => {
            const { tier, lp } = parseTotalScore(player.mmr);
            const TierIcon = tier.icon;
            return (
              <div
                key={player.rank}
                className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
                  player.rank <= 3
                    ? `${getRankColor(player.rank)} border`
                    : "bg-black/20 hover:bg-black/30"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(player.rank)}
                  </div>
                  <div className="w-8 text-center font-bold text-white">
                    #{player.rank}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full flex items-center justify-center overflow-hidden border-2 border-cyber-blue">
                      {player.profile_img_url ? (
                        <img
                          src={getAbsoluteUrl(player.profile_img_url)}
                          alt={player.nickname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {player.nickname}
                      </div>
                      <div className="text-sm text-gray-400 flex items-center">
                        순위 변동:{" "}
                        <span
                          className={`ml-1 flex items-center ${getRankDiffColor(player.rank_diff)}`}
                        >
                          {Math.abs(player.rank_diff)}{" "}
                          {getRankDiffIcon(player.rank_diff)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end mb-1">
                    <TierIcon className={`h-4 w-4 mr-1 ${tier.color}`} />
                    <span className={`font-bold ${tier.color}`}>
                      {tier.name}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">{lp} LP</div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  </CyberCard>
);

export default RankingList;