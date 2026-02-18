import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    bookmarked: 'bg-gray-100 text-gray-700',
    applying: 'bg-blue-100 text-blue-700',
    applied: 'bg-purple-100 text-purple-700',
    interviewing: 'bg-orange-100 text-orange-700',
    negotiating: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    withdrawn: 'bg-gray-100 text-gray-500',
    rejected: 'bg-red-100 text-red-700',
    no_response: 'bg-gray-100 text-gray-400',
  };
  return colors[status] || colors.bookmarked;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    bookmarked: 'Bookmarked',
    applying: 'Applying',
    applied: 'Applied',
    interviewing: 'Interviewing',
    negotiating: 'Negotiating',
    accepted: 'Accepted',
    withdrawn: 'Withdrawn',
    rejected: 'Rejected',
    no_response: 'No Response',
  };
  return labels[status] || status;
}
