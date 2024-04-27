import { UserDocument, UserInput } from "../models/user.model";
import { IGenericRepository } from "./IGenericRepository";

export interface IUserRepository
  extends IGenericRepository<UserDocument, UserInput> {
  //Defined specific methods to User Model
}
