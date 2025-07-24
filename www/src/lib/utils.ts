import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

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
