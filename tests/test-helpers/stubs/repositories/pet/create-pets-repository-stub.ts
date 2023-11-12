import { CreatePetsRepositoryIntereface } from "../../../../../src/data/protocols";
import { PetEntityType } from "../../../../../src/domain/protocols";

export class CreatePetsRepositoryStub
  implements CreatePetsRepositoryIntereface
{
  public async createPets(pets: PetEntityType[]): Promise<void> {
    return Promise.resolve();
  }
}
