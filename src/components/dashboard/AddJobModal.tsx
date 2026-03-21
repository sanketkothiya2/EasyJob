'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
  Upload,
  Image as ImageIcon,
  Trash2,
  Globe,
  Linkedin,
  Check,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Job, JobPlatform } from '@/types';

// Platform options with icons and colors
const platformOptions: { value: JobPlatform; label: string; color: string; bgColor: string }[] = [
  { value: 'linkedin', label: 'LinkedIn', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { value: 'indeed', label: 'Indeed', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { value: 'monster', label: 'Monster', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { value: 'glassdoor', label: 'Glassdoor', color: 'text-green-600', bgColor: 'bg-green-50' },
  { value: 'ziprecruiter', label: 'ZipRecruiter', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { value: 'dice', label: 'Dice', color: 'text-red-600', bgColor: 'bg-red-50' },
  { value: 'angellist', label: 'AngelList', color: 'text-gray-800', bgColor: 'bg-gray-100' },
  { value: 'company_website', label: 'Company Website', color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
  { value: 'referral', label: 'Referral', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  { value: 'other', label: 'Other', color: 'text-gray-600', bgColor: 'bg-gray-50' },
];

// Platform icon component
const PlatformIcon = ({ platform }: { platform: JobPlatform }) => {
  if (platform === 'linkedin') {
    return <Linkedin className="w-4 h-4" />;
  }
  return <Globe className="w-4 h-4" />;
};

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Job>) => void;
  editingJob?: Job | null;
}

export default function AddJobModal({
  isOpen,
  onClose,
  onSubmit,
  editingJob,
}: AddJobModalProps) {
  const isEditing = !!editingJob;
  const [excitement, setExcitement] = useState(editingJob?.excitement || 3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: editingJob?.title || '',
    company: editingJob?.company || '',
    location: editingJob?.location || '',
    url: editingJob?.url || '',
    description: editingJob?.description || '',
    salaryMin: editingJob?.salary?.min ? String(editingJob.salary.min) : '',
    salaryMax: editingJob?.salary?.max ? String(editingJob.salary.max) : '',
    deadline: editingJob?.deadline ? new Date(editingJob.deadline).toISOString().split('T')[0] : '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Resume image state
  const [resumeImage, setResumeImage] = useState<string | null>(editingJob?.resumeImage || null);
  const [resumeImagePublicId, setResumeImagePublicId] = useState<string | null>(editingJob?.resumeImagePublicId || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Platform state
  const [platform, setPlatform] = useState<JobPlatform>(editingJob?.platform || 'linkedin');
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (editingJob) {
      setFormData({
        title: editingJob.title || '',
        company: editingJob.company || '',
        location: editingJob.location || '',
        url: editingJob.url || '',
        description: editingJob.description || '',
        salaryMin: editingJob.salary?.min ? String(editingJob.salary.min) : '',
        salaryMax: editingJob.salary?.max ? String(editingJob.salary.max) : '',
        deadline: editingJob.deadline ? new Date(editingJob.deadline).toISOString().split('T')[0] : '',
      });
      setExcitement(editingJob.excitement || 3);
      setResumeImage(editingJob.resumeImage || null);
      setResumeImagePublicId(editingJob.resumeImagePublicId || null);
      setPlatform(editingJob.platform || 'linkedin');
      setErrors({});
      return;
    }

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
    setResumeImage(null);
    setResumeImagePublicId(null);
    setPlatform('linkedin');
    setErrors({});
  }, [editingJob, isOpen]);

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

  // Image upload handlers
  const uploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      const data = await response.json();
      setResumeImage(data.url);
      setResumeImagePublicId(data.publicId);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      uploadImage(file);
    }
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            uploadImage(file);
          }
          break;
        }
      }
    }
  }, []);

  const removeImage = async () => {
    if (resumeImagePublicId) {
      try {
        await fetch(`/api/upload?publicId=${encodeURIComponent(resumeImagePublicId)}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    setResumeImage(null);
    setResumeImagePublicId(null);
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
      excitement,
      platform,
      resumeImage: resumeImage || undefined,
      resumeImagePublicId: resumeImagePublicId || undefined,
      salary:
        formData.salaryMin || formData.salaryMax
          ? {
              min: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
              max: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
            }
          : undefined,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
    };

    // Only set status for new jobs
    if (!isEditing) {
      jobData.status = 'bookmarked';
    }

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
    setResumeImage(null);
    setResumeImagePublicId(null);
    setPlatform('linkedin');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 flex-shrink-0">
              <h2 className="text-xl font-semibold text-white">{isEditing ? 'Edit Job' : 'Add New Job'}</h2>
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
                      type="text"
                      inputMode="numeric"
                      value={formData.salaryMin}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        handleInputChange('salaryMin', value);
                      }}
                      placeholder="Min"
                      className="flex-1"
                    />
                    <span className="flex items-center text-gray-400">to</span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={formData.salaryMax}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        handleInputChange('salaryMax', value);
                      }}
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

                {/* Platform Dropdown */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Globe className="w-4 h-4 text-pink-500" />
                    Job Platform (optional)
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-lg ${platformOptions.find(p => p.value === platform)?.bgColor}`}>
                          <PlatformIcon platform={platform} />
                        </span>
                        <span className={platformOptions.find(p => p.value === platform)?.color}>
                          {platformOptions.find(p => p.value === platform)?.label}
                        </span>
                      </span>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${showPlatformDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <AnimatePresence>
                      {showPlatformDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                        >
                          <div className="max-h-48 overflow-y-auto py-1">
                            {platformOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setPlatform(option.value);
                                  setShowPlatformDropdown(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors ${
                                  platform === option.value ? 'bg-pink-50' : ''
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className={`p-1.5 rounded-lg ${option.bgColor}`}>
                                    <PlatformIcon platform={option.value} />
                                  </span>
                                  <span className={option.color}>{option.label}</span>
                                </span>
                                {platform === option.value && (
                                  <Check className="w-4 h-4 text-pink-500" />
                                )}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Resume Image Upload */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <ImageIcon className="w-4 h-4 text-pink-500" />
                    Resume Screenshot (optional)
                  </label>
                  
                  {!resumeImage ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onPaste={handlePaste}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-pink-400 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
                          <p className="text-sm text-gray-500">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <Upload className={`w-10 h-10 mx-auto mb-2 ${isDragging ? 'text-pink-500' : 'text-gray-300'}`} />
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="text-pink-500 font-medium">Click to upload</span> or drag & drop
                          </p>
                          <p className="text-xs text-gray-400">
                            You can also paste an image (Ctrl+V)
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG, GIF, WebP up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resumeImage}
                        alt="Resume screenshot"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1"
                          >
                            <Upload className="w-4 h-4" />
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="px-3 py-1.5 bg-red-500 rounded-lg text-sm font-medium text-white hover:bg-red-600 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  )}
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
        </div>
      )}
    </AnimatePresence>
  );
}
