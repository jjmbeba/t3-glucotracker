import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function removeSearchParam(pathname: string, param: string) {
  const urlObj = new URL(`${process.env.NEXT_PUBLIC_APP_URL}${pathname}`)
  urlObj.searchParams.delete(param)
  return urlObj.pathname + urlObj.search
}

export function constructNewUrl(pathname: string, params: Record<string, string>) {
  const urlObj = new URL(`${process.env.NEXT_PUBLIC_APP_URL}${pathname}`)
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value)
  })
  return urlObj.pathname + urlObj.search
}
