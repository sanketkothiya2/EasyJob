// Job Status Types
export type JobStatus =
  | 'bookmarked'
  | 'applying'
  | 'applied'
  | 'interviewing'
  | 'negotiating'
  | 'accepted'
  | 'withdrawn'
  | 'rejected'
  | 'no_response';

// Note Types
export type NoteType = 'general' | 'interview' | 'research' | 'follow_up';

// User Interface
export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Salary Range
export interface SalaryRange {
  min?: number;
  max?: number;
}

// Checklist Progress
export interface ChecklistProgress {
  bookmarked: number;
  applying: number;
  applied: number;
  interviewing: number;
  negotiating: number;
  accepted: number;
}

// Job Interface
export interface Job {
  _id: string;
  userId: string;
  title: string;
  company: string;
  location: string;
  url?: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  salary?: SalaryRange;
  status: JobStatus;
  excitement: number;
  datePosted?: Date;
  dateSaved: Date;
  dateApplied?: Date;
  deadline?: Date;
  followUpDate?: Date;
  checklistProgress: ChecklistProgress;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
}

// Note Interface
export interface Note {
  _id: string;
  jobId: string;
  userId: string;
  title: string;
  content: string;
  type: NoteType;
  createdAt: Date;
}

// Contact Interface
export interface Contact {
  _id: string;
  jobId: string;
  userId: string;
  name: string;
  role?: string;
  email?: string;
  linkedin?: string;
  notes?: string;
  createdAt: Date;
}

// Pipeline Stage
export interface PipelineStage {
  id: JobStatus;
  label: string;
  icon: string;
  color: string;
  count?: number;
}

// Form Types
export interface CreateJobInput {
  title: string;
  company: string;
  location: string;
  url?: string;
  description?: string;
  salary?: SalaryRange;
}

export interface UpdateJobInput extends Partial<CreateJobInput> {
  status?: JobStatus;
  excitement?: number;
  requirements?: string[];
  responsibilities?: string[];
  checklistProgress?: Partial<ChecklistProgress>;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  type: NoteType;
}

export interface CreateContactInput {
  name: string;
  role?: string;
  email?: string;
  linkedin?: string;
  notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Table Column Definition
export interface TableColumn {
  id: string;
  label: string;
  sortable: boolean;
  visible: boolean;
  width?: string;
}

// Filter Options
export interface FilterOptions {
  status?: JobStatus[];
  excitement?: number[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  search?: string;
}

// Group By Options
export type GroupByOption = 'status' | 'company' | 'location' | 'none';

// Checklist Item
export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  stage: JobStatus;
}

// Email Template
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  stage: JobStatus;
}
