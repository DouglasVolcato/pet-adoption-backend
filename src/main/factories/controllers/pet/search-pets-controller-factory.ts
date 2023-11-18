import { SearchPetsController } from "../../../../presentation/controllers";
import { makeDbTransactionControllerDecoratorFactory } from "../..";
import { PetMongoDBRepository } from "../../../../infra/databases";
import { SearchPetsService } from "../../../../data/services";
import { ControllerInterface } from "../../../protocols";

export function makeSearchPetsControllerFactory(): ControllerInterface {
  const getPetsRepository = new PetMongoDBRepository();
  const searchPetsService = new SearchPetsService(getPetsRepository);
  const controller = new SearchPetsController(searchPetsService);
  return makeDbTransactionControllerDecoratorFactory(controller);
}
