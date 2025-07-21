import { useEffect, useRef, useState } from "react";

export function useWebSocket(props: {
  url: string;
  onMessage?: (event: MessageEvent) => void;
  onConnectionClose?: () => void;
  onConnection?: () => void;
  onError?: (error: string) => void;
}) {
  const [connected, setConnected] = useState(false);
  const webSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    function connectWebSocket() {
      try {
        const ws = new WebSocket(props.url);
        webSocketRef.current = ws;

        ws.onopen = () => {
          setConnected(true);
          props.onConnection?.();
          console.count("[web socket] connected");
        };

        ws.onmessage = (event) => {
          console.log("[web socket] message", event);
          props.onMessage?.(event);
        };

        ws.onclose = () => {
          console.log("[web socket] disconnected");
          setConnected(false);
          props.onConnectionClose?.();
        };

        ws.onerror = (err) => {
          console.error("[web socket] error", err);
          setConnected(false);
          ws.close();
        };
      } catch (err) {
        console.error("[web socket] error", err);
        props.onError?.(String(err));
      }
    }

    connectWebSocket();
    return () => {
      webSocketRef.current?.close();
      props.onConnectionClose?.();
    };
  }, [props]);

  return { webSocketRef, connected };
}
