import mongoose, { Schema } from "mongoose";
import { IPostType } from "../types/globals.js";

const postTypeSchema = new Schema<IPostType>({
  name: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

export const PostType = mongoose.model('PostType', postTypeSchema);