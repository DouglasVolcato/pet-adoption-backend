import { SearchPetsUseCase } from "../../../../src/domain/protocols";

export class SearchPetsServiceStub implements SearchPetsUseCase.Service {
  public async execute(
    input: SearchPetsUseCase.Input
  ): SearchPetsUseCase.Output {
    return Promise.resolve([]);
  }
}
