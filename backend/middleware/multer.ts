import multer from 'multer';
import path from 'path';
import {v4 as uuid} from 'uuid';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const mime = file.mimetype;
    let folder = "uploads/others";
    if(mime.startsWith('image/')) folder = "uploads/images";
    if(mime.startsWith('video/')) folder = "uploads/videos";
    if(mime.startsWith('audio/')) folder = "uploads/audios";
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${uuid()}${ext}`;
    cb(null,filename);
  }
});

export const upload = multer({ 
  storage,
  fileFilter: function (req, file, cb) {
    if (['image/jpeg','image/png','image/webp','video/mkv','video/mp4','audio/wav','audio/mp3'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null,false);
    }
  }
});
