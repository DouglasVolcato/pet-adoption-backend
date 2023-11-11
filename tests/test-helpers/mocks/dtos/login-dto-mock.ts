import { LoginUseCase } from "../../../../src/domain/protocols/usecases/login-usecase";
import { FakeData } from "../../fake-data";

export const makeLoginDto = (): LoginUseCase.Input => {
  return {
    email: FakeData.email(),
    password: FakeData.password(),
  };
};
