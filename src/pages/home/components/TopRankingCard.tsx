import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Star, Crown } from "lucide-react";
import { parseTotalScore } from "@/utils/lpSystem";

interface RankingEntry {
  user_id: number;
  nickname: string;
  mmr: number;
  rank: number;
}

interface Props {
  topRanking: RankingEntry[];
  onViewRanking: () => void;
}

const TopRankingCard = ({ topRanking, onViewRanking }: Props) => (
  <CyberCard className="flex-1 flex flex-col">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
        <Trophy className="h-5 w-5 text-yellow-400" />
        <h2 className="text-xl font-bold text-yellow-400">TOP 랭킹</h2>
      </div>
      <CyberButton size="sm" onClick={onViewRanking}>
        전체보기
      </CyberButton>
    </div>
    <div className="h-80 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="space-y-2 pr-4">
          {topRanking.map((player) => {
            const { tier: playerTier, lp: playerLp } = parseTotalScore(player.mmr);
            return (
              <div
                key={player.user_id}
                className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    {player.rank === 1 && (
                      <Crown className="h-5 w-5 text-yellow-400" />
                    )}
                    {player.rank === 2 && (
                      <Trophy className="h-5 w-5 text-gray-300" />
                    )}
                    {player.rank === 3 && (
                      <Star className="h-5 w-5 text-orange-400" />
                    )}
                    {player.rank > 3 && (
                      <span className="text-white font-bold text-sm">#{player.rank}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-white font-medium">{player.nickname}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`text-xs ${playerTier.color}`}>{playerTier.name}</div>
                  <div className="text-right">
                    <div className="text-cyan-400 font-medium">{playerLp} LP</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  </CyberCard>
);

export default TopRankingCard;