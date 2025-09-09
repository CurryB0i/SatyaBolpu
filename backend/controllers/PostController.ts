import { Request, Response } from 'express';
import { Post } from '../models/Post.js';
import { Tag } from '../models/Tag.js';

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

    const newPost = await Post.create({
      mainTitle: details.mainTitle,
      shortTitle: details.shortTitle,
      culture: details.culture,
      description: details.description,
      tags: tagIds,
      image: details.image,
      content,
      location: mapDetails || undefined,
    });

    const { _id, __v, ...rest } = newPost.toObject();
    return res.status(201).json({ post: { id: _id, ...rest } });

  } catch (err: any) {
    console.error('Error while uploading Post: ', err.message);
    return res.status(500).json({ msg: 'Internal Server error while uploading post.' });
  }
};

