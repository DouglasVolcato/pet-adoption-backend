import { LoginUseCase } from "../../../../src/domain/protocols";
import { FakeData } from "../../fake-data";
import { makeUserEntity } from "../../mocks";

export class LoginServiceStub implements LoginUseCase.Service {
  public async execute(input: LoginUseCase.Input): LoginUseCase.Output {
    return Promise.resolve({ token: FakeData.word(), user: makeUserEntity() });
  }
}
