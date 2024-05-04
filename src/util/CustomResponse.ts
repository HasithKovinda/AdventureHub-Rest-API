import { NextFunction, Response } from "express";
import { Document } from "mongoose";

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
}
