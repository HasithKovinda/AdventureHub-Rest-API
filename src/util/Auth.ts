import { promisify } from "util";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "config";

export default class Auth {
  private secret_key: string;
  private expires_time: string;

  constructor() {
    this.secret_key = config.get<string>("JWT_SECRET");
    this.expires_time = config.get<string>("JWT_EXPIRES_TIME");
  }

  signIn(
    payload: { [key: string]: any },
    options: SignOptions = { expiresIn: this.expires_time }
  ) {
    const token = jwt.sign(payload, this.secret_key, options);
    return token;
  }

  async verify(token: string) {
    const verify = promisify(jwt.verify) as (
      token: string,
      secret: jwt.Secret
    ) => Promise<JwtPayload>;
    const decodedToken = await verify(token, this.secret_key);
    return decodedToken;
  }
}
