import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { Crown, ArrowRight } from "lucide-react";

const TierPromotionPage = () => {
  const navigate = useNavigate();
  const [animationPhase, setAnimationPhase] = useState(0);

  const oldTier = { name: "Gold III", color: "text-yellow-400" };
  const newTier = { name: "Gold II", color: "text-yellow-400" };

  useEffect(() => {
    const phases = [
      { delay: 1500, phase: 1 }, // 이전 티어 사라지기 시작
      { delay: 2500, phase: 2 }, // 새 티어 나타나기 시작
      { delay: 4000, phase: 3 }, // 최종 정보 표시
    ];

    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setAnimationPhase(phase), delay);
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-250px)]">
        <div className="w-full max-w-4xl">
          <CyberCard
            glowing
            className="text-center p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-yellow-400/5 animate-pulse"></div>

            <div className="relative z-10 space-y-8">
              <h1 className="text-4xl font-bold text-white mb-12">
                티어 승급!
              </h1>

              <div className="relative h-48 flex items-center justify-center">
                {/* 이전 티어 */}
                <div
                  className={`absolute transition-opacity duration-1000 ${
                    animationPhase >= 1 ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <Crown className={`h-24 w-24 ${oldTier.color}`} />
                    <span className={`text-3xl font-bold ${oldTier.color}`}>
                      {oldTier.name}
                    </span>
                  </div>
                </div>

                {/* 새 티어 */}
                <div
                  className={`absolute transition-opacity duration-1000 ${
                    animationPhase >= 2 ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Crown className={`h-32 w-32 ${newTier.color}`} />
                    </div>
                    <span
                      className={`text-4xl font-bold ${newTier.color} neon-text`}
                    >
                      {newTier.name}
                    </span>
                  </div>
                </div>
              </div>

              {animationPhase >= 3 && (
                <div className="space-y-8 animate-fade-in">
                  <h2 className="text-3xl font-bold text-green-400 animate-pulse">
                    축하합니다!
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

                    <ArrowRight className="h-8 w-8 text-green-400 animate-pulse" />

                    <div className="text-center">
                      <div className={`text-2xl font-bold ${newTier.color}`}>
                        {newTier.name}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        현재 티어
                      </div>
                    </div>
                  </div>

                  <p className="text-xl text-gray-300">
                    티어 승급을 축하드립니다!
                  </p>

                  <div className="pt-6 flex justify-center">
                    <CyberButton
                      onClick={() => navigate("/result")}
                      size="lg"
                      className="animate-pulse-neon"
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

export default TierPromotionPage;