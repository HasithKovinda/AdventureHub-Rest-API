import { NextFunction, Request, Response } from "express";
import { FileUpload } from "../util/FileUpload";
import { MulterConfiguration } from "../util/multer";

//Handle Multiple Images
const multer = new MulterConfiguration().upload();

export const setTourImages = multer.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

export const uploadTourImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await new FileUpload().uploadTourImages(req, next);
};
