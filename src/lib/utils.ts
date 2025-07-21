import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
}

export const getAbsoluteUrl = (path: string) => {
  // console.log("getAbsoluteUrl called with path:", path);
  if (!path || path === "null" || path === "undefined" || path.trim() === "") return "";
  if (/^[a-zA-Z]+:\/\//.test(path)) return path;

  try {
    const url = new URL(path, S3_BASE_URL);
    return url.toString();
  } catch {
    return "";
  }
};
