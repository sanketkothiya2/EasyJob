import mongoose, { Schema, Document, Model } from 'mongoose';
import { JobStatus, JobPlatform, SalaryRange, ChecklistProgress } from '@/types';

export interface IJob extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
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
  resumeImage?: string;
  resumeImagePublicId?: string;
  platform?: JobPlatform;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
}

const JobSchema = new Schema<IJob>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    url: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    requirements: [{
      type: String,
      trim: true,
    }],
    responsibilities: [{
      type: String,
      trim: true,
    }],
    salary: {
      min: Number,
      max: Number,
    },
    status: {
      type: String,
      enum: [
        'bookmarked',
        'applying',
        'applied',
        'interviewing',
        'negotiating',
        'accepted',
        'withdrawn',
        'rejected',
        'no_response',
      ],
      default: 'bookmarked',
      index: true,
    },
    excitement: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    datePosted: Date,
    dateSaved: {
      type: Date,
      default: Date.now,
    },
    dateApplied: Date,
    deadline: Date,
    followUpDate: Date,
    checklistProgress: {
      bookmarked: { type: Number, default: 0 },
      applying: { type: Number, default: 0 },
      applied: { type: Number, default: 0 },
      interviewing: { type: Number, default: 0 },
      negotiating: { type: Number, default: 0 },
      accepted: { type: Number, default: 0 },
    },
    resumeImage: {
      type: String,
      trim: true,
    },
    resumeImagePublicId: {
      type: String,
      trim: true,
    },
    platform: {
      type: String,
      enum: [
        'linkedin',
        'indeed',
        'monster',
        'glassdoor',
        'ziprecruiter',
        'dice',
        'angellist',
        'company_website',
        'referral',
        'other',
      ],
      default: 'linkedin',
    },
    archivedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Compound index for user queries
JobSchema.index({ userId: 1, status: 1 });
JobSchema.index({ userId: 1, createdAt: -1 });

// Prevent model recompilation in development
const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);

export default Job;
