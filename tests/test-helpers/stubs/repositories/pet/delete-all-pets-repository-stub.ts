import { DeleteAllPetsRepositoryIntereface } from "../../../../../src/data/protocols";

export class DeleteAllPetsRepositoryStub
  implements DeleteAllPetsRepositoryIntereface
{
  public async deleteAllPets(): Promise<void> {
    return;
  }
}
