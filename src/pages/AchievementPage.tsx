import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import { Trophy, Crown, Zap, Target, Medal, Star, Sparkles, ChevronLeft, ChevronRight, Flame, Shield, Sword, Award, Play } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { getUserAchievements, claimAchievementReward } from '@/utils/api';
import { UserAchievement } from '@/types/achievement';
import { useToast } from '@/components/ui/use-toast';

const AchievementPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: isUserLoading, setNewlyAchieved } = useUser();
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { toast } = useToast();

  const ACHIEVEMENTS_PER_PAGE = 3;

  const fetchAchievements = useCallback(async () => {
    if (!user?.user_id) return;
    setIsLoadingAchievements(true);
    try {
      const data: UserAchievement[] = await getUserAchievements(user.user_id);
      const unclaimedAchievements = data.filter(ua => !ua.is_reward_received);
      setUserAchievements(unclaimedAchievements);
    } catch (error) {
      console.error('Failed to fetch user achievements:', error);
      toast({
        title: '업적 불러오기 실패',
        description: '업적 정보를 불러오는 데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingAchievements(false);
    }
  }, [user?.user_id, toast]);

  useEffect(() => {
    const { unclaimedAchievements } = location.state || {};

    if (unclaimedAchievements && unclaimedAchievements.length > 0) {
      setUserAchievements(unclaimedAchievements);
      setIsLoadingAchievements(false);
    } else if (!isUserLoading && user?.user_id) {
      fetchAchievements();
    }
  }, [isUserLoading, user?.user_id, fetchAchievements, location.state]);

  const handleClaimReward = async (userAchievementId: number) => {
    if (!user?.user_id) return;
    try {
      await claimAchievementReward(user.user_id, userAchievementId);
      toast({
        title: '보상 수령 완료',
        description: '업적 보상을 성공적으로 수령했습니다!',
        variant: 'success',
      });
      // UI 업데이트를 위해 업적 목록을 다시 불러옵니다.
      fetchAchievements();
      setNewlyAchieved(null); // 보상 수령 후 newlyAchieved 상태 초기화
    } catch (error: any) {
      console.error('Failed to claim reward:', error);
      toast({
        title: '보상 수령 실패',
        description: error.message || '보상을 수령하는 데 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  const totalPages = Math.ceil(userAchievements.length / ACHIEVEMENTS_PER_PAGE);
  const currentAchievements = userAchievements.slice(
    currentPage * ACHIEVEMENTS_PER_PAGE,
    (currentPage + 1) * ACHIEVEMENTS_PER_PAGE
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return 'text-gray-400';
      case 'RARE': return 'text-blue-400';
      case 'EPIC': return 'text-purple-400';
      case 'LEGENDARY': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'COMMON': return 'shadow-gray-400/20';
      case 'RARE': return 'shadow-blue-400/20';
      case 'EPIC': return 'shadow-purple-400/20';
      case 'LEGENDARY': return 'shadow-yellow-400/20';
      default: return 'shadow-gray-400/20';
    }
  };

  const getAchievementIcon = (triggerType: string) => {
    switch (triggerType) {
      case 'TOTAL_WIN':
      case 'FIRST_WIN':
      case 'CONSECUTIVE_WIN': return <Trophy className="h-12 w-12" />;
      case 'TOTAL_LOSS':
      case 'CONSECUTIVE_LOSS': return <Shield className="h-12 w-12" />;
      case 'TOTAL_DRAW': return <Sword className="h-12 w-12" />;
      case 'PROBLEM_SOLVED': return <Target className="h-12 w-12" />;
      case 'WIN_WITHIN_N_SUBMISSIONS':
      case 'WIN_WITHOUT_MISS': return <Zap className="h-12 w-12" />;
      case 'FAST_WIN': return <Flame className="h-12 w-12" />;
      case 'APPROVED_PROBLEM_COUNT': return <Medal className="h-12 w-12" />;
      default: return <Award className="h-12 w-12" />;
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

  if (isUserLoading || isLoadingAchievements) {
    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center">
        <p className="text-white text-xl">업적 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-grid">
      <Header />
      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-250px)]">
        <div className="w-full max-w-6xl">
          <CyberCard glowing className="text-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-yellow-400/5 animate-pulse"></div>
            <div className="relative z-10 space-y-8">
              <div className={`transition-all duration-1000 opacity-100 translate-y-0`}>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Trophy className="h-12 w-12 text-yellow-400 animate-pulse" />
                  <h1 className="text-4xl font-bold text-white">내 업적</h1>
                  <Trophy className="h-12 w-12 text-yellow-400 animate-pulse" />
                </div>
                <p className="text-xl text-gray-300">획득한 업적들을 확인하고 보상을 수령하세요!</p>
              </div>

              {totalPages > 0 && (
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span className="text-gray-400 text-sm">
                    {currentPage + 1} / {totalPages}
                  </span>
                </div>
              )}

              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentPage * 100}%)`,
                  }}
                >
                  {Array.from({ length: totalPages }, (_, pageIndex) => {
                    const pageAchievements = userAchievements.slice(
                      pageIndex * ACHIEVEMENTS_PER_PAGE,
                      (pageIndex + 1) * ACHIEVEMENTS_PER_PAGE
                    );

                    return (
                      <div
                        key={pageIndex}
                        className="flex-shrink-0 p-2"
                        style={{ width: `100%` }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pageAchievements.map((userAchievement) => (
                          <div
                            key={userAchievement.user_achievement_id}
                            className="transition-all duration-800 opacity-100 scale-100 translate-y-0"
                          >
                            <div className="relative group hover:scale-105 transition-transform duration-300 overflow-visible">
                              {!userAchievement.is_reward_received && (
                                <div className="absolute -top-1 -right-1 z-20">
                                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                    NEW!
                                  </div>
                                  <Sparkles className="absolute -top-1 -left-1 h-4 w-4 text-yellow-400 animate-spin" />
                                </div>
                              )}
                              <div className={`
                                bg-gradient-to-br from-background/80 to-background/40
                                border border-primary/20 rounded-lg p-6 h-full
                                hover:border-primary/40 transition-all duration-300
                                shadow-lg ${getRarityGlow(userAchievement.achievement.reward_type)}
                              `}>
                                <div className="flex flex-col items-center space-y-4">
                                  <div className={`
                                    p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10
                                    ${getRarityColor(userAchievement.achievement.reward_type)}
                                    animate-bounce-slow
                                  `}>
                                    {getAchievementIcon(userAchievement.achievement.trigger_type)}
                                  </div>
                                  <div className={`
                                    text-xs uppercase font-bold tracking-wider
                                    ${getRarityColor(userAchievement.achievement.reward_type)}
                                  `}>
                                    {userAchievement.achievement.reward_type}
                                  </div>
                                  <h3 className="text-xl font-bold text-white text-center">
                                    {userAchievement.achievement.title}
                                  </h3>
                                  <p className="text-gray-400 text-center text-sm leading-relaxed">
                                    {userAchievement.achievement.description}
                                  </p>
                                  <p className="text-gray-500 text-xs">
                                    획득일: {new Date(userAchievement.obtained_at).toLocaleDateString()}
                                  </p>
                                  <div className="flex space-x-1">
                                    {[...Array(userAchievement.achievement.reward_type === 'LEGENDARY' ? 5 :
                                             userAchievement.achievement.reward_type === 'EPIC' ? 4 :
                                             userAchievement.achievement.reward_type === 'RARE' ? 3 : 2)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${getRarityColor(userAchievement.achievement.reward_type)} fill-current animate-pulse`}
                                        style={{ animationDelay: `${i * 100}ms` }}
                                      />
                                    ))}
                                  </div>
                                  {!userAchievement.is_reward_received ? (
                                    <CyberButton
                                      onClick={() => handleClaimReward(userAchievement.user_achievement_id)}
                                      className="mt-4"
                                    >
                                      보상 수령
                                    </CyberButton>
                                  ) : (
                                    <p className="text-green-400 mt-4">보상 수령 완료</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>

              {totalPages > 1 && (
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

              <div className="pt-8 space-y-6">
                <div className="flex justify-center space-x-4">
                  <CyberButton
                    onClick={() => navigate('/matching')}
                    size="lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    다시 하기
                  </CyberButton>
                  <CyberButton
                    onClick={() => navigate('/profile')}
                    size="lg"
                    variant="secondary"
                  >
                    <Trophy className="h-5 w-5 mr-2" />
                    모든 업적 확인
                  </CyberButton>
                </div>
              </div>
            </div>
          </CyberCard>
        </div>
      </main>
    </div>
  );
};

export default AchievementPage;
