'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import {
  Search,
  Plus,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Download,
  BookOpen,
  Briefcase,
  ListTodo,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface DashboardHeaderProps {
  userName?: string;
  onAddJob?: () => void;
  onExport?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
  showAddJob?: boolean;
  showExport?: boolean;
}

export default function DashboardHeader({
  userName = 'User',
  onAddJob,
  onExport,
  searchQuery = '',
  onSearchChange,
}: DashboardHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const navTabs = [
    { href: '/dashboard', label: 'Jobs', icon: Briefcase },
    { href: '/tasks', label: 'Tasks', icon: ListTodo },
    { href: '/resources', label: 'Resources', icon: BookOpen },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/images/logo/logo.png"
              alt="EasyJob"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="font-bold text-xl bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
              EasyJob
            </span>
          </Link>

          {/* Search Bar */}
          {onSearchChange && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <nav className="dashboard-nav hidden lg:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {navTabs.map((tab) => {
              const isActive = pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href));
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`dashboard-nav-tab flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    isActive
                      ? 'dashboard-nav-tab-active bg-white text-pink-600 shadow-sm'
                      : 'text-gray-600 hover:text-pink-600 hover:bg-white/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 ml-4">
            <ThemeToggle />

            {/* Add Job Button */}
            {onAddJob && (
              <>
                <Button onClick={onAddJob} className="hidden sm:flex">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Job
                </Button>
                <Button onClick={onAddJob} className="sm:hidden p-2" aria-label="Add Job">
                  <Plus className="w-5 h-5" />
                </Button>
              </>
            )}

            {/* Export Button */}
            {onExport && (
              <button
                onClick={onExport}
                className="p-2 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                title="Export data"
              >
                <Download className="w-5 h-5" />
              </button>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-pink-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {userName}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                  >
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      href="/tasks"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors lg:hidden"
                    >
                      <ListTodo className="w-4 h-4" />
                      Tasks
                    </Link>
                    <Link
                      href="/resources"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors lg:hidden"
                    >
                      <BookOpen className="w-4 h-4" />
                      Resources
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
