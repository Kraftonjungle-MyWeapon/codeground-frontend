import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { 
  localStream as sharedLocalStream, 
  remoteStream as sharedRemoteStream, 
  setLocalStream, setRemoteStream, 
  setPeerConnection, peerConnection as sharedPC 
} from "@/utils/webrtcStore";
import useWebSocketStore from "@/stores/websocketStore";

const apiUrl = import.meta.env.VITE_API_URL;
const wsUrl = apiUrl.replace(/^http/, "ws");

export function useScreenShareSetup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useUser();
  const { websocket, connect, disconnect, sendMessage } = useWebSocketStore();

  // --- 상태 ---
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStreamState, setRemoteStreamState] = useState<MediaStream | null>(null);
  const [myShareStatus, setMyShareStatus] = useState<"waiting" | "sharing" | "invalid" | "connected" | "disconnected">("waiting");
  const [opponentReady, setOpponentReady] = useState(false);
  const [myReady, setMyReady] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isWebRTCConnected, setIsWebRTCConnected] = useState(false);
  const [opponentScreenShareStatus, setOpponentScreenShareStatus] = useState<"waiting" | "connected" | "disconnected">("waiting");
  const [showMyScreenShareRestartButton, setShowMyScreenShareRestartButton] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // --- Game ID/유저 ID 관리 ---
  const gameId = searchParams.get("gameId");
  const currentUrlGameId = searchParams.get("gameId");
  const storedGameId = localStorage.getItem("currentGameId");
  const effectiveGameId = currentUrlGameId || storedGameId;
  const userId = user?.user_id;

  // --- WebRTC 초기화 및 정리 ---
  useEffect(() => {
    if (sharedPC) {
      sharedPC.close();
      setPeerConnection(null);
    }
    if (sharedLocalStream) {
      sharedLocalStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (sharedRemoteStream) {
      sharedRemoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
    setMyStream(null);
    setRemoteStreamState(null);
    setMyShareStatus("waiting");
    setOpponentReady(false);
    setMyReady(false);
    setCountdown(0);
    setIsCountingDown(false);
    setIsWebRTCConnected(false);
    setOpponentScreenShareStatus("waiting");
    setShowMyScreenShareRestartButton(false);
  }, []);

  // --- 화면 공유 시작 ---
  const startScreenShare = useCallback(async () => {
    try {
      setMyShareStatus("sharing");
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      const videoTrack = mediaStream.getVideoTracks()[0];
      const settings = videoTrack.getSettings() as any;

      if (settings.displaySurface === "monitor") {
        setMyShareStatus("connected");
        setMyStream(mediaStream);
        setLocalStream(mediaStream);
        if (sharedPC) {
          mediaStream.getTracks().forEach(track => sharedPC.addTrack(track, mediaStream));
          const offer = await sharedPC.createOffer();
          await sharedPC.setLocalDescription(offer);
          sendMessage(
            JSON.stringify({ type: "webrtc_signal", signal: sharedPC.localDescription })
          );
        }
        videoTrack.addEventListener("ended", () => {
          setMyShareStatus("disconnected");
          setMyStream(null);
          setLocalStream(null);
          setMyReady(false);
          setIsCountingDown(false);
          setCountdown(0);
          sendMessage(JSON.stringify({ type: "screen_share_stopped" }));
        });
      } else {
        setMyShareStatus("invalid");
        setMyReady(false);
        setIsCountingDown(false);
        setCountdown(0);
        mediaStream.getTracks().forEach(track => track.stop());
      }
    } catch (error) {
      setMyShareStatus("waiting");
    }
  }, [sendMessage]);

  // --- 기타 핸들러 ---
  const handleRetryShare = useCallback(() => {
    setMyShareStatus("waiting");
    startScreenShare();
  }, [startScreenShare]);

  const handleReady = useCallback(() => {
    if (myShareStatus === "connected") {
      setMyReady(true);
      sendMessage(JSON.stringify({ type: "ready" }));
    }
  }, [myShareStatus, sendMessage]);

  // --- 카운트다운 로직 ---
  useEffect(() => {
    if (myReady && opponentReady && isWebRTCConnected && !isCountingDown) {
      setIsCountingDown(true);
      setCountdown(3);
    }
  }, [myReady, opponentReady, isWebRTCConnected, isCountingDown]);

  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isCountingDown && countdown === 0) {
      if (gameId) {
        navigate(`/battle?gameId=${gameId}`);
      } else {
        navigate("/battle");
      }
    }
  }, [isCountingDown, countdown, gameId, navigate]);

  // --- 비디오 스트림 바인딩 ---
  useEffect(() => {
    if (myStream && localVideoRef.current) {
      localVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  useEffect(() => {
    if (remoteStreamState && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamState;
    }
  }, [remoteStreamState]);

  // --- WebSocket, Peer 연결 ---
  useEffect(() => {
    let effectiveGameId = currentUrlGameId || storedGameId;
    if (!effectiveGameId || !userId) return;

    const webSocketUrl = `${wsUrl}/api/v1/game/ws/game/${effectiveGameId}?user_id=${userId}`;

    if (websocket && websocket.readyState === WebSocket.OPEN && websocket.url === webSocketUrl) {
      return;
    }

    if (!sharedPC) {
      createPeerConnection();
    }

    connect(webSocketUrl);

    // cleanup 생략 (필요시 추가)
  }, [effectiveGameId, userId, connect, disconnect]);

  // --- WebSocket 이벤트 핸들러 ---
  useEffect(() => {
    if (!websocket) return;

    websocket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "webrtc_signal" && data.sender !== user.user_id) {
          await handleSignal(data.signal);
        } else if (data.type === "player_ready" && data.user_id !== user.user_id) {
          setOpponentReady(true);
        } else if (data.type === "all_ready") {
          setOpponentReady(true);
          setMyReady(true);
        }
      } catch (e) {
        // handle error
      }
    };

    websocket.onopen = () => {
      sendMessage(JSON.stringify({ type: "webrtc_signal", signal: { type: "join" } }));
    };
  }, [websocket, user, sendMessage]);

  // --- PeerConnection 연결 상태 관리 ---
  useEffect(() => {
    if (!sharedPC) return;
    const handleConnectionStateChange = () => {
      if (
        sharedPC.connectionState === "disconnected" ||
        sharedPC.connectionState === "failed" ||
        sharedPC.connectionState === "closed"
      ) {
        setOpponentScreenShareStatus("disconnected");
        setShowMyScreenShareRestartButton(true);
        setIsWebRTCConnected(false);
      } else if (sharedPC.connectionState === "connected") {
        setOpponentScreenShareStatus("connected");
        setShowMyScreenShareRestartButton(false);
        setIsWebRTCConnected(true);
      }
    };
    sharedPC.addEventListener("connectionstatechange", handleConnectionStateChange);
    return () => {
      sharedPC.removeEventListener("connectionstatechange", handleConnectionStateChange);
    };
  }, [sharedPC]);

  // --- PeerConnection 생성 함수 ---
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    setPeerConnection(pc);

    pc.oniceconnectionstatechange = () => {
      if (
        pc.iceConnectionState === "disconnected" ||
        pc.iceConnectionState === "failed" ||
        pc.iceConnectionState === "closed"
      ) {
        setOpponentScreenShareStatus("disconnected");
        setShowMyScreenShareRestartButton(true);
        setRemoteStream(null);
        setRemoteStreamState(null);
        setIsWebRTCConnected(false);
      } else if (pc.iceConnectionState === "connected") {
        setOpponentScreenShareStatus("connected");
        setShowMyScreenShareRestartButton(false);
        setIsWebRTCConnected(true);
      }
    };

    const stream = myStream || sharedLocalStream;
    if (stream) {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    }
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        sendMessage(
          JSON.stringify({ type: "webrtc_signal", signal: { type: "candidate", candidate } })
        );
      }
    };
    pc.ontrack = ({ streams: [stream] }) => {
      setRemoteStream(stream);
      setRemoteStreamState(stream);
      setOpponentScreenShareStatus("connected");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      const remoteVideoTrack = stream.getVideoTracks()[0];
      if (remoteVideoTrack) {
        remoteVideoTrack.onended = () => {
          setOpponentScreenShareStatus("disconnected");
          setShowMyScreenShareRestartButton(true);
          setRemoteStream(null);
          setRemoteStreamState(null);
        };
      }
    };
    return pc;
  }, [myStream, sendMessage]);

  // --- Signal 핸들러 ---
  const handleSignal = useCallback(async (signal: any) => {
    let pc = sharedPC;
    if (!pc) {
      pc = createPeerConnection();
    }
    if (signal.type === "offer") {
      if (pc.signalingState !== "stable") {
        await Promise.all([
          pc.localDescription ? pc.setLocalDescription(pc.localDescription) : Promise.resolve(),
          pc.remoteDescription ? pc.setRemoteDescription(pc.remoteDescription) : Promise.resolve(),
        ]);
      }
      await pc.setRemoteDescription(new RTCSessionDescription(signal));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      sendMessage(JSON.stringify({ type: "webrtc_signal", signal: pc.localDescription }));
    } else if (signal.type === "answer") {
      if (pc.signalingState === "have-local-offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(signal));
      }
    } else if (signal.type === "candidate") {
      if (signal.candidate) {
        try {
          await pc.addIceCandidate(signal.candidate);
        } catch {}
      }
    }
    setPeerConnection(pc);
  }, [createPeerConnection, sendMessage]);

  // --- 화면 공유 재시작 ---
  const handleRestartScreenShare = useCallback(async () => {
    try {
      setMyShareStatus("sharing");
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      const videoTrack = mediaStream.getVideoTracks()[0];
      const settings = videoTrack.getSettings() as any;
      if (settings.displaySurface === "monitor") {
        setMyShareStatus("connected");
        setMyStream(mediaStream);
        setLocalStream(mediaStream);
        if (sharedPC) {
          mediaStream.getTracks().forEach((track) => sharedPC.addTrack(track, mediaStream));
          const offer = await sharedPC.createOffer();
          await sharedPC.setLocalDescription(offer);
          sendMessage(
            JSON.stringify({ type: "webrtc_signal", signal: sharedPC.localDescription })
          );
        }
        videoTrack.addEventListener("ended", () => {
          setMyShareStatus("disconnected");
          setMyStream(null);
          setLocalStream(null);
          setMyReady(false);
          setIsCountingDown(false);
          setCountdown(0);
          sendMessage(JSON.stringify({ type: "screen_share_stopped" }));
        });
      } else {
        setMyShareStatus("invalid");
        setMyReady(false);
        setIsCountingDown(false);
        setCountdown(0);
        mediaStream.getTracks().forEach(track => track.stop());
      }
    } catch {
      setMyShareStatus("waiting");
    }
  }, [sendMessage]);

  return {
    myStream,
    remoteStreamState,
    myShareStatus,
    opponentReady,
    myReady,
    countdown,
    isCountingDown,
    isWebRTCConnected,
    opponentScreenShareStatus,
    showMyScreenShareRestartButton,
    localVideoRef,
    remoteVideoRef,
    startScreenShare,
    handleRetryShare,
    handleReady,
    handleRestartScreenShare,
    setMyReady,
    setOpponentReady,
  };
}
