import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { Users } from "lucide-react";
import { parseTotalScore } from "@/utils/lpSystem";

interface UserStats {
  nickname: string;
  totalScore: number;
  win: number;
  loss: number;
  win_rate: number;
  rank: number;
}

interface Props {
  user: UserStats;
  onViewProfile: () => void;
}

const ProfileSummaryCard = ({ user, onViewProfile }: Props) => {
  const { tier, lp } = parseTotalScore(user.totalScore);
  const winRate = user.win_rate != null ? user.win_rate.toFixed(2) : "0.00";

  return (
    <CyberCard className="text-center">
      <div className="w-20 h-20 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full mx-auto mb-4 flex items-center justify-center">
        <Users className="h-10 w-10 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 block opacity-100 visible">
        {user.nickname}
      </h3>
      <div className="text-sm text-gray-400 mb-4">
        <span className={tier.color}>{tier.name}</span> • {user.rank}위
      </div>
      <div className="text-center mb-4">
        <div className="text-lg font-bold text-cyber-blue">{lp} LP</div>
        <div className="text-sm text-gray-400">현재 LP</div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center mb-4">
        <div>
          <div className="text-lg font-bold text-green-400">{user.win}</div>
          <div className="text-sm text-gray-400">승리</div>
        </div>
        <div>
          <div className="text-lg font-bold text-red-400">{user.loss}</div>
          <div className="text-sm text-gray-400">패배</div>
        </div>
        <div>
          <div className="text-lg font-bold text-cyber-blue">{winRate}%</div>
          <div className="text-sm text-gray-400">승률</div>
        </div>
      </div>
      <CyberButton className="w-full" onClick={onViewProfile}>
        프로필 보기
      </CyberButton>
    </CyberCard>
  );
};

export default ProfileSummaryCard;