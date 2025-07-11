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
  profileImageUrl?: string; // 유저 프로필 사진 URL (optional)
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
      {/* 1. 프로필 이미지 */}
      <div className="w-20 h-20 rounded-full mx-auto mb-2 overflow-hidden bg-cyber-dark flex items-center justify-center border-2 border-cyber-blue">
        {user.profileImageUrl ? (
          <img src={user.profileImageUrl} alt="프로필 이미지" className="h-full w-full object-cover" />
        ) : (
          <Users className="h-10 w-10 text-white" />
        )}
      </div>
      {/* 2. 닉네임 */}
      <h3 className="text-xl font-bold text-white mb-1">
        {user.nickname}
      </h3>
      {/* 3. 티어 이미지 (Gold, Silver 등) */}
      <div className="flex items-center justify-center mb-1">
        {tier.image && (
          <img src={tier.image} alt={tier.name} className="h-20 w-20 object-contain" />
        )}
      </div>
      {/* 4. V 0 LP (현재 LP) */}
      <div className="text-center mb-1">
        <span className="text-lg font-bold text-white">
          <span className={tier.color}>{tier.name}</span> • {user.rank}위
        </span>
        <div className="text-lg font-bold text-cyber-blue">{lp} LP</div>
        {/* <span className="text-sm text-gray-400 ml-2">(현재 LP)</span> */}
      </div>
      {/* 6. 승/패/승률 */}
      <div className="grid grid-cols-3 gap-2 text-center mb-4">
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
      {/* 7. 프로필 보기 버튼 */}
      <CyberButton className="w-full" onClick={onViewProfile}>
        프로필 보기
      </CyberButton>
    </CyberCard>
  );
};

export default ProfileSummaryCard;