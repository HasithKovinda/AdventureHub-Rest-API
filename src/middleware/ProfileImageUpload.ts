import { NextFunction, Request, Response } from "express";
import { FileUpload } from "../util/FileUpload";
import { MulterConfiguration } from "../util/multer";

//Single Image Handling
const multer = new MulterConfiguration().upload();

export const setProfileImage = multer.single("photo");

export const uploadProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await new FileUpload().singleImageUpload(req, next);
};
