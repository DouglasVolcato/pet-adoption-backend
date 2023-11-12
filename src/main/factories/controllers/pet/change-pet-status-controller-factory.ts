import { ChangePetStatusController } from "../../../../presentation/controllers";
import { PetMongoDBRepository } from "../../../../infra/databases";
import { ChangePetStatusService } from "../../../../data/services";

export function makeChangePetStatusControllerFactory(): ChangePetStatusController {
  const updatePetStatusRepository = new PetMongoDBRepository();
  const changePetStatusService = new ChangePetStatusService(
    updatePetStatusRepository
  );
  return new ChangePetStatusController(changePetStatusService);
}
