
import Header from '@/components/Header';
import CyberCard from '@/components/CyberCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Medal, Award, Crown, User } from 'lucide-react';
import { parseTotalScore } from '@/utils/lpSystem';

const RankingPage = () => {
  // 확장된 랭킹 데이터 (50개)
  const rankings = [
    { rank: 1, name: 'AlgorithmMaster', totalScore: 2450, winRate: 87.3, battles: 203 },
    { rank: 2, name: 'CodeNinja', totalScore: 2380, winRate: 82.1, battles: 189 },
    { rank: 3, name: 'ByteWarrior', totalScore: 2310, winRate: 79.5, battles: 156 },
    { rank: 4, name: 'ScriptKiddie', totalScore: 2280, winRate: 76.8, battles: 142 },
    { rank: 5, name: 'DebugMaster', totalScore: 2250, winRate: 74.2, battles: 178 },
    { rank: 6, name: 'SyntaxError', totalScore: 2190, winRate: 71.9, battles: 134 },
    { rank: 7, name: 'CompilerKing', totalScore: 2150, winRate: 69.4, battles: 167 },
    { rank: 8, name: 'RuntimeHero', totalScore: 2120, winRate: 67.8, battles: 145 },
    { rank: 9, name: 'LogicLord', totalScore: 2080, winRate: 65.2, battles: 158 },
    { rank: 10, name: 'CyberCoder', totalScore: 2050, winRate: 63.5, battles: 127 },
    { rank: 11, name: 'JavaGuru', totalScore: 2020, winRate: 61.8, battles: 134 },
    { rank: 12, name: 'PythonKing', totalScore: 1990, winRate: 59.3, battles: 142 },
    { rank: 13, name: 'ReactMaster', totalScore: 1960, winRate: 57.1, battles: 156 },
    { rank: 14, name: 'NodejsPro', totalScore: 1930, winRate: 54.8, battles: 167 },
    { rank: 15, name: 'VueExpert', totalScore: 1900, winRate: 52.4, battles: 178 },
    { rank: 16, name: 'AngularNinja', totalScore: 1870, winRate: 50.2, battles: 189 },
    { rank: 17, name: 'TypeScriptLord', totalScore: 1840, winRate: 48.6, battles: 203 },
    { rank: 18, name: 'CssWizard', totalScore: 1810, winRate: 46.9, battles: 145 },
    { rank: 19, name: 'HtmlMaster', totalScore: 1780, winRate: 44.1, battles: 134 },
    { rank: 20, name: 'DatabaseKing', totalScore: 1750, winRate: 42.3, battles: 142 },
    { rank: 21, name: 'APIExpert', totalScore: 1720, winRate: 40.8, battles: 156 },
    { rank: 22, name: 'GitMaster', totalScore: 1690, winRate: 38.2, battles: 167 },
    { rank: 23, name: 'DockerPro', totalScore: 1660, winRate: 36.7, battles: 178 },
    { rank: 24, name: 'KubernetesNinja', totalScore: 1630, winRate: 34.1, battles: 189 },
    { rank: 25, name: 'CloudExpert', totalScore: 1600, winRate: 32.5, battles: 203 },
    { rank: 26, name: 'DevOpsGuru', totalScore: 1570, winRate: 30.8, battles: 145 },
    { rank: 27, name: 'SecurityMaster', totalScore: 1540, winRate: 29.3, battles: 134 },
    { rank: 28, name: 'TestingKing', totalScore: 1510, winRate: 27.6, battles: 142 },
    { rank: 29, name: 'PerformanceGuru', totalScore: 1480, winRate: 25.9, battles: 156 },
    { rank: 30, name: 'ScalabilityPro', totalScore: 1450, winRate: 24.2, battles: 167 },
    { rank: 31, name: 'MicroservicesExpert', totalScore: 1420, winRate: 22.7, battles: 178 },
    { rank: 32, name: 'ServerlessNinja', totalScore: 1390, winRate: 21.1, battles: 189 },
    { rank: 33, name: 'BlockchainMaster', totalScore: 1360, winRate: 19.4, battles: 203 },
    { rank: 34, name: 'AISpecialist', totalScore: 1330, winRate: 17.8, battles: 145 },
    { rank: 35, name: 'MLEngineer', totalScore: 1300, winRate: 16.2, battles: 134 },
    { rank: 36, name: 'DataScienceGuru', totalScore: 1270, winRate: 14.6, battles: 142 },
    { rank: 37, name: 'BigDataExpert', totalScore: 1240, winRate: 13.1, battles: 156 },
    { rank: 38, name: 'AnalyticsKing', totalScore: 1210, winRate: 11.5, battles: 167 },
    { rank: 39, name: 'VisualizationPro', totalScore: 1180, winRate: 9.8, battles: 178 },
    { rank: 40, name: 'StatisticsNinja', totalScore: 1150, winRate: 8.2, battles: 189 },
    { rank: 41, name: 'MathMaster', totalScore: 1120, winRate: 6.7, battles: 203 },
    { rank: 42, name: 'AlgorithmSolver', totalScore: 1090, winRate: 5.1, battles: 145 },
    { rank: 43, name: 'LogicWizard', totalScore: 1060, winRate: 3.4, battles: 134 },
    { rank: 44, name: 'ProblemSolver', totalScore: 1030, winRate: 1.8, battles: 142 },
    { rank: 45, name: 'CodeBreaker', totalScore: 1000, winRate: 0.2, battles: 156 },
    { rank: 46, name: 'BugHunter', totalScore: 970, winRate: 87.5, battles: 167 },
    { rank: 47, name: 'RefactorKing', totalScore: 940, winRate: 85.9, battles: 178 },
    { rank: 48, name: 'OptimizationGuru', totalScore: 910, winRate: 84.2, battles: 189 },
    { rank: 49, name: 'CleanCodeMaster', totalScore: 880, winRate: 82.6, battles: 203 },
    { rank: 50, name: 'BestPracticesPro', totalScore: 850, winRate: 81.1, battles: 145 }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2: return <Medal className="h-6 w-6 text-gray-300" />;
      case 3: return <Award className="h-6 w-6 text-orange-400" />;
      default: return <Trophy className="h-5 w-5 text-gray-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 2: return 'text-gray-300 bg-gray-300/10 border-gray-300/30';
      case 3: return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
      default: return 'text-gray-400';
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

          {/* 탑 3 랭킹 하이라이트 */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {rankings.slice(0, 3).map((player) => {
              const { tier, lp } = parseTotalScore(player.totalScore);
              const TierIcon = tier.icon;
              return (
                <CyberCard 
                  key={player.rank} 
                  className={`text-center ${getRankColor(player.rank)}`}
                >
                  <div className="mb-4">
                    {getRankIcon(player.rank)}
                  </div>
                  <div className="text-2xl font-bold mb-1">{player.rank}위</div>
                  <div className="text-lg font-semibold text-white mb-2">{player.name}</div>
                  <div className="flex items-center justify-center mb-1">
                    <TierIcon className={`h-4 w-4 mr-1 ${tier.color}`} />
                    <span className={`text-sm ${tier.color}`}>{tier.name}</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">{lp} LP</div>
                  <div className="text-xs text-gray-500">
                    승률 {player.winRate}% • {player.battles}전
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
                    const { tier, lp } = parseTotalScore(player.totalScore);
                    const TierIcon = tier.icon;
                    return (
                      <div 
                        key={player.rank}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
                          player.rank <= 3 
                            ? `${getRankColor(player.rank)} border` 
                            : 'bg-black/20 hover:bg-black/30'
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
                              <div className="font-semibold text-white">{player.name}</div>
                              <div className="text-sm text-gray-400">
                                {player.battles}전 • 승률 {player.winRate}%
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end mb-1">
                            <TierIcon className={`h-4 w-4 mr-1 ${tier.color}`} />
                            <span className={`font-bold ${tier.color}`}>{tier.name}</span>
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
        </div>
      </main>
    </div>
  );
};

export default RankingPage;
