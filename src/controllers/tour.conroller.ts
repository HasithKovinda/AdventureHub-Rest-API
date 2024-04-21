import { Request, Response, NextFunction } from "express";

export function getTours(req: Request, res: Response, next: NextFunction) {
  return res.json({ status: "success" });
}
