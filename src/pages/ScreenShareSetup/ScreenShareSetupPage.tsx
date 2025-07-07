import React from "react";
import ScreenShareStatusCard from "./components/ScreenShareStatusCard";
import ScreenShareVideo from "./components/ScreenShareVideo";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { useScreenShareSetup } from "@/hooks/useScreenShareSetup";

const ScreenShareSetupPage: React.FC = () => {
  // 커스텀 훅에서 값/핸들러 다 꺼내오기
  const {
    myStream,
    remoteStreamState,
    myShareStatus,
    opponentReady,
    myReady,
    countdown,
    isCountingDown,
    opponentScreenShareStatus,
    showMyScreenShareRestartButton,
    localVideoRef,
    remoteVideoRef,
    startScreenShare,
    handleRetryShare,
    handleReady,
  } = useScreenShareSetup();

  return (
    <div className="min-h-screen cyber-grid bg-cyber-darker">
      {/* 상태 카드 */}
      <div className="mb-8">
        <CyberCard className="p-6">
          <div className="flex items-center justify-between">
            <ScreenShareStatusCard
              label="나"
              isReady={myReady}
              shareStatus={myShareStatus}
              avatarColor="from-cyber-blue to-cyber-purple"
            />
            <div className="text-2xl font-bold neon-text">VS</div>
            <ScreenShareStatusCard
              label="상대방"
              isReady={opponentReady}
              shareStatus={opponentScreenShareStatus}
              avatarColor="from-red-500 to-pink-500"
            />
          </div>
        </CyberCard>
      </div>

      {/* 비디오 카드 (내 화면/상대 화면) */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <CyberCard className="p-6">
          <h3 className="text-lg font-semibold text-cyber-blue mb-4 flex items-center">
            내 화면 공유
          </h3>
          <div className="aspect-video bg-black/50 rounded-lg border-2 border-cyber-blue/30 flex items-center justify-center mb-4">
            <ScreenShareVideo
              stream={myStream}
              shareStatus={myShareStatus}
              isLocal={true}
            />
          </div>
          <div className="flex justify-center space-x-3">
            {(myShareStatus === "invalid" || myShareStatus === "waiting" || myShareStatus === "disconnected") && (
              <CyberButton onClick={handleRetryShare} size="sm">
                {myShareStatus === "waiting" ? "화면 공유 시작" : "다시 시도"}
              </CyberButton>
            )}
            {myShareStatus === "connected" && !myReady && (
              <CyberButton
                onClick={handleReady}
                className="bg-gradient-to-r from-green-500 to-emerald-600"
              >
                준비 완료
              </CyberButton>
            )}
            {myReady && (
              <div className="flex items-center space-x-2 text-green-400">
                <span className="font-semibold">준비됨</span>
              </div>
            )}
          </div>
        </CyberCard>

        <CyberCard className="p-6">
          <h3 className="text-lg font-semibold text-cyber-blue mb-4 flex items-center">
            상대방 화면 공유
          </h3>
          <div className="aspect-video bg-black/50 rounded-lg border-2 border-cyber-blue/30 flex items-center justify-center mb-4">
            <ScreenShareVideo
              stream={remoteStreamState}
              shareStatus={opponentScreenShareStatus}
              isLocal={false}
            />
          </div>
          {showMyScreenShareRestartButton && (
            <div className="flex justify-center mt-4">
              <CyberButton onClick={startScreenShare} className="bg-blue-500 hover:bg-blue-600">
                내 화면 공유 재시작
              </CyberButton>
            </div>
          )}
        </CyberCard>
      </div>

      <CyberCard className="p-4">
        <div className="text-center">
          {!myReady ? (
            <div className="text-gray-300">
              전체 화면을 공유하고 준비 버튼을 눌러주세요
            </div>
          ) : isCountingDown ? (
            <div className="text-green-400 font-semibold">
              게임이 곧 시작됩니다!
            </div>
          ) : (
            <div className="text-green-400 font-semibold">
              준비 완료! 게임 시작을 기다리고 있습니다.
            </div>
          )}
        </div>
      </CyberCard>

      {/* 카운트다운 오버레이 (옵션) */}
      {isCountingDown && countdown > 0 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <div className="text-8xl font-bold neon-text mb-4 animate-bounce">
              <span key={countdown} className="inline-block animate-pulse">
                {countdown}
              </span>
            </div>
            <div className="text-2xl text-cyber-blue animate-pulse">
              게임이 곧 시작됩니다!
            </div>
            <div className="mt-6 w-48 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full transition-all duration-1000 ease-linear"
                style={{
                  width: `${((4 - countdown) / 3) * 100}%`,
                  boxShadow: "0 0 10px rgba(0, 200, 255, 0.5)",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenShareSetupPage;