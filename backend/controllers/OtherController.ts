import { Request, Response } from "express";
import { Tag } from "../models/Tag.js";
import { PostType } from "../models/PostType.js";
import { PostGroup } from "../models/PostGroup.js";
import { Culture } from "../models/Culture.js";

export const getTags = async (req: Request, res: Response) => {
  try {
    const sortBy = req.query?.sortBy?.toString() ?? "tag";
    const tags = await Tag.find({}, "tag").sort({ [sortBy]: 1 });
    if (!tags) {
      res.status(404).json({ msg: 'No tags found' });
    }

    return res.status(200).json({ tags })
  } catch (err: any) {
    console.error("Error while fetching tags: " + err);
    return res.status(500).json({ msg: 'Internal server error while fetching tags' });
  }
}

export const addTag = async (req: Request, res: Response) => {
  try {
    const { tag } = req.body;

    if(!tag) {
      return res.status(400).json({ msg: "Missing required field 'tag'" });
    }

    const doesExist = await Tag.findOne({ tag });
    if(doesExist) {
      return res.status(400).json({ msg: "Tag already exists" });
    }
  
    const newTag = await Tag.create({ tag });
    return res.status(200).json({ tag: newTag.tag });
  } catch (err: any) {
    console.error(`Error while adding tag : ${err}`);
    return res.status(500).json({ msg: "Internal sever error while adding tag." });
  }
}

export const getPostTypes = async (req: Request, res: Response) => {
  try {
    const sortBy = req.query?.sortBy?.toString() ?? "name";
    const postTypes = await PostType.find({}, "name").sort({ [sortBy]: 1 });
    if (!postTypes) {
      res.status(404).json({ msg: 'No post types found.' });
    }

    return res.status(200).json({ postTypes });
  } catch (err: any) {
    console.error("Error while fetching post types: " + err);
    return res.status(500).json({ msg: 'Internal server error while fetching post types.' });
  }
}

export const addPostType = async (req: Request, res: Response) => {
  try {
    const { postType } = req.body;

    if(!postType) {
      return res.status(400).json({ msg: "Missing required field." });
    }

    const doesExist = await PostType.findOne({ name: postType });
    if(doesExist) {
      return res.status(400).json({ msg: "Post type already exists." });
    }
  
    const { name } = await PostType.create({ name: postType });
    return res.status(200).json({ postType: name });
  } catch (err: any) {
    console.error(`Error while adding post type. : ${err}`);
    return res.status(500).json({ msg: "Internal server error while adding post type." });
  }
}

export const getPostGroups = async (req: Request, res: Response) => {
  try {
    const sortBy = req.query?.sortBy?.toString() ?? "name";
    const postGroups = await PostGroup.find({}, "name").sort({ [sortBy]: 1 });
    if (!postGroups) {
      res.status(404).json({ msg: 'No post groups found.' });
    }

    return res.status(200).json({ postGroups });
  } catch (err: any) {
    console.error("Error while fetching post groups: " + err);
    return res.status(500).json({ msg: 'Internal server error while fetching post groups.' });
  }
}

export const addPostGroup = async (req: Request, res: Response) => {
  try {
    const { postGroup } = req.body;

    if(!postGroup) {
      return res.status(400).json({ msg: "Missing required field." });
    }

    const doesExist = await PostGroup.findOne({ name: postGroup });
    if(doesExist) {
      return res.status(400).json({ msg: "Post group already exists." });
    }

    const { name } = await PostGroup.create({ name: postGroup, postCount: 0 });
    return res.status(200).json({ postGroup: name });
  } catch (err: any) {
    console.error(`Error while adding post group. : ${err}`);
    return res.status(500).json({ msg: "Internal server error while adding post group." });
  }
}