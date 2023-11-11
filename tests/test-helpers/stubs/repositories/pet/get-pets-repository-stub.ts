import { GetPetsRepositoryInterface } from "../../../../../src/data/protocols";
import { PetEntityType } from "../../../../../src/domain/protocols";
import { SearchPetsUseCase } from "../../../../../src/domain/protocols/usecases/search-pets-usecase";

export class GetPetsRepositoryStub implements GetPetsRepositoryInterface {
  public async getPets(
    searchParams: SearchPetsUseCase.Input
  ): Promise<PetEntityType[]> {
    return Promise.resolve([]);
  }
}
