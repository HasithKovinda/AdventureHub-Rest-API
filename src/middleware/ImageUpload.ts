import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import sharp from "sharp";
import config from "config";
import AppError from "../util/AppError";

const cloud_name = config.get<string>("CLOUDINARY_NAME");
const api_key = config.get<string>("CLOUDINARY_API_KEY");
const api_secret = config.get<string>("CLOUDINARY_SECRET");

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
  fileFilter: fileFilter,
});

const uploadProfileImage = upload.single("photo");

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

interface CloudinaryFile extends Express.Multer.File {
  buffer: Buffer;
}

export const resizeImageAndUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return next();
    }
    const file: CloudinaryFile = req.file as CloudinaryFile;
    const resizedBuffer: Buffer = await sharp(file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "AdventurHub Users",
      } as any,
      (
        err: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (err) {
          console.error("Cloudinary upload error:", err);
          return next(err);
        }
        if (!result) {
          console.error("Cloudinary upload error: Result is undefined");
          return next(new Error("Cloudinary upload result is undefined"));
        }
        if (req.file) req.file.filename = result.secure_url;
        next();
      }
    );
    uploadStream.end(resizedBuffer);
  } catch (error) {
    console.error("Error in uploadToCloudinary middleware:", error);
    next(error);
  }
};

export default uploadProfileImage;
