import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { User } from "lucide-react";

interface Props {
  nickname: string;
  profileImageUrl?: string;
  rank: number;
  tier: { name: string; color: string };
  lp: number;
  onEdit: () => void;
}

const UserInfoCard = ({nickname, profileImageUrl, rank, tier, lp, onEdit }: Props) => (
  <CyberCard className="text-center">
    <div className="w-24 h-24 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden border-2 border-cyber-blue">
      {profileImageUrl ? (
        <img src={profileImageUrl} alt={nickname} className="w-full h-full object-cover" />
      ) : (
        <User className="h-12 w-12 text-white" />
      )}
    </div>
    <h1 className="text-2xl font-bold text-white mb-2">{nickname}</h1>
    <div className="text-gray-400 text-sm mb-4">
      <span className={tier.color}>{tier.name}</span> • 전체랭킹 {rank}위
    </div>
    <div className="text-center mb-4">
      <div className="text-lg font-bold text-cyber-blue">{lp} LP</div>
      <div className="text-sm text-gray-400">총 포인트</div>
    </div>
    <CyberButton onClick={onEdit} className="w-full">
      프로필 편집
    </CyberButton>
  </CyberCard>
);

export default UserInfoCard;