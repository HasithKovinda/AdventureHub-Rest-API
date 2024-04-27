import jwt, { SignOptions } from "jsonwebtoken";
import config from "config";

export default class Auth {
  private secret_key: string;
  private expires_time: string;

  constructor() {
    this.secret_key = config.get<string>("JWT_SECRET");
    this.expires_time = config.get<string>("JWT_EXPIRES_TIME");
  }

  signIn(
    payload: Object,
    options: SignOptions = { expiresIn: this.expires_time }
  ) {
    const token = jwt.sign(payload, this.secret_key, options);
    return token;
  }
}
