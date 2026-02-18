'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, FileJson, FileSpreadsheet, Download } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Job } from '@/types';
import { exportToCSV, exportToJSON } from '@/lib/export';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: Job[];
}

export default function ExportModal({ isOpen, onClose, jobs }: ExportModalProps) {
  const handleExportCSV = () => {
    exportToCSV(jobs);
    onClose();
  };

  const handleExportJSON = () => {
    exportToJSON(jobs);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Jobs
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Export your {jobs.length} job application{jobs.length !== 1 ? 's' : ''} to a file.
              </p>

              <div className="space-y-3">
                {/* CSV Export */}
                <button
                  onClick={handleExportCSV}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <FileSpreadsheet className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">Export as CSV</h3>
                    <p className="text-sm text-gray-500">
                      Compatible with Excel, Google Sheets
                    </p>
                  </div>
                </button>

                {/* JSON Export */}
                <button
                  onClick={handleExportJSON}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <FileJson className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">Export as JSON</h3>
                    <p className="text-sm text-gray-500">
                      For developers and data backup
                    </p>
                  </div>
                </button>
              </div>

              {/* Cancel */}
              <div className="mt-6">
                <Button variant="outline" onClick={onClose} className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
