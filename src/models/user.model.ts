import mongoose, { Document } from "mongoose";
import validator from "validator";

export interface UserInput {
  name: string;
  email: string;
  photo: string;
  password: string;
  passwordConfirm: string;
}

export interface UserDocument extends UserInput, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User must have a name"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "User must have an email address"],
      validate: [validator.isEmail, "Please provide valid email address"],
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minLength: 6,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please provide a password"],
      validate: {
        validator: function (value: string) {
          return (this as UserDocument).password === value;
        },
        message: "password and password confirm felids not match",
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
