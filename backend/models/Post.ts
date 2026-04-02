import mongoose, { Schema } from "mongoose";
import { ILocation, IPost } from "../types/globals.js";

export const locationSchema = new Schema<ILocation>({
  district: { type: String, required: true },
  taluk: { type: String },
  village: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
}, { _id: false });

const postSchema = new Schema<IPost>({
  mainTitle: {
    type: String,
    required: true
  },
  shortTitle: {
    type: String,
    required: true
  },
  culture: {
    type: Schema.Types.ObjectId,
    ref: 'Culture',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    required: true,
    validate: {
      validator: function (val: Schema.Types.ObjectId[]) {
        return val && val.length > 0;
      },
      message: 'At least one tag required'
    }
  },
  image: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  location: {
    type: locationSchema
  }
}, { timestamps: true });

postSchema.index({ culture: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ "location.lng": 1, "location.lat": 1 });

export const Post = mongoose.model<IPost>('Post',postSchema);
