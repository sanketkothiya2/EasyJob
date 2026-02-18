import { cn } from '@/lib/utils';
import { JobStatus } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'status' | 'outline' | 'secondary';
  status?: JobStatus;
  size?: 'sm' | 'md';
  className?: string;
}

const statusColors: Record<JobStatus, string> = {
  bookmarked: 'bg-gray-100 text-gray-700 border-gray-200',
  applying: 'bg-blue-100 text-blue-700 border-blue-200',
  applied: 'bg-purple-100 text-purple-700 border-purple-200',
  interviewing: 'bg-orange-100 text-orange-700 border-orange-200',
  negotiating: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  accepted: 'bg-green-100 text-green-700 border-green-200',
  withdrawn: 'bg-gray-100 text-gray-500 border-gray-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  no_response: 'bg-gray-50 text-gray-400 border-gray-200',
};

const statusLabels: Record<JobStatus, string> = {
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

export default function Badge({
  children,
  variant = 'default',
  status,
  size = 'md',
  className,
}: BadgeProps) {
  const baseClasses = cn(
    'inline-flex items-center rounded-full font-medium border',
    size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs'
  );

  if (variant === 'status' && status) {
    return (
      <span className={cn(baseClasses, statusColors[status], className)}>
        {children || statusLabels[status]}
      </span>
    );
  }

  const variantClasses: Record<string, string> = {
    default: 'bg-pink-100 text-pink-700 border-pink-200',
    outline: 'bg-transparent text-gray-600 border-gray-300',
    secondary: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <span className={cn(baseClasses, variantClasses[variant] || variantClasses.default, className)}>
      {children}
    </span>
  );
}
