import mongoose, { Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

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

//Hash password

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  (this as any)["passwordConfirm"] = undefined;
  next();
});

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
