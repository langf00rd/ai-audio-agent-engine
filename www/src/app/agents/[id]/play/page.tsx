"use client";

import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/use-web-socket";
import { useParams, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export default function AgentPlayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoadingAIResponse, setIsLoadingAIResponse] = useState(false);

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
    setIsListening(true);
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      console.log("[recorder] Stopped");
      setIsListening(false);
    }
  };

  async function handleGetAIResponse() {
    try {
      setIsLoadingAIResponse(true);
      const response = await fetch("http://localhost:8000/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: transcript, agent: params.id }),
      });
      const result = await response.json();
      setAIResponse(result.data);
      readOut(result.data);
    } catch (err) {
      alert(err);
    } finally {
      setIsLoadingAIResponse(false);
    }
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

  if (!connected) return <p>Not connected</p>;

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold capitalize">
        {isListening ? "Speaking" : "Speak"} To {searchParams.get("agent_name")}
      </h1>
      <div className="space-x-4">
        <Button
          onClick={isListening ? stopRecording : startRecording}
          variant={isListening ? "destructive" : "default"}
        >
          {!isListening ? "Start talking" : "Stop listening"}
        </Button>
        <Button onClick={handleGetAIResponse} disabled={isLoadingAIResponse}>
          {isLoadingAIResponse ? "Agent is thinking..." : "Ask Agent"}
        </Button>
      </div>
      <p className="italic">{transcript || "No transcript"}</p>
      {aiResponse && (
        <div className="space-y-1">
          <div className="size-4 bg-black animate-pulse" />
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
}
