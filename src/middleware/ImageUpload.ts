import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { v4 as uuidv4 } from "uuid";
import AppError from "../util/AppError";

const multerStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "public/img/user");
  },
  filename(req, file, callback) {
    const extension = file.mimetype.split("/")[1];
    callback(null, `user-${uuidv4()}.${extension}`);
  },
});

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new AppError("Please upload only images.", 400));
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: fileFilter,
});

const uploadProfileImage = upload.single("photo");

export default uploadProfileImage;
