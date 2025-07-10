import React from "react";
import AcceptProgressCircle from "./AcceptProgressCircle";
import OpponentInfo from "./OpponentInfo";
import CyberButton from "../../../components/CyberButton";
import { Check, X } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface MatchFoundModalProps {
    acceptTimeLeft: number;
    userAccepted: boolean;
    opponentAccepted: boolean;
    handleAccept: () => void;
    handleDecline: () => void;
    opponent: {
    name: string;
    // rank, tier 등 지금은 빼자!
    };
}

const MatchFoundModal: React.FC<MatchFoundModalProps> = ({
    acceptTimeLeft,
    userAccepted,
    opponentAccepted,
    handleAccept,
    handleDecline,
    opponent,
}) => {
    const { user } = useUser(); // 내 정보 가져오기

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center">
            <div className="relative z-50 text-center space-y-8">
                <h1 className="text-4xl font-bold text-green-400 mb-8">
                    게임을 찾았습니다!
                </h1>

                {/* 원형 타이머 */}
                <AcceptProgressCircle
                    timeLeft={acceptTimeLeft}
                    accepted={userAccepted && opponentAccepted}
                />

                {/* 네모 박스 안에 VS 닉네임만! */}
                <div className="bg-black/40 rounded-lg p-4 border border-cyber-blue/30 backdrop-blur-sm mt-6">
                    <div className="flex items-center justify-center w-full mb-2">
                        <span className="text-lg font-bold text-cyber-green">
                            {user?.nickname}
                        </span>
                        <span className="mx-2 text-lg font-bold text-cyber-blue">VS</span>
                        <span className="text-lg font-bold text-cyber-red">
                            {opponent.name}
                        </span>
                    </div>
                    {/* 필요하면 밑에 OpponentInfo... */}
                    <OpponentInfo
                        userAccepted={userAccepted}
                        opponentAccepted={opponentAccepted}
                        opponent={opponent}
                    />
                </div>

                {/* 수락/거절 버튼 */}
                {!userAccepted && (
                    <div className="flex justify-center gap-8">
                        <CyberButton
                            onClick={handleAccept}
                            size="lg"
                            className="w-32 h-16 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500"
                        >
                            <Check className="h-6 w-6" />
                            수락
                        </CyberButton>
                        <CyberButton
                            onClick={handleDecline}
                            variant="danger"
                            size="lg"
                            className="w-32 h-16 text-lg"
                        >
                            <X className="h-6 w-6" />
                            거절
                        </CyberButton>
                    </div>
                )}

                {/* 상태 메시지 (수락 대기/매칭 성공) */}
                {userAccepted && !opponentAccepted && (
                    <div className="text-center space-y-4">
                        <div className="text-green-400 font-semibold text-lg flex items-center justify-center">
                            <Check className="h-5 w-5 mr-2" />
                            수락 완료! 상대방을 기다리는 중...
                        </div>
                        <div className="animate-pulse text-cyber-blue">
                            상대방이 수락하길 기다리고 있습니다
                        </div>
                    </div>
                )}
                {userAccepted && opponentAccepted && (
                    <div className="text-center space-y-4">
                        <div className="text-green-400 font-bold text-xl">
                            매칭 성공!
                        </div>
                        <div className="text-cyber-blue">
                            게임을 시작합니다...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MatchFoundModal;
