// LP 시스템 유틸리티
import { Trophy, Medal, Award, Crown, Shield, Star } from "lucide-react";

export interface Tier {
  name: string;
  icon: any;
  color: string;
  minLp: number;
  baseLp: number; // 해당 티어의 기준점 (100의 자리)
}

export const tiers: Tier[] = [
  {
    name: "Bronze V",
    icon: Medal,
    color: "text-orange-600",
    minLp: 0,
    baseLp: 0,
  },
  {
    name: "Bronze IV",
    icon: Medal,
    color: "text-orange-600",
    minLp: 100,
    baseLp: 100,
  },
  {
    name: "Bronze III",
    icon: Medal,
    color: "text-orange-600",
    minLp: 200,
    baseLp: 200,
  },
  {
    name: "Bronze II",
    icon: Medal,
    color: "text-orange-600",
    minLp: 300,
    baseLp: 300,
  },
  {
    name: "Bronze I",
    icon: Medal,
    color: "text-orange-600",
    minLp: 400,
    baseLp: 400,
  },
  {
    name: "Silver V",
    icon: Award,
    color: "text-gray-400",
    minLp: 500,
    baseLp: 500,
  },
  {
    name: "Silver IV",
    icon: Award,
    color: "text-gray-400",
    minLp: 600,
    baseLp: 600,
  },
  {
    name: "Silver III",
    icon: Award,
    color: "text-gray-400",
    minLp: 700,
    baseLp: 700,
  },
  {
    name: "Silver II",
    icon: Award,
    color: "text-gray-400",
    minLp: 800,
    baseLp: 800,
  },
  {
    name: "Silver I",
    icon: Award,
    color: "text-gray-400",
    minLp: 900,
    baseLp: 900,
  },
  {
    name: "Gold V",
    icon: Trophy,
    color: "text-yellow-400",
    minLp: 1000,
    baseLp: 1000,
  },
  {
    name: "Gold IV",
    icon: Trophy,
    color: "text-yellow-400",
    minLp: 1100,
    baseLp: 1100,
  },
  {
    name: "Gold III",
    icon: Trophy,
    color: "text-yellow-400",
    minLp: 1200,
    baseLp: 1200,
  },
  {
    name: "Gold II",
    icon: Trophy,
    color: "text-yellow-400",
    minLp: 1300,
    baseLp: 1300,
  },
  {
    name: "Gold I",
    icon: Trophy,
    color: "text-yellow-400",
    minLp: 1400,
    baseLp: 1400,
  },
  {
    name: "Platinum V",
    icon: Shield,
    color: "text-blue-400",
    minLp: 1500,
    baseLp: 1500,
  },
  {
    name: "Platinum IV",
    icon: Shield,
    color: "text-blue-400",
    minLp: 1600,
    baseLp: 1600,
  },
  {
    name: "Platinum III",
    icon: Shield,
    color: "text-blue-400",
    minLp: 1700,
    baseLp: 1700,
  },
  {
    name: "Platinum II",
    icon: Shield,
    color: "text-blue-400",
    minLp: 1800,
    baseLp: 1800,
  },
  {
    name: "Platinum I",
    icon: Shield,
    color: "text-blue-400",
    minLp: 1900,
    baseLp: 1900,
  },
  {
    name: "Diamond V",
    icon: Star,
    color: "text-purple-400",
    minLp: 2000,
    baseLp: 2000,
  },
  {
    name: "Diamond IV",
    icon: Star,
    color: "text-purple-400",
    minLp: 2100,
    baseLp: 2100,
  },
  {
    name: "Diamond III",
    icon: Star,
    color: "text-purple-400",
    minLp: 2200,
    baseLp: 2200,
  },
  {
    name: "Diamond II",
    icon: Star,
    color: "text-purple-400",
    minLp: 2300,
    baseLp: 2300,
  },
  {
    name: "Diamond I",
    icon: Star,
    color: "text-purple-400",
    minLp: 2400,
    baseLp: 2400,
  },
  {
    name: "Challenger",
    icon: Crown,
    color: "text-red-400",
    minLp: 2500,
    baseLp: 2500,
  },
];

// 총 점수에서 티어 정보 계산
export const getTierFromTotalScore = (totalScore: number): Tier => {
  return (
    tiers
      .slice()
      .reverse()
      .find((tier) => totalScore >= tier.minLp) || tiers[0]
  );
};

// 총 점수에서 LP 계산 (십의 자리)
export const getLpFromTotalScore = (totalScore: number): number => {
  const tier = getTierFromTotalScore(totalScore);
  return totalScore - tier.baseLp;
};

// 총 점수를 티어와 LP로 분리
export const parseTotalScore = (totalScore: number) => {
  const tier = getTierFromTotalScore(totalScore);
  const lp = getLpFromTotalScore(totalScore);
  return { tier, lp };
};

// 티어 변화 확인
export const getTierChange = (oldScore: number, newScore: number) => {
  const oldTier = getTierFromTotalScore(oldScore);
  const newTier = getTierFromTotalScore(newScore);

  if (oldTier.minLp < newTier.minLp) {
    return "promotion"; // 승급
  } else if (oldTier.minLp > newTier.minLp) {
    return "demotion"; // 강등
  }
  return "none"; // 변화 없음
};
