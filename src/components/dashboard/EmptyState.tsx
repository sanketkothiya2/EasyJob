'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import Button from '@/components/ui/Button';

interface EmptyStateProps {
  hasJobs: boolean;
  onAddJob: () => void;
}

export default function EmptyState({ hasJobs, onAddJob }: EmptyStateProps) {
  if (hasJobs) {
    // No matching jobs (filtered)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-soft border border-gray-100 p-12 text-center"
      >
        <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-pink-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No matching jobs found
        </h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          Try adjusting your search or filter criteria to find what you're looking
          for.
        </p>
      </motion.div>
    );
  }

  // No jobs at all
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-soft border border-gray-100 p-12 text-center"
    >
      <div className="relative w-48 h-48 mx-auto mb-6">
        <Image
          src="/images/illustrations/empty-states/no-jobs.png"
          alt="No jobs"
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Start your job search journey!
      </h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        Track your applications, stay organized, and land your dream job. Add your
        first job to get started.
      </p>
      <Button onClick={onAddJob} size="lg">
        <Plus className="w-5 h-5 mr-2" />
        Add Your First Job
      </Button>
    </motion.div>
  );
}
