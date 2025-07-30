"use client";

import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/use-web-socket";
import { WEB_SOCKET_URL } from "@/lib/constants";
import { fetchAgentById } from "@/lib/services/agent";
import { Agent } from "@/lib/types";
import { MicIcon, PhoneIcon, PhoneOffIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import EmptyState from "./empty-state";
import { ErrorText } from "./typography";

export default function AgentChat(props: { isEmbed?: boolean; id: string }) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isListening, setIsListening] = useState(false);
  // const [aiResponse, setAIResponse] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState<null | boolean>(null);
  const [isPublic, setIsPublic] = useState<boolean | null>(null);

  const { webSocketRef, connected, connect } = useWebSocket({
    url: WEB_SOCKET_URL!,
    agentId: props.id,
    onMessage: async (evt) => {
      const data = JSON.parse(evt.data);
      // if (data.type === "LLM_RESPONSE") {
      //   setAIResponse((prev) => prev + data.llm_response);
      // }
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

  async function handleGetAgent() {
    try {
      const _agent = await fetchAgentById(props.id);
      setAgent(_agent.data);
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
      <div className="h-full items-center flex flex-col justify-center gap-5">
        <div className="size-[160px] bg-gradient-to-b from-[#ffb800] via-[#ffd9a8] to-[#ffb800] animate-pulse rounded-full" />
        <p className="uppercase font-semibold">
          {isListening ? "Speaking" : "Speak"} to {agent?.name}
        </p>
        <div className="flex gap-2">
          <Button disabled variant="outline">
            <MicIcon />
            Mute
          </Button>
          <Button
            onClick={isListening ? stopRecording : startRecording}
            variant={isListening ? "destructive-secondary" : "default"}
          >
            {isListening ? (
              <>
                End Call <PhoneOffIcon />
              </>
            ) : (
              <>
                <PhoneIcon />
                Start call
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
