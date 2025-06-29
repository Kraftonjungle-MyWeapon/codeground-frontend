import { useState } from 'react';
import Header from '@/components/Header';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import ProfileEditModal from '@/components/ProfileEditModal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Trophy, Target, Clock, TrendingUp, CheckCircle, Award, Medal, Crown, Zap, Shield, Star, Flame, Gem } from 'lucide-react';
import { parseTotalScore } from '@/utils/lpSystem';
import { useUser } from '../context/UserContext';

const ProfilePage = () => {
  const { user } = useUser();
  const [showEditModal, setShowEditModal] = useState(false);

  // 예시 사용자 데이터 (더 자세한 더미 데이터)
  const dummyUser = {
    name: 'CyberCoder',
    email: 'cybercoder@example.com',
    joinDate: '2024-01-15',
    totalScore: 1580,
    wins: 87,
    losses: 40,
    draws: 8,
    totalBattles: 135,
    currentStreak: 5,
    bestStreak: 12,
    rank: 15,
    favoriteLanguage: 'Python',
    averageTime: '4:32',
    bestTime: '1:47'
  };

  const currentUser = user || dummyUser; // Use context user if available, otherwise dummy

    const { tier, lp } = parseTotalScore(currentUser.totalScore);
  const winRate = ((currentUser.wins / currentUser.totalBattles) * 100).toFixed(1);

  // 최근 전적 데이터 (더 많은 더미 데이터 추가)
  const recentMatches = [
    { 
      opponent: 'AlgorithmMaster', 
      result: 'Win', 
      tier: '다이아몬드', 
      date: '2024-06-25', 
      earnedLP: '+25 LP', 
      currentLP: '1,580 LP',
      language: 'Python',
      difficulty: '고급'
    },
    { 
      opponent: 'CodeNinja', 
      result: 'Lose', 
      tier: '다이아몬드', 
      date: '2024-06-24', 
      earnedLP: '-18 LP', 
      currentLP: '1,555 LP',
      language: 'JavaScript',
      difficulty: '중급'
    },
    { 
      opponent: 'ByteWarrior', 
      result: 'Win', 
      tier: '플래티넘', 
      date: '2024-06-24', 
      earnedLP: '+22 LP', 
      currentLP: '1,573 LP',
      language: 'Java',
      difficulty: '고급'
    },
    { 
      opponent: 'ScriptKiddie', 
      result: 'Win', 
      tier: '골드', 
      date: '2024-06-23', 
      earnedLP: '+20 LP', 
      currentLP: '1,551 LP',
      language: 'C++',
      difficulty: '중급'
    },
    { 
      opponent: 'DebugMaster', 
      result: 'Lose', 
      tier: '플래티넘', 
      date: '2024-06-23', 
      earnedLP: '-16 LP', 
      currentLP: '1,531 LP',
      language: 'Python',
      difficulty: '고급'
    },
    { 
      opponent: 'ReactPro', 
      result: 'Win', 
      tier: '골드', 
      date: '2024-06-22', 
      earnedLP: '+18 LP', 
      currentLP: '1,547 LP',
      language: 'JavaScript',
      difficulty: '중급'
    },
    { 
      opponent: 'JavaGuru', 
      result: 'Win', 
      tier: '플래티넘', 
      date: '2024-06-22', 
      earnedLP: '+21 LP', 
      currentLP: '1,529 LP',
      language: 'Java',
      difficulty: '고급'
    },
    { 
      opponent: 'CppMaster', 
      result: 'Lose', 
      tier: '다이아몬드', 
      date: '2024-06-21', 
      earnedLP: '-19 LP', 
      currentLP: '1,508 LP',
      language: 'C++',
      difficulty: '전문가'
    },
    { 
      opponent: 'PythonKing', 
      result: 'Win', 
      tier: '골드', 
      date: '2024-06-21', 
      earnedLP: '+17 LP', 
      currentLP: '1,527 LP',
      language: 'Python',
      difficulty: '중급'
    },
    { 
      opponent: 'WebDevNinja', 
      result: 'Win', 
      tier: '플래티넘', 
      date: '2024-06-20', 
      earnedLP: '+23 LP', 
      currentLP: '1,510 LP',
      language: 'TypeScript',
      difficulty: '고급'
    }
  ];

  // 모든 뱃지 데이터 (획득/미획득 포함)
  const allAchievements = [
    { 
      id: 1, 
      title: '첫 승리', 
      description: '첫 대결에서 승리하기', 
      completed: true,
      icon: Trophy,
      rarity: 'common'
    },
    { 
      id: 2, 
      title: '연승왕', 
      description: '5연승 달성하기', 
      completed: true,
      icon: Flame,
      rarity: 'rare'
    },
    { 
      id: 3, 
      title: '속도왕', 
      description: '2분 이내 문제 해결하기', 
      completed: true,
      icon: Zap,
      rarity: 'epic'
    },
    { 
      id: 4, 
      title: '완벽주의자', 
      description: '정확도 100% 10회 달성', 
      completed: true,
      icon: Target,
      rarity: 'rare'
    },
    { 
      id: 5, 
      title: '실버 등급', 
      description: '실버 티어 달성하기', 
      completed: true,
      icon: Medal,
      rarity: 'common'
    },
    { 
      id: 6, 
      title: '골드 등급', 
      description: '골드 티어 달성하기', 
      completed: true,
      icon: Award,
      rarity: 'uncommon'
    },
    { 
      id: 7, 
      title: '플래티넘 등급', 
      description: '플래티넘 티어 달성하기', 
      completed: false,
      icon: Shield,
      rarity: 'epic'
    },
    { 
      id: 8, 
      title: '다이아몬드 등급', 
      description: '다이아몬드 티어 달성하기', 
      completed: false,
      icon: Gem,
      rarity: 'legendary'
    },
    { 
      id: 9, 
      title: '마스터 등급', 
      description: '마스터 티어 달성하기', 
      completed: false,
      icon: Crown,
      rarity: 'legendary'
    },
    { 
      id: 10, 
      title: '100전 100승', 
      description: '100승 달성하기', 
      completed: false,
      icon: Star,
      rarity: 'epic'
    },
    { 
      id: 11, 
      title: '언어 마스터', 
      description: '5개 언어로 승리하기', 
      completed: false,
      icon: User,
      rarity: 'rare'
    },
    { 
      id: 12, 
      title: '전설의 연승', 
      description: '20연승 달성하기', 
      completed: false,
      icon: Flame,
      rarity: 'legendary'
    }
  ];

  const getResultColor = (result: string) => {
    switch (result) {
      case 'Win': return 'text-green-400';
      case 'Lose': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getBadgeRarityColor = (rarity: string, completed: boolean) => {
    if (!completed) return 'text-gray-500 bg-gray-800/50';
    
    switch (rarity) {
      case 'common': return 'text-gray-300 bg-gray-600/30';
      case 'uncommon': return 'text-green-400 bg-green-500/20';
      case 'rare': return 'text-blue-400 bg-blue-500/20';
      case 'epic': return 'text-purple-400 bg-purple-500/20';
      case 'legendary': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-300 bg-gray-600/30';
    }
  };

  return (
    <div className="min-h-screen cyber-grid">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 왼쪽: 프로필 기본 정보 */}
            <div className="flex flex-col space-y-6">
              <CyberCard className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">{currentUser.username}</h1>
                <div className="text-gray-400 text-sm mb-4">
                  <span className={tier.color}>{tier.name}</span> • 전체랭킹 {currentUser.rank}위
                </div>
                <div className="text-center mb-4">
                  <div className="text-lg font-bold text-cyber-blue">{lp} LP</div>
                  <div className="text-sm text-gray-400">총 포인트</div>
                </div>
                <CyberButton 
                  onClick={() => setShowEditModal(true)}
                  className="w-full"
                >
                  프로필 편집
                </CyberButton>
              </CyberCard>

              {/* 게임 통계 */}
              <CyberCard className="flex-1 flex flex-col">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-pink-400" />
                  <h2 className="text-lg font-bold text-white">게임 통계</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-xl font-bold text-white">{currentUser.totalBattles}</div>
                    <div className="text-sm text-gray-400">총게임</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-xl font-bold text-green-400">{currentUser.wins}</div>
                    <div className="text-sm text-gray-400">승리</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-xl font-bold text-red-400">{currentUser.losses}</div>
                    <div className="text-sm text-gray-400">패배</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-xl font-bold text-yellow-400">{winRate}%</div>
                    <div className="text-sm text-gray-400">승률</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-xl font-bold text-purple-400">{currentUser.averageTime}</div>
                    <div className="text-sm text-gray-400">평균 시간</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-xl font-bold text-cyan-400">{currentUser.bestTime}</div>
                    <div className="text-sm text-gray-400">최단 시간</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-xl font-bold text-orange-400">{currentUser.currentStreak}</div>
                    <div className="text-sm text-gray-400">현재 연승</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-xl font-bold text-pink-400">{currentUser.bestStreak}</div>
                    <div className="text-sm text-gray-400">최고 연승</div>
                  </div>
                </div>
              </CyberCard>
            </div>

            {/* 오른쪽: 최근 전적과 명예 */}
            <div className="lg:col-span-2 flex flex-col space-y-6">
              {/* 최근 전적 */}
              <CyberCard>
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-lg font-bold text-white">최근 전적</h2>
                </div>
                
                <div className="h-80 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="space-y-2 pr-4">
                      {recentMatches.map((match, index) => (
                        <div key={index} className="grid grid-cols-6 gap-4 p-3 bg-black/20 rounded-lg text-sm">
                          <div className={`font-bold ${getResultColor(match.result)}`}>
                            {match.result}
                          </div>
                          <div className="text-gray-300">vs {match.opponent}</div>
                          <div className="text-gray-400">{match.language}</div>
                          <div className="text-gray-400">{match.difficulty}</div>
                          <div className="text-gray-400">{match.date}</div>
                          <div className={`${match.result === 'Win' ? 'text-green-400' : 'text-red-400'}`}>
                            {match.earnedLP}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CyberCard>

              {/* 명예 (모든 배지) */}
              <CyberCard className="flex-1 flex flex-col">
                <div className="flex items-center space-x-2 mb-6">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <h2 className="text-lg font-bold text-white">명예 컬렉션</h2>
                  <span className="text-sm text-gray-400">
                    ({allAchievements.filter(a => a.completed).length}/{allAchievements.length})
                  </span>
                </div>
                
                <div className="h-64 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                      {allAchievements.map((achievement) => {
                        const IconComponent = achievement.icon;
                        return (
                          <div 
                            key={achievement.id} 
                            className={`flex flex-col items-center p-4 rounded-lg border transition-all duration-200 ${
                              achievement.completed 
                                ? `${getBadgeRarityColor(achievement.rarity, true)} hover:scale-105 border-current/30` 
                                : 'bg-gray-800/30 border-gray-700/50 opacity-60'
                            }`}
                          >
                            <IconComponent className={`h-8 w-8 mb-2 ${
                              achievement.completed 
                                ? getBadgeRarityColor(achievement.rarity, true).split(' ')[0]
                                : 'text-gray-500'
                            }`} />
                            <span className={`text-sm font-medium text-center mb-1 ${
                              achievement.completed ? 'text-white' : 'text-gray-500'
                            }`}>
                              {achievement.title}
                            </span>
                            <span className={`text-xs text-center ${
                              achievement.completed ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {achievement.description}
                            </span>
                            {achievement.completed && (
                              <CheckCircle className="h-4 w-4 text-green-400 mt-2" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </CyberCard>
            </div>
          </div>
        </div>
      </main>

      {showEditModal && (
        <ProfileEditModal 
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          currentUsername={currentUser.username}
        />
      )}
    </div>
  );
};

export default ProfilePage;
