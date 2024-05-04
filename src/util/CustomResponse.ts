import { NextFunction, Response } from "express";
import { Document } from "mongoose";
import AppError from "./AppError";

export class CustomResponse {
  static sendCreateResponse(res: Response, resourceName: string, doc: any) {
    res.status(201).json({ status: "success", data: { [resourceName]: doc } });
  }

  static sendGetAllResponse(res: Response, resourceName: string, doc: any[]) {
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: { [resourceName]: doc },
    });
  }

  static sendGetOneOrUpdateResponse(
    res: Response,
    next: NextFunction,
    resourceName: string,
    doc: any | null,
    id?: string
  ) {
    if (!doc)
      return next(
        new AppError(
          `No ${resourceName} found for this ${resourceName} id ${id}`,
          404
        )
      );
    res.status(200).json({
      status: "success",
      data: { [resourceName]: doc },
    });
  }
  static sendDeleteResponse(
    res: Response,
    next: NextFunction,
    resourceName: string,
    doc: any | null,
    id?: string
  ) {
    if (!doc)
      return next(
        new AppError(
          `No ${resourceName} found for this ${resourceName} id ${id}`,
          404
        )
      );
    res.status(204).json({
      status: "success",
    });
  }
}
