
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import { Trophy, Clock, User, Award, ArrowRight, BarChart3, Play, Eye, Code, Crown, Shield, Sword, Star, Zap } from 'lucide-react';
import { getTierFromTotalScore, parseTotalScore, getTierChange } from '@/utils/lpSystem';

const ResultPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [animatingLp, setAnimatingLp] = useState(false);
  const [displayLp, setDisplayLp] = useState(65);
  const [tierChangeAnimation, setTierChangeAnimation] = useState(false);
  
  // 결과 데이터 (총 점수 기준)
  const [result] = useState({
    victory: true,
    myTime: '3:24',
    opponentTime: '4:17',
    lpChange: '+18',
    oldTotalScore: 1347, // 기존 총점
    newTotalScore: 1365, // 새로운 총점
    accuracy: 100,
    opponentAccuracy: 85,
    myCode: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
    memoryUsage: '12.4MB',
    executionTime: '84ms',
    testsPassed: '15/15'
  });

  // 티어 정보 계산
  const oldTierInfo = parseTotalScore(result.oldTotalScore);
  const newTierInfo = parseTotalScore(result.newTotalScore);
  const tierChange = getTierChange(result.oldTotalScore, result.newTotalScore);
  const hasTierChange = tierChange !== 'none';

  const handleContinue = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setAnimatingLp(true);
      
      // LP 애니메이션 (십의 자리만)
      const startLp = oldTierInfo.lp;
      const endLp = newTierInfo.lp;
      const duration = 2000;
      const steps = 60;
      const increment = (endLp - startLp) / steps;
      
      let currentLp = startLp;
      const interval = setInterval(() => {
        currentLp += increment;
        setDisplayLp(Math.round(currentLp));
        
        // 티어 변화 감지 (LP가 100을 넘거나 0 아래로 떨어질 때)
        if (hasTierChange && Math.round(currentLp) >= (result.victory ? 100 : 0)) {
          setTierChangeAnimation(true);
        }
        
        if (Math.abs(currentLp - endLp) < 0.5) {
          setDisplayLp(endLp);
          setAnimatingLp(false);
          clearInterval(interval);
        }
      }, duration / steps);
    }
  };

  const handlePlayAgain = () => {
    navigate('/matching');
  };

  const handleViewDetails = () => {
    setCurrentStep(3);
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  // 단계 1: 승패 결과
  if (currentStep === 1) {
    return (
      <div className="min-h-screen cyber-grid">
        <Header />
        
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-250px)]">
          <div className="w-full max-w-2xl">
            <CyberCard glowing className="text-center p-12">
              <div className="space-y-8">
                {result.victory ? (
                  <>
                    <Trophy className="h-24 w-24 text-yellow-400 mx-auto animate-bounce" />
                    <h1 className="text-6xl font-bold text-green-400 animate-pulse">
                      승리!
                    </h1>
                    <p className="text-2xl text-gray-300">
                      축하합니다! 코딩 대결에서 승리했습니다.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="h-24 w-24 bg-red-500/20 rounded-full mx-auto flex items-center justify-center">
                      <span className="text-5xl">😢</span>
                    </div>
                    <h1 className="text-6xl font-bold text-red-400">
                      패배
                    </h1>
                    <p className="text-2xl text-gray-300">
                      아쉽네요. 다음엔 더 잘할 수 있을 거예요!
                    </p>
                  </>
                )}
                
                <div className="flex justify-center">
                  <CyberButton 
                    onClick={handleContinue}
                    size="lg"
                    className="animate-pulse-neon"
                  >
                    <ArrowRight className="h-6 w-6 mr-2" />
                    계속
                  </CyberButton>
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
      <div className="min-h-screen cyber-grid">
        <Header />
        
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-250px)]">
          <div className="w-full max-w-2xl">
            <CyberCard glowing className="text-center p-12">
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-white mb-8">LP 변화</h2>
                
                {/* 현재 티어 표시 */}
                <div className="mb-6">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <Crown className={`h-8 w-8 ${oldTierInfo.tier.color}`} />
                    <span className={`text-2xl font-bold ${oldTierInfo.tier.color}`}>
                      {oldTierInfo.tier.name}
                    </span>
                  </div>
                </div>
                
                {/* 티어 변화 애니메이션 */}
                {hasTierChange && tierChangeAnimation && (
                  <div className="mb-8 relative h-32">
                    {/* 기존 티어 (사라지는 효과) */}
                    <div className={`absolute inset-0 transition-all duration-1000 ${tierChangeAnimation ? 'opacity-0 scale-75 rotate-12' : 'opacity-100 scale-100'}`}>
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <Crown className={`h-12 w-12 ${oldTierInfo.tier.color}`} />
                        <span className={`text-3xl font-bold ${oldTierInfo.tier.color}`}>
                          {oldTierInfo.tier.name}
                        </span>
                      </div>
                      <div className="w-32 h-1 bg-gray-600 mx-auto"></div>
                    </div>
                    
                    {/* 새로운 티어 (나타나는 효과) */}
                    <div className={`absolute inset-0 transition-all duration-1000 delay-500 ${tierChangeAnimation ? 'opacity-100 scale-110' : 'opacity-0 scale-75'}`}>
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <Crown className={`h-16 w-16 ${newTierInfo.tier.color} animate-pulse`} />
                        <span className={`text-4xl font-bold ${newTierInfo.tier.color} neon-text`}>
                          {newTierInfo.tier.name}
                        </span>
                      </div>
                      {tierChange === 'promotion' ? (
                        <p className="text-green-400 font-bold animate-bounce text-xl">티어 승급!</p>
                      ) : (
                        <p className="text-red-400 font-bold text-xl">티어 강등...</p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="bg-black/30 p-8 rounded-lg border border-cyber-blue/30">
                  <div className="flex items-center justify-center space-x-6">
                    <span className="text-3xl font-bold text-gray-300">{oldTierInfo.lp}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-1 bg-cyber-blue animate-pulse"></div>
                      <span className={`text-3xl font-bold ${
                        result.victory ? 'text-green-400' : 'text-red-400'
                      } ${animatingLp ? 'animate-bounce' : ''}`}>
                        {result.lpChange}
                      </span>
                      <div className="w-16 h-1 bg-cyber-blue animate-pulse"></div>
                    </div>
                    <span className={`text-4xl font-bold neon-text ${animatingLp ? 'animate-pulse' : ''}`}>
                      {displayLp}
                    </span>
                  </div>
                  <div className="text-center mt-4">
                    <span className="text-lg text-gray-400">LP</span>
                  </div>
                </div>
                
                {animatingLp ? (
                  <p className="text-lg text-gray-400 animate-pulse">
                    LP 계산 중...
                  </p>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">최종 LP: {newTierInfo.lp}</h3>
                    
                    <div className="flex justify-center gap-6">
                      <CyberButton 
                        onClick={handlePlayAgain}
                        size="lg"
                        className="w-44 h-16 animate-pulse-neon flex items-center justify-center"
                      >
                        <Play className="h-6 w-6 mr-2 flex-shrink-0" />
                        <span className="text-base whitespace-nowrap">다시 도전</span>
                      </CyberButton>
                      <CyberButton 
                        onClick={handleViewDetails}
                        variant="secondary"
                        size="lg"
                        className="w-44 h-16 flex items-center justify-center"
                      >
                        <Eye className="h-6 w-6 mr-2 flex-shrink-0" />
                        <span className="text-base whitespace-nowrap">결과 보기</span>
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
  }

  // 단계 3: 상세 결과
  return (
    <div className="min-h-screen cyber-grid">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <CyberCard glowing className="p-6">
            <h1 className="text-3xl font-bold text-center mb-8 neon-text">상세 결과</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 대결 정보 */}
              <div className="space-y-6">
                <div className="bg-black/30 p-6 rounded-lg border border-cyber-blue/30">
                  <h3 className="text-xl font-bold text-cyber-blue mb-4 flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    성능 분석
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">실행 시간:</span>
                      <span className="text-green-400 font-bold">{result.executionTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">메모리 사용량:</span>
                      <span className="text-blue-400 font-bold">{result.memoryUsage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">테스트 통과:</span>
                      <span className="text-yellow-400 font-bold">{result.testsPassed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">완료 시간:</span>
                      <span className="text-white font-bold">{result.myTime}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 p-6 rounded-lg border border-cyber-blue/30">
                  <h3 className="text-xl font-bold text-cyber-blue mb-4">대결 결과</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-500/10 rounded border border-green-500/30">
                      <p className="text-sm text-gray-300">나</p>
                      <p className="text-lg font-bold text-green-400">{result.myTime}</p>
                    </div>
                    <div className="text-center p-4 bg-red-500/10 rounded border border-red-500/30">
                      <p className="text-sm text-gray-300">상대</p>
                      <p className="text-lg font-bold text-red-400">{result.opponentTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 작성한 코드 */}
              <div className="bg-black/30 p-6 rounded-lg border border-cyber-blue/30">
                <h3 className="text-xl font-bold text-cyber-blue mb-4 flex items-center">
                  <Code className="mr-2 h-5 w-5" />
                  작성한 코드
                </h3>
                <div className="bg-black/50 p-4 rounded border border-gray-600 font-mono text-sm">
                  <pre className="text-green-400 whitespace-pre-wrap overflow-auto max-h-96">
                    <code>{result.myCode}</code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <CyberButton 
                onClick={handlePlayAgain}
                size="lg"
                className="animate-pulse-neon whitespace-nowrap"
              >
                <Play className="h-5 w-5 mr-2" />
                다시 도전
              </CyberButton>
              <CyberButton 
                onClick={handleGoHome}
                variant="secondary"
                size="lg"
                className="whitespace-nowrap"
              >
                홈으로
              </CyberButton>
            </div>
          </CyberCard>
        </div>
      </main>
    </div>
  );
};

export default ResultPage;
