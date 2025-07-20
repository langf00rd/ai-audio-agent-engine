"use client";

import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/use-web-socket";
import {
  API_BASE_URL,
  AUDIO_INPUT_SILENCE_THRESHOLD_DURATION,
  WEB_SOCKET_URL,
} from "@/lib/constants";
import { trackAgentUsage } from "@/lib/services/analytics";
import { speak } from "@/lib/services/tts";
import { PlayCircle, StopCircle } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AgentPlayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoadingAIResponse, setIsLoadingAIResponse] = useState(false);

  const { webSocketRef, connected } = useWebSocket({
    url: WEB_SOCKET_URL,
    onMessage: (evt) => {
      const data = JSON.parse(evt.data);
      if (data.sessionId) {
        setSessionId(data.sessionId);
        trackAgentUsage(String(params.id), data.sessionId);
      }
      if (data.transcript) {
        setTranscript(data.transcript);
        resetSilenceTimer(data.transcript);
      }
    },
    onConnectionClose: () => {
      stopRecording();
    },
  });

  const resetSilenceTimer = (_transcript: string) => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      handleGetAIResponse(_transcript);
    }, AUDIO_INPUT_SILENCE_THRESHOLD_DURATION);
  };

  const startRecording = async () => {
    if (!connected) return alert("Socket not connected");
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
    mediaRecorder.start(250); // Send audio chunks every 250ms
    setIsListening(true);
    console.log("[recorder] started");
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      console.log("[recorder] stopped");
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setIsListening(false);
  };

  async function handleGetAIResponse(_transcript?: string) {
    try {
      setIsLoadingAIResponse(true);
      const response = await fetch(`${API_BASE_URL}/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: _transcript || transcript,
          agent: params.id,
        }),
      });
      const result = await response.json();
      setAIResponse(result.data);
      await speak(result.data);
    } catch (err) {
      alert(err);
    } finally {
      setIsLoadingAIResponse(false);
    }
  }

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  if (!connected) return <p>Not connected</p>;

  return (
    <div className="space-y-10 relative h-[80%]">
      {sessionId && (
        <p className="text-sm text-neutral-400">
          You are connected. {sessionId}
        </p>
      )}
      {transcript && (
        <div>
          <p className="text-sm text-neutral-400">You</p>
          <p className="text-2xl text-neutral-700 leading-[1.6]">
            {transcript}
          </p>
        </div>
      )}
      {aiResponse && (
        <div className="space-y-1">
          <div className="flex items-center gap-1 animate-bounce">
            <div className="size-3 bg-black rounded-sm" />
            <p className="text-sm text-neutral-400">
              {searchParams.get("agent_name")}
            </p>
          </div>
          <p className="text-2xl text-neutral-700 leading-[1.6]">
            {aiResponse}
          </p>
        </div>
      )}
      {isLoadingAIResponse && (
        <p className="text-sm text-neutral-500 animate-pulse">
          Agent is thinking...
        </p>
      )}
      <div className="absolute bottom-[0] w-full flex items-center justify-center">
        <Button
          size="lg"
          onClick={isListening ? stopRecording : startRecording}
          variant={isListening ? "destructive" : "default"}
        >
          {isListening ? "Stop" : "Start conversation"}
          {isListening ? <StopCircle /> : <PlayCircle />}
        </Button>
      </div>
    </div>
  );
}
