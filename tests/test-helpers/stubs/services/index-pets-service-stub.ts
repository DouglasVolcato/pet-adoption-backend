import { IndexPetsUseCase } from "../../../../src/domain/protocols";

export class IndexPetsServiceStub implements IndexPetsUseCase.Service {
  public async execute(): IndexPetsUseCase.Output {
    return Promise.resolve();
  }
}
