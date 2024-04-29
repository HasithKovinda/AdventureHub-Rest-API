import bcrypt from "bcrypt";
import crypto from "crypto";
import mongoose, { Document } from "mongoose";
import validator from "validator";

export interface UserInput {
  name: string;
  email: string;
  photo: string;
  password: string;
  passwordConfirm: string;
}

export enum Role {
  user = "user",
  guide = "guide",
  leadGuid = "lead-guide",
  admin = "admin",
}

export interface UserDocument extends UserInput, Document {
  createdAt: Date;
  updatedAt: Date;
  role: Role;
  passwordChangeAt: Date;
  passwordRestToken: string;
  passwordRestTokenExpires: Date;
  active: Boolean;
  comparePassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<Boolean>;
  checkIsPasswordChange(jwtIat: number): boolean;
  createRestPasswordToken(): string;
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
    role: {
      type: String,
      enum: ["user", "guide", "lead-guide", "admin"],
      default: "user",
      message: "Role is either: user, guide, lead-guide or admin",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minLength: 6,
      select: false,
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
    passwordChangeAt: Date,
    passwordRestToken: String,
    passwordRestTokenExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);

//Hash password

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  //remove password confirm from the database
  (this as any)["passwordConfirm"] = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangeAt = new Date(Date.now() - 1000);
  next();
});

userSchema.pre(
  /^find/,
  function (this: mongoose.Query<UserDocument, UserDocument>, next) {
    this.find({ active: { $ne: false } });
    next();
  }
);

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.checkIsPasswordChange = function (jwtIat: number) {
  let self = this as UserDocument;
  if (self.passwordChangeAt) {
    const changeTimeStamp = Number(self.passwordChangeAt.getTime() / 1000);
    return jwtIat < changeTimeStamp;
  }
  return false;
};

userSchema.methods.createRestPasswordToken = function () {
  let self = this as UserDocument;
  const resetToken = crypto.randomBytes(32).toString("hex");
  console.log("resetToken", resetToken);
  self.passwordRestToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  self.passwordRestTokenExpires = (Date.now() +
    10 * 60 * 1000) as unknown as Date;
  console.log("pass", self.passwordRestToken);
  return resetToken;
};

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
