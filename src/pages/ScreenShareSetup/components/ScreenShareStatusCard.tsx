import React from "react";
import { User, Check, AlertTriangle, Monitor, Clock, XCircle } from "lucide-react";

// 모든 화면 공유 관련 컴포넌트에서 공유할 타입
export type ShareStatus =
  | "waiting"
  | "sharing"
  | "connected"
  | "disconnected"
  | "invalid";

interface ScreenShareStatusCardProps {
  label: string;
  isReady: boolean;
  shareStatus: ShareStatus;
  avatarColor?: string;
  name?: string;
}

const statusTextMap: Record<ShareStatus, string> = {
  connected: "화면 공유 완료",
  disconnected: "연결 끊김",
  invalid: "전체 화면 필요",
  sharing: "공유 설정 중...",
  waiting: "화면 공유 대기",
};

const statusColorMap: Record<ShareStatus, string> = {
  connected: "text-green-400",
  disconnected: "text-red-400",
  invalid: "text-red-400",
  sharing: "text-yellow-400",
  waiting: "text-yellow-400",
};

const StatusIcon: React.FC<{ status: ShareStatus }> = ({ status }) => {
  switch (status) {
    case "connected":
      return <Check className="h-4 w-4 text-green-400" />;
    case "disconnected":
      return <XCircle className="h-4 w-4 text-red-400" />;
    case "invalid":
      return <AlertTriangle className="h-4 w-4 text-red-400" />;
    case "sharing":
      return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />;
    case "waiting":
      return <Monitor className="h-4 w-4 text-gray-400" />;
    default:
      return null;
  }
};

const ScreenShareStatusCard: React.FC<ScreenShareStatusCardProps> = ({
  label,
  isReady,
  shareStatus,
  avatarColor = "from-cyber-blue to-cyber-purple",
  name,
}) => {
  return (
    <div className="flex items-center space-x-4">
      <div
        className={`w-12 h-12 bg-gradient-to-r ${avatarColor} rounded-full flex items-center justify-center`}
      >
        <User className="h-6 w-6 text-white" />
      </div>
      <div>
        <div className="text-white font-semibold">
          {name || label}
        </div>
        <div className="flex items-center space-x-2">
          <StatusIcon status={shareStatus} />
          <span className={`text-sm ${statusColorMap[shareStatus]}`}>
            {statusTextMap[shareStatus]}
          </span>
        </div>
        <div className="mt-1">
          {isReady ? (
            <span className="flex items-center text-green-400 text-xs font-semibold">
              <Check className="h-3 w-3 mr-1" />
              준비 완료
            </span>
          ) : (
            <span className="text-gray-400 text-xs">준비 대기 중</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenShareStatusCard;