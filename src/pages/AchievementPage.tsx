import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import { 
  Trophy, 
  Crown, 
  Zap, 
  Target, 
  Medal, 
  Star,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Flame,
  Shield,
  Sword,
  Play, // 추가
  Eye // 추가
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isNew: boolean;
  category: 'battle' | 'skill' | 'streak' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const AchievementPage = () => {
  const navigate = useNavigate();
  const [animationPhase, setAnimationPhase] = useState(0);
  const [visibleAchievements, setVisibleAchievements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const ACHIEVEMENTS_PER_PAGE = 3;

  // 새로 획득한 업적들만
  const newAchievements: Achievement[] = [
    {
      id: 'first_victory',
      title: '첫 승리',
      description: '첫 번째 승리를 달성했습니다!',
      icon: <Trophy className="h-12 w-12" />,
      isNew: true,
      category: 'battle' as const,
      rarity: 'common' as const
    },
    {
      id: 'speed_coder',
      title: '스피드 코더',
      description: '3분 안에 문제를 해결했습니다!',
      icon: <Zap className="h-12 w-12" />,
      isNew: true,
      category: 'skill' as const,
      rarity: 'rare' as const
    },
    {
      id: 'perfect_solution',
      title: '완벽한 솔루션',
      description: '첫 번째 시도에 문제를 완벽하게 해결했습니다!',
      icon: <Target className="h-12 w-12" />,
      isNew: true,
      category: 'skill' as const,
      rarity: 'epic' as const
    },
    {
      id: 'champion',
      title: '챔피언',
      description: '10연승을 달성했습니다!',
      icon: <Crown className="h-12 w-12" />,
      isNew: true,
      category: 'streak' as const,
      rarity: 'legendary' as const
    },
    {
      id: 'medal_collector',
      title: '메달 수집가',
      description: '5개의 서로 다른 업적을 획득했습니다!',
      icon: <Medal className="h-12 w-12" />,
      isNew: true,
      category: 'special' as const,
      rarity: 'rare' as const
    },
    {
      id: 'flame_warrior',
      title: '불꽃 전사',
      description: '화끈한 승부로 상대를 압도했습니다!',
      icon: <Flame className="h-12 w-12" />,
      isNew: true,
      category: 'battle' as const,
      rarity: 'epic' as const
    },
    {
      id: 'shield_master',
      title: '방어의 달인',
      description: '완벽한 방어 코드로 버그 없는 솔루션을 작성했습니다!',
      icon: <Shield className="h-12 w-12" />,
      isNew: true,
      category: 'skill' as const,
      rarity: 'legendary' as const
    }
  ];

  const achievements = newAchievements; // 새로 획득한 업적만 표시

  // 페이지네이션 계산
  const totalPages = Math.ceil(achievements.length / ACHIEVEMENTS_PER_PAGE);
  const currentAchievements = achievements.slice(
    currentPage * ACHIEVEMENTS_PER_PAGE,
    (currentPage + 1) * ACHIEVEMENTS_PER_PAGE
  );

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityGlow = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'shadow-gray-400/20';
      case 'rare': return 'shadow-blue-400/20';
      case 'epic': return 'shadow-purple-400/20';
      case 'legendary': return 'shadow-yellow-400/20';
      default: return 'shadow-gray-400/20';
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages && !isTransitioning) {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentPage(newPage);
        setIsTransitioning(false);
      }, 300);
    }
  };

  useEffect(() => {
    // 초기 애니메이션 시작
    setTimeout(() => setAnimationPhase(1), 500);
    
    // 현재 페이지의 업적들을 하나씩 나타나게 하기 (첫 로드시에만)
    currentAchievements.forEach((_, index) => {
      setTimeout(() => {
        setVisibleAchievements(prev => prev + 1);
      }, 1500 + (index * 800));
    });

    // 완료 단계
    setTimeout(() => {
      setAnimationPhase(2);
    }, 1500 + (currentAchievements.length * 800) + 1000);
  }, []);  // currentPage 의존성 제거

  return (
    <div className="min-h-screen cyber-grid">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-250px)]">
        <div className="w-full max-w-6xl">
          <CyberCard glowing className="text-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-yellow-400/5 animate-pulse"></div>
            
            <div className="relative z-10 space-y-8">
              {/* 헤더 */}
              <div className={`transition-all duration-1000 ${
                animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Trophy className="h-12 w-12 text-yellow-400 animate-pulse" />
                  <h1 className="text-4xl font-bold text-white">업적 달성!</h1>
                  <Trophy className="h-12 w-12 text-yellow-400 animate-pulse" />
                </div>
                <p className="text-xl text-gray-300">새로운 업적을 획득했습니다!</p>
              </div>

              {/* 페이지 인디케이터 */}
              {totalPages > 1 && animationPhase >= 1 && (
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span className="text-gray-400 text-sm">
                    {currentPage + 1} / {totalPages}
                  </span>
                </div>
              )}

              {/* 업적 목록 컨테이너 */}
              <div className="relative overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ 
                    transform: `translateX(-${currentPage * (100 / totalPages)}%)`,
                    width: `${totalPages * 100}%`
                  }}
                >
                  {Array.from({ length: totalPages }, (_, pageIndex) => {
                    const pageAchievements = achievements.slice(
                      pageIndex * ACHIEVEMENTS_PER_PAGE,
                      (pageIndex + 1) * ACHIEVEMENTS_PER_PAGE
                    );
                    
                    return (
                      <div 
                        key={pageIndex}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-shrink-0 p-2"
                        style={{ width: `${100 / totalPages}%` }}
                      >
                        {pageAchievements.map((achievement, index) => (
                          <div
                            key={achievement.id}
                            className="transition-all duration-800 opacity-100 scale-100 translate-y-0"
                          >
                            <div className="relative group hover:scale-105 transition-transform duration-300 overflow-visible">
                              {/* 새 업적 표시 - overflow 방지를 위해 더 안전한 위치로 이동 */}
                              {achievement.isNew && (
                                <div className="absolute -top-1 -right-1 z-20">
                                  <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                    NEW!
                                  </div>
                                  <Sparkles className="absolute -top-1 -left-1 h-4 w-4 text-yellow-400 animate-spin" />
                                </div>
                              )}
                              
                              {/* 업적 카드 */}
                              <div className={`
                                bg-gradient-to-br from-background/80 to-background/40 
                                border border-primary/20 rounded-lg p-6 h-full
                                hover:border-primary/40 transition-all duration-300
                                shadow-lg ${getRarityGlow(achievement.rarity)}
                                ${achievement.isNew ? 'animate-pulse-slow' : ''}
                              `}>
                                <div className="flex flex-col items-center space-y-4">
                                  {/* 아이콘 */}
                                  <div className={`
                                    p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10
                                    ${getRarityColor(achievement.rarity)}
                                    animate-bounce-slow
                                  `}>
                                    {achievement.icon}
                                  </div>
                                  
                                  {/* 희귀도 표시 */}
                                  <div className={`
                                    text-xs uppercase font-bold tracking-wider
                                    ${getRarityColor(achievement.rarity)}
                                  `}>
                                    {achievement.rarity}
                                  </div>
                                  
                                  {/* 제목 */}
                                  <h3 className="text-xl font-bold text-white text-center">
                                    {achievement.title}
                                  </h3>
                                  
                                  {/* 설명 */}
                                  <p className="text-gray-400 text-center text-sm leading-relaxed">
                                    {achievement.description}
                                  </p>
                                  
                                  {/* 별 장식 */}
                                  <div className="flex space-x-1">
                                    {[...Array(achievement.rarity === 'legendary' ? 5 : 
                                             achievement.rarity === 'epic' ? 4 :
                                             achievement.rarity === 'rare' ? 3 : 2)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`h-4 w-4 ${getRarityColor(achievement.rarity)} fill-current animate-pulse`}
                                        style={{ animationDelay: `${i * 100}ms` }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 페이지네이션 버튼 */}
              {totalPages > 1 && animationPhase >= 1 && (
                <div className="flex items-center justify-center space-x-6 mt-8">
                  <CyberButton
                    variant="secondary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="flex items-center space-x-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>이전</span>
                  </CyberButton>
                  
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          i === currentPage 
                            ? 'bg-primary scale-125' 
                            : 'bg-gray-600 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <CyberButton
                    variant="secondary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="flex items-center space-x-2"
                  >
                    <span>다음</span>
                    <ChevronRight className="h-4 w-4" />
                  </CyberButton>
                </div>
              )}

              {/* 완료 버튼 */}
              {animationPhase >= 2 && (
                <div className="pt-8 space-y-6 animate-fade-in">
                  <div className="flex items-center justify-center space-x-4">
                    <Flame className="h-8 w-8 text-orange-400 animate-pulse" />
                    <p className="text-2xl font-bold text-green-400">
                      {achievements.filter(a => a.isNew).length}개의 새로운 업적을 달성했습니다!
                    </p>
                    <Flame className="h-8 w-8 text-orange-400 animate-pulse" />
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <CyberButton 
                      onClick={() => navigate('/matching')}
                      size="lg"
                      className="animate-pulse-neon"
                    >
                      <ArrowRight className="h-5 w-5 mr-2" />
                      계속하기
                    </CyberButton>
                    
                    <CyberButton 
                      variant="secondary"
                      onClick={() => navigate('/profile')}
                      size="lg"
                    >
                      <Trophy className="h-5 w-5 mr-2" />
                      모든 업적 보기
                    </CyberButton>
                  </div>
                </div>
              )}
            </div>
          </CyberCard>
        </div>
      </main>
    </div>
  );
};

export default AchievementPage;