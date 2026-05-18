import mongoose, { Schema } from "mongoose";
import { IPostGroup } from "../types/globals.js";

const postGroupSchema = new Schema<IPostGroup>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  postCount: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export const PostGroup = mongoose.model('PostGroup', postGroupSchema);