import { AUDIO_INPUT_TIME_SLICE } from "@/lib/constants";
import { useRef } from "react";

export default function useAudio(props: {
  onAudioAvailable: (evt: BlobEvent) => void;
}) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  async function connectBrowserAudio() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = (evt) => {
      props.onAudioAvailable(evt);
    };
    mediaRecorder.start(AUDIO_INPUT_TIME_SLICE);
  }

  async function disconnectBrowserAudio() {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    mediaRecorderRef.current = null;
  }

  return { connectBrowserAudio, disconnectBrowserAudio };
}
