
import { create } from 'zustand';

interface WebSocketState {
  websocket: WebSocket | null;
  isConnected: boolean;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  reconnectTimeoutId: ReturnType<typeof setTimeout> | null;
  isReconnecting: boolean;
  reconnectUrl: string | null;
  connect: (url: string) => void;
  disconnect: () => void;
  sendMessage: (message: string) => void;
  reconnect: () => void;
}

const useWebSocketStore = create<WebSocketState>((set, get) => ({
  websocket: null,
  isConnected: false,
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
  reconnectTimeoutId: null,
  isReconnecting: false,
  reconnectUrl: sessionStorage.getItem('websocketUrl'), // Load from sessionStorage on init

  connect: (url: string) => {
    const { websocket, isReconnecting, reconnectTimeoutId } = get();

    if (websocket && websocket.readyState === WebSocket.OPEN) {
      // If already connected to the same URL, do nothing
      if (websocket.url === url) {
        console.log('WebSocket already connected to the same URL.');
        return;
      }
      // If connected to a different URL, close the old connection
      else {
        console.log('WebSocket connected to a different URL. Closing old connection.');
        websocket.close(1000, 'New connection requested');
        set({ websocket: null, isConnected: false });
      }
    }

    // Clear any existing reconnect attempts if a new connection is explicitly initiated
    if (reconnectTimeoutId) {
      clearTimeout(reconnectTimeoutId);
      set({ reconnectTimeoutId: null, isReconnecting: false, reconnectAttempts: 0 });
    }

    set({ isReconnecting: false, reconnectAttempts: 0, reconnectUrl: url });

    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('WebSocket connected.');
      sessionStorage.setItem('websocketUrl', url); // Save URL to sessionStorage on successful connection
      set({ websocket: ws, isConnected: true, reconnectAttempts: 0, isReconnecting: false });
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      // You might want to add a callback or a way to handle messages here
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      set({ websocket: null, isConnected: false });

      // Only attempt to reconnect if not a normal closure (code 1000) and not already reconnecting
      if (event.code !== 1000 && !get().isReconnecting) {
        get().reconnect();
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      set({ isConnected: false });
      if (!get().isReconnecting) {
        get().reconnect();
      }
    };
  },

  disconnect: () => {
    const { websocket, reconnectTimeoutId } = get();
    if (reconnectTimeoutId) {
      clearTimeout(reconnectTimeoutId);
    }
    if (websocket) {
      // Use code 1000 for normal closure to prevent auto-reconnect
      websocket.close(1000, 'Client disconnected');
      localStorage.removeItem('websocketUrl'); // Remove URL from localStorage on explicit disconnect
      set({ websocket: null, isConnected: false, isReconnecting: false, reconnectAttempts: 0, reconnectTimeoutId: null });
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

  reconnect: () => {
    const { reconnectAttempts, maxReconnectAttempts, reconnectUrl, connect } = get();

    if (reconnectAttempts < maxReconnectAttempts && reconnectUrl) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/battle' && currentPath !== '/screen-share-setup') {
        console.log('Not on battle or screen share setup page. Skipping reconnect.');
        set({ isReconnecting: false, reconnectAttempts: 0, reconnectTimeoutId: null });
        return;
      }
      const delay = Math.pow(2, reconnectAttempts) * 1000; // Exponential backoff
      console.log(`Attempting to reconnect in ${delay / 1000} seconds (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})...`);
      set({ isReconnecting: true, reconnectAttempts: reconnectAttempts + 1 });

      const timeoutId = setTimeout(() => {
        connect(reconnectUrl);
      }, delay);
      set({ reconnectTimeoutId: timeoutId });
    } else {
      console.error('Max reconnect attempts reached or no reconnect URL. Giving up.');
      set({ isReconnecting: false, reconnectAttempts: 0, reconnectTimeoutId: null });
      // Optionally, notify the user that reconnection failed
    }
  },
}));

export default useWebSocketStore;
