'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  FileEdit,
  Send,
  MessageSquare,
  HandshakeIcon,
  Trophy,
  LogOut,
  XCircle,
  Clock,
  ChevronDown,
  Check,
} from 'lucide-react';
import { JobStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusOption {
  value: JobStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const statusOptions: StatusOption[] = [
  {
    value: 'bookmarked',
    label: 'Bookmarked',
    icon: <Bookmark className="w-4 h-4" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 hover:bg-gray-100',
    borderColor: 'border-gray-200',
  },
  {
    value: 'applying',
    label: 'Applying',
    icon: <FileEdit className="w-4 h-4" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    borderColor: 'border-blue-200',
  },
  {
    value: 'applied',
    label: 'Applied',
    icon: <Send className="w-4 h-4" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
    borderColor: 'border-purple-200',
  },
  {
    value: 'interviewing',
    label: 'Interviewing',
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
    borderColor: 'border-orange-200',
  },
  {
    value: 'negotiating',
    label: 'Negotiating',
    icon: <HandshakeIcon className="w-4 h-4" />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100',
    borderColor: 'border-yellow-200',
  },
  {
    value: 'accepted',
    label: 'Accepted',
    icon: <Trophy className="w-4 h-4" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100',
    borderColor: 'border-green-200',
  },
  {
    value: 'withdrawn',
    label: 'Withdrawn',
    icon: <LogOut className="w-4 h-4" />,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50 hover:bg-gray-100',
    borderColor: 'border-gray-200',
  },
  {
    value: 'rejected',
    label: 'Rejected',
    icon: <XCircle className="w-4 h-4" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100',
    borderColor: 'border-red-200',
  },
  {
    value: 'no_response',
    label: 'No Response',
    icon: <Clock className="w-4 h-4" />,
    color: 'text-slate-500',
    bgColor: 'bg-slate-50 hover:bg-slate-100',
    borderColor: 'border-slate-200',
  },
];

interface StatusDropdownProps {
  value: JobStatus;
  onChange: (status: JobStatus) => void;
  className?: string;
}

export default function StatusDropdown({
  value,
  onChange,
  className,
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentStatus = statusOptions.find((opt) => opt.value === value) || statusOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, [isOpen]);

  const handleSelect = (status: JobStatus) => {
    onChange(status);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)}>
      {/* Trigger Button */}
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-200',
          currentStatus.bgColor,
          currentStatus.color,
          currentStatus.borderColor,
          isOpen && 'ring-2 ring-pink-300 ring-offset-1'
        )}
      >
        {currentStatus.icon}
        <span>{currentStatus.label}</span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </motion.button>

      {/* Dropdown Menu - Rendered via Portal */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'fixed',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
              }}
              className="w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-[9999]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-1 max-h-[300px] overflow-y-auto">
                {statusOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150',
                      option.value === value
                        ? cn(option.bgColor, option.color)
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <span className={cn(option.color)}>{option.icon}</span>
                    <span className="flex-1 text-sm font-medium">{option.label}</span>
                    {option.value === value && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-pink-500"
                      >
                        <Check className="w-4 h-4" />
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
