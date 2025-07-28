"use client";

import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/use-web-socket";
import {
  AUDIO_INPUT_SILENCE_THRESHOLD_DURATION,
  WEB_SOCKET_URL,
} from "@/lib/constants";
import { fetchAgentById } from "@/lib/services/agent";
import { fetchAIResponse } from "@/lib/services/ai";
import { speak } from "@/lib/services/tts";
import { PlayCircle, StopCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import EmptyState from "./empty-state";
import { ErrorText } from "./typography";

export default function AgentChat(props: { isEmbed?: boolean; id: string }) {
  const searchParams = useSearchParams();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoadingAIResponse, setIsLoadingAIResponse] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState<null | boolean>(null);
  const [isPublic, setIsPublic] = useState<boolean | null>(null);

  const { webSocketRef, connected, connect } = useWebSocket({
    url: WEB_SOCKET_URL!,
    agentId: props.id,
    onMessage: async (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === "LLM_RESPONSE") {
        setAIResponse((prev) => prev + data.llm_response);
      }
      if (data.type === "TTS_AUDIO") {
        const base64Audio = data.audio;
        const audioBuffer = Uint8Array.from(atob(base64Audio), (c) =>
          c.charCodeAt(0),
        );
        const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play().catch((err) => console.error("audio play error", err));
      }
    },
    onConnectionClose: () => {
      stopRecording();
    },
  });

  const resetSilenceTimer = (_transcript: string, _sessionId: string) => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      handleGetAIResponse(_sessionId, _transcript);
    }, AUDIO_INPUT_SILENCE_THRESHOLD_DURATION);
  };

  const startRecording = async () => {
    try {
      if (!connected) return alert("socket not connected");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (evt) => {
        if (webSocketRef.current?.readyState === WebSocket.OPEN) {
          webSocketRef.current.send(evt.data);
        }
      };
      mediaRecorder.start(250); // send audio chunks every 250ms
      setIsListening(true);
      console.log("[recorder] started");
    } catch (err) {
      alert(err);
    }
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

  async function handleGetAIResponse(_sessionId: string, _transcript?: string) {
    try {
      setIsLoadingAIResponse(true);
      const response = await fetchAIResponse(
        _transcript || transcript,
        props.id,
        sessionId || _sessionId,
      );
      if (response.data) await speak(response.data);
      setAIResponse(response.data);
    } catch (err) {
      toast((err as Error).message);
    } finally {
      setIsLoadingAIResponse(false);
    }
  }

  async function handleGetAgent() {
    try {
      const _agent = await fetchAgentById(props.id);
      return _agent.data;
    } catch (err) {
      toast((err as Error).message);
    }
  }

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  if (!isReady) {
    return (
      <EmptyState
        title={`Conversation not started yet`}
        isActionButtonDisabled={Boolean(isLoading)}
        actionButtonLabel={isLoading ? "Connecting..." : "Connect"}
        onActionButtonClick={async () => {
          try {
            setIsLoading(true);
            const _agent = await handleGetAgent();
            setIsPublic(Boolean(_agent?.is_public));
            if (props.isEmbed) {
              if (Boolean(_agent?.is_public)) connect();
            } else connect();
            setIsReady(true);
          } catch (err) {
            alert(err);
          } finally {
            setIsLoading(false);
          }
        }}
      />
    );
  }

  if (props.isEmbed && !isPublic) {
    return (
      <ErrorText>Could not find agent. Please contact the admin</ErrorText>
    );
  }

  return (
    <div className="space-y-10 h-full relative flex flex-col justify-between">
      <div className="space-y-2">
        {sessionId && (
          <p className="text-sm text-neutral-400">
            You are connected. {sessionId}
          </p>
        )}
        {isLoadingAIResponse && (
          <p className="text-sm text-neutral-500 animate-pulse">
            Agent is responding...
          </p>
        )}
      </div>
      <div className="pb-20 space-y-8">
        {transcript && (
          <div>
            <p className="text-sm text-neutral-400">You</p>
            <p className="text-xl md:text-2xl text-neutral-600 leading-[1.6]">
              {transcript}
            </p>
          </div>
        )}
        {aiResponse && (
          <div className="space-y-1">
            <div
              className={`flex items-center gap-1 ${isLoadingAIResponse && "animate-bounce"}`}
            >
              <div className="size-3 bg-black rounded-sm" />
              <p className="text-sm text-neutral-400">
                {searchParams.get("agent_name")}
              </p>
            </div>
            <p className="text-xl md:text-2xl text-neutral-700 leading-[1.6]">
              {aiResponse}
            </p>
          </div>
        )}
      </div>
      <div className="sticky bottom-[10] w-full flex items-center justify-center">
        <Button
          onClick={isListening ? stopRecording : startRecording}
          variant={isListening ? "destructive" : "default"}
        >
          {isListening ? (
            <>
              Stop <StopCircle />
            </>
          ) : (
            <>
              Start conversation <PlayCircle />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
