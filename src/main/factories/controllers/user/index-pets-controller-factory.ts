import { CatsApiGateway, DogsApiGateway } from "../../../../apis/gateways";
import { PetSearchGatewayComposite } from "../../../../apis/composites";
import { IndexPetsController } from "../../../../presentation/controllers";
import { AxiosAdapter, UuidAdapter } from "../../../../infra/adapters";
import { PetMongoDBRepository } from "../../../../infra/databases";
import { IndexPetsService } from "../../../../data/services";

export function makeIndexPetsControllerFactory(): IndexPetsController {
  const deleteAllPetsRepository = new PetMongoDBRepository();
  const clientGetRequestSender = new AxiosAdapter();
  const catsApiGateway = new CatsApiGateway(clientGetRequestSender);
  const dogsApiGateway = new DogsApiGateway(clientGetRequestSender);
  const petSearcher = new PetSearchGatewayComposite([
    catsApiGateway,
    dogsApiGateway,
  ]);
  const createPetsRepository = new PetMongoDBRepository();
  const idGenerator = new UuidAdapter();
  const indexPetsService = new IndexPetsService(
    deleteAllPetsRepository,
    petSearcher,
    createPetsRepository,
    idGenerator
  );
  return new IndexPetsController(indexPetsService);
}
