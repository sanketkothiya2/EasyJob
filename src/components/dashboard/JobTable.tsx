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
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
        <div className="col-span-4">Job</div>
        <div
          className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-pink-500 transition-colors"
          onClick={() => onSortChange('company')}
        >
          Company
          <SortIcon field="company" />
        </div>
        <div className="col-span-2">Status</div>
        <div
          className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-pink-500 transition-colors"
          onClick={() => onSortChange('dateSaved')}
        >
          Date Saved
          <SortIcon field="dateSaved" />
        </div>
        <div
          className="col-span-1 flex items-center gap-1 cursor-pointer hover:text-pink-500 transition-colors"
          onClick={() => onSortChange('excitement')}
        >
          <Star className="w-4 h-4" />
          <SortIcon field="excitement" />
        </div>
        <div className="col-span-1"></div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-50">
        {jobs.map((job, index) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            onClick={() => onSelectJob(job)}
            className={`grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer transition-all ${
              selectedJobId === job._id
                ? 'bg-pink-50 border-l-4 border-pink-500'
                : 'hover:bg-gray-50'
            }`}
          >
            {/* Job Title & Location */}
            <div className="col-span-4">
              <h3 className="font-medium text-gray-900 truncate">{job.title}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{job.location}</span>
              </div>
            </div>

            {/* Company */}
            <div className="col-span-2 flex items-center">
              <span className="text-gray-700 truncate">{job.company}</span>
            </div>

            {/* Status */}
            <div className="col-span-2 flex items-center">
              <StatusDropdown
                value={job.status}
                onChange={(status) => onStatusChange(job._id, status)}
              />
            </div>

            {/* Date Saved */}
            <div className="col-span-2 flex items-center text-sm text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(job.dateSaved)}
            </div>

            {/* Excitement */}
            <div className="col-span-1 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < job.excitement
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="col-span-1 flex items-center justify-end gap-2">
              {job.url && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1 text-gray-400 hover:text-pink-500 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
