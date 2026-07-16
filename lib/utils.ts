import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Helps merge Tailwind classes dynamically
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
