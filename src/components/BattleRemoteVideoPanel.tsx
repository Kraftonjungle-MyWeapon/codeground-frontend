import CyberCard from "@/components/CyberCard";
import { Monitor } from "lucide-react";

interface BattleRemoteVideoPanelProps {
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  sharedRemoteStream: MediaStream | null;
  isRemoteStreamActive: boolean;
  showRemoteScreenSharePrompt: boolean;
}

const BattleRemoteVideoPanel = ({
  remoteVideoRef,
  sharedRemoteStream,
  isRemoteStreamActive,
  showRemoteScreenSharePrompt,
}: BattleRemoteVideoPanelProps) => {
  return (
    <CyberCard className="p-3 flex flex-col items-center justify-center h-full">
      {sharedRemoteStream && isRemoteStreamActive ? (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="text-xs text-gray-400 text-center">
          <Monitor className="h-8 w-8 text-gray-400 mb-2 mx-auto" />
          <div>상대방 화면</div>
          {showRemoteScreenSharePrompt ? (
            <div className="mt-1 text-red-400">
              공유 중지됨. 상대방이 다시 공유해야 합니다.
            </div>
          ) : (
            <div className="mt-1 text-yellow-400">공유 대기중...</div>
          )}
        </div>
      )}
    </CyberCard>
  );
};

export default BattleRemoteVideoPanel;
