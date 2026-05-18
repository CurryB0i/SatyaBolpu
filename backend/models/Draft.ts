import mongoose, { Schema } from "mongoose";
import { ICulture, IDraft, IEvent, IPost } from "../types/globals.js";
import { locationSchema } from "./Post.js";
import { durationSchema } from "./Event.js";

const draftSchema = new Schema<IDraft & ((IPost & { locationSpecific: boolean }) | ICulture | IEvent)>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['post', 'culture', 'event'],
    required: true
  }
}, {
  discriminatorKey: 'type', 
  timestamps: true 
});
export const Draft = mongoose.model<IDraft & ((IPost & { locationSpecific: boolean }) | ICulture | IEvent)>('Draft', draftSchema);
draftSchema.index({ userId: 1, type: 1 });

export const postDraftSchema = new Schema<IPost & { locationSpecific: boolean }>({
  title: {
    type: String
  },
  shortTitle: {
    type: String
  },
  culture: {
    type: Schema.Types.ObjectId,
    ref: 'Culture'
  },
  postGroup: {
    type: Schema.Types.ObjectId,
    ref: 'PostGroup'
  },
  postType: {
    type: Schema.Types.ObjectId,
    ref: 'PostType'
  },
  description: {
    type: String
  },
  tags: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Tag' }]
  },
  locationSpecific: {
    type: Boolean
  },
  image: {
    type: String
  },
  content: {
    type: String
  },
  location: {
    type: locationSchema
  }
}, { timestamps: true });
export const PostDraft = Draft.discriminator("post", postDraftSchema);

const eventSchema = new Schema<IEvent>({
  title: {
    type: String
  },
  description: {
    type: String
  },
  culture: {
    type: Schema.Types.ObjectId,
    ref: 'Culture'
  },
  duration: {
    type: durationSchema
  },
  docs: {
    type: [String]
  },
  location: {
    type: locationSchema
  }
}, { timestamps: true });
export const EventDraft = Draft.discriminator("event", eventSchema);

const cultureSchema = new Schema<ICulture>({
  title: {
    type: String
  },
  descriptiveName: {
    type: String
  },
  description: {
    type: String
  },
  coverImages: {
    type: [String]
  },
  galleryImages: {
    type: [String]
  },
  content: {
    type: String
  }
}, { timestamps: true });
export const CultureDraft = Draft.discriminator("culture", cultureSchema);