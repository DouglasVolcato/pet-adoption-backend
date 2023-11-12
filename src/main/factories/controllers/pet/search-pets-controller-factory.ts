import { SearchPetsService } from "../../../../data/services";
import { PetMongoDBRepository } from "../../../../infra/databases";
import { SearchPetsController } from "../../../../presentation/controllers";

export function makeSearchPetsControllerFactory(): SearchPetsController {
  const getPetsRepository = new PetMongoDBRepository();
  const searchPetsService = new SearchPetsService(getPetsRepository);
  return new SearchPetsController(searchPetsService);
}
