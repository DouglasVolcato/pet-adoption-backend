import { GetUserByTokenUserUseCase } from "../../../../src/domain/protocols";
import { makeUserEntity } from "../../mocks";

export class GetUserByTokenServiceStub
  implements GetUserByTokenUserUseCase.Service
{
  public async execute(
    input: GetUserByTokenUserUseCase.Input
  ): GetUserByTokenUserUseCase.Output {
    return Promise.resolve(makeUserEntity());
  }
}
