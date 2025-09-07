import { Request, Response } from "express";

export const uploadController = async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if(!file) {
      console.warn("No file received in request.");
      return res.status(400).json({ msg: "Missing File." });
    }

    const fileUrl = `/${file.destination}/${file.filename}`.replace(/\\/g, "/");
    console.log("Uploaded file",fileUrl);
    return res.status(200).json({ msg: 'Upload Successful', path: fileUrl })
  } catch (err: any) {
    console.error("Error during file upload:", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

export const uploadMultipleController = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if(!files) {
      console.warn("No files received in request.");
      return res.status(400).json({ msg: "Missing Files." });
    }

    const paths = [];
    for(const file of files) {
      const fileUrl = `/${file.destination}/${file.filename}`.replace(/\\/g, "/");
      console.log("Uploaded file",fileUrl);
      paths.push(fileUrl);
    }
    return res.status(200).json({ msg: 'Upload Successful', paths: paths })
  } catch (err: any) {
    console.error("Error during file upload:", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
