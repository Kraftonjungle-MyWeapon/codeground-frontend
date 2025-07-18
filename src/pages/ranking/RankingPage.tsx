import Header from "@/components/Header";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { getRankings } from "@/utils/api";
import CyberLoadingSpinner from "@/components/CyberLoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TopThreeRanking, { RankingEntry } from "./components/TopThreeRanking";
import RankingList from "./components/RankingList";

const RankingPage = () => {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("python3");

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const data = await getRankings(selectedLanguage);
        // MMR 기준으로 내림차순 정렬
        const sortedRankings = data.rankings.sort((a: RankingEntry, b: RankingEntry) => b.mmr - a.mmr);
        
        let currentRank = 1;
        let previousMmr = -1; // MMR은 음수가 될 수 없으므로 초기값으로 -1 설정

        const rankingsWithRank = sortedRankings.map((player: RankingEntry, index: number) => {
          if (player.mmr !== previousMmr) {
            currentRank = index + 1;
          }
          previousMmr = player.mmr;
          return {
            ...player,
            rank: currentRank,
            rank_diff: 0, // rank_diff를 0으로 초기화
          };
        });
        setRankings(rankingsWithRank);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, [selectedLanguage]);

  return (
    <div className="min-h-screen">
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

          <div className="flex justify-center mb-6">
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="언어 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python3">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="c">C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <CyberLoadingSpinner />
            </div>
          ) : (
            <>
              <TopThreeRanking players={rankings.slice(0, 3)} />
              <RankingList players={rankings} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default RankingPage;