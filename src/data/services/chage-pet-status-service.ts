import { ChangePetStatusUseCase } from "../../domain/protocols";
import { InvalidFieldError } from "../../presentation/helpers";
import { UpdatePetStatusRepositoryIntereface } from "../protocols";

export class ChangePetStatusService implements ChangePetStatusUseCase.Service {
  private readonly updatePetStatusRepository: UpdatePetStatusRepositoryIntereface;

  public constructor(
    updatePetStatusRepository: UpdatePetStatusRepositoryIntereface
  ) {
    this.updatePetStatusRepository = updatePetStatusRepository;
  }

  public async execute(
    input: ChangePetStatusUseCase.Input
  ): ChangePetStatusUseCase.Output {
    const updatedPet = await this.updatePetStatusRepository.updateStatus(
      input.petId,
      input.newStatus
    );
    if (!updatedPet) return new InvalidFieldError("id");
    return updatedPet;
  }
}
