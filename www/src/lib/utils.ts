import { clsx, type ClassValue } from "clsx";
import Cookie from "js-cookie";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { COOKIE_KEYS } from "./constants";
import { SessionConversation } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast("copied to clipboard");
}

export function isoToReadableDate(dateString: Date): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
}

export function getDurationString(
  start: Date | string,
  end: Date | string,
): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  let diffInSeconds = Math.floor(
    (endDate.getTime() - startDate.getTime()) / 1000,
  );
  const hours = Math.floor(diffInSeconds / 3600);
  diffInSeconds %= 3600;
  const minutes = Math.floor(diffInSeconds / 60);
  const seconds = diffInSeconds % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}hr${hours > 1 ? "s" : ""} `);
  if (minutes > 0) parts.push(`${minutes}min${minutes > 1 ? "s" : ""}`);
  if (seconds > 0 || parts.length === 0)
    parts.push(`${seconds}sec${seconds > 1 ? "s" : ""}`);
  return parts.join(" ");
}

export function getTotalConversationDuration(
  sessions: SessionConversation[],
): string {
  function formatDuration(ms: number): string {
    let totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}hr${hours > 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes}min${minutes > 1 ? "s" : ""}`);
    if (seconds > 0 || parts.length === 0)
      parts.push(`${seconds}sec${seconds > 1 ? "s" : ""}`);
    return parts.join(" ");
  }
  return formatDuration(
    sessions.reduce((total, session) => {
      const start = new Date(session.start_dt).getTime();
      const end = new Date(session.end_dt).getTime();
      const duration = end - start;
      return total + duration;
    }, 0),
  ); // duration in milliseconds
}

export function formatNumber(num: number) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export function getCookie<T>(
  key: COOKIE_KEYS,
  opts?: {
    parse?: boolean;
  },
) {
  if (!key) throw new Error("key is required");
  const data = Cookie.get(String(key));
  if (!data) return null;
  if (opts?.parse) return JSON.parse(data) as T;
  return data as T;
}
