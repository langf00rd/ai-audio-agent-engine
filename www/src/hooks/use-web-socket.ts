import { useEffect, useRef, useState } from "react";

export function useWebSocket(props: {
  url: string;
  agentId: string;
  onMessage?: (event: MessageEvent) => void;
  onConnectionClose?: () => void;
  onConnection?: () => void;
  onError?: (error: string) => void;
}) {
  const [isConnecting, setIsConnecting] = useState<boolean | null>(null);
  const [connected, setConnected] = useState(false);
  const webSocketRef = useRef<WebSocket | null>(null);

  function connect() {
    console.count("[web socket] connecting...");
    try {
      setIsConnecting(true);
      const ws = new WebSocket(props.url + `?agentId=${props.agentId}`);
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
      setConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }

  useEffect(() => {
    return () => {
      webSocketRef.current?.close();
      props.onConnectionClose?.();
    };
  }, []);

  return { webSocketRef, connected, isConnecting, connect };
}
