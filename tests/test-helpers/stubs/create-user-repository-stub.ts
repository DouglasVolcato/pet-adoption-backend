import { CreateUserRepositoryInterface } from "../../../src/data/protocols";
import { UserEntityType } from "../../../src/domain/protocols";
import { makeUserEntity } from "../mocks";

export class CreateUserRepositoryStub implements CreateUserRepositoryInterface {
  public async create(userEntity: UserEntityType): Promise<UserEntityType> {
    return Promise.resolve(makeUserEntity());
  }
}
