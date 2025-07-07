import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { fetchProblemForGame } from "@/utils/api";

// 실제 환경에 맞게 경로 수정!
const apiUrl = import.meta.env.VITE_API_URL;
const wsUrl = apiUrl.replace(/^http/, "ws");

export function useMatching() {
    const navigate = useNavigate();
    const { user } = useUser();
    const userId = user?.user_id;
    const [matchingTime, setMatchingTime] = useState(0);
    const [foundOpponent, setFoundOpponent] = useState(false);
    const [acceptTimeLeft, setAcceptTimeLeft] = useState(20);
    const [userAccepted, setUserAccepted] = useState(false);
    const [opponentAccepted, setOpponentAccepted] = useState(false);
    const [opponent, setOpponent] = useState({
    name: "CodeWarrior",
    mmr: 1823,
    rank: "Gold II",
    winRate: 58.3,
    });

    const [ws, setWs] = useState<WebSocket | null>(null);
    const matchIdRef = useRef<number | null>(null);

  // WebSocket 연결/메시지 핸들링
    useEffect(() => {
    if (!userId) {
        navigate("/home");
        return;
    }
    const websocket = new WebSocket(
        `${wsUrl}/api/v1/match/ws/match/${userId}`
    );
    setWs(websocket);

    websocket.onopen = () => {
        console.log("WebSocket connected");
    };

    websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "match_found") {
            setFoundOpponent(true);
            setUserAccepted(false);
            setOpponentAccepted(false);
            setAcceptTimeLeft(message.time_limit);
            matchIdRef.current = message.match_id;
            localStorage.setItem("currentMatchId", String(message.match_id));
            // 상대 정보 동적으로 들어올 경우 여기에 setOpponent(message.opponent)
        } else if (message.type === "match_accepted") {
            if (message.problem && message.game_id) {
            try {
                fetchProblemForGame(message.problem, message.game_id);
                setOpponentAccepted(true);
                localStorage.setItem("gameId", message.game_id);
                navigate(`/screen-share-setup?gameId=${message.game_id}`);
            } catch (error) {
                navigate("/home");
            }
        }
        } else if (message.type === "opponent_accepted") {
            setOpponentAccepted(true);
        } else if (message.type === "match_cancelled") {
            setFoundOpponent(false);
            setMatchingTime(0);
            setAcceptTimeLeft(20);
            setUserAccepted(false);
            setOpponentAccepted(false);
            matchIdRef.current = null;
            localStorage.removeItem("currentMatchId");
        if (message.reason === "timeout or rejection") {
            navigate("/home");
            }
        }
    };

    websocket.onclose = () => {
        console.log("WebSocket disconnected");
    };

    websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    return () => {
        websocket.close();
    };
    }, [navigate, userId]);

  // 매칭 대기 시간 타이머
    useEffect(() => {
    if (!foundOpponent) {
        const timer = setInterval(() => {
            setMatchingTime((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }
    }, [foundOpponent]);

    // 수락 타이머
    useEffect(() => {
    if (foundOpponent) {
        const acceptTimer = setInterval(() => {
            setAcceptTimeLeft((prev) => {
            if (prev <= 1) {
                clearInterval(acceptTimer);
            return 0;
            }
        return prev - 1;
    });
}, 1000);

    return () => clearInterval(acceptTimer);
}
}, [foundOpponent]);

    // 시간 포맷 함수
    const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

    // 수락/거절/취소 핸들러
    const handleAccept = () => {
        if (ws && matchIdRef.current) {
        setUserAccepted(true);
        ws.send(
            JSON.stringify({ type: "match_accept", match_id: matchIdRef.current })
        );
        localStorage.setItem("currentMatchId", String(matchIdRef.current));
    }
    };

    const handleDecline = () => {
        if (userAccepted) return;
        if (ws && matchIdRef.current) {
        ws.send(
            JSON.stringify({ type: "match_reject", match_id: matchIdRef.current })
        );
        }
        localStorage.removeItem("currentMatchId");
        navigate("/home");
    };

    const handleCancel = () => {
    if (ws) {
        ws.send(JSON.stringify({ type: "cancel_queue" }));
    }
    localStorage.removeItem("currentMatchId");
    navigate("/home");
    };

    return {
    foundOpponent,
    matchingTime,
    acceptTimeLeft,
    userAccepted,
    opponentAccepted,
    opponent,
    handleAccept,
    handleDecline,
    handleCancel,
    formatTime,
    };
}
