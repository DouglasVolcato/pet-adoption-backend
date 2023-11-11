import { CreateUserUseCase } from "../../../../src/domain/protocols";
import { FakeData } from "../../fake-data";

export const makeUserDto = (): CreateUserUseCase.Input => ({
  name: FakeData.word(),
  email: FakeData.email(),
  password: FakeData.password(),
});
