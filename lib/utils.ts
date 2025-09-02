import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hoursSince(timestamp: string | number | Date): number {
  const past = new Date(timestamp).getTime();
  const now = Date.now();
  const diffMs = now - past; // difference in milliseconds
  const hours = diffMs / (1000 * 60 * 60); // convert ms → hours
  return Math.ceil(hours); // round up
}
