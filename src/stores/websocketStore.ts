
import { create } from 'zustand';

interface WebSocketState {
  websocket: WebSocket | null;
  isConnected: boolean;
  connect: (url: string) => void;
  disconnect: () => void;
  sendMessage: (message: string) => void;
}

const useWebSocketStore = create<WebSocketState>((set, get) => ({
  websocket: null,
  isConnected: false,
  connect: (url: string) => {
    if (get().websocket && get().websocket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected.');
      return;
    }

    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('WebSocket connected.');
      set({ websocket: ws, isConnected: true });
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      // You might want to add a callback or a way to handle messages here
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      set({ websocket: null, isConnected: false });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      set({ isConnected: false });
    };
  },
  disconnect: () => {
    const { websocket } = get();
    if (websocket) {
      websocket.close();
      set({ websocket: null, isConnected: false });
    }
  },
  sendMessage: (message: string) => {
    const { websocket } = get();
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(message);
    } else {
      console.warn('WebSocket not connected. Cannot send message:', message);
    }
  },
}));

export default useWebSocketStore;
