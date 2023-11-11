import {
  PetStatusEnum,
  PetCategoryEnum,
  PetEntityType,
} from "../../../../src/domain/protocols";
import { FakeData } from "../../fake-data";

export const makePetEntity = (): PetEntityType => ({
  id: FakeData.id(),
  name: FakeData.word(),
  description: FakeData.phrase(),
  image: FakeData.url(),
  createdAt: FakeData.date(),
  category: PetCategoryEnum.CATS,
  status: PetStatusEnum.FREE,
});
