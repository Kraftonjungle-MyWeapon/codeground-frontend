import React from "react";
import CyberCard from "../../../components/CyberCard";
import CyberButton from "../../../components/CyberButton";
import { User, Clock } from "lucide-react";

interface MatchingWaitingCardProps {
  matchingTime: number;                // 매칭 경과 시간(초)
  formatTime: (seconds: number) => string; // 시간 포맷 함수(분:초)
  handleCancel: () => void;            // 매칭 취소 버튼 클릭 핸들러
}

const MatchingWaitingCard: React.FC<MatchingWaitingCardProps> = ({
    matchingTime,
    formatTime,
    handleCancel,
}) => (
    <CyberCard className="text-center">
    <div className="space-y-8">
        <h1 className="text-3xl font-bold neon-text">
        상대방을 찾고 있습니다...
        </h1>

      {/* 매칭 아이콘 */}
        <div className="relative">
        <div className="w-32 h-32 mx-auto">
            <div className="absolute inset-0 border-4 border-cyber-blue/30 rounded-full"></div>
            <div className="absolute inset-4 border-4 border-cyber-purple/30 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
            <User className="h-12 w-12 text-cyber-blue" />
            </div>
        </div>
        </div>

        <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2 text-xl">
            <Clock className="h-6 w-6 text-cyber-blue" />
            <span className="text-cyber-blue font-mono">
            {formatTime(matchingTime)}
            </span>
        </div>
        <div className="text-gray-300">평균 매칭 시간: 30초</div>
        </div>

        <div className="flex justify-center">
        <CyberButton
            onClick={handleCancel}
            variant="secondary"
            className="w-48"
        >
            매칭 취소
        </CyberButton>
        </div>
    </div>
    </CyberCard>
);

export default MatchingWaitingCard;
