import { Document } from "mongoose";

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
  name: string;
  descriptiveName: string;
  description: string;
  coverImages: string[];
  galleryImages: string[];
  content: string;
  posts: number;
};

export interface ILocation extends Document {
  district: string;
  taluk: string;
  village: string;
  lat: number;
  lng: number;
};

export interface IPost extends Document {
  mainTitle: string;
  shortTitle: string;
  culture: Schema.Types.ObjectId;
  description: string;
  tags: Schema.Types.ObjectId[];
  image: string;
  content: string;
  location?: ILocation;
};

export interface IDuration extends Document {
  start: Date;
  end: Date;
};

export interface IEvent extends Document {
  name: string;
  description: string;
  duration: IDuration;
  culture: Schema.Types.ObjectId;
  docs: string[];
  location: ILocation
};

export interface ITag extends Document {
  tag: string;
};
