import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { getAllUserAchievements, getUserAchievements } from "@/utils/api";
import { UserAchievement } from "@/types/achievement"; // Import getAllUserAchievements
import {
  Trophy,
  Clock,
  User,
  Award,
  ArrowRight,
  BarChart3,
  Play,
  Eye,
  Code,
  Crown,
  Shield,
  Sword,
  Star,
  Zap,
} from "lucide-react";
import { getTierFromTotalScore, parseTotalScore, getTierChange } from "@/utils/lpSystem";
import { authFetch } from "@/utils/api";

const apiUrl = import.meta.env.VITE_API_URL;

// 서버에서 받는 데이터 형식
interface MatchResult {
  winner: number | null;
  reason: 'finish' | 'timeout' | 'surrender' | 'walkover' | 'late' | 'draw';
  plus_mmr: number;
  minus_mmr: number;
  my_time?: string;
  opponent_time?: string;
  my_code?: string;
}

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, isLoading: isUserLoading } = useUser(); // newlyAchieved 제거
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnclaimedAchievements, setHasUnclaimedAchievements] = useState<UserAchievement[]>([]); // 새로운 상태 추가

  const [animatingLp, setAnimatingLp] = useState(false);
  const [displayLp, setDisplayLp] = useState(0);
  const [tierChangeAnimation, setTierChangeAnimation] = useState(false);
  const [initialUserTotalScore, setInitialUserTotalScore] = useState<number | null>(null);

  const matchResult = location.state?.matchResult as MatchResult | null;
  const matchType = location.state?.matchType as string | null;

  useEffect(() => {
    const gameId = sessionStorage.getItem("gameId");

    sessionStorage.removeItem("currentMatchId");
    sessionStorage.removeItem("gameId");
    sessionStorage.removeItem("matchResult");
    sessionStorage.removeItem("websocketUrl");
    sessionStorage.removeItem("currentGameId");

    if (gameId) {
      sessionStorage.removeItem(`problem_${gameId}`);
    }

    console.log('ResultPage: Match result from state:', matchResult);

    if (!matchResult) {
        console.log('ResultPage: No match result found in state. Navigating to home.');
        navigate("/home");
        return;
    }

    // user 데이터 로딩이 완료되면 initialUserTotalScore 설정 및 업적 불러오기
    if (!isUserLoading && user && user.totalScore !== undefined && initialUserTotalScore === null) {
      setInitialUserTotalScore(user.totalScore);

      const fetchAchievements = async () => {
        if (user?.user_id) {
          try {
            const data = await getUserAchievements(user.user_id);
            const unclaimed = data.filter(ua => !ua.is_reward_received);
            setHasUnclaimedAchievements(unclaimed);
          } catch (error) {
            console.error("Failed to fetch achievements in ResultPage:", error);
            setHasUnclaimedAchievements([]);
          } finally {
            setIsLoading(false); // 모든 데이터 로딩 완료 후 로딩 상태 해제
          }
        }
      };
      fetchAchievements();
    } else if (isUserLoading) {
      setIsLoading(true); // user 로딩 중이면 페이지 로딩 상태 유지
    } else if (!user) {
      // user가 없으면 (로그인 안 됨 등) 홈으로 리다이렉트
      navigate("/home");
    }

  }, [navigate, user, isUserLoading, initialUserTotalScore, matchResult]);

  if (isLoading || !matchResult || !user || initialUserTotalScore === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-2xl">결과를 불러오는 중...</p>
      </div>
    );
  }

  const { winner, reason, plus_mmr, minus_mmr } = matchResult;

  const victory = winner !== null && Number(winner) === Number(user.user_id);
  const isDraw = winner === null;

  const earned = isDraw ? 0 : victory ? plus_mmr : minus_mmr;

  let resultTitle = "";
  let resultMessage = "";

  if (isDraw) {
    resultTitle = "무승부";
    resultMessage = "치열한 접전 끝에 무승부를 기록했습니다.";
  } else if (victory) {
    resultTitle = "승리!";
    switch (reason) {
      case 'surrender':
        resultMessage = "상대방이 항복하여 승리했습니다!";
        break;
      case 'walkover':
        resultMessage = "상대방의 연결 문제로 부전승을 거두었습니다.";
        break;
      case 'finish':
      case 'timeout': // 백엔드에서 timeout으로 승리하는 경우 (상대방이 더 늦게 타임아웃되거나 기권)
        resultMessage = "축하합니다! 문제를 성공적으로 해결하여 승리했습니다.";
        break;
      default:
        resultMessage = "축하합니다! 코딩 대결에서 승리했습니다.";
        break;
    }
  } else { // Loss
    resultTitle = "패배";
    switch (reason) {
      case 'surrender':
        resultMessage = "아쉽지만 항복하셨습니다. 다음 대결을 기약해주세요.";
        break;
      case 'late':
      case 'timeout': // 백엔드에서 timeout으로 패배하는 경우 (내가 더 늦게 타임아웃되거나 상대가 먼저 완료)
        resultMessage = "상대방이 먼저 문제를 해결했습니다. 다음 기회에 만회하세요!";
        break;
      case 'finish':
        resultMessage = "상대방이 문제를 해결하여 패배했습니다. 분발하세요!";
        break;
      default:
        resultMessage = "아쉽네요. 다음엔 더 잘할 수 있을 거예요!";
        break;
    }
  }

  const initialTotalScore = initialUserTotalScore; // 여기서 고정된 초기 점수 사용
  const finalTotalScore = initialTotalScore + earned;

  const initialTierInfo = parseTotalScore(initialTotalScore);
  const finalTierInfo = parseTotalScore(finalTotalScore);
  const tierChange = getTierChange(initialTotalScore, finalTotalScore);
  const hasTierChange = tierChange !== "none";

  const handleGoHome = () => {
    navigate("/home");
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setAnimatingLp(true);

      const startLp = initialTierInfo.lp;
      const endLp = finalTierInfo.lp;
      setDisplayLp(startLp);

      if (startLp === endLp) {
        setAnimatingLp(false);
        setUser({ ...user, totalScore: finalTotalScore }); // 애니메이션이 없으면 바로 업데이트
        return;
      }

      const duration = 2000; // 2 seconds
      const steps = 60; // Number of animation frames
      const scoreIncrementPerStep = (finalTotalScore - initialTotalScore) / steps;

      let currentAnimatedScore = initialTotalScore;
      let previousTierName = initialTierInfo.tier.name; // Track tier name for animation trigger

      const interval = setInterval(() => {
        currentAnimatedScore += scoreIncrementPerStep;

        // Ensure we don't overshoot the final score
        if ((finalTotalScore - initialTotalScore > 0 && currentAnimatedScore >= finalTotalScore) ||
            (finalTotalScore - initialTotalScore < 0 && currentAnimatedScore <= finalTotalScore)) {
          currentAnimatedScore = finalTotalScore;
        }

        const currentTierInfo = parseTotalScore(Math.round(currentAnimatedScore)); // currentAnimatedScore를 반올림하여 전달
        setDisplayLp(currentTierInfo.lp); // Display LP within the current tier

        // Check for tier change during animation
        if (currentTierInfo.tier.name !== previousTierName) {
          setTierChangeAnimation(true); // Trigger tier change animation
          previousTierName = currentTierInfo.tier.name; // Update previous tier
        }

        if (currentAnimatedScore === finalTotalScore) {
          setDisplayLp(finalTierInfo.lp); // Ensure final LP is exactly correct
          setAnimatingLp(false);
          clearInterval(interval);
          setUser({ ...user, totalScore: finalTotalScore }); // Update user context after animation

          if (hasTierChange) {
            setTimeout(() => {
              setTierChangeAnimation(false); // Reset tier change animation state
              toast({
                title: tierChange === "promotion" ? "티어 승급!" : "티어 강등...",
                description: `${initialTierInfo.tier.name}에서 ${finalTierInfo.tier.name}으로 ${tierChange === "promotion" ? "승급" : "강등"}되었습니다.`,
                variant: tierChange === "promotion" ? "success" : "destructive",
              });
            }, 1000); // 1초 후 초기화 및 토스트 알림
          }
        }
      }, duration / steps);
    }
  };

  const handleViewDetails = () => setCurrentStep(3);

  // 단계 1: 승패 결과
  if (currentStep === 1) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-250px)]">
          <div className="w-full max-w-2xl">
            <CyberCard glowing className="text-center p-12">
              <div className="space-y-8">
                {isDraw ? (
                    <>
                        <Shield className="h-24 w-24 text-gray-400 mx-auto animate-pulse" />
                        <h1 className="text-6xl font-bold text-gray-300">{resultTitle}</h1>
                        <p className="text-2xl text-gray-400">{resultMessage}</p>
                    </>
                ) : victory ? (
                  <>
                    <Trophy className="h-24 w-24 text-yellow-400 mx-auto animate-bounce" />
                    <h1 className="text-6xl font-bold text-green-400 animate-pulse">{resultTitle}</h1>
                    <p className="text-2xl text-gray-300">{resultMessage}</p>
                  </>
                ) : (
                  <>
                    <div className="h-24 w-24 bg-red-500/20 rounded-full mx-auto flex items-center justify-center">
                      <span className="text-5xl">😢</span>
                    </div>
                    <h1 className="text-6xl font-bold text-red-400">{resultTitle}</h1>
                    <p className="text-2xl text-gray-300">{resultMessage}</p>
                  </>
                )}
                <div className="flex justify-center">
                  {matchType === 'custom' ? (
                    <CyberButton onClick={handleGoHome} size="lg" className="animate-pulse-neon">
                      <ArrowRight className="h-6 w-6 mr-2" />
                      홈으로 가기
                    </CyberButton>
                  ) : (
                    <CyberButton onClick={handleContinue} size="lg" className="animate-pulse-neon">
                      <ArrowRight className="h-6 w-6 mr-2" />
                      결과 확인
                    </CyberButton>
                  )}
                </div>
              </div>
            </CyberCard>
          </div>
        </main>
      </div>
    );
  }

  // 단계 2: LP 변화 애니메이션 및 액션 선택
  if (currentStep === 2) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-250px)]">
          <div className="w-full max-w-2xl">
            <CyberCard glowing className="text-center p-12">
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-white mb-8">MMR 변동</h2>
                
                {/* 티어 변화 애니메이션 */}
                <div className="mb-8 relative h-32 flex items-center justify-center">
                    {hasTierChange ? (
                        (animatingLp || tierChangeAnimation) ? (
                            <>
                                {/* Initial Tier */}
                                <div className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${tierChangeAnimation ? "opacity-0" : "opacity-100"}`}>
                                    <Crown className={`h-16 w-16 ${initialTierInfo.tier.color}`} />
                                    <span className={`text-4xl font-bold ${initialTierInfo.tier.color}`}>{initialTierInfo.tier.name}</span>
                                </div>
                                {/* Final Tier */}
                                <div className={`absolute inset-0 transition-opacity duration-1000 delay-[1000ms] flex items-center justify-center ${tierChangeAnimation ? "opacity-100" : "opacity-0"}`}>
                                    <Crown className={`h-20 w-20 ${finalTierInfo.tier.color} animate-pulse`} />
                                    <span className={`text-5xl font-bold ${finalTierInfo.tier.color} neon-text`}>{finalTierInfo.tier.name}</span>
                                </div>
                            </>
                        ) : (
                            // Animation finished, show final tier
                            <div className="flex items-center justify-center space-x-3 mb-4">
                                <Crown className={`h-16 w-16 ${finalTierInfo.tier.color}`} />
                                <span className={`text-4xl font-bold ${finalTierInfo.tier.color}`}>{finalTierInfo.tier.name}</span>
                            </div>
                        )
                    ) : (
                        // No tier change
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <Crown className={`h-16 w-16 ${initialTierInfo.tier.color}`} />
                            <span className={`text-4xl font-bold ${initialTierInfo.tier.color}`}>{initialTierInfo.tier.name}</span>
                        </div>
                    )}
                </div>
                {hasTierChange && tierChangeAnimation && (
                    tierChange === "promotion" ? (
                        <p className="text-green-400 font-bold animate-bounce text-2xl -mt-4">티어 승급!</p>
                    ) : (
                        <p className="text-red-400 font-bold text-2xl -mt-4">티어 강등...</p>
                    )
                )}

                <div className="bg-black/30 p-8 rounded-lg border border-cyber-blue/30">
                  <div className="flex items-center justify-center space-x-6">
                    <span className="text-3xl font-bold text-gray-300">{initialTierInfo.lp}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-1 bg-cyber-blue animate-pulse"></div>
                      <span className={`text-3xl font-bold ${earned > 0 ? "text-green-400" : earned < 0 ? "text-red-400" : "text-gray-400"} ${animatingLp ? "animate-bounce" : ""}`}>
                        {`${earned >= 0 ? '+' : ''}${earned}`}
                      </span>
                      <div className="w-16 h-1 bg-cyber-blue animate-pulse"></div>
                    </div>
                    <span className={`text-4xl font-bold neon-text ${earned > 0 ? "text-green-400" : earned < 0 ? "text-red-400" : "text-gray-400"} ${animatingLp ? "animate-pulse" : ""}`}>
                      {displayLp}
                    </span>
                  </div>
                  <div className="text-center mt-4">
                    <span className="text-lg text-gray-400">LP</span>
                  </div>
                </div>

                {animatingLp ? (
                  <p className="text-lg text-gray-400 animate-pulse">LP 계산 중...</p>
                ) : (
                  <div className="space-y-6">
                    <h3 className={`text-2xl font-bold ${victory ? "text-green-400" : "text-red-400"}`}>최종 LP: {finalTierInfo.lp}</h3>
                    <div className="flex justify-center">
                      {hasUnclaimedAchievements.length > 0 ? (
                        <CyberButton onClick={() => navigate("/achievement", { state: { unclaimedAchievements: hasUnclaimedAchievements } })} size="lg" className="animate-pulse-neon">
                          <ArrowRight className="h-6 w-6 mr-2" />
                          다음으로
                        </CyberButton>
                      ) : (
                        <div className="flex justify-center space-x-4">
                          <CyberButton onClick={() => navigate("/matching")} size="lg" className="animate-pulse-neon">
                            <Play className="h-6 w-6 mr-2" />
                            다시 하기
                          </CyberButton>
                          <CyberButton onClick={() => navigate("/home")} size="lg" variant="secondary">
                            <ArrowRight className="h-6 w-6 mr-2" />
                            홈으로 나가기
                          </CyberButton>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CyberCard>
          </div>
        </main>
      </div>
    );
  }
  
};

export default ResultPage;

