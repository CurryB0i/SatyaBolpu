import mongoose, { Schema } from 'mongoose';
import { ICulture } from '../types/globals.js';

const cultureSchema = new Schema<ICulture>({
  name: {
    type: String,
    required: true,
  },
  descriptiveName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverImages: {
    type: [String],
    required: true
  },
  galleryImages: {
    type: [String],
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  posts: {
    type: Number,
    required: true
  }
});

export const Culture = mongoose.model<ICulture>('Culture',cultureSchema);
