import { UserDtoType } from "../../../../src/domain/protocols";
import { FakeData } from "../../fake-data";

export const makeUserDto = (): UserDtoType => ({
  name: FakeData.word(),
  email: FakeData.email(),
  password: FakeData.password(),
});
