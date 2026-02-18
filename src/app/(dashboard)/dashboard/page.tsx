'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Pipeline from '@/components/ui/Pipeline';
import JobTable from '@/components/dashboard/JobTable';
import AddJobModal from '@/components/dashboard/AddJobModal';
import JobDetailPanel from '@/components/dashboard/JobDetailPanel';
import EmptyState from '@/components/dashboard/EmptyState';
import ExportModal from '@/components/dashboard/ExportModal';
import { triggerPinkConfetti } from '@/lib/confetti';
import { Job, JobStatus, PipelineStage } from '@/types';

const pipelineStages: PipelineStage[] = [
  { id: 'bookmarked', label: 'Bookmarked', icon: 'bookmark', color: 'bg-gray-400' },
  { id: 'applying', label: 'Applying', icon: 'edit', color: 'bg-blue-400' },
  { id: 'applied', label: 'Applied', icon: 'send', color: 'bg-purple-400' },
  { id: 'interviewing', label: 'Interviewing', icon: 'users', color: 'bg-yellow-400' },
  { id: 'negotiating', label: 'Negotiating', icon: 'handshake', color: 'bg-orange-400' },
  { id: 'accepted', label: 'Accepted', icon: 'check-circle', color: 'bg-green-400' },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [sortBy, setSortBy] = useState<'dateSaved' | 'company' | 'excitement'>('dateSaved');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch jobs
  useEffect(() => {
    if (status === 'authenticated') {
      fetchJobs();
    }
  }, [status]);

  // Filter and sort jobs
  useEffect(() => {
    let result = [...jobs];

    // Filter by status
    if (selectedStatus !== 'all') {
      result = result.filter((job) => job.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'dateSaved':
          comparison = new Date(a.dateSaved).getTime() - new Date(b.dateSaved).getTime();
          break;
        case 'company':
          comparison = a.company.localeCompare(b.company);
          break;
        case 'excitement':
          comparison = a.excitement - b.excitement;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredJobs(result);
  }, [jobs, selectedStatus, searchQuery, sortBy, sortOrder]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs');
      const data = await response.json();
      if (data.jobs) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (jobData: Partial<Job>) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        const data = await response.json();
        setJobs((prev) => [data.job, ...prev]);
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const handleUpdateJob = async (jobId: string, updates: Partial<Job>) => {
    try {
      // Check if status is being changed to 'accepted' for confetti
      const job = jobs.find((j) => j._id === jobId);
      const isAccepting = updates.status === 'accepted' && job?.status !== 'accepted';

      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setJobs((prev) =>
          prev.map((job) => (job._id === jobId ? data.job : job))
        );
        if (selectedJob?._id === jobId) {
          setSelectedJob(data.job);
        }

        // Trigger confetti when job is accepted
        if (isAccepting) {
          triggerPinkConfetti();
        }
      }
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setJobs((prev) => prev.filter((job) => job._id !== jobId));
        if (selectedJob?._id === jobId) {
          setSelectedJob(null);
        }
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: JobStatus) => {
    await handleUpdateJob(jobId, { status: newStatus });
  };

  // Calculate pipeline counts
  const pipelineWithCounts = pipelineStages.map((stage) => ({
    ...stage,
    count: jobs.filter((job) => job.status === stage.id).length,
  }));

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <DashboardHeader
        userName={session?.user?.name || 'User'}
        onAddJob={() => setIsAddModalOpen(true)}
        onExport={() => setIsExportModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Pipeline
            stages={pipelineWithCounts}
            selectedStatus={selectedStatus}
            onStageClick={(status) =>
              setSelectedStatus(status === selectedStatus ? 'all' : status)
            }
          />
        </motion.div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Job Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`flex-1 ${selectedJob ? 'hidden lg:block' : ''}`}
          >
            {filteredJobs.length > 0 ? (
              <JobTable
                jobs={filteredJobs}
                selectedJobId={selectedJob?._id}
                onSelectJob={(job: Job) => setSelectedJob(job)}
                onStatusChange={handleStatusChange}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={(field: 'dateSaved' | 'company' | 'excitement') => {
                  if (sortBy === field) {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy(field);
                    setSortOrder('desc');
                  }
                }}
              />
            ) : (
              <EmptyState
                hasJobs={jobs.length > 0}
                onAddJob={() => setIsAddModalOpen(true)}
              />
            )}
          </motion.div>

          {/* Job Detail Panel */}
          <AnimatePresence>
            {selectedJob && (
              <JobDetailPanel
                job={selectedJob}
                onClose={() => setSelectedJob(null)}
                onUpdate={handleUpdateJob}
                onDelete={handleDeleteJob}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Add Job Modal */}
      <AddJobModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddJob}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        jobs={jobs}
      />
    </div>
  );
}
