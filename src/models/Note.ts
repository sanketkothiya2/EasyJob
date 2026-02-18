import mongoose, { Schema, Document, Model } from 'mongoose';
import { NoteType } from '@/types';

export interface INote extends Document {
  _id: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  type: NoteType;
  createdAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
      maxlength: [10000, 'Content cannot exceed 10000 characters'],
    },
    type: {
      type: String,
      enum: ['general', 'interview', 'research', 'follow_up'],
      default: 'general',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for job notes queries
NoteSchema.index({ jobId: 1, createdAt: -1 });

// Prevent model recompilation in development
const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);

export default Note;
