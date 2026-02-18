import { Job } from '@/types';

export function exportToCSV(jobs: Job[], filename: string = 'job-applications') {
  // CSV Headers
  const headers = [
    'Title',
    'Company',
    'Location',
    'Status',
    'Excitement',
    'Salary Min',
    'Salary Max',
    'Date Saved',
    'Date Applied',
    'Deadline',
    'URL',
    'Description',
  ];

  // Convert jobs to CSV rows
  const rows = jobs.map((job) => [
    escapeCSV(job.title),
    escapeCSV(job.company),
    escapeCSV(job.location),
    escapeCSV(job.status),
    job.excitement.toString(),
    job.salary?.min?.toString() || '',
    job.salary?.max?.toString() || '',
    formatDateForCSV(job.dateSaved),
    job.dateApplied ? formatDateForCSV(job.dateApplied) : '',
    job.deadline ? formatDateForCSV(job.deadline) : '',
    escapeCSV(job.url || ''),
    escapeCSV(job.description || ''),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  // Create and download file
  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
}

export function exportToJSON(jobs: Job[], filename: string = 'job-applications') {
  const exportData = jobs.map((job) => ({
    title: job.title,
    company: job.company,
    location: job.location,
    status: job.status,
    excitement: job.excitement,
    salary: job.salary,
    dateSaved: job.dateSaved,
    dateApplied: job.dateApplied,
    deadline: job.deadline,
    url: job.url,
    description: job.description,
  }));

  const jsonContent = JSON.stringify(exportData, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatDateForCSV(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
