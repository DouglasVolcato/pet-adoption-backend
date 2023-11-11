import { FakeData } from "../../fake-data";

export const makeRandonData = () => ({
  id: FakeData.id(),
  word: FakeData.word(),
  email: FakeData.email(),
  password: FakeData.password(),
  integer: FakeData.numberInteger(),
  phrase: FakeData.phrase(),
});
