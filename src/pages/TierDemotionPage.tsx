import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { Crown, ArrowRight, Zap } from "lucide-react";

const TierDemotionPage = () => {
  const navigate = useNavigate();
  const [animationPhase, setAnimationPhase] = useState(0);

  const oldTier = { name: "Gold II", color: "text-yellow-400" };
  const newTier = { name: "Gold III", color: "text-yellow-400" };

  useEffect(() => {
    const phases = [
      { delay: 500, phase: 1 },
      { delay: 1500, phase: 2 },
      { delay: 2500, phase: 3 },
      { delay: 3000, phase: 4 },
      { delay: 4000, phase: 5 },
    ];

    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setAnimationPhase(phase), delay);
    });
  }, []);

  return (
    <div className="min-h-screen cyber-grid">
      <Header />

      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-250px)]">
        <div className="w-full max-w-4xl">
          <CyberCard className="text-center p-12 relative overflow-hidden border-red-500/30">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/5 via-transparent to-red-400/5 animate-pulse"></div>

            <div className="relative z-10 space-y-8">
              <h1 className="text-4xl font-bold text-red-400 mb-12">
                티어 강등
              </h1>

              <div className="relative h-60 flex items-center justify-center">
                {/* 이전 티어 - 번개에 맞기 전까지 표시 */}
                <div
                  className={`absolute transition-all duration-500 ${
                    animationPhase >= 3
                      ? "opacity-0 scale-0 rotate-12"
                      : "opacity-100 scale-100"
                  } ${animationPhase >= 2 ? "animate-bounce" : ""}`}
                >
                  <div className="flex flex-col items-center space-y-4 relative">
                    <Crown
                      className={`h-24 w-24 ${oldTier.color} ${
                        animationPhase >= 2 ? "animate-pulse" : ""
                      }`}
                    />
                    <span className={`text-3xl font-bold ${oldTier.color}`}>
                      {oldTier.name}
                    </span>

                    {/* 왕관 주변 노란색 번개들 */}
                    {animationPhase >= 2 && animationPhase < 4 && (
                      <>
                        <Zap
                          className="h-8 w-8 text-yellow-400 absolute -top-2 -left-8 animate-ping"
                          style={{ animationDelay: "0s" }}
                        />
                        <Zap
                          className="h-6 w-6 text-yellow-400 absolute -top-4 right-6 animate-ping"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <Zap
                          className="h-10 w-10 text-yellow-400 absolute bottom-8 -left-6 animate-ping"
                          style={{ animationDelay: "0.4s" }}
                        />
                        <Zap
                          className="h-7 w-7 text-yellow-400 absolute bottom-6 -right-8 animate-ping"
                          style={{ animationDelay: "0.6s" }}
                        />
                        <Zap
                          className="h-9 w-9 text-yellow-400 absolute top-2 right-10 animate-ping"
                          style={{ animationDelay: "0.8s" }}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* 중앙 강력한 번개 충격 효과 */}
                {animationPhase === 3 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute bg-yellow-400/30 animate-ping rounded-full w-32 h-32"></div>
                    <Zap className="h-20 w-20 text-yellow-400 animate-pulse scale-150" />
                  </div>
                )}

                {/* 새 티어 - 번개 이후 나타남 */}
                <div
                  className={`absolute transition-all duration-1000 ${
                    animationPhase >= 4
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-50"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <Crown
                      className={`h-28 w-28 ${newTier.color} opacity-70`}
                    />
                    <span className={`text-3xl font-bold ${newTier.color}`}>
                      {newTier.name}
                    </span>
                  </div>
                </div>
              </div>

              {animationPhase >= 5 && (
                <div className="space-y-8 animate-fade-in">
                  <h2 className="text-2xl font-bold text-red-400">
                    티어가 강등되었습니다
                  </h2>

                  {/* 티어 변화 표시 */}
                  <div className="flex items-center justify-center space-x-8">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${oldTier.color}`}>
                        {oldTier.name}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        이전 티어
                      </div>
                    </div>

                    <ArrowRight className="h-8 w-8 text-red-400" />

                    <div className="text-center">
                      <div className={`text-2xl font-bold ${newTier.color}`}>
                        {newTier.name}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        현재 티어
                      </div>
                    </div>
                  </div>

                  <p className="text-lg text-gray-400">
                    다음엔 더 좋은 결과를 얻을 수 있을 거예요!
                  </p>

                  <div className="pt-6 flex justify-center">
                    <CyberButton
                      onClick={() => navigate("/result")}
                      size="lg"
                      variant="secondary"
                    >
                      결과 화면으로
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

export default TierDemotionPage;
