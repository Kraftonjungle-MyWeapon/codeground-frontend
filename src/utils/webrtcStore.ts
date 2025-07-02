export let localStream: MediaStream | null = null;
export let remoteStream: MediaStream | null = null;
export let peerConnection: RTCPeerConnection | null = null;

export const setLocalStream = (stream: MediaStream | null) => {
  localStream = stream;
};

export const setRemoteStream = (stream: MediaStream | null) => {
  remoteStream = stream;
};

export const setPeerConnection = (pc: RTCPeerConnection | null) => {
  peerConnection = pc;
};