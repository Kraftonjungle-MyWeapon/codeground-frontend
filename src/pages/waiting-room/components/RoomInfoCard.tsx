import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { Settings } from "lucide-react";
import { FC } from "react";

interface RoomSettings {
  title: string;
  language: string;
  category: string;
  difficulty: string;
}

interface Props {
  settings: RoomSettings;
  isHost: boolean;
  onOpenSettings: () => void;
}

const RoomInfoCard: FC<Props> = ({ settings, isHost, onOpenSettings }) => (
  <CyberCard className="mb-6">
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-3xl font-bold text-cyber-blue">{settings.title}</h1>
      {isHost && (
        <CyberButton size="sm" variant="secondary" onClick={onOpenSettings}>
          <Settings className="mr-2 h-4 w-4" />
          설정 변경
        </CyberButton>
      )}
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div>
        <div className="text-sm text-gray-400">사용 언어</div>
        <div className="text-lg font-semibold text-white">
          {settings.language}
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-400">문제 분야</div>
        <div className="text-lg font-semibold text-white">
          {settings.category}
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-400">난이도</div>
        <div className="text-lg font-semibold text-white">
          {settings.difficulty}
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-400">참가자</div>
        <div className="text-lg font-semibold text-white">2/2</div>
      </div>
    </div>
  </CyberCard>
);

export default RoomInfoCard;