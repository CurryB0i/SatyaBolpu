import mongoose, { Schema } from "mongoose";
import { ITag } from "../types/globals.js";

const tagSchema = new Schema<ITag>({
  tag: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

export const Tag = mongoose.model('Tag',tagSchema);
