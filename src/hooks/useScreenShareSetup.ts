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
const wsUrl = apiUrl.startsWith('https')
    ? apiUrl.replace(/^https/, 'wss')
    : apiUrl.replace(/^http/, 'ws');

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
    console.log("[ScreenShare] Initializing and cleaning up previous connections.");
    if (sharedPC) {
      console.log("[ScreenShare] Closing existing PeerConnection.");
      sharedPC.close();
      setPeerConnection(null);
    }
    if (sharedLocalStream) {
      console.log("[ScreenShare] Stopping existing local stream tracks.");
      sharedLocalStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (sharedRemoteStream) {
      console.log("[ScreenShare] Stopping existing remote stream tracks.");
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
    console.log("[ScreenShare] Attempting to start screen share.");
    try {
      setMyShareStatus("sharing");
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      console.log("[ScreenShare] getDisplayMedia success.", mediaStream);
      const videoTrack = mediaStream.getVideoTracks()[0];
      const settings = videoTrack.getSettings() as any;
      console.log("[ScreenShare] Video track settings:", settings);

      if (settings.displaySurface === "monitor") {
        console.log("[ScreenShare] Screen share type is 'monitor'. Proceeding.");
        setMyShareStatus("connected");
        setMyStream(mediaStream);
        setLocalStream(mediaStream);
        if (sharedPC) {
          console.log("[ScreenShare] Adding tracks to PeerConnection and creating offer.");
          mediaStream.getTracks().forEach(track => sharedPC.addTrack(track, mediaStream));
          const offer = await sharedPC.createOffer();
          await sharedPC.setLocalDescription(offer);
          console.log("[ScreenShare] Sending WebRTC offer.");
          sendMessage(
            JSON.stringify({ type: "webrtc_signal", signal: sharedPC.localDescription })
          );
        }
        videoTrack.addEventListener("ended", () => {
          console.log("[ScreenShare] Screen share track ended by user.");
          setMyShareStatus("disconnected");
          setMyStream(null);
          setLocalStream(null);
          setMyReady(false);
          setIsCountingDown(false);
          setCountdown(0);
          sendMessage(JSON.stringify({ type: "screen_share_stopped" }));
        });
      } else {
        console.warn("[ScreenShare] Invalid share type. Must share the entire screen.");
        setMyShareStatus("invalid");
        setMyReady(false);
        setIsCountingDown(false);
        setCountdown(0);
        mediaStream.getTracks().forEach(track => track.stop());
      }
    } catch (error) {
      console.error("[ScreenShare] Error starting screen share:", error);
      setMyShareStatus("waiting");
    }
  }, [sendMessage]);

  // --- 기타 핸들러 ---
  const handleRetryShare = useCallback(() => {
    console.log("[ScreenShare] Retrying screen share.");
    setMyShareStatus("waiting");
    startScreenShare();
  }, [startScreenShare]);

  const handleReady = useCallback(() => {
    if (myShareStatus === "connected") {
      console.log("[ScreenShare] User is ready.");
      setMyReady(true);
      sendMessage(JSON.stringify({ type: "ready" }));
    } else {
      console.warn("[ScreenShare] Ready button clicked but screen share not connected.");
    }
  }, [myShareStatus, sendMessage]);

  // --- 카운트다운 로직 ---
  useEffect(() => {
    console.log(`[ScreenShare] Countdown check: myReady=${myReady}, opponentReady=${opponentReady}, isWebRTCConnected=${isWebRTCConnected}, isCountingDown=${isCountingDown}`);
    if (myReady && opponentReady && isWebRTCConnected && !isCountingDown) {
      console.log("[ScreenShare] All conditions met. Starting countdown.");
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
      console.log("[ScreenShare] Countdown finished. Navigating to battle page.");
      if (gameId) {
        navigate(`/battle?gameId=${gameId}`);
      } else {
        console.error("[ScreenShare] Cannot navigate, gameId is missing.");
        navigate("/battle");
      }
    }
  }, [isCountingDown, countdown, gameId, navigate]);

  // --- 비디오 스트림 바인딩 ---
  useEffect(() => {
    if (myStream && localVideoRef.current) {
      console.log("[ScreenShare] Binding local stream to video element.");
      localVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  useEffect(() => {
    if (remoteStreamState && remoteVideoRef.current) {
      console.log("[ScreenShare] Binding remote stream to video element.");
      remoteVideoRef.current.srcObject = remoteStreamState;
    }
  }, [remoteStreamState]);

  // --- WebSocket, Peer 연결 ---
  useEffect(() => {
    let effectiveGameId = currentUrlGameId || storedGameId;
    console.log(`[ScreenShare] WS Connection Effect: effectiveGameId=${effectiveGameId}, userId=${userId}`);
    if (!effectiveGameId || !userId) return;

    const webSocketUrl = `${wsUrl}/api/v1/game/ws/game/${effectiveGameId}?user_id=${userId}`;
    console.log(`[ScreenShare] WebSocket URL: ${webSocketUrl}`);

    if (websocket && websocket.readyState === WebSocket.OPEN && websocket.url === webSocketUrl) {
      console.log("[ScreenShare] WebSocket already connected to the correct URL.");
      return;
    }

    if (!sharedPC) {
      console.log("[ScreenShare] No PeerConnection found, creating a new one.");
      createPeerConnection();
    }

    console.log("[ScreenShare] Connecting WebSocket...");
    connect(webSocketUrl);

    // cleanup 생략 (필요시 추가)
  }, [effectiveGameId, userId, connect, disconnect]);

  // --- WebSocket 이벤트 핸들러 ---
  useEffect(() => {
    if (!websocket) return;
    console.log("[ScreenShare] Attaching WebSocket event handlers.");

    websocket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("[ScreenShare] WS Message Received:", data);
        if (data.type === "webrtc_signal" && data.sender !== user.user_id) {
          console.log("[ScreenShare] Handling WebRTC signal from peer.");
          await handleSignal(data.signal);
        } else if (data.type === "player_ready" && data.user_id !== user.user_id) {
          console.log("[ScreenShare] Opponent is ready.");
          setOpponentReady(true);
        } else if (data.type === "all_ready") {
          console.log("[ScreenShare] All players are ready.");
          setOpponentReady(true);
          setMyReady(true);
        }
      } catch (e) {
        console.error("[ScreenShare] Error parsing WS message:", e);
      }
    };

    websocket.onopen = () => {
      console.log("[ScreenShare] WebSocket connection opened.");
      sendMessage(JSON.stringify({ type: "webrtc_signal", signal: { type: "join" } }));
    };

    websocket.onerror = (error) => {
      console.error("[ScreenShare] WebSocket error:", error);
    };

    websocket.onclose = (event) => {
      console.log(`[ScreenShare] WebSocket closed: code=${event.code}, reason=${event.reason}`);
    };
  }, [websocket, user, sendMessage]);

  // --- PeerConnection 연결 상태 관리 ---
  useEffect(() => {
    if (!sharedPC) return;
    const handleConnectionStateChange = () => {
      console.log(`[ScreenShare] PeerConnection state changed: ${sharedPC.connectionState}`);
      if (
        sharedPC.connectionState === "disconnected" ||
        sharedPC.connectionState === "failed" ||
        sharedPC.connectionState === "closed"
      ) {
        console.warn("[ScreenShare] PeerConnection disconnected or failed.");
        setOpponentScreenShareStatus("disconnected");
        setShowMyScreenShareRestartButton(true);
        setIsWebRTCConnected(false);
      } else if (sharedPC.connectionState === "connected") {
        console.log("[ScreenShare] PeerConnection connected successfully.");
        setOpponentScreenShareStatus("connected");
        setShowMyScreenShareRestartButton(false);
        setIsWebRTCConnected(true);
      }
    };
    console.log("[ScreenShare] Attaching PeerConnection state change listener.");
    sharedPC.addEventListener("connectionstatechange", handleConnectionStateChange);
    return () => {
      console.log("[ScreenShare] Removing PeerConnection state change listener.");
      sharedPC.removeEventListener("connectionstatechange", handleConnectionStateChange);
    };
  }, [sharedPC]);

  // --- PeerConnection 생성 함수 ---
  const createPeerConnection = useCallback(() => {
    console.log("[ScreenShare] Creating new PeerConnection.");
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: [
            'turns:turn.code-ground.com:5349?transport=tcp'  // TLS over TCP
          ],
          username: 'codegrounduser',
          credential: 'codegroundpass'
        },
        {
          urls: [
            'turn:turn.code-ground.com:3478?transport=udp',
            'turn:turn.code-ground.com:3478?transport=tcp'
          ],
          username: 'codegrounduser',
          credential: 'codegroundpass'
        }
      ],
    });
    setPeerConnection(pc);

    pc.oniceconnectionstatechange = () => {
      console.log(`[ScreenShare] ICE connection state change: ${pc.iceConnectionState}`);
      if (
        pc.iceConnectionState === "disconnected" ||
        pc.iceConnectionState === "failed" ||
        pc.iceConnectionState === "closed"
      ) {
        console.warn("[ScreenShare] ICE Connection disconnected or failed.");
        setOpponentScreenShareStatus("disconnected");
        setShowMyScreenShareRestartButton(true);
        setRemoteStream(null);
        setRemoteStreamState(null);
        setIsWebRTCConnected(false);
      } else if (pc.iceConnectionState === "connected") {
        console.log("[ScreenShare] ICE Connection connected.");
        setOpponentScreenShareStatus("connected");
        setShowMyScreenShareRestartButton(false);
        setIsWebRTCConnected(true);
      }
    };

    const stream = myStream || sharedLocalStream;
    if (stream) {
      console.log("[ScreenShare] Adding tracks from existing stream to new PeerConnection.");
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    }
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        console.log("[ScreenShare] Sending ICE candidate.");
        sendMessage(
          JSON.stringify({ type: "webrtc_signal", signal: { type: "candidate", candidate } })
        );
      }
    };
    pc.ontrack = ({ streams: [stream] }) => {
      console.log("[ScreenShare] Received remote stream.", stream);
      setRemoteStream(stream);
      setRemoteStreamState(stream);
      setOpponentScreenShareStatus("connected");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      const remoteVideoTrack = stream.getVideoTracks()[0];
      if (remoteVideoTrack) {
        remoteVideoTrack.onended = () => {
          console.log("[ScreenShare] Remote track ended.");
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
    console.log("[ScreenShare] Handling signal:", signal);
    let pc = sharedPC;
    if (!pc) {
      console.log("[ScreenShare] No PeerConnection, creating one for signal handling.");
      pc = createPeerConnection();
    }
    try {
      if (signal.type === "offer") {
        console.log("[ScreenShare] Received offer.");
        if (pc.signalingState !== "stable") {
          console.warn(`[ScreenShare] Signaling state is not stable (${pc.signalingState}), rolling back.`);
          await Promise.all([
            pc.setLocalDescription({ type: "rollback" }),
            pc.setRemoteDescription(new RTCSessionDescription(signal))
          ]);
        } else {
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
        }
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log("[ScreenShare] Sending answer.");
        sendMessage(JSON.stringify({ type: "webrtc_signal", signal: pc.localDescription }));
      } else if (signal.type === "answer") {
        console.log("[ScreenShare] Received answer.");
        if (pc.signalingState === "have-local-offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(signal));
        } else {
          console.warn(`[ScreenShare] Received answer but signaling state is ${pc.signalingState}.`);
        }
      } else if (signal.type === "candidate") {
        if (signal.candidate) {
          console.log("[ScreenShare] Adding ICE candidate.");
          await pc.addIceCandidate(signal.candidate);
        }
      }
    } catch (error) {
      console.error("[ScreenShare] Error handling signal:", error);
    }
    setPeerConnection(pc);
  }, [createPeerConnection, sendMessage]);

  // --- 화면 공유 재시작 ---
  const handleRestartScreenShare = useCallback(async () => {
    console.log("[ScreenShare] Restarting screen share process.");
    try {
      setMyShareStatus("sharing");
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      const videoTrack = mediaStream.getVideoTracks()[0];
      const settings = videoTrack.getSettings() as any;
      if (settings.displaySurface === "monitor") {
        console.log("[ScreenShare] Restart successful, got 'monitor' stream.");
        setMyShareStatus("connected");
        setMyStream(mediaStream);
        setLocalStream(mediaStream);
        if (sharedPC) {
          const sender = sharedPC.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            console.log("[ScreenShare] Replacing track on existing sender.");
            await sender.replaceTrack(videoTrack);
          } else {
            console.log("[ScreenShare] No existing sender, adding new track.");
            sharedPC.addTrack(videoTrack, mediaStream);
          }
          console.log("[ScreenShare] Creating offer with ICE restart.");
          const offer = await sharedPC.createOffer({ iceRestart: true });
          await sharedPC.setLocalDescription(offer);
          console.log("[ScreenShare] Sending restart offer.");
          sendMessage(
            JSON.stringify({ type: "webrtc_signal", signal: sharedPC.localDescription })
          );
        }
        videoTrack.addEventListener("ended", () => {
          console.log("[ScreenShare] Restarted screen share track ended.");
          setMyShareStatus("disconnected");
          setMyStream(null);
          setLocalStream(null);
          setMyReady(false);
          setIsCountingDown(false);
          setCountdown(0);
          sendMessage(JSON.stringify({ type: "screen_share_stopped" }));
        });
      } else {
        console.warn("[ScreenShare] Invalid share type on restart.");
        setMyShareStatus("invalid");
        setMyReady(false);
        setIsCountingDown(false);
        setCountdown(0);
        mediaStream.getTracks().forEach(track => track.stop());
      }
    } catch (error) {
      console.error("[ScreenShare] Error restarting screen share:", error);
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
