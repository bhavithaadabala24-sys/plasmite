import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type EmbedRecord<T> = T | T[] | null;

export function embedValue<T>(value: EmbedRecord<T>): T | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}