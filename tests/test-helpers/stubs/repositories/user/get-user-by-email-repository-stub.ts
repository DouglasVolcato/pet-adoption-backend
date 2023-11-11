import { GetUserByEmailRepositoryInterface } from "../../../../../src/data/protocols";
import { UserEntityType } from "../../../../../src/domain/protocols";
import { makeUserEntity } from "../../../mocks";

export class GetUserByEmailRepositoryStub
  implements GetUserByEmailRepositoryInterface
{
  public async getByEmail(email: string): Promise<UserEntityType | null> {
    return Promise.resolve(makeUserEntity());
  }
}
