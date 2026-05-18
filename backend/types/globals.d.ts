import { Request } from "express";
import { Schema, Document } from "mongoose";

export interface IPhone extends Document {
  dialCode: number;
  number: number;
};

export interface IUser extends Document {
  name: string;
  uname: string;
  email: string;
  phone: IPhone;
  role: 'user' | 'admin';
  verified: boolean;
  password: string;
};

export interface ICulture extends Document {
  title: string;
  descriptiveName: string;
  description: string;
  coverImages: string[];
  galleryImages: string[];
  content: string;
};

export interface ILocation extends Document {
  type: "Point",
  district: string;
  taluk: string;
  village: string;
  coordinates: number[2];
};

export interface IPost extends Document {
  userId: Schema.Types.ObjectId,
  title: string,
  shortTitle: string,
  culture: Schema.Types.ObjectId,
  postGroup: Schema.Types.ObjectId,
  postType: Schema.Types.ObjectId,
  description: string,
  tags: Schema.Types.ObjectId[],
  image: string,
  content: string,
  location?: ILocation
};

export interface IDuration extends Document {
  start: Date;
  end: Date;
};

export interface IEvent extends Document {
  title: string;
  description: string;
  duration: IDuration;
  culture: Schema.Types.ObjectId;
  docs: string[];
  location: ILocation
};

export interface ITag extends Document {
  tag: string;
};

export interface IPostGroup extends Document {
  name: string;
  postCount: number;
};

export interface IPostType extends Document {
  name: string
}

export interface IDraft extends Document  {
  userId: Schema.Types.ObjectId,
  type: 'post' | 'culture' | 'event'
}

export type CardDataType = {
  id: string;
  title: string;
  images?: string[];
  description: string;
};

export interface AuthRequest extends Request {
  user?: any;
}