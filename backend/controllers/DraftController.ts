import { Request, Response } from "express";
import { AuthRequest, ICulture, IEvent, IPost } from "../types/globals.js";
import { Draft } from "../models/Draft.js";

export const getDrafts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    const drafts =
      (await Draft
        .find({ userId })
        .sort({ createdAt: -1 })
      ).map(d => ({
        id: d._id as string,
        title: d.title
      }));

    if (!drafts) {
      return res.status(500).json({ msg: 'No posts found.' });
    }

    return res.status(200).json({ drafts });
  } catch (err: any) {
    console.error('Error while fetching drafts: ', err.message);
    return res.status(500).json({ msg: 'Internal Server error while fetching drafts.' });
  }
}

export const getDraft = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        msg: "Missing required field."
      });
    }

    const draft = await Draft.findById(id);

    if (!draft) {
      return res.status(404).json({ msg: "Draft not found." });
    }

    let draftRes;

    if (draft.type === "culture") {
      const d = draft.toObject() as ICulture;

      draftRes = {
        type: "culture",
        details: {
          title: d?.title ?? "",
          description: d?.description ?? "",
          descriptiveName: d?.descriptiveName ?? "",
          coverImages: d?.coverImages ?? [],
          galleryImages: d?.galleryImages ?? []
        },
        content: d.content ?? ""
      };
    }

    else if (draft.type === "event") {
      const d = draft.toObject() as IEvent;

      draftRes = {
        type: "event",
        details: {
          title: d?.title ?? "",
          culture: d?.culture ?? "",
          description: d?.description ?? "",
          duration:
            d?.duration?.start && d?.duration?.end
              ? {
                  start: d.duration.start
                    .toISOString()
                    .split("T")[0],

                  end: d.duration.end
                    .toISOString()
                    .split("T")[0]
                }
              : {
                  start: null,
                  end: null
                },

          docs: d?.docs ?? []
        },

        location: d?.location ? {
          district: d?.location.district,
          taluk: d?.location.taluk,
          village: d?.location.village,
          lat: d?.location.coordinates[0],
          lng: d?.location.coordinates[1]
        } : null
      };
    }

    else if (draft.type === "post") {
      const d = draft.toObject() as (IPost & { locationSpecific: boolean });

      draftRes = {
        type: "post",
        details: {
          title: d?.title ?? "",
          shortTitle: d?.shortTitle ?? "",
          postGroup: d?.postGroup ?? "",
          postType: d?.postType ?? "",
          description: d?.description ?? "",
          tags: d?.tags ?? [],
          image: d?.image ?? "",
          locationSpecific: d?.locationSpecific
        },

        location: d?.location ? {
          district: d?.location.district,
          taluk: d?.location.taluk,
          village: d?.location.village,
          lat: d?.location.coordinates[0],
          lng: d?.location.coordinates[1]
        } : null,

        content: d?.content ?? ""
      };
    }

    console.log(draftRes)
    return res.status(200).json({ draft: draftRes });

  } catch (err: any) {
    console.error( "Error while fetching draft:", err.message);
    return res.status(500).json({ msg: "Internal Server error while fetching draft." });
  }
};

export const createDraft = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { type } = req.body;
    const { _id } = (await Draft.create({ userId, type })).toObject();
    return res.status(201).json({ id: _id });
  } catch(err: any) {
    console.error("Error while creating culture draft: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while creating culture draft.' });
  }
}

export const deleteDraft = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ msg: 'Missing required field.' });
    }

    await Draft.deleteOne({ _id: id });
    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Error while deleting draft: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while deleting draft.' });
  }
}