import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
}

export function eraseCookie(name: string) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export const getAbsoluteUrl = (path: string) => {
  // console.log("getAbsoluteUrl called with path:", path);
  if (!path) return "";
  if (/^[a-zA-Z]+:\/\//.test(path)) return path;

  try {
    const url = new URL(path, S3_BASE_URL);
    return url.toString();
  } catch {
    return "";
  }
};
