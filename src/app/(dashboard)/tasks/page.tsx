'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Calendar,
  LayoutGrid,
  ListTodo,
  Target,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Zap,
  RefreshCw,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import TaskCard from '@/components/tasks/TaskCard';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import CalendarView from '@/components/tasks/CalendarView';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Task, TaskCategory, TaskPriority, TaskStatus, Job } from '@/types';

type ViewMode = 'dashboard' | 'calendar' | 'kanban';
type FilterCategory = TaskCategory | 'all';
type FilterStatus = TaskStatus | 'all';
type FilterPriority = TaskPriority | 'all';

interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  overdue: number;
  today: number;
}

export default function TasksPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    overdue: 0,
    today: 0,
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskDefaults, setNewTaskDefaults] = useState<Partial<Task>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const TASKS_PER_PAGE = 10;

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterPriority !== 'all') params.append('priority', filterPriority);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/tasks?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filterCategory, filterStatus, filterPriority, searchQuery]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchJobs();
  }, [fetchTasks]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, filterStatus, filterPriority, viewMode]);

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      const url = editingTask ? `/api/tasks/${editingTask._id}` : '/api/tasks';
      const method = editingTask ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        fetchTasks();
        setEditingTask(null);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const statusOrder: TaskStatus[] = ['todo', 'in_progress', 'done'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleToggleSubtask = async (task: Task, subtaskId: string) => {
    const updatedSubtasks = task.subtasks?.map((subtask) =>
      subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
    );

    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtasks: updatedSubtasks }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating subtask:', error);
    }
  };

  // Handler for adding task from Calendar with pre-filled date
  const handleAddTaskFromCalendar = (date: Date) => {
    setEditingTask(null);
    setNewTaskDefaults({ dueDate: date });
    setIsModalOpen(true);
  };

  // Handler for adding task from Kanban with pre-filled status
  const handleAddTaskFromKanban = (status: TaskStatus) => {
    setEditingTask(null);
    setNewTaskDefaults({ status });
    setIsModalOpen(true);
  };

  // Handler for changing task status (used by Kanban drag-drop)
  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const totalTaskPages = Math.max(1, Math.ceil(tasks.length / TASKS_PER_PAGE));
  const paginatedTasks = tasks.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  );

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: ListTodo,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Due Today',
      value: stats.today,
      icon: Target,
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-orange-50',
    },
  ];

  const viewTabs = [
    { value: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { value: 'calendar', label: 'Calendar', icon: Calendar },
    { value: 'kanban', label: 'Kanban', icon: ListTodo },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <DashboardHeader userName={session?.user?.name || 'User'} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-pink-500" />
              Task Manager
            </h1>
            <p className="text-gray-500 mt-1">
              Organize your day and boost productivity
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Tabs */}
            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
              {viewTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setViewMode(tab.value as ViewMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === tab.value
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <Button
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-2xl p-5 border border-white/50`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Productivity Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Productivity Score</h3>
                <p className="text-sm text-gray-500">Your task completion rate</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-3xl font-bold text-gray-900">{completionRate}%</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full"
            />
          </div>
        </motion.div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                showFilters
                  ? 'bg-pink-50 border-pink-200 text-pink-600'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => fetchTasks()}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Category Filters */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500 mr-2">Quick Filter:</span>
            {(['all', 'daily', 'weekly', 'monthly'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterCategory === category
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-3 gap-4 pt-4 mt-4 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="all">All Statuses</option>
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value as FilterPriority)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dashboard View */}
        {viewMode === 'dashboard' && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-6">
              {/* Overdue Tasks */}
              {stats.overdue > 0 && (
                <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                  <h3 className="font-semibold text-red-700 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Overdue Tasks
                  </h3>
                  <p className="text-3xl font-bold text-red-600 mt-2">{stats.overdue}</p>
                  <p className="text-sm text-red-500 mt-1">Tasks past their due date</p>
                </div>
              )}

              {stats.overdue === 0 && (
                <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                  <h3 className="font-semibold text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Overdue Tasks
                  </h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">0</p>
                  <p className="text-sm text-green-500 mt-1">You are all caught up</p>
                </div>
              )}
            </div>

            {/* Categories Breakdown */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Tasks by Category</h3>
              <div className="space-y-3">
                {(['daily', 'weekly', 'monthly'] as TaskCategory[]).map((cat) => {
                  const count = tasks.filter((t) => t.category === cat).length;
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  const colors = {
                    daily: 'bg-purple-500',
                    weekly: 'bg-blue-500',
                    monthly: 'bg-pink-500',
                  };
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600 capitalize">{cat}</span>
                        <span className="font-medium text-gray-900">{count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`${colors[cat]} h-2 rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* All Tasks List */}
        {viewMode === 'dashboard' && (
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-purple-500" />
                  All Tasks
                  <span className="ml-auto text-sm font-normal text-gray-500">
                    {tasks.length} tasks
                  </span>
                </h2>
              </div>
              <div className="p-5 space-y-4 max-h-[760px] overflow-y-auto custom-scrollbar">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-pink-500" />
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ListTodo className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No tasks found</p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4 text-pink-500 hover:text-pink-600 font-medium"
                    >
                      Create your first task
                    </button>
                  </div>
                ) : (
                  paginatedTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onToggleStatus={() => handleToggleStatus(task)}
                      onEdit={() => handleEditTask(task)}
                      onDelete={() => handleDeleteTask(task._id)}
                      onToggleSubtask={(subtaskId) => handleToggleSubtask(task, subtaskId)}
                    />
                  ))
                )}
              </div>

              {!isLoading && tasks.length > 0 && totalTaskPages > 1 && (
                <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * TASKS_PER_PAGE + 1}-
                    {Math.min(currentPage * TASKS_PER_PAGE, tasks.length)} of {tasks.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Prev
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalTaskPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalTaskPages))}
                      disabled={currentPage === totalTaskPages}
                      className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <CalendarView
            tasks={tasks}
            onTaskClick={handleEditTask}
            onAddTask={handleAddTaskFromCalendar}
          />
        )}

        {/* Kanban View */}
        {viewMode === 'kanban' && (
          <KanbanBoard
            tasks={tasks}
            onTaskClick={handleEditTask}
            onAddTask={handleAddTaskFromKanban}
            onStatusChange={handleStatusChange}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </main>

      {/* Add/Edit Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
          setNewTaskDefaults({});
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
        jobs={jobs}
        defaultValues={newTaskDefaults}
      />
    </div>
  );
}
