// 상대 정보 타입
export interface OpponentInfo {
    name: string;
    mmr: number;
    rank: string;
    winRate?: number;
    [key: string]: any; // 필요 시 확장
}

// WebSocket 메시지 타입 (서버에서 오는 메시지들)
export type MatchSocketMessage =
    | MatchFoundMessage
    | MatchAcceptedMessage
    | OpponentAcceptedMessage
    | MatchCancelledMessage;

export interface MatchFoundMessage {
    type: "match_found";
    match_id: number;
    time_limit: number;
    opponent_ids?: number[]; // 상대 정보가 id로만 올 수도 있음
    opponent?: OpponentInfo; // 상대 정보가 전체 올 수도 있음
}

export interface MatchAcceptedMessage {
    type: "match_accepted";
    problem?: any;
    game_id?: string;
}

export interface OpponentAcceptedMessage {
    type: "opponent_accepted";
}

export interface MatchCancelledMessage {
    type: "match_cancelled";
    reason: string;
}

// 매칭 진행 상태 (옵션)
export type MatchingStatus = "WAITING" | "FOUND" | "ACCEPTING" | "MATCHED";

// useMatching에서 반환하는 값 타입(예시)
export interface UseMatchingResult {
    matchingTime: number;
    foundOpponent: boolean;
    acceptTimeLeft: number;
    userAccepted: boolean;
    opponentAccepted: boolean;
    opponent: OpponentInfo | null;
    handleAccept: () => void;
    handleDecline: () => void;
    handleCancel: () => void;
    formatTime: (seconds: number) => string;
}

