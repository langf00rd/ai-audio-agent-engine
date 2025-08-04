"use client";

import { Button } from "@/components/ui/button";
import useAudio from "@/hooks/use-audio";
import { useAudioStream } from "@/hooks/use-audio-stream";
import { useWebSocket } from "@/hooks/use-web-socket";
import { WEB_SOCKET_URL } from "@/lib/constants";
import { fetchAgentById } from "@/lib/services/agent";
import { Agent, WebSocketResponseType } from "@/lib/types";
import { MicIcon, PhoneIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EmptyState from "./empty-state";
import { ErrorText } from "./typography";

export default function AgentChat(props: { isEmbed?: boolean; id: string }) {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState<null | boolean>(null);
  const [isPublic, setIsPublic] = useState<boolean | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);

  const { handleChunks, setupBrowserAudioStreamHandler } = useAudioStream();

  const { webSocketRef, connect } = useWebSocket({
    url: WEB_SOCKET_URL!,
    agentId: props.id,
    onConnectionClose: () => disconnectBrowserAudio(),
    onMessage: async (evt) => {
      const data = JSON.parse(evt.data);
      const type = data.type as WebSocketResponseType;
      if (type === WebSocketResponseType.TTS_AUDIO_STREAM) handleChunks(data);
    },
  });

  const { disconnectBrowserAudio, connectBrowserAudio } = useAudio({
    onAudioAvailable: (evt) => {
      if (webSocketRef.current?.readyState === WebSocket.OPEN) {
        webSocketRef.current.send(evt.data);
      }
    },
  });

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
      disconnectBrowserAudio();
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
        <p className="uppercase font-semibold">Speak to {agent?.name}</p>
        <div className="flex gap-2">
          <Button disabled variant="outline">
            <MicIcon />
            Mute
          </Button>
          <Button
            // onClick={isListening ? disconnectBrowserAudio : connectBrowserAudio}
            // variant={isListening ? "destructive-secondary" : "default"}
            onClick={() => {
              setupBrowserAudioStreamHandler();
              connectBrowserAudio();
            }}
          >
            <PhoneIcon />
            Start call
            {/*{isListening ? (
              <>
                End Call <PhoneOffIcon />
              </>
            ) : (
              <>
                <PhoneIcon />
                Start call
              </>
            )}*/}
          </Button>
        </div>
      </div>
    </div>
  );
}
