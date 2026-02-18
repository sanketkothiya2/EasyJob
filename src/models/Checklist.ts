import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  completedAt?: Date;
}

export interface IChecklist extends Document {
  _id: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: IChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistItemSchema = new Schema<IChecklistItem>(
  {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Label cannot exceed 200 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  { _id: false }
);

const ChecklistSchema = new Schema<IChecklist>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [ChecklistItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for job checklist queries
ChecklistSchema.index({ jobId: 1, userId: 1 });

const Checklist: Model<IChecklist> =
  mongoose.models.Checklist || mongoose.model<IChecklist>('Checklist', ChecklistSchema);

export default Checklist;
