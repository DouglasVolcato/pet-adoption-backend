import { SearchPetsUseCase } from "../../domain/protocols";
import { GetPetsRepositoryInterface } from "../protocols";

export class SearchPetsService implements SearchPetsUseCase.Service {
  private readonly getPetsRepository: GetPetsRepositoryInterface;

  public constructor(getPetsRepository: GetPetsRepositoryInterface) {
    this.getPetsRepository = getPetsRepository;
  }

  public async execute(
    input: SearchPetsUseCase.Input
  ): SearchPetsUseCase.Output {
    return await this.getPetsRepository.getPets(input);
  }
}
