import { useRef } from "react";

/**
 * plays out audio streams by handling audio chunks and playing as a single audio
 * @returns
 */
export function useAudioStream() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const chunkQueueRef = useRef<Uint8Array[]>([]);

  /**
   * receives audio chunks from audio stream and queues it for play out
   * @param data  - audio chunk from server
   * @returns void
   */
  function handleChunks(data: { audio: string }) {
    const byteCharacters = atob(data.audio);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(null)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const chunk = new Uint8Array(byteNumbers);
    const sourceBuffer = sourceBufferRef.current;
    if (!sourceBuffer) return;
    if (sourceBuffer.updating || chunkQueueRef.current.length > 0) {
      chunkQueueRef.current.push(chunk);
    } else sourceBuffer.appendBuffer(chunk);
  }

  const setupBrowserAudioStreamHandler = () => {
    if (audioRef.current) return;
    const audio = new Audio();
    const mediaSource = new MediaSource();
    mediaSource.addEventListener("sourceopen", () => {
      const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
      sourceBufferRef.current = sourceBuffer;
      sourceBuffer.addEventListener("updateend", () => {
        const queue = chunkQueueRef.current;
        if (queue.length > 0 && !sourceBuffer.updating) {
          const nextChunk = queue.shift();
          if (nextChunk) {
            sourceBuffer.appendBuffer(nextChunk as unknown as ArrayBuffer);
          }
        }
      });
    });
    audio.src = URL.createObjectURL(mediaSource);
    audio.autoplay = true;
    mediaSourceRef.current = mediaSource;
    audioRef.current = audio;
    document.body.appendChild(audio);
  };

  return { handleChunks, setupBrowserAudioStreamHandler };
}
