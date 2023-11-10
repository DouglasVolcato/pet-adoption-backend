import { UserEntityType } from "../../../../src/domain/protocols";
import { FakeData } from "../../fake-data";

export const makeUserEntity = (): UserEntityType => ({
  id: FakeData.id(),
  name: FakeData.word(),
  email: FakeData.email(),
  password: FakeData.password(),
  admin: FakeData.bool(),
});
