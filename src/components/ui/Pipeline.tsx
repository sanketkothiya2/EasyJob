'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { JobStatus } from '@/types';
import {
  Bookmark,
  FileEdit,
  Send,
  MessageSquare,
  HandshakeIcon,
  Trophy,
} from 'lucide-react';

interface PipelineStage {
  id: JobStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const stages: PipelineStage[] = [
  {
    id: 'bookmarked',
    label: 'Bookmarked',
    icon: <Bookmark className="w-5 h-5" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 hover:bg-gray-200',
  },
  {
    id: 'applying',
    label: 'Applying',
    icon: <FileEdit className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 hover:bg-blue-200',
  },
  {
    id: 'applied',
    label: 'Applied',
    icon: <Send className="w-5 h-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 hover:bg-purple-200',
  },
  {
    id: 'interviewing',
    label: 'Interviewing',
    icon: <MessageSquare className="w-5 h-5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 hover:bg-orange-200',
  },
  {
    id: 'negotiating',
    label: 'Negotiating',
    icon: <HandshakeIcon className="w-5 h-5" />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 hover:bg-yellow-200',
  },
  {
    id: 'accepted',
    label: 'Accepted',
    icon: <Trophy className="w-5 h-5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100 hover:bg-green-200',
  },
];

interface StageWithCount {
  id: JobStatus;
  label: string;
  icon?: string;
  color?: string;
  count?: number;
}

interface PipelineProps {
  stages: StageWithCount[];
  selectedStatus?: JobStatus | 'all';
  onStageClick?: (status: JobStatus) => void;
  className?: string;
}

export default function Pipeline({
  stages: stagesWithCounts,
  selectedStatus,
  onStageClick,
  className,
}: PipelineProps) {
  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto pb-2', className)}>
      {stages.map((stage, index) => {
        const stageData = stagesWithCounts.find((s) => s.id === stage.id);
        const count = stageData?.count || 0;

        return (
          <motion.button
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStageClick?.(stage.id)}
            className={cn(
              'flex flex-col items-center p-4 rounded-xl min-w-[120px] transition-all duration-200',
              stage.bgColor,
              selectedStatus === stage.id && 'ring-2 ring-pink-500 ring-offset-2'
            )}
          >
            <div className={cn('mb-2', stage.color)}>{stage.icon}</div>
            <span className={cn('text-sm font-medium', stage.color)}>
              {stage.label}
            </span>
            <span className={cn('text-2xl font-bold mt-1', stage.color)}>
              {count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// Mini pipeline for job detail view
interface MiniPipelineProps {
  currentStatus: JobStatus;
  onStatusChange?: (status: JobStatus) => void;
  className?: string;
}

export function MiniPipeline({
  currentStatus,
  onStatusChange,
  className,
}: MiniPipelineProps) {
  const currentIndex = stages.findIndex((s) => s.id === currentStatus);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {stages.map((stage, index) => {
        const isPast = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <button
            key={stage.id}
            onClick={() => onStatusChange?.(stage.id)}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
              isPast && 'bg-green-500 text-white',
              isCurrent && 'bg-pink-500 text-white ring-2 ring-pink-300',
              !isPast && !isCurrent && 'bg-gray-200 text-gray-400 hover:bg-gray-300'
            )}
            title={stage.label}
          >
            <span className="text-xs font-bold">{index + 1}</span>
          </button>
        );
      })}
    </div>
  );
}

export { stages };
