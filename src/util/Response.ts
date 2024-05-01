import config from "config";
import { CookieOptions, Response } from "express";
import { UserDocument } from "../models/user.model";

type Status = "success" | "fail";
export class AuthResponse {
  private static prepareCookie() {
    const cookieExpireTime = config.get<number>("jwt_cookie_expires");
    const env = process.env.NODE_ENV;
    //expires within 24 hours
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + cookieExpireTime * 24 * 60 * 60 * 1000),
    };
    if (env === "production") cookieOptions.secure = true;
    return cookieOptions;
  }

  static sendGeneralResponse(
    res: Response,
    options: { statusCode: number; status: string; message: string }
  ) {
    res.status(options.statusCode).json({
      status: options.status,
      message: options.message,
    });
  }

  static sendResponseWithToken(
    res: Response,
    options: { statusCode: number; status: Status; token: string }
  ) {
    res.cookie("token", options.token, this.prepareCookie());
    res.status(options.statusCode).json({
      status: options.status,
      token: options.token,
    });
  }

  static sendResponseWithTokenAndData(
    res: Response,
    options: {
      statusCode: number;
      status: Status;
      token: string;
      user: UserDocument;
    }
  ) {
    res.cookie("token", options.token, this.prepareCookie());
    res.status(options.statusCode).json({
      status: options.status,
      token: options.token,
      data: { user: options.user },
    });
  }
}
