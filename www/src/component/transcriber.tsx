"use client";

import { useEffect, useRef, useState } from "react";

export default function Transcriber() {
  const [transcript, setTranscript] = useState("");
  const [socketOpen, setSocketOpen] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket("ws://localhost:8000/ws");

      wsRef.current = ws;

      ws.onopen = () => {
        setSocketOpen(true);
        console.count("[web socket] connected");
      };

      ws.onmessage = (event) => {
        console.log("[web socket] message", event);
        const data = JSON.parse(event.data);
        if (data.transcript) setTranscript(data.transcript);
      };

      ws.onclose = () => {
        setSocketOpen(false);
        console.log("[web socket] disconnected");
      };

      ws.onerror = (err) => {
        console.error("[web socket] error", err);
        setSocketOpen(false);
        ws.close();
      };
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      wsRef.current?.close();
      mediaRecorderRef.current?.stop();
    };
  }, []);

  const startRecording = async () => {
    if (!socketOpen) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = (e) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(e.data);
      }
    };

    mediaRecorder.start(250);
    console.log("[recorder] Started");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">🎙️ Live Transcriber</h2>
      <button
        onClick={startRecording}
        disabled={!socketOpen}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mb-4"
      >
        Start Talking
      </button>
      <div className="bg-gray-100 text-gray-800 p-4 rounded h-60 overflow-y-auto whitespace-pre-line font-mono text-sm">
        {transcript || "Waiting for speech..."}
      </div>
    </div>
  );
}
