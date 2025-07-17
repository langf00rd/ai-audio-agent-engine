"use client";

import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/use-web-socket";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";

export default function Transcriber() {
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const params = useParams();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { webSocketRef, connected } = useWebSocket({
    url: "ws://localhost:8000/ws",
    onMessage: (evt) => {
      const data = JSON.parse(evt.data);
      if (data.transcript) setTranscript(data.transcript);
    },
    onConnectionClose: () => {
      mediaRecorderRef.current?.stop();
    },
  });

  const startRecording = async () => {
    if (!connected) return alert("socket not connected");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = (e) => {
      if (webSocketRef.current?.readyState === WebSocket.OPEN) {
        webSocketRef.current.send(e.data);
      }
    };
    mediaRecorder.start(250);
    console.log("[recorder] Started");
  };

  async function handleGetAIResponse() {
    const response = await fetch("http://localhost:8000/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: transcript, agent: params.id }),
    });
    const result = await response.json();
    setAIResponse(result.data);
    readOut(result.data);
  }

  function readOut(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.onend = () => {
      console.log("✅ tts finished speaking");
    };
    speechSynthesis.speak(utterance);
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">🎙️ Live Transcriber</h2>
      <button
        onClick={startRecording}
        disabled={!connected}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mb-4"
      >
        start talking
      </button>
      <p>{transcript || "..."}</p>
      <Button onClick={handleGetAIResponse}>ask ai</Button>
      <p>from ai:</p>
      <p>{aiResponse}</p>
    </div>
  );
}
