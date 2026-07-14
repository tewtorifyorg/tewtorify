// ============================================================
// Tewtorify — Utility Functions
// ============================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with conflict resolution.
 * Used by shadcn/ui components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format BDT currency amount.
 */
export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`;
}

/**
 * Format a salary range.
 */
export function formatSalaryRange(min: number, max: number): string {
  return `${formatBDT(min)} – ${formatBDT(max)}/month`;
}

/**
 * Get initials from a name (for avatar fallback).
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * Truncate text to a max length with ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Format a Firestore timestamp to a readable date string.
 */
export function formatDate(timestamp: { toDate: () => Date } | Date | null): string {
  if (!timestamp) return 'N/A';
  const date = 'toDate' in timestamp ? timestamp.toDate() : timestamp;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format a relative time string (e.g., "2 days ago").
 */
export function timeAgo(timestamp: { toDate: () => Date } | Date | null): string {
  if (!timestamp) return 'N/A';
  const date = 'toDate' in timestamp ? timestamp.toDate() : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(timestamp);
}

/**
 * Generate a random ID (for client-side use before Firestore auto-ID).
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}

/**
 * Validate a Bangladeshi phone number (basic validation).
 * Accepts formats: 01XXXXXXXXX, +88 01XXXXXXXXX, 88 01XXXXXXXXX
 */
export function isValidBDPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^(\+?88)?01[3-9]\d{8}$/.test(cleaned);
}

/**
 * Validate an email address.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
