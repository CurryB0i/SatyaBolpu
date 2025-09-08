import { Request, Response } from "express";
import { Tag } from "../models/Tag.js";

export const getTags = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find();
    if (!tags) {
      res.status(404).json({ msg: 'No tags found' });
    }

    return res.status(200).json({
      tags: tags.map((tagObj) => tagObj.tag)
    })
  } catch (err: any) {
    console.error("Error while fetching tags: " + err);
    return res.status(500).json({ msg: 'Server error while fetching tags' });
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
    return res.status(500).json({ msg: "Error while adding tag" });
  }
}
