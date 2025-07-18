import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";
import { MatchLog } from "@/types/codeEditor";
import { getDifficultyColor, getResultColor } from "../utils";

interface Props {
  matches: MatchLog[];
  onLoadMore: () => void;
  hasMore: boolean;
}

const MatchHistory = ({ matches, onLoadMore, hasMore }: Props) => {
  const matchesToShow = hasMore ? matches.slice(0, matches.length - 1) : matches;

  return (
    <CyberCard>
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="h-5 w-5 text-cyan-400" />
        <h2 className="text-lg font-bold text-white">최근 전적</h2>
      </div>
      <div className="h-80 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-2 pr-4">
            {matches.length > 0 ? (
              <>
                {matchesToShow.map((match, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[min-content_1fr_2fr_8rem_6rem] gap-4 p-3 bg-black/20 rounded-lg text-sm"
                  >
                    <div
                      className={`font-bold ${getResultColor(match.result)} border-r border-gray-700/50 pr-4 w-16 text-center`}
                    >
                      {match.result === null || match.result === undefined || match.result === "" ? "draw" : match.result}
                    </div>
                    <div className={`${getResultColor(match.result || "")} border-r border-gray-700/50 pr-4`}>
                      vs {match.opponent_name} ({match.opponent_tier})
                    </div>
                    <div className={`${getDifficultyColor(match.game_difficulty)} truncate overflow-hidden border-r border-gray-700/50 pr-4`}>
                      {match.game_title}
                    </div>
                    <div className="text-gray-400 border-r border-gray-700/50 pr-4">
                      {(() => {
                        const date = new Date(match.game_time);
                        const year = date.getFullYear().toString().slice(-2);
                        const month = (date.getMonth() + 1).toString().padStart(2, "0");
                        const day = date.getDate().toString().padStart(2, "0");
                        const hours = date.getHours().toString().padStart(2, "0");
                        const minutes = date.getMinutes().toString().padStart(2, "0");
                        return `${year}.${month}.${day} ${hours}:${minutes}`;
                      })()}
                    </div>
                    <div className={getResultColor(match.result || "")}> {match.mmr_earned > 0 ? "+" : ""}{match.mmr_earned} LP</div>
                  </div>
                ))}
                {hasMore && (
                  <div className="flex justify-center mt-4">
                    <CyberButton onClick={onLoadMore}>더 보기</CyberButton>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 py-10">경기 전적 없음</div>
            )}
          </div>
        </ScrollArea>
      </div>
    </CyberCard>
  );
};

export default MatchHistory;