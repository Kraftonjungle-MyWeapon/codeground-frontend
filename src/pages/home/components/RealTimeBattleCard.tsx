import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { Play } from "lucide-react";

interface Props {
  onStartMatch: () => void;
}

const RealTimeBattleCard = ({ onStartMatch }: Props) => (
  <CyberCard className="text-center">
    <h2 className="text-2xl font-bold text-cyber-blue mb-4">실시간 코딩 대결</h2>
    <p className="text-gray-300 mb-6">다른 개발자들과 코딩 실력을 겨뤄보세요!</p>
    <CyberButton
      size="lg"
      className="w-full max-w-sm mx-auto"
      onClick={onStartMatch}
    >
      <Play className="h-5 w-5 mr-2" />
      매칭 시작
    </CyberButton>
  </CyberCard>
);

export default RealTimeBattleCard;