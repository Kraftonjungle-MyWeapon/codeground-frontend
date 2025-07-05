import Header from "@/components/Header";
import CyberCard from "@/components/CyberCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Medal, Award, Crown, User, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { parseTotalScore } from "@/utils/lpSystem";
import { useEffect, useState } from "react";
import { getRankings } from "@/utils/api";
import CyberLoadingSpinner from "@/components/CyberLoadingSpinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RankingEntry {
  user_id: number;
  nickname: string;
  mmr: number;
  rank: number;
  rank_diff: number; // 백엔드에서 0으로 기본값 설정
}

const RankingPage = () => {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("python3"); // 기본 언어 설정

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const data = await getRankings(selectedLanguage);
        setRankings(data.rankings); // 백엔드 응답이 { language: string, rankings: RankingEntry[] } 형태
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [selectedLanguage]); // 선택된 언어가 변경될 때마다 랭킹을 다시 가져옴

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
    if (diff > 0) {
      return <ArrowUp className="h-4 w-4 text-green-400" />;
    } else if (diff < 0) {
      return <ArrowDown className="h-4 w-4 text-red-400" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRankDiffColor = (diff: number) => {
    if (diff > 0) {
      return "text-green-400";
    } else if (diff < 0) {
      return "text-red-400";
    } else {
      return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen cyber-grid">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
              <Trophy className="mr-3 h-8 w-8 text-cyber-blue" />
              전체 랭킹
            </h1>
            <p className="text-gray-400">최고의 코더들과 경쟁하세요</p>
          </div>

          {/* 언어 선택 드롭다운 */}
          <div className="flex justify-center mb-6">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="언어 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python3">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                {/* 다른 언어들도 필요에 따라 추가 */}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <CyberLoadingSpinner />
            </div>
          ) : (
            <>
              {/* 탑 3 랭킹 하이라이트 */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {rankings.slice(0, 3).map((player) => {
                  const { tier, lp } = parseTotalScore(player.mmr); // mmr 사용
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
                        순위 변동: <span className={`ml-1 ${getRankDiffColor(player.rank_diff)}`}>{getRankDiffIcon(player.rank_diff)} {Math.abs(player.rank_diff)}</span>
                      </div>
                    </CyberCard>
                  );
                })}
              </div>

              {/* 전체 랭킹 리스트 */}
              <CyberCard>
                <h2 className="text-xl font-bold text-white mb-6">전체 랭킹</h2>
                <div className="h-96 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="space-y-3 pr-4">
                      {rankings.map((player) => {
                        const { tier, lp } = parseTotalScore(player.mmr); // mmr 사용
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
                                <div className="w-10 h-10 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="font-semibold text-white">
                                    {player.nickname}
                                  </div>
                                  <div className="text-sm text-gray-400 flex items-center">
                                    순위 변동: <span className={`ml-1 ${getRankDiffColor(player.rank_diff)}`}>{getRankDiffIcon(player.rank_diff)} {Math.abs(player.rank_diff)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center justify-end mb-1">
                                <TierIcon
                                  className={`h-4 w-4 mr-1 ${tier.color}`}
                                />
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
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default RankingPage;
