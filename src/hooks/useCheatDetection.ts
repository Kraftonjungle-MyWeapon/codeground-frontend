import { useEffect, useRef, useCallback } from 'react';
import useWebSocketStore from '@/stores/websocketStore';
import { useToast } from '@/components/ui/use-toast';
import { authFetch } from '@/utils/api';
import { localStream as sharedLocalStream } from '@/utils/webrtcStore';

interface Options {
  gameId?: string | null;
  remoteVideoRef?: React.RefObject<HTMLVideoElement>;
  containerRef?: React.RefObject<HTMLElement>;
}

// ReportModal과 공유할 타입
export interface ReportPayload {
  reason: string;
  description: string;
}

export default function useCheatDetection({ gameId, remoteVideoRef, containerRef }: Options) {
  const { sendMessage } = useWebSocketStore();
  const { toast } = useToast();

  const tabWarningsRef = useRef(0);
  const mouseWarningsRef = useRef(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback((stream: MediaStream) => {
    if (sharedLocalStream && stream.id === sharedLocalStream.id) {
      console.error("CheatDetection: Attempting to record local stream instead of remote stream. Aborting.");
      toast({
        title: '녹화 오류',
        description: '상대방 화면이 아닌 자신의 화면이 녹화되는 오류가 감지되어 녹화를 중단합니다.',
        variant: 'destructive',
      });
      return;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    recorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
      // 1분 분량의 데이터만 유지 (10초짜리 청크 6개)
      if (chunksRef.current.length > 6) {
        chunksRef.current.shift();
      }
    };

    recorder.start(10_000); // 10초 단위로 청크 생성
    mediaRecorderRef.current = recorder;
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  }, []);

  useEffect(() => {
    const videoEl = remoteVideoRef?.current;
    if (!videoEl) return;

    const handleStreamLoaded = () => {
      const stream = videoEl.srcObject as MediaStream;
      if (stream) {
        startRecording(stream);
      }
    };

    if (videoEl.srcObject) {
      handleStreamLoaded();
    } else {
      videoEl.addEventListener('loadedmetadata', handleStreamLoaded);
    }

    return () => {
      videoEl.removeEventListener('loadedmetadata', handleStreamLoaded);
      stopRecording();
    };
  }, [remoteVideoRef, startRecording, stopRecording]);

  const reportCheating = useCallback(
    async ({ reason, description }: ReportPayload) => {
      if (!gameId) return;
      try {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.requestData();
        }

        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('game_id', gameId);
        formData.append('reason', reason);
        formData.append('description', description); // 상세 설명 추가
        formData.append('video', blob, 'evidence.webm');

        await authFetch('http://localhost:8000/api/v1/report/', {
          method: 'POST',
          body: formData,
        });

        toast({ title: '신고 완료', description: '부정행위 신고가 제출되었습니다.' });
      } catch (err) {
        console.error('Failed to send cheating report', err);
        toast({ title: '신고 실패', description: '서버에 신고를 전송하지 못했습니다.' });
      }
    },
    [gameId, toast],
  );

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        tabWarningsRef.current += 1;
        const count = tabWarningsRef.current;

        toast({
          title: '탭 이탈 감지',
          description: `다른 탭으로 이동했습니다. 경고 ${count}/5`,
        });

        // 자동 기권 로직 제거, 경고 메시지만 전송
        sendMessage(JSON.stringify({ 
          type: 'system_warning', 
          event: 'tab_hidden',
          count: count,
        }));
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [sendMessage, toast]);

  useEffect(() => {
    const container = containerRef?.current || document;

    const handleLeave = (event: MouseEvent) => {
      // relatedTarget이 null이면 마우스가 창 밖으로 나간 것입니다.
      // document.hasFocus()가 false인 경우는 다른 애플리케이션으로 포커스가 이동한 경우입니다.
      if (event.relatedTarget === null && document.hasFocus()) {
        mouseWarningsRef.current += 1;
        const count = mouseWarningsRef.current;

        toast({
          title: '마우스 이탈 감지',
          description: `화면에서 마우스가 벗어났습니다. 경고 ${count}/5`,
        });

        sendMessage(JSON.stringify({
          type: 'system_warning',
          event: 'mouse_leave',
          count: count,
        }));
      }
    };

    container.addEventListener('mouseleave', handleLeave);
    return () => container.removeEventListener('mouseleave', handleLeave);
  }, [sendMessage, toast, containerRef]);

  return { reportCheating };
}