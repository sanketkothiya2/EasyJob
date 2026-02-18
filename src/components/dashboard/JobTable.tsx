'use client';

import { motion } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  MapPin,
  Calendar,
  ExternalLink,
  MoreHorizontal,
  Star,
  Building2,
} from 'lucide-react';
import { Job, JobStatus } from '@/types';
import StatusDropdown from '@/components/ui/StatusDropdown';
import { formatDate } from '@/lib/utils';

interface JobTableProps {
  jobs: Job[];
  selectedJobId?: string;
  onSelectJob: (job: Job) => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  sortBy: 'dateSaved' | 'company' | 'excitement';
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: 'dateSaved' | 'company' | 'excitement') => void;
}

export default function JobTable({
  jobs,
  selectedJobId,
  onSelectJob,
  onStatusChange,
  sortBy,
  sortOrder,
  onSortChange,
}: JobTableProps) {
  const SortIcon = ({
    field,
  }: {
    field: 'dateSaved' | 'company' | 'excitement';
  }) => {
    if (sortBy !== field)
      return <ChevronDown className="w-4 h-4 text-gray-300" />;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-pink-500" />
    ) : (
      <ChevronDown className="w-4 h-4 text-pink-500" />
    );
  };

  return (
    <div className="space-y-3">
      {/* Sort Controls */}
      <div className="flex items-center gap-4 px-2 text-sm">
        <span className="text-gray-500">Sort by:</span>
        <button
          onClick={() => onSortChange('dateSaved')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
            sortBy === 'dateSaved' 
              ? 'bg-pink-100 text-pink-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Date
          <SortIcon field="dateSaved" />
        </button>
        <button
          onClick={() => onSortChange('company')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
            sortBy === 'company' 
              ? 'bg-pink-100 text-pink-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Company
          <SortIcon field="company" />
        </button>
        <button
          onClick={() => onSortChange('excitement')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
            sortBy === 'excitement' 
              ? 'bg-pink-100 text-pink-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Star className="w-4 h-4" />
          <SortIcon field="excitement" />
        </button>
      </div>

      {/* Job Cards */}
      <div className="space-y-3">
        {jobs.map((job, index) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            onClick={() => onSelectJob(job)}
            className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedJobId === job._id
                ? 'border-pink-400 shadow-md bg-pink-50/50'
                : 'border-gray-100 hover:border-pink-200'
            }`}
          >
            {/* Top Row: Title & Status */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate text-lg">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Building2 className="w-4 h-4 text-pink-400" />
                    <span className="font-medium">{job.company}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{job.location}</span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Row: Status, Date, Stars */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div onClick={(e) => e.stopPropagation()}>
                <StatusDropdown
                  value={job.status}
                  onChange={(status) => onStatusChange(job._id, status)}
                />
              </div>
              
              <div className="flex items-center gap-4">
                {/* Date */}
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(job.dateSaved)}</span>
                </div>
                
                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < job.excitement
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
