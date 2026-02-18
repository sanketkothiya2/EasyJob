'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Briefcase,
  Building2,
  MapPin,
  Link as LinkIcon,
  DollarSign,
  Star,
  FileText,
  Calendar,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Job, JobStatus } from '@/types';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Job>) => void;
}

export default function AddJobModal({
  isOpen,
  onClose,
  onSubmit,
}: AddJobModalProps) {
  const [excitement, setExcitement] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    url: '',
    description: '',
    salaryMin: '',
    salaryMax: '',
    deadline: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.url && !formData.url.match(/^https?:\/\/.+/)) {
      newErrors.url = 'Invalid URL format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const jobData: Partial<Job> = {
      title: formData.title,
      company: formData.company,
      location: formData.location,
      url: formData.url || undefined,
      description: formData.description || undefined,
      status: 'bookmarked',
      excitement,
      salary:
        formData.salaryMin || formData.salaryMax
          ? {
              min: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
              max: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
            }
          : undefined,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
    };

    await onSubmit(jobData);
    setIsSubmitting(false);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      url: '',
      description: '',
      salaryMin: '',
      salaryMax: '',
      deadline: '',
    });
    setExcitement(3);
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 flex-shrink-0">
              <h2 className="text-xl font-semibold text-white">Add New Job</h2>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleFormSubmit}
              className="p-6 overflow-y-auto flex-1"
            >
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Briefcase className="w-4 h-4 text-pink-500" />
                    Job Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    error={errors.title}
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Building2 className="w-4 h-4 text-pink-500" />
                    Company *
                  </label>
                  <Input
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="e.g. Google"
                    error={errors.company}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 text-pink-500" />
                    Location *
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g. San Francisco, CA or Remote"
                    error={errors.location}
                  />
                </div>

                {/* URL */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <LinkIcon className="w-4 h-4 text-pink-500" />
                    Job URL
                  </label>
                  <Input
                    value={formData.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    placeholder="https://..."
                    error={errors.url}
                  />
                </div>

                {/* Salary Range */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <DollarSign className="w-4 h-4 text-pink-500" />
                    Salary Range (optional)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                      placeholder="Min"
                      className="flex-1"
                    />
                    <span className="flex items-center text-gray-400">to</span>
                    <Input
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                      placeholder="Max"
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 text-pink-500" />
                    Application Deadline
                  </label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                  />
                </div>

                {/* Excitement Level */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Star className="w-4 h-4 text-pink-500" />
                    Excitement Level
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setExcitement(level)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            level <= excitement
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FileText className="w-4 h-4 text-pink-500" />
                    Description / Notes
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Add any notes about this job..."
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Job'}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
