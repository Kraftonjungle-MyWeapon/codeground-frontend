import CyberButton from "@/components/CyberButton";
import FeatureCard, { Feature } from "@/pages/landing/components/FeatureCard";
import HeroVideo from "@/pages/landing/components/HeroVideo";
import { Play, Code, Zap, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features: Feature[] = [
  {
    icon: Code,
    title: "실시간 코딩 대결",
    description: "다른 개발자들과 실시간으로 코딩 실력을 겨뤄보세요",
  },
  {
    icon: Trophy,
    title: "랭킹 시스템",
    description: "MMR 기반 랭킹으로 자신의 실력을 증명하세요",
  },
  {
    icon: Zap,
    title: "다양한 문제",
    description: "알고리즘부터 자료구조까지 다양한 문제에 도전하세요",
  },
];

const LandingHero = () => {
  const navigate = useNavigate();
  const handleLogin = () => navigate("/login");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
      <div className="space-y-8">
        <div className="space-y-6">
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
            <span className="neon-text">코딩 실력을</span>
            <br />
            <span className="text-white">겨뤄보세요</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            실시간 코딩 대결로 다른 개발자들과 경쟁하고, 랭킹 시스템을 통해
            자신의 실력을 증명해보세요.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <CyberButton
            onClick={handleLogin}
            size="lg"
            className="text-lg px-8 py-4"
          >
            <Play className="h-6 w-6" />
            지금 시작하기
          </CyberButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      <HeroVideo />
    </div>
  );
};

export default LandingHero;