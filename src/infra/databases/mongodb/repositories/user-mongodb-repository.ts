import { UserMongoDbModel } from "../models/user-mongodb-model";
import { UserEntityType } from "../../../../domain/protocols";
import {
  CreateUserRepositoryInterface,
  GetUserByEmailRepositoryInterface,
  GetUserByIdRepositoryInterface,
} from "../../../../data/protocols";

export class UserMongoDBRepository
  implements
    CreateUserRepositoryInterface,
    GetUserByIdRepositoryInterface,
    GetUserByEmailRepositoryInterface
{
  public async create(userEntity: UserEntityType): Promise<UserEntityType> {
    const newUser = new UserMongoDbModel(userEntity);
    await newUser.save();
    return this.map(newUser.toObject());
  }

  public async getByEmail(email: string): Promise<UserEntityType | null> {
    const foundUser = await UserMongoDbModel.findOne({ email }).exec();
    return foundUser ? this.map(foundUser) : null;
  }

  public async getById(id: string): Promise<UserEntityType | null> {
    const foundUser = await UserMongoDbModel.findOne({ id }).exec();
    return foundUser ? this.map(foundUser) : null;
  }

  private map(data: UserEntityType): UserEntityType {
    const userData = data;
    delete (userData as any)._id;
    delete (userData as any).__v;
    return userData;
  }
}
