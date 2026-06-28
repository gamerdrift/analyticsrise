import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with clsx
 * Handles conditional classes and prevents conflicts
 *
 * @param inputs - Class values to merge
 * @returns Merged class string
 *
 * @example
 * cn('px-2 py-1', condition && 'bg-red-500', 'px-3')
 * // Result: 'py-1 bg-red-500 px-3'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
