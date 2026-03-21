'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Circle,
  Clock,
  CheckCircle2,
  Plus,
  GripVertical,
  Calendar,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Task, TaskStatus } from '@/types';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
}

interface Column {
  id: TaskStatus;
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

const columns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    icon: Circle,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 'done',
    title: 'Done',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
];

const priorityColors = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const categoryColors = {
  daily: 'bg-purple-100 text-purple-700',
  weekly: 'bg-blue-100 text-blue-700',
  monthly: 'bg-pink-100 text-pink-700',
};

export default function KanbanBoard({
  tasks,
  onTaskClick,
  onAddTask,
  onStatusChange,
  onDeleteTask,
}: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const dragTaskRef = useRef<Task | null>(null);

  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks.filter((task) => task.status === status).sort((a, b) => a.order - b.order);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    dragTaskRef.current = task;
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    
    // Set drag image to the element itself
    const element = e.currentTarget as HTMLElement;
    e.dataTransfer.setDragImage(element, 20, 20);
    
    // Add a delay to show the dragging state
    setTimeout(() => {
      element.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.style.opacity = '1';
    setDraggedTask(null);
    setDragOverColumn(null);
    dragTaskRef.current = null;
    
    // Re-enable text selection
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    if (dragTaskRef.current && dragTaskRef.current.status !== newStatus) {
      onStatusChange(dragTaskRef.current._id, newStatus);
    }
    setDragOverColumn(null);
    setDraggedTask(null);
    dragTaskRef.current = null;
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return null;
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (task: Task): boolean => {
    if (!task.dueDate || task.status === 'done') return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div className={`flex gap-6 overflow-x-auto pb-4 ${draggedTask ? 'select-none' : ''}`}>
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        const isDropTarget = dragOverColumn === column.id && draggedTask?.status !== column.id;

        return (
          <div
            key={column.id}
            className="flex-1 min-w-[320px]"
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className={`flex items-center gap-3 px-4 py-3 ${column.bgColor} rounded-t-xl border ${column.borderColor} border-b-0`}>
              <column.icon className={`w-5 h-5 ${column.color}`} />
              <h3 className={`font-semibold ${column.color}`}>{column.title}</h3>
              <span className={`ml-auto px-2.5 py-0.5 text-sm font-medium rounded-full ${column.bgColor} ${column.color}`}>
                {columnTasks.length}
              </span>
            </div>

            {/* Column Body */}
            <div
              className={`p-3 bg-white rounded-b-xl border ${column.borderColor} border-t-0 min-h-[400px] transition-all ${
                isDropTarget ? 'ring-2 ring-pink-400 ring-inset bg-pink-50/50' : ''
              }`}
            >
              {/* Add Task Button */}
              <button
                onClick={() => onAddTask(column.id)}
                className={`w-full flex items-center justify-center gap-2 py-3 mb-3 border-2 border-dashed ${column.borderColor} rounded-xl text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors`}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Task</span>
              </button>

              {/* Tasks */}
              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, task)}
                    onDragEnd={(e) => handleDragEnd(e as unknown as React.DragEvent)}
                    className={`relative group bg-white border border-gray-200 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow select-none ${
                      draggedTask?._id === task._id ? 'opacity-50' : ''
                    } ${isOverdue(task) ? 'border-l-4 border-l-red-500' : ''}`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onTaskClick(task)}
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(task._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h4
                      onClick={() => onTaskClick(task)}
                      className={`font-medium text-gray-900 mb-2 cursor-pointer hover:text-pink-600 ${
                        task.status === 'done' ? 'line-through text-gray-400' : ''
                      }`}
                    >
                      {task.title}
                    </h4>

                    {/* Description */}
                    {task.description && (
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColors[task.category]}`}>
                        {task.category}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>

                    {/* Subtasks Progress */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Subtasks</span>
                          <span>
                            {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-pink-500 h-1.5 rounded-full transition-all"
                            style={{
                              width: `${(task.subtasks.filter((s) => s.completed).length / task.subtasks.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      {task.dueDate ? (
                        <span className={`flex items-center gap-1 text-xs ${
                          isOverdue(task) ? 'text-red-500 font-medium' : 'text-gray-500'
                        }`}>
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(task.dueDate)}
                        </span>
                      ) : (
                        <span />
                      )}

                      {task.scheduledTime && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          {task.scheduledTime.start}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {task.tags.length > 3 && (
                          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{task.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Color indicator bar */}
                    {task.color && (
                      <div
                        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                        style={{ backgroundColor: task.color }}
                      />
                    )}
                  </motion.div>
                ))}

                {/* Empty State */}
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <column.icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
