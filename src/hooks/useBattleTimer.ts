import { useState, useEffect } from 'react';
import useWebSocketStore from '@/stores/websocketStore';

interface UseBattleTimerProps {
  isGamePaused: boolean;
  isGameFinished: boolean;
}

export const useBattleTimer = ({
  isGamePaused,
  isGameFinished,
}: UseBattleTimerProps) => {
  const { sendMessage } = useWebSocketStore();
  const [timeLeft, setTimeLeft] = useState(930);

  useEffect(() => {
    if (isGamePaused || isGameFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sendMessage(JSON.stringify({ type: "match_result", reason: "timeout" }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sendMessage, isGamePaused, isGameFinished]);

  return { timeLeft };
};
