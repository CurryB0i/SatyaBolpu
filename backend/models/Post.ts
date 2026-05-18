import mongoose, { Schema } from "mongoose";
import { IPost } from "../types/globals.js";

export const locationSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
    default: "Point"
  },

  coordinates: {
    type: [Number],
    required: true
  },

  district: {
    type: String,
    required: true
  },
  taluk: String,
  village: {
    type: String,
    required: true
  }
}, { _id: false });

const postSchema = new Schema<IPost>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
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
  postGroup: {
    type: Schema.Types.ObjectId,
    ref: 'PostGroup',
    required: true
  },
  postType: {
    type: Schema.Types.ObjectId,
    ref: 'PostType',
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

postSchema.index({ postGroup: 1 });
postSchema.index({ postType: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ location: "2dsphere" });

export const Post = mongoose.model<IPost>('Post',postSchema);
