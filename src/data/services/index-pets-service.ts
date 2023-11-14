import { IndexPetsUseCase } from "../../domain/protocols";
import {
  CreatePetsRepositoryIntereface,
  DeleteAllPetsRepositoryIntereface,
  IdGeneratorInterface,
  PetSearcherInterface,
} from "../protocols";

export class IndexPetsService implements IndexPetsUseCase.Service {
  private readonly deleteAllPetsRepository: DeleteAllPetsRepositoryIntereface;
  private readonly petSearcher: PetSearcherInterface;
  private readonly createPetsRepository: CreatePetsRepositoryIntereface;
  private readonly idGenerator: IdGeneratorInterface;

  public constructor(
    deleteAllPetsRepository: DeleteAllPetsRepositoryIntereface,
    petSearcher: PetSearcherInterface,
    createPetsRepository: CreatePetsRepositoryIntereface,
    idGenerator: IdGeneratorInterface
  ) {
    this.deleteAllPetsRepository = deleteAllPetsRepository;
    this.petSearcher = petSearcher;
    this.createPetsRepository = createPetsRepository;
    this.idGenerator = idGenerator;
  }

  public async execute(): IndexPetsUseCase.Output {
    await this.deleteAllPetsRepository.deleteAllPets();
    while (!this.petSearcher.requestFinished()) {
      const pets = await this.petSearcher.request();
      const petsWithIds = pets.map((pet) => ({
        ...pet,
        id: this.idGenerator.generateId(),
        createdAt: new Date().toISOString().split("T")[0],
      }));
      this.idGenerator.generateId();
      await this.createPetsRepository.createPets(petsWithIds);
    }
  }
}
