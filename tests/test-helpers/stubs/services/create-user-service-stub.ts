import { CreateUserUseCase } from "../../../../src/domain/protocols";
import { makeUserEntity } from "../../mocks";

export class CreateUserServiceStub implements CreateUserUseCase.Service {
  public async execute(
    input: CreateUserUseCase.Input
  ): CreateUserUseCase.Output {
    return Promise.resolve(makeUserEntity());
  }
}
