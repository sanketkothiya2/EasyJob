import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContact extends Document {
  _id: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  role?: string;
  email?: string;
  linkedin?: string;
  notes?: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
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
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    linkedin: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for job contacts queries
ContactSchema.index({ jobId: 1, createdAt: -1 });

// Prevent model recompilation in development
const Contact: Model<IContact> = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
