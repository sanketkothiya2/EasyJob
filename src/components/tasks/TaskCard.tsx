'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Flag,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  PlayCircle,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { formatDate } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onToggleStatus?: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onSubtaskToggle?: (taskId: string, subtaskId: string) => void;
  onToggleSubtask?: (subtaskId: string) => void;
  compact?: boolean;
}

const statusConfig: Record<TaskStatus, { label: string; icon: typeof Circle; color: string; bg: string }> = {
  todo: { label: 'To Do', icon: Circle, color: 'text-gray-500', bg: 'bg-gray-100' },
  in_progress: { label: 'In Progress', icon: PlayCircle, color: 'text-blue-500', bg: 'bg-blue-100' },
  done: { label: 'Done', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100' },
};

const priorityConfig: Record<TaskPriority, { label: string; color: string; bg: string; border: string }> = {
  low: { label: 'Low', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  medium: { label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  high: { label: 'High', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
};

const categoryColors = {
  daily: { text: 'text-purple-600', bg: 'bg-purple-100' },
  weekly: { text: 'text-blue-600', bg: 'bg-blue-100' },
  monthly: { text: 'text-pink-600', bg: 'bg-pink-100' },
};

export default function TaskCard({
  task,
  onStatusChange,
  onToggleStatus,
  onEdit,
  onDelete,
  onSubtaskToggle,
  onToggleSubtask,
  compact = false,
}: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);

  const StatusIcon = statusConfig[task.status].icon;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  const handleStatusClick = () => {
    if (onToggleStatus) {
      onToggleStatus();
      return;
    }
    if (onStatusChange) {
      const nextStatus: Record<TaskStatus, TaskStatus> = {
        todo: 'in_progress',
        in_progress: 'done',
        done: 'todo',
      };
      onStatusChange(task._id, nextStatus[task.status]);
    }
  };

  const handleSubtaskToggle = (subtaskId: string) => {
    if (onToggleSubtask) {
      onToggleSubtask(subtaskId);
    } else if (onSubtaskToggle) {
      onSubtaskToggle(task._id, subtaskId);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task._id);
    }
  };

  if (compact) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`group bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer ${
          isOverdue ? 'border-l-4 border-l-red-400' : ''
        }`}
        style={{ borderLeftColor: isOverdue ? undefined : task.color }}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); handleStatusClick(); }}
            className={`flex-shrink-0 transition-colors ${statusConfig[task.status].color} hover:scale-110`}
          >
            <StatusIcon className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className={`font-medium text-gray-900 truncate ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              {task.dueDate && (
                <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
                  <Calendar className="w-3 h-3" />
                  {formatDate(new Date(task.dueDate))}
                </span>
              )}
              {task.scheduledTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {task.scheduledTime.start}
                </span>
              )}
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig[task.priority].bg} ${priorityConfig[task.priority].color}`}>
            {task.priority}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`group bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden hover:shadow-lg transition-all ${
        isOverdue ? 'ring-2 ring-red-200' : ''
      }`}
    >
      {/* Color Bar */}
      <div
        className="h-1"
        style={{ backgroundColor: task.color || '#ec4899' }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={handleStatusClick}
              className={`flex-shrink-0 mt-0.5 transition-all hover:scale-110 ${statusConfig[task.status].color}`}
            >
              <StatusIcon className="w-6 h-6" />
            </button>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-gray-900 ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20"
                >
                  <button
                    onClick={() => { handleEdit(); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => { handleDelete(); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {/* Category Badge */}
          <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${categoryColors[task.category].bg} ${categoryColors[task.category].text}`}>
            {task.category}
          </span>

          {/* Priority Badge */}
          <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${priorityConfig[task.priority].bg} ${priorityConfig[task.priority].color}`}>
            <Flag className="w-3 h-3" />
            {priorityConfig[task.priority].label}
          </span>

          {/* Status Badge */}
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusConfig[task.status].bg} ${statusConfig[task.status].color}`}>
            {statusConfig[task.status].label}
          </span>

          {/* Overdue Badge */}
          {isOverdue && (
            <span className="px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Overdue
            </span>
          )}
        </div>

        {/* Date & Time */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
          {task.dueDate && (
            <span className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
              <Calendar className="w-4 h-4" />
              {formatDate(new Date(task.dueDate))}
            </span>
          )}
          {task.scheduledTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {task.scheduledTime.start} - {task.scheduledTime.end}
            </span>
          )}
          {task.linkedJob && (
            <span className="flex items-center gap-1.5 text-pink-500">
              <Briefcase className="w-4 h-4" />
              {task.linkedJob.company}
            </span>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            <Tag className="w-3.5 h-3.5 text-gray-400" />
            {task.tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Subtasks */}
        {totalSubtasks > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-900"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Subtasks ({completedSubtasks}/{totalSubtasks})
              </span>
              {showSubtasks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Progress Bar */}
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all"
                style={{ width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%` }}
              />
            </div>

            {showSubtasks && (
              <div className="mt-2 space-y-1">
                {task.subtasks.map((subtask) => (
                  <button
                    key={subtask.id}
                    onClick={() => handleSubtaskToggle(subtask.id)}
                    className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    {subtask.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {subtask.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
