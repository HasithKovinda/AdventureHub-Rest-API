import { Model } from "mongoose";
import { UserDocument, UserInput } from "../models/user.model";
import { GenericRepository } from "./GenericRepository";
import { IUserRepository } from "../Contracts/IUserRepository";

export class UserRepository
  extends GenericRepository<UserDocument, UserInput>
  implements IUserRepository
{
  constructor(model: Model<UserDocument>) {
    super(model);
  }
}
