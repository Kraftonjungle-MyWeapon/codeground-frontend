import React, { useEffect, useRef } from "react";
import { Clock, AlertTriangle, Monitor, XCircle } from "lucide-react";
import { ShareStatus } from "./ScreenShareStatusCard"; // StatusCard에서 정의한 타입 import

interface ScreenShareVideoProps {
  stream: MediaStream | null;
  shareStatus: ShareStatus;
  isLocal?: boolean;
}

const VideoPlaceholder: React.FC<{ status: ShareStatus }> = ({ status }) => {
  if (status === "invalid") {
    return (
      <div className="text-center p-4">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-2" />
        <div className="text-red-400 font-semibold">전체 화면이 아님</div>
        <div className="text-sm text-gray-400">
          창이나 탭이 아닌 전체 화면을 선택해주세요
        </div>
      </div>
    );
  }

  if (status === "sharing") {
    return (
      <div className="text-center">
        <Clock className="h-12 w-12 text-yellow-400 mx-auto mb-2 animate-spin" />
        <div className="text-yellow-400 font-semibold">공유 설정 중...</div>
      </div>
    );
  }

  if (status === "disconnected") {
    return (
      <div className="text-center">
        <XCircle className="h-12 w-12 text-red-400 mx-auto mb-2" />
        <div className="text-red-400 font-semibold">연결 끊김</div>
        <div className="text-sm text-gray-400">상대방의 연결이 끊어졌습니다.</div>
      </div>
    );
  }

  // waiting 또는 기타 상태
  return (
    <div className="text-center">
      <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-2" />
      <div className="text-gray-400">화면 공유 대기 중</div>
    </div>
  );
};

const ScreenShareVideo: React.FC<ScreenShareVideoProps> = ({
  stream,
  shareStatus,
  isLocal = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    } else if (videoRef.current) {
      videoRef.current.srcObject = null; // 스트림이 없을 때 비디오 소스 정리
    }
  }, [stream]);

  if (shareStatus === "connected" && stream) {
    return (
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className="w-full h-full object-contain"
      />
    );
  }

  return <VideoPlaceholder status={shareStatus} />;
};

export default ScreenShareVideo;
