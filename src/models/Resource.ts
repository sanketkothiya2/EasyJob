import mongoose, { Schema, Document } from 'mongoose';

export type ResourceType = 'link' | 'image' | 'note';

export interface IResource extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: ResourceType;
  title: string;
  content?: string; // For notes - rich text content
  url?: string; // For links and images
  thumbnail?: string; // Preview image for links
  description?: string; // Meta description for links
  siteName?: string; // Site name from meta
  category?: mongoose.Types.ObjectId;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['link', 'image', 'note'],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    siteName: {
      type: String,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ResourceSchema.index({ userId: 1, type: 1 });
ResourceSchema.index({ userId: 1, category: 1 });
ResourceSchema.index({ userId: 1, createdAt: -1 });
ResourceSchema.index({ userId: 1, isFavorite: 1 });

export default mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);
