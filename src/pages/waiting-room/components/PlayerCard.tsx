import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { User } from "lucide-react";
import { FC } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface Props {
  name: string;
  mmr: number;
  role: "host" | "player";
  isHostView: boolean;
  isReady: boolean;
  onToggleReady?: () => void;
  onGameStart?: () => void;
  profileImageUrl: string;
}

const PlayerCard: FC<Props> = ({
  name,
  mmr,
  role,
  isHostView,
  isReady,
  onToggleReady,
  onGameStart,
  profileImageUrl,
}) => (
  <CyberCard glowing={role === "host"}>
    <div className="text-center space-y-4">
      <Avatar
        className={`w-20 h-20 mx-auto ${role === "host" ? "border-2 border-cyber-blue" : ""}`}
      >
        <AvatarImage src={profileImageUrl} alt={`${name}'s profile`} />
        <User className="h-10 w-10 text-white" />
      </Avatar>
      <div>
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p
          className={
            role === "host" ? "text-cyber-blue font-semibold" : "text-gray-400"
          }
        >
          {role === "host" ? "방장" : "플레이어"}
        </p>
        <p className="text-sm text-gray-400">MMR: {mmr}</p>
      </div>
      {role === "host" ? (
        isHostView ? (
          <CyberButton
            onClick={onGameStart}
            disabled={!isReady}
            className="w-full"
          >
            게임 시작
          </CyberButton>
        ) : (
          <div
            className={`font-semibold ${isReady ? "text-green-400" : "text-yellow-400"}`}
          >
            {isReady ? "준비 완료" : "준비 중..."}
          </div>
        )
      ) : isHostView ? (
        <div
          className={`font-semibold ${isReady ? "text-green-400" : "text-yellow-400"}`}
        >
          {isReady ? "준비 완료" : "준비 중..."}
        </div>
      ) : (
        <CyberButton
          onClick={onToggleReady}
          variant={isReady ? "secondary" : "primary"}
          className="w-full"
        >
          {isReady ? "준비 취소" : "준비"}
        </CyberButton>
      )}
    </div>
  </CyberCard>
);

export default PlayerCard;