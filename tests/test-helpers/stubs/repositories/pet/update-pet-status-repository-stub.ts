import { UpdatePetStatusRepositoryIntereface } from "../../../../../src/data/protocols";
import { makePetEntity } from "../../../mocks";
import {
  PetStatusEnum,
  PetEntityType,
} from "../../../../../src/domain/protocols";

export class UpdatePetStatusRepositoryStub
  implements UpdatePetStatusRepositoryIntereface
{
  public async updateStatus(
    petId: string,
    newStatus: PetStatusEnum
  ): Promise<PetEntityType | null> {
    return Promise.resolve(makePetEntity());
  }
}
