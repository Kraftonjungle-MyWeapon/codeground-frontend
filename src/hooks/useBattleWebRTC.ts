import { useRef, useCallback, useState, useEffect } from 'react';
import { peerConnection as sharedPC, setPeerConnection, setRemoteStream } from '@/utils/webrtcStore';
import useWebSocketStore from '@/stores/websocketStore';

interface UseBattleWebRTCProps {
  isGameFinished: boolean;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  sharedLocalStream: MediaStream | null;
}

export const useBattleWebRTC = ({
  isGameFinished,
  remoteVideoRef,
  sharedLocalStream,
}: UseBattleWebRTCProps) => {
  const { sendMessage } = useWebSocketStore();
  const [isRemoteStreamActive, setIsRemoteStreamActive] = useState(true); // 훅 내부 상태로 변경
  const [showRemoteScreenSharePrompt, setShowRemoteScreenSharePrompt] = useState(false); // 훅 내부 상태로 변경

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    setPeerConnection(pc);

    pc.oniceconnectionstatechange = () => {
      if (isGameFinished) return;
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed') {
        setRemoteStream(null);
        setIsRemoteStreamActive(false); // 상태 업데이트
        setShowRemoteScreenSharePrompt(true); // 상태 업데이트
      }
    };

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        sendMessage(
          JSON.stringify({ type: 'webrtc_signal', signal: { type: 'candidate', candidate } })
        );
      }
    };
    pc.ontrack = ({ streams: [stream] }) => {
      setRemoteStream(stream);
      setIsRemoteStreamActive(true);
      setShowRemoteScreenSharePrompt(false);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }

      const remoteVideoTrack = stream.getVideoTracks()[0];
      if (remoteVideoTrack) {
        remoteVideoTrack.onended = () => {
          if (isGameFinished) return;
          setIsRemoteStreamActive(false);
          setShowRemoteScreenSharePrompt(true);
          sendMessage(JSON.stringify({ type: 'screen_share_stopped' }));
        };
      }
    };
    return pc;
  }, [isGameFinished, remoteVideoRef, sendMessage]); // 의존성에서 setIsRemoteStreamActive, setShowRemoteScreenSharePrompt 제거

  const handleSignal = useCallback(async (signal: any) => {
    let pc = sharedPC;
    if (!pc) {
      pc = createPeerConnection();
    }

    if (signal.type === 'offer') {
      await pc.setRemoteDescription(new RTCSessionDescription(signal));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      sendMessage(JSON.stringify({ type: 'webrtc_signal', signal: pc.localDescription }));
    } else if (signal.type === 'answer') {
      await pc.setRemoteDescription(new RTCSessionDescription(signal));
    } else if (signal.type === 'candidate' && signal.candidate) {
      await pc.addIceCandidate(signal.candidate);
    } else if (signal.type === 'join') {
      if (sharedLocalStream) {
        pc.getSenders().forEach((sender) => {
          if (sender.track && sender.track.kind === 'video') {
            pc.removeTrack(sender);
          }
        });
        sharedLocalStream.getTracks().forEach((track) => {
          pc.addTrack(track, sharedLocalStream);
        });
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sendMessage(
          JSON.stringify({ type: 'webrtc_signal', signal: pc.localDescription })
        );
      }
    } else if (signal.type === 'renegotiate_screen_share') {
      // 기존 peerConnection 정리 및 새로 생성
      if (pc) {
        pc.close();
      }
      pc = createPeerConnection();
      if (sharedLocalStream) {
        sharedLocalStream.getTracks().forEach((track) => {
          pc.addTrack(track, sharedLocalStream);
        });
      }
    }
    setPeerConnection(pc);
  }, [createPeerConnection, sendMessage, sharedLocalStream, setIsRemoteStreamActive, setShowRemoteScreenSharePrompt]);

  useEffect(() => {
    if (sharedPC) {
      if (sharedPC.remoteDescription && sharedPC.remoteDescription.type === 'offer' && !sharedPC.localDescription) {
        // If we have a remote offer but no local answer, create one
        sharedPC.createAnswer().then(answer => {
          sharedPC.setLocalDescription(answer);
          sendMessage(JSON.stringify({ type: 'webrtc_signal', signal: answer }));
        });
      }
    }
  }, [sharedPC, sendMessage]);

  return { createPeerConnection, handleSignal, isRemoteStreamActive, setIsRemoteStreamActive, showRemoteScreenSharePrompt, setShowRemoteScreenSharePrompt };
};