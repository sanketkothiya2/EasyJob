import mongoose, { Schema, Document } from 'mongoose';

export type TaskCategory = 'daily' | 'weekly' | 'monthly';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  scheduledTime?: {
    start: string; // HH:mm format
    end: string;   // HH:mm format
  };
  tags: string[];
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  completedAt?: Date;
  reminderAt?: Date;
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  linkedJobId?: mongoose.Types.ObjectId;
  color?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily',
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'done'],
      default: 'todo',
    },
    dueDate: {
      type: Date,
    },
    scheduledTime: {
      start: String,
      end: String,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    subtasks: [{
      id: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    }],
    completedAt: {
      type: Date,
    },
    reminderAt: {
      type: Date,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
    },
    linkedJobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
    },
    color: {
      type: String,
      default: '#ec4899', // Pink default
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ userId: 1, category: 1 });
TaskSchema.index({ userId: 1, dueDate: 1 });
TaskSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
