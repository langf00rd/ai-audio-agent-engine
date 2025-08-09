import { clsx, type ClassValue } from "clsx";
import Cookie from "js-cookie";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { COOKIE_KEYS } from "./constants";
import { Job, SessionConversation } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast("copied to clipboard");
}

export function isoToReadableDate(
  dateString: Date | string,
  output?: "time" | "date-time" | "date",
  relative?: boolean,
): string {
  const date = new Date(dateString);
  const now = new Date();

  if (relative) {
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds} secs ago`;
    if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24 && now.toDateString() === date.toDateString()) {
      return `Today at ${date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    }
    if (days === 1 || (hours < 48 && isYesterday(date, now)))
      return "Yesterday";
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

    // fallback to default format if older than 7 days
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // default behavior if `relative` is false
  if (output === "time") {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } else if (output === "date-time") {
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } else {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
}

function isYesterday(date: Date, now: Date): boolean {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
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
    dataType?: "boolean";
  },
) {
  if (!key) throw new Error("key is required");
  const data = Cookie.get(String(key));
  if (!data) return null;
  if (opts?.parse) {
    if (opts?.dataType === "boolean") {
      return (data === "true") as T; // strict boolean conversion
    }
    return JSON.parse(data) as T;
  }
  return data as T;
}

export function getInitials(word: string) {
  if (!word) return "";
  const words = word.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function formatJobInterval(interval: Job["interval"]) {
  if (!interval) return "None";
  const parts = [];
  if (interval.months) parts.push(`${interval.months} months`);
  if (interval.days) parts.push(`${interval.days} days`);
  if (interval.hours) parts.push(`${interval.hours} hours`);
  return parts.length > 0 ? parts.join(" ") : "None";
}
