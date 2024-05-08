import dotenv from "dotenv";

const a = dotenv.config({ path: `${__dirname}/../development.env` });
export default {
  PORT: Number(process.env.PORT),
  CONNECTION_STRING: process.env.CONNECTION_STRING,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_TIME: process.env.JWT_EXPIRES_TIME,
  JWT_COOKIE_EXPIRES: Number(process.env.JWT_COOKIE_EXPIRES),
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_USER_NAME: process.env.EMAIL_USER_NAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
};
