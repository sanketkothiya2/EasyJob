'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Task } from '@/types';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (date: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarView({ tasks, onTaskClick, onAddTask }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { year, month } = useMemo(() => ({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
  }), [currentDate]);

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Add empty slots to complete the grid
    const remainingSlots = 42 - days.length; // 6 rows * 7 days
    for (let i = 0; i < remainingSlots; i++) {
      days.push(null);
    }

    return days;
  }, [year, month]);

  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const statusColors = {
    todo: 'bg-gray-400',
    in_progress: 'bg-blue-500',
    done: 'bg-green-500',
  };

  const priorityBorders = {
    low: 'border-l-green-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-red-500',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Calendar Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              {MONTHS[month]} {year}
            </h2>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
            >
              Today
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={previousMonth}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Calendar Grid */}
        <div className="flex-1 p-4">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={index} className="aspect-square p-1" />;
              }

              const dayTasks = getTasksForDate(date);
              const hasOverdue = dayTasks.some(
                (t) => t.status !== 'done' && new Date(t.dueDate!) < new Date()
              );

              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square p-1 rounded-xl transition-all relative group ${
                    isSelected(date)
                      ? 'bg-pink-500 text-white shadow-lg'
                      : isToday(date)
                      ? 'bg-pink-100 text-pink-600'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    isSelected(date) ? 'text-white' : ''
                  }`}>
                    {date.getDate()}
                  </span>

                  {/* Task Indicators */}
                  {dayTasks.length > 0 && (
                    <div className="flex gap-0.5 justify-center mt-1 flex-wrap">
                      {dayTasks.slice(0, 3).map((task, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected(date) ? 'bg-white/80' : statusColors[task.status]
                          }`}
                        />
                      ))}
                      {dayTasks.length > 3 && (
                        <span className={`text-[10px] ${
                          isSelected(date) ? 'text-white/80' : 'text-gray-400'
                        }`}>
                          +{dayTasks.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Overdue Indicator */}
                  {hasOverdue && !isSelected(date) && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                  )}

                  {/* Add Task Button on Hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddTask(date);
                    }}
                    className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                      isSelected(date) ? 'bg-pink-600/50' : 'bg-gray-100/80'
                    } rounded-xl`}
                  >
                    <Plus className={`w-5 h-5 ${isSelected(date) ? 'text-white' : 'text-gray-600'}`} />
                  </button>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Panel */}
        <AnimatePresence mode="wait">
          {selectedDate && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-gray-100 bg-gray-50 overflow-hidden"
            >
              <div className="p-4 w-[300px]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">{WEEKDAYS[selectedDate.getDay()]}</p>
                    <h3 className="text-lg font-bold text-gray-900">
                      {MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()}
                    </h3>
                  </div>
                  <button
                    onClick={() => onAddTask(selectedDate)}
                    className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Tasks for Selected Day */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {selectedDateTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No tasks for this day</p>
                      <button
                        onClick={() => onAddTask(selectedDate)}
                        className="mt-2 text-pink-500 hover:text-pink-600 text-sm font-medium"
                      >
                        Add a task
                      </button>
                    </div>
                  ) : (
                    selectedDateTasks.map((task) => (
                      <motion.button
                        key={task._id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onTaskClick(task)}
                        className={`w-full text-left p-3 bg-white rounded-xl shadow-sm border-l-4 ${
                          priorityBorders[task.priority]
                        } hover:shadow-md transition-all`}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`p-1 rounded-full ${statusColors[task.status]}`}
                          >
                            {task.status === 'done' ? (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            ) : task.status === 'in_progress' ? (
                              <Clock className="w-3 h-3 text-white" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm truncate ${
                              task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-900'
                            }`}>
                              {task.title}
                            </p>
                            {task.scheduledTime && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {task.scheduledTime.start} - {task.scheduledTime.end}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="text-gray-600">To Do</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-600">Done</span>
          </div>
        </div>
      </div>
    </div>
  );
}
