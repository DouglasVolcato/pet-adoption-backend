import { PetSearcherInterface } from "../../../../src/data/protocols";
import { PetEntityType } from "../../../../src/domain/protocols";

export class PetSearcherStub implements PetSearcherInterface {
  public async searchPets(): Promise<PetEntityType[]> {
    return Promise.resolve([]);
  }
}
