'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Mail,
  Lock,
  Palette,
  Bell,
  Download,
  Trash2,
  ChevronRight,
  Save,
  Loader2,
  ArrowLeft,
  Shield,
  Database,
  HelpCircle,
  ExternalLink,
  Check,
  Star,
  Briefcase,
  Moon,
  Sun,
} from 'lucide-react';
import Button from '@/components/ui/Button';

type SettingsSection = 'profile' | 'preferences' | 'notifications' | 'data' | 'about';

const defaultStatuses = [
  { value: 'bookmarked', label: 'Bookmarked' },
  { value: 'applying', label: 'Applying' },
  { value: 'applied', label: 'Applied' },
];

export default function SettingsPage() {
  const { data: session, status } = useSession();
  
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Profile settings
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Preferences
  const [defaultStatus, setDefaultStatus] = useState('bookmarked');
  const [defaultExcitement, setDefaultExcitement] = useState(3);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  
  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [applicationReminders, setApplicationReminders] = useState(true);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      
      const blob = new Blob([JSON.stringify(data.jobs, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `easyjob-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
    setIsLoading(false);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.')) {
      // Handle account deletion
      alert('Account deletion is not yet implemented. Please contact support.');
    }
  };

  const sections = [
    { id: 'profile' as const, label: 'Profile', icon: User, description: 'Manage your personal information' },
    { id: 'preferences' as const, label: 'Preferences', icon: Palette, description: 'Customize your experience' },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell, description: 'Control how we contact you' },
    { id: 'data' as const, label: 'Data & Privacy', icon: Shield, description: 'Export or delete your data' },
    { id: 'about' as const, label: 'About', icon: HelpCircle, description: 'App info and help' },
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logo/logo.png"
                  alt="EasyJob"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <h1 className="text-xl font-bold text-gray-900">Settings</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl shadow-soft border border-gray-100 p-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-pink-50'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6"
            >
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
                    <p className="text-gray-500 mt-1">Manage your personal information</p>
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{name}</h3>
                      <p className="text-sm text-gray-500">{email}</p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                        <Lock className="w-5 h-5" />
                        <span>Change Password</span>
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : isSaved ? (
                        <Check className="w-5 h-5 mr-2" />
                      ) : (
                        <Save className="w-5 h-5 mr-2" />
                      )}
                      {isSaved ? 'Saved!' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Preferences Section */}
              {activeSection === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>
                    <p className="text-gray-500 mt-1">Customize your EasyJob experience</p>
                  </div>

                  {/* Theme */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-pink-500" />
                      Appearance
                    </h3>
                    <div className="flex gap-3">
                      {[
                        { value: 'light' as const, icon: Sun, label: 'Light' },
                        { value: 'dark' as const, icon: Moon, label: 'Dark' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setTheme(option.value)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                            theme === option.value
                              ? 'border-pink-500 bg-pink-50 text-pink-600'
                              : 'border-gray-200 hover:border-pink-200'
                          }`}
                        >
                          <option.icon className="w-4 h-4" />
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Dark mode coming soon!</p>
                  </div>

                  {/* Default Job Settings */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-pink-500" />
                      Default Job Settings
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Status for New Jobs
                        </label>
                        <select
                          value={defaultStatus}
                          onChange={(e) => setDefaultStatus(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          {defaultStatuses.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Excitement Level
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <button
                              key={level}
                              onClick={() => setDefaultExcitement(level)}
                              className="p-1 transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  level <= defaultExcitement
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <Save className="w-5 h-5 mr-2" />
                      )}
                      Save Preferences
                    </Button>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                    <p className="text-gray-500 mt-1">Control how we contact you</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        id: 'email',
                        title: 'Email Notifications',
                        description: 'Receive important updates via email',
                        checked: emailNotifications,
                        onChange: setEmailNotifications,
                      },
                      {
                        id: 'digest',
                        title: 'Weekly Digest',
                        description: 'Get a summary of your job search progress every week',
                        checked: weeklyDigest,
                        onChange: setWeeklyDigest,
                      },
                      {
                        id: 'reminders',
                        title: 'Application Reminders',
                        description: 'Remind me to follow up on applications',
                        checked: applicationReminders,
                        onChange: setApplicationReminders,
                      },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={(e) => item.onChange(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-gray-400">
                    Note: Notification features are coming soon. Your preferences will be saved for when they launch.
                  </p>
                </div>
              )}

              {/* Data & Privacy Section */}
              {activeSection === 'data' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Data & Privacy</h2>
                    <p className="text-gray-500 mt-1">Manage your data and account</p>
                  </div>

                  {/* Export Data */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Database className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Export Your Data</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Download all your job data as a JSON file. This includes all jobs, notes, contacts, and checklists.
                        </p>
                        <Button
                          onClick={handleExportData}
                          variant="secondary"
                          className="mt-3"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Download className="w-4 h-4 mr-2" />
                          )}
                          Export Data
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-red-100 rounded-xl">
                        <Trash2 className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-900">Delete Account</h3>
                        <p className="text-sm text-red-700 mt-1">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <button
                          onClick={handleDeleteAccount}
                          className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete My Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* About Section */}
              {activeSection === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">About EasyJob</h2>
                    <p className="text-gray-500 mt-1">App information and help</p>
                  </div>

                  {/* App Info */}
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
                    <Image
                      src="/images/logo/logo.png"
                      alt="EasyJob"
                      width={64}
                      height={64}
                      className="rounded-xl shadow-md"
                    />
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                        EasyJob
                      </h3>
                      <p className="text-gray-600">Version 1.0.0</p>
                      <p className="text-sm text-gray-500">Your personal job tracking companion</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Features</h3>
                    <div className="grid gap-3">
                      {[
                        'Track job applications with custom statuses',
                        'Add notes, contacts, and checklists for each job',
                        'Rate jobs by excitement level',
                        'Store resources like links, images, and notes',
                        'Export your data anytime',
                        'Beautiful, easy-to-use interface',
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 text-gray-600">
                          <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-pink-500" />
                          </div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Help & Support</h3>
                    <div className="space-y-2">
                      {[
                        { label: 'Documentation', href: '#' },
                        { label: 'Report a Bug', href: '#' },
                        { label: 'Feature Request', href: '#' },
                        { label: 'Contact Support', href: '#' },
                      ].map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-gray-700">{link.label}</span>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-400">
                      Made with ❤️ for job seekers everywhere
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
