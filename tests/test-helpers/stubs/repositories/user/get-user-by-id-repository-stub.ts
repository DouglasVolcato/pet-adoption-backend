import { GetUserByIdRepositoryInterface } from "../../../../../src/data/protocols";
import { UserEntityType } from "../../../../../src/domain/protocols";
import { makeUserEntity } from "../../../mocks";

export class GetUserByIdRepositoryStub
  implements GetUserByIdRepositoryInterface
{
  public async getById(id: string): Promise<UserEntityType | null> {
    return Promise.resolve(makeUserEntity());
  }
}
