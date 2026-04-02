import { Request, Response } from 'express';
import { Post } from '../models/Post.js';
import { Tag } from '../models/Tag.js';
import { Culture } from '../models/Culture.js';

export const uploadPost = async (req: Request, res: Response) => {
  try {
    const { details, content, mapDetails } = req.body;
    
    if (!details || !content) {
      return res.status(400).json({ msg: 'Missing Required Field' });
    }

    const tagIds = [];
    for(const tag of details.tags) {
      const t = await Tag.findOne({ tag });
      tagIds.push(t?._id);
    }

    const cultureName = details.culture.charAt(0).toUpperCase() + details.culture.slice(1);
    const culture = await Culture.findOne({ name: cultureName });
    if(!culture) {
      return res.status(400).json({ msg: 'Culture not found.' });
    }

    const newPost = await Post.create({
      mainTitle: details.mainTitle,
      shortTitle: details.shortTitle,
      culture: culture._id,
      description: details.description,
      tags: tagIds,
      image: details.image,
      content,
      location: mapDetails
    });

    const { _id, __v, ...rest } = newPost.toObject();
    return res.status(201).json({ post: { id: _id, ...rest } });

  } catch (err: any) {
    console.error('Error while uploading Post: ', err.message);
    return res.status(500).json({ msg: 'Internal Server error while uploading post.' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    if(!posts) {
      return res.status(500).json({ msg: 'No posts found.' });
    }

    return res.status(200).json({ posts });
  } catch(err: any) {
    console.error('Error while fetching posts: ', err.message);
    return res.status(500).json({ msg: 'Internal Server error while fetching posts.' });
  }
}

export const getPost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const post = await Post.findOne({ _id: id });
    if(!post) {
      return res.status(500).json({ msg: 'No posts found.' });
    }

    return res.status(200).json({ post });
  } catch(err: any) {
    console.error(`Error while fetching post with id ${req.params.id}: `, err.message);
    return res.status(500).json({ msg: `Internal Server error while fetching post with id ${req.params.id}.` });
  }
}
