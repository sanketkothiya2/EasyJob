'use client';

import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  children: (activeTab: string) => ReactNode;
  className?: string;
}

export default function Tabs({
  tabs,
  defaultTab,
  onChange,
  children,
  className,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4 -mb-px overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="pt-4"
      >
        {children(activeTab)}
      </motion.div>
    </div>
  );
}

// Simple tab panel component
interface TabPanelProps {
  children: ReactNode;
  className?: string;
}

export function TabPanel({ children, className }: TabPanelProps) {
  return <div className={cn('', className)}>{children}</div>;
}
