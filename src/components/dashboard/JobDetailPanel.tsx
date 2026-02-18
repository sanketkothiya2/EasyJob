'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  MapPin,
  ExternalLink,
  Star,
  Calendar,
  DollarSign,
  Briefcase,
  Building2,
  Trash2,
  Edit2,
  FileText,
  Users,
  CheckSquare,
  Clock,
  Link as LinkIcon,
} from 'lucide-react';
import { Job, JobStatus, Note, Contact } from '@/types';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import StatusDropdown from '@/components/ui/StatusDropdown';
import { formatDate } from '@/lib/utils';

interface JobDetailPanelProps {
  job: Job;
  onClose: () => void;
  onUpdate: (jobId: string, updates: Partial<Job>) => void;
  onDelete: (jobId: string) => void;
}

export default function JobDetailPanel({
  job,
  onClose,
  onUpdate,
  onDelete,
}: JobDetailPanelProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [notes, setNotes] = useState<Note[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Fetch notes and contacts when job changes
    fetchNotes();
    fetchContacts();
  }, [job._id]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/jobs/${job._id}/notes`);
      const data = await response.json();
      if (data.notes) {
        setNotes(data.notes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch(`/api/jobs/${job._id}/contacts`);
      const data = await response.json();
      if (data.contacts) {
        setContacts(data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(job._id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  const tabs = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'notes', label: 'Notes', icon: FileText, count: notes.length },
    { id: 'contacts', label: 'Contacts', icon: Users, count: contacts.length },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="w-full lg:w-[450px] bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden flex-shrink-0"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <StatusDropdown
            value={job.status}
            onChange={(status) => onUpdate(job._id, { status })}
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-1">{job.title}</h2>
        <p className="text-white/90 flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          {job.company}
        </p>
        <p className="text-white/80 flex items-center gap-2 mt-1 text-sm">
          <MapPin className="w-4 h-4" />
          {job.location}
        </p>

        {/* Excitement Rating */}
        <div className="flex items-center gap-1 mt-3">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => onUpdate(job._id, { excitement: level })}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-5 h-5 ${
                  level <= job.excitement
                    ? 'text-yellow-300 fill-yellow-300'
                    : 'text-white/30'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-100">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center justify-center gap-1">
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="text-xs bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 h-[400px] overflow-y-auto">
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  Date Saved
                </div>
                <p className="font-medium text-gray-900">
                  {formatDate(job.dateSaved)}
                </p>
              </div>
              {job.salary && (job.salary.min || job.salary.max) && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <DollarSign className="w-4 h-4" />
                    Salary
                  </div>
                  <p className="font-medium text-gray-900">
                    {job.salary.min && `$${job.salary.min.toLocaleString()}`}
                    {job.salary.min && job.salary.max && ' - '}
                    {job.salary.max && `$${job.salary.max.toLocaleString()}`}
                  </p>
                </div>
              )}
              {job.dateApplied && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    Applied On
                  </div>
                  <p className="font-medium text-gray-900">
                    {formatDate(job.dateApplied)}
                  </p>
                </div>
              )}
              {job.deadline && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    Deadline
                  </div>
                  <p className="font-medium text-gray-900">
                    {formatDate(job.deadline)}
                  </p>
                </div>
              )}
            </div>

            {/* Job URL */}
            {job.url && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Job Listing
                </h4>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
                >
                  <span className="truncate">{job.url}</span>
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                </a>
              </div>
            )}

            {/* Description */}
            {job.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description
                </h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Archive
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            {notes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No notes yet</p>
                <p className="text-sm">Add notes to keep track of important info</p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-gray-50 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{note.title}</h4>
                    <Badge variant="secondary" size="sm">
                      {note.type}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{note.content}</p>
                  <p className="text-xs text-gray-400">
                    {formatDate(note.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No contacts yet</p>
                <p className="text-sm">
                  Add recruiters or interviewers you've connected with
                </p>
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact._id}
                  className="bg-gray-50 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-medium">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{contact.name}</h4>
                      {contact.role && (
                        <p className="text-sm text-gray-500">{contact.role}</p>
                      )}
                    </div>
                  </div>
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-pink-600 hover:underline"
                    >
                      {contact.email}
                    </a>
                  )}
                  {contact.linkedin && (
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-pink-600 hover:underline block"
                    >
                      LinkedIn Profile
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <CheckSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Checklist coming soon</p>
              <p className="text-sm">
                Track your progress through the application process
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Archive this job?
            </h3>
            <p className="text-gray-500 mb-6">
              This job will be moved to your archive. You can restore it later.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                {isDeleting ? 'Archiving...' : 'Archive'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
