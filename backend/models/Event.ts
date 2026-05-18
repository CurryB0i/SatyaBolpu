import mongoose, { Schema } from 'mongoose';
import { IDuration, IEvent } from '../types/globals.js';
import { locationSchema } from './Post.js';

export const durationSchema = new Schema<IDuration>({
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  }
});

const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  culture: {
    type: Schema.Types.ObjectId,
    ref: 'Culture',
    required: true
  },
  duration: {
    type: durationSchema,
    required: true
  },
  docs: {
    type: [String]
  },
  location: {
    type: locationSchema,
    required: true
  }
}, { timestamps: true });

export const Event = mongoose.model<IEvent>('Event', eventSchema);
