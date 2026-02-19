'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  ExternalLink,
  Star,
  Calendar,
  DollarSign,
  Building2,
  Trash2,
  FileText,
  Users,
  CheckSquare,
  Clock,
  Plus,
  Send,
  Mail,
  Linkedin,
  Check,
  MessageSquare,
  UserPlus,
  Globe,
  Image as ImageIcon,
  Link as LinkIcon,
} from 'lucide-react';
import { Job, Note, Contact } from '@/types';

// Platform display info
const platformInfo: Record<string, { label: string; color: string; bgColor: string }> = {
  linkedin: { label: 'LinkedIn', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  indeed: { label: 'Indeed', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  monster: { label: 'Monster', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  glassdoor: { label: 'Glassdoor', color: 'text-green-600', bgColor: 'bg-green-50' },
  ziprecruiter: { label: 'ZipRecruiter', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  dice: { label: 'Dice', color: 'text-red-600', bgColor: 'bg-red-50' },
  angellist: { label: 'AngelList', color: 'text-gray-800', bgColor: 'bg-gray-100' },
  company_website: { label: 'Company Website', color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
  referral: { label: 'Referral', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  other: { label: 'Other', color: 'text-gray-600', bgColor: 'bg-gray-50' },
};
import Button from '@/components/ui/Button';
import StatusDropdown from '@/components/ui/StatusDropdown';
import { formatDate } from '@/lib/utils';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  completedAt?: string;
}

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
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Notes form state
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<'general' | 'interview' | 'research' | 'follow_up'>('general');
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  // Contacts form state
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactLinkedin, setContactLinkedin] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);
  
  // Checklist state
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [isAddingChecklistItem, setIsAddingChecklistItem] = useState(false);

  useEffect(() => {
    // Fetch notes, contacts, and checklist when job changes
    fetchNotes();
    fetchContacts();
    fetchChecklist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const fetchChecklist = async () => {
    try {
      const response = await fetch(`/api/jobs/${job._id}/checklist`);
      const data = await response.json();
      if (data.checklist?.items) {
        setChecklist(data.checklist.items);
      }
    } catch (error) {
      console.error('Error fetching checklist:', error);
    }
  };

  const handleAddNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;
    
    setIsAddingNote(true);
    try {
      const response = await fetch(`/api/jobs/${job._id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noteTitle,
          content: noteContent,
          type: noteType,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotes([data.note, ...notes]);
        setNoteTitle('');
        setNoteContent('');
        setNoteType('general');
        setShowNoteForm(false);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/jobs/${job._id}/notes?noteId=${noteId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setNotes(notes.filter(n => n._id !== noteId));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleAddContact = async () => {
    if (!contactName.trim()) return;
    
    setIsAddingContact(true);
    try {
      const response = await fetch(`/api/jobs/${job._id}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          role: contactRole,
          email: contactEmail,
          linkedin: contactLinkedin,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setContacts([data.contact, ...contacts]);
        setContactName('');
        setContactRole('');
        setContactEmail('');
        setContactLinkedin('');
        setShowContactForm(false);
      }
    } catch (error) {
      console.error('Error adding contact:', error);
    } finally {
      setIsAddingContact(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      const response = await fetch(`/api/jobs/${job._id}/contacts?contactId=${contactId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setContacts(contacts.filter(c => c._id !== contactId));
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleToggleChecklistItem = async (itemId: string, completed: boolean) => {
    // Optimistic update
    setChecklist(checklist.map(item => 
      item.id === itemId 
        ? { ...item, completed, completedAt: completed ? new Date().toISOString() : undefined }
        : item
    ));
    
    try {
      await fetch(`/api/jobs/${job._id}/checklist`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, completed }),
      });
    } catch (error) {
      console.error('Error toggling checklist item:', error);
      // Revert on error
      fetchChecklist();
    }
  };

  const handleAddChecklistItem = async () => {
    if (!newChecklistItem.trim()) return;
    
    setIsAddingChecklistItem(true);
    try {
      const response = await fetch(`/api/jobs/${job._id}/checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newChecklistItem }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setChecklist(data.checklist.items);
        setNewChecklistItem('');
      }
    } catch (error) {
      console.error('Error adding checklist item:', error);
    } finally {
      setIsAddingChecklistItem(false);
    }
  };

  const handleDeleteChecklistItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/jobs/${job._id}/checklist?itemId=${itemId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setChecklist(checklist.filter(item => item.id !== itemId));
      }
    } catch (error) {
      console.error('Error deleting checklist item:', error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(job._id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;

  const tabs = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'notes', label: 'Notes', icon: FileText, count: notes.length },
    { id: 'contacts', label: 'Contacts', icon: Users, count: contacts.length },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare, count: totalCount > 0 ? `${completedCount}/${totalCount}` : undefined },
  ];

  const noteTypeColors = {
    general: 'bg-gray-100 text-gray-700',
    interview: 'bg-purple-100 text-purple-700',
    research: 'bg-blue-100 text-blue-700',
    follow_up: 'bg-amber-100 text-amber-700',
  };

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

            {/* Platform */}
            {job.platform && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Source Platform
                </h4>
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${platformInfo[job.platform]?.bgColor || 'bg-gray-50'}`}>
                  {job.platform === 'linkedin' ? (
                    <Linkedin className={`w-4 h-4 ${platformInfo[job.platform]?.color}`} />
                  ) : (
                    <Globe className={`w-4 h-4 ${platformInfo[job.platform]?.color}`} />
                  )}
                  <span className={`font-medium ${platformInfo[job.platform]?.color}`}>
                    {platformInfo[job.platform]?.label || job.platform}
                  </span>
                </span>
              </div>
            )}

            {/* Resume Screenshot */}
            {job.resumeImage && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Resume Screenshot
                </h4>
                <a
                  href={job.resumeImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl overflow-hidden border border-gray-200 hover:border-pink-300 transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={job.resumeImage}
                    alt="Resume screenshot"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </a>
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
            {/* Add Note Button/Form */}
            <AnimatePresence mode="wait">
              {!showNoteForm ? (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowNoteForm(true)}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50/50 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Add a note
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 space-y-3 border border-pink-100"
                >
                  <input
                    type="text"
                    placeholder="Note title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white"
                  />
                  <textarea
                    placeholder="Write your note..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all resize-none bg-white"
                  />
                  <div className="flex items-center gap-2">
                    <select
                      value={noteType}
                      onChange={(e) => setNoteType(e.target.value as typeof noteType)}
                      className="flex-1 px-3 py-2 rounded-lg border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white text-sm"
                    >
                      <option value="general">General</option>
                      <option value="interview">Interview</option>
                      <option value="research">Research</option>
                      <option value="follow_up">Follow Up</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowNoteForm(false);
                        setNoteTitle('');
                        setNoteContent('');
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNote}
                      disabled={!noteTitle.trim() || !noteContent.trim() || isAddingNote}
                      className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {isAddingNote ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notes List */}
            {notes.length === 0 && !showNoteForm ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No notes yet</p>
                <p className="text-sm">Add notes to keep track of important info</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <motion.div
                    key={note._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-white rounded-xl p-4 space-y-2 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-gray-900 flex-1">{note.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${noteTypeColors[note.type] || noteTypeColors.general}`}>
                          {note.type.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => handleDeleteNote(note._id)}
                          className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{note.content}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(note.createdAt)}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {/* Add Contact Button/Form */}
            <AnimatePresence mode="wait">
              {!showContactForm ? (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowContactForm(true)}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50/50 transition-all"
                >
                  <UserPlus className="w-5 h-5" />
                  Add a contact
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 space-y-3 border border-pink-100"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Name *"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="col-span-2 px-3 py-2 rounded-lg border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Role / Title"
                      value={contactRole}
                      onChange={(e) => setContactRole(e.target.value)}
                      className="col-span-2 px-3 py-2 rounded-lg border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white text-sm"
                    />
                    <input
                      type="text"
                      placeholder="LinkedIn URL"
                      value={contactLinkedin}
                      onChange={(e) => setContactLinkedin(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowContactForm(false);
                        setContactName('');
                        setContactRole('');
                        setContactEmail('');
                        setContactLinkedin('');
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddContact}
                      disabled={!contactName.trim() || isAddingContact}
                      className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {isAddingContact ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Add
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contacts List */}
            {contacts.length === 0 && !showContactForm ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No contacts yet</p>
                <p className="text-sm">
                  Add recruiters or interviewers you&apos;ve connected with
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <motion.div
                    key={contact._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                            {contact.role && (
                              <p className="text-sm text-gray-500">{contact.role}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteContact(contact._id)}
                            className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {contact.email && (
                            <a
                              href={`mailto:${contact.email}`}
                              className="inline-flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700 bg-pink-50 px-2 py-1 rounded-lg transition-colors"
                            >
                              <Mail className="w-3 h-3" />
                              {contact.email}
                            </a>
                          )}
                          {contact.linkedin && (
                            <a
                              href={contact.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                            >
                              <Linkedin className="w-3 h-3" />
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-4">
            {/* Progress Bar */}
            {totalCount > 0 && (
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-semibold text-pink-600">
                    {completedCount} of {totalCount} completed
                  </span>
                </div>
                <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                  />
                </div>
                {completedCount === totalCount && totalCount > 0 && (
                  <p className="text-center text-sm text-pink-600 font-medium mt-2 flex items-center justify-center gap-1">
                    <Check className="w-4 h-4" />
                    All tasks completed!
                  </p>
                )}
              </div>
            )}

            {/* Add New Item */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a new task..."
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
              />
              <button
                onClick={handleAddChecklistItem}
                disabled={!newChecklistItem.trim() || isAddingChecklistItem}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isAddingChecklistItem ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Checklist Items */}
            {checklist.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No tasks yet</p>
                <p className="text-sm">Add tasks to track your application progress</p>
              </div>
            ) : (
              <div className="space-y-2">
                {checklist.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      item.completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-100 hover:border-pink-200 hover:shadow-sm'
                    }`}
                  >
                    <button
                      onClick={() => handleToggleChecklistItem(item.id, !item.completed)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        item.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-pink-400'
                      }`}
                    >
                      {item.completed && <Check className="w-4 h-4" />}
                    </button>
                    <span
                      className={`flex-1 transition-all ${
                        item.completed ? 'text-gray-500 line-through' : 'text-gray-700'
                      }`}
                    >
                      {item.label}
                    </span>
                    <button
                      onClick={() => handleDeleteChecklistItem(item.id)}
                      className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
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
