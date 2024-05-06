import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import AppError from "../util/AppError";

export class MulterConfiguration {
  private multerStorage: multer.StorageEngine;
  constructor() {
    this.multerStorage = multer.memoryStorage();
  }

  private fileFilter(
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

  upload() {
    const upload = multer({
      storage: this.multerStorage,
      fileFilter: this.fileFilter,
    });
    return upload;
  }
}
