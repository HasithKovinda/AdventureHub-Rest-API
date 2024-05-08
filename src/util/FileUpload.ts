import config from "config";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request } from "express";

interface imageFile extends Express.Multer.File {
  buffer: Buffer;
}

type CloudinaryUploadResult = {
  url: string;
  secure_url: string;
};

export class FileUpload {
  constructor() {
    const cloud_name = config.get<string>("CLOUDINARY_NAME");
    const api_key = config.get<string>("CLOUDINARY_API_KEY");
    const api_secret = config.get<string>("CLOUDINARY_SECRET");
    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
    });
  }

  async singleImageUpload(req: Request, next: NextFunction) {
    try {
      if (!req.file) {
        return next();
      }
      const file: imageFile = req.file as imageFile;
      this.resizeImage(file.buffer, 500, 500);
      const resizedBuffer: Buffer = await this.resizeImage(
        file.buffer,
        500,
        500
      );
      const image_url = await this.cloudnaryUpload(
        resizedBuffer,
        "AdventurHub Users",
        "user"
      );
      if (image_url) {
        if (req.file) req.file.filename = image_url;
        next();
      }
    } catch (error) {
      next(error);
    }
  }

  async uploadTourImages(req: Request, next: NextFunction) {
    try {
      if (!(req.files as any).imageCover || !(req.files as any).images) {
        return next();
      }

      //upload Cover image
      const file: imageFile = (req.files as any).imageCover[0] as imageFile;
      const imageCoverBuffer = await this.resizeImage(file.buffer, 2000, 1333);
      const imageCover = await this.cloudnaryUpload(
        imageCoverBuffer,
        "AdventureHub Tours",
        "imageCover"
      );
      req.body.imageCover = imageCover;
      //Upload images array
      req.body.images = [];
      const files: imageFile[] = (req.files as any).images as imageFile[];
      const buffersPromise = files.map(async (file) => {
        const buffer = await this.resizeImage(file.buffer, 2000, 1333);
        const url = await this.cloudnaryUpload(
          buffer,
          "AdventureHub Tours",
          "images"
        );
        req.body.images.push(url);
      });

      await Promise.all(buffersPromise);
      next();
    } catch (error) {
      next(error);
    }
  }

  private resizeImage(
    buffer: Buffer,
    width: number,
    height: number,
    quality: number = 90
  ) {
    return sharp(buffer)
      .resize(width, height)
      .toFormat("jpeg")
      .jpeg({ quality })
      .toBuffer();
  }

  private async cloudnaryUpload(
    data: Buffer,
    folderName: string,
    resourceType: string
  ) {
    //generate file name
    const fileName = `${resourceType}-${uuidv4()}`;
    const image: CloudinaryUploadResult = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
              folder: folderName,
              public_id: fileName,
            },
            function (error, result) {
              if (error) {
                reject(error);
                return;
              }
              resolve(result!);
            }
          )
          .end(data);
      }
    );
    return image.url;
  }
}
