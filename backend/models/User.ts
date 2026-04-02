import mongoose, { Schema } from "mongoose";
import { IPhone, IUser } from "../types/globals.js";

const phoneSchema = new Schema<IPhone>({
  dialCode: {
    type: Number,
    required: true
  },
  number: {
    type: Number,
    required: true
  }
});

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  uname: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: phoneSchema
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  verified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
  },
},{ timestamps: true });

export const User = mongoose.model<IUser>('User',userSchema);
