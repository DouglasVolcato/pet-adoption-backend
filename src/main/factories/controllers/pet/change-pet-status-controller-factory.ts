import { ChangePetStatusController } from "../../../../presentation/controllers";
import { makeDbTransactionControllerDecoratorFactory } from "../..";
import { PetMongoDBRepository } from "../../../../infra/databases";
import { ChangePetStatusService } from "../../../../data/services";
import { ControllerInterface } from "../../../protocols";

export function makeChangePetStatusControllerFactory(): ControllerInterface {
  const updatePetStatusRepository = new PetMongoDBRepository();
  const changePetStatusService = new ChangePetStatusService(
    updatePetStatusRepository
  );
  const controller = new ChangePetStatusController(changePetStatusService);
  return makeDbTransactionControllerDecoratorFactory(controller);
}
