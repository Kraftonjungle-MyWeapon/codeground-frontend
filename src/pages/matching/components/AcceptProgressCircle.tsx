import React from "react";

interface AcceptProgressCircleProps {
  /** 남은 시간(초) */
    timeLeft: number;
  /** 전체 타이머(초), 기본값 20 */
    totalTime?: number;
  /** 수락 완료 시 true */
    accepted?: boolean;
}

const CIRCLE_LENGTH = 283; // SVG 원 둘레 (r=45 기준)
const RADIUS = 45;

const AcceptProgressCircle: React.FC<AcceptProgressCircleProps> = ({
    timeLeft,
    totalTime = 20,
    accepted = false,
}) => {
  // 진행률 계산 (0~CIRCLE_LENGTH)
  const progress = ((totalTime - timeLeft) / totalTime) * CIRCLE_LENGTH;

    return (
    <div className="relative w-80 h-80 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* 배경 원 */}
        <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
        />
        {/* 진행 원 */}
        <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={CIRCLE_LENGTH}
            strokeDashoffset={CIRCLE_LENGTH - progress}
            className="transition-all duration-1000 ease-linear"
        />
        <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F6FF" />
            <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
        </defs>
        </svg>
      {/* 중앙 컨텐츠 */}
        <div className="absolute inset-8 bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 rounded-full border border-cyber-blue/30 backdrop-blur-sm flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
            <div className="text-2xl font-bold text-white">코딩 배틀</div>
            <div className="text-sm text-gray-300">랭크 매칭</div>
            {!accepted ? (
            <div className="text-lg text-cyber-blue font-mono">{timeLeft}초</div>
            ) : (
            <div className="text-lg text-green-400 font-mono">수락됨</div>
            )}
        </div>
        </div>
      {/* 타이머 텍스트(상단 고정, optional) */}
        {!accepted && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white font-bold text-lg">
            {timeLeft}
        </div>
        )}
    </div>
    );
};

export default AcceptProgressCircle;
