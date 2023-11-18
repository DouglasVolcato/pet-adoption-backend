import { CatsApiGateway, DogsApiGateway } from "../../../../apis/gateways";
import { PetSearchGatewayComposite } from "../../../../apis/composites";
import { IndexPetsController } from "../../../../presentation/controllers";
import { makeDbTransactionControllerDecoratorFactory } from "../..";
import { AxiosAdapter, UuidAdapter } from "../../../../infra/adapters";
import { PetMongoDBRepository } from "../../../../infra/databases";
import { IndexPetsService } from "../../../../data/services";
import { ControllerInterface } from "../../../protocols";

export function makeIndexPetsControllerFactory(): ControllerInterface {
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
  const controller = new IndexPetsController(indexPetsService);
  return makeDbTransactionControllerDecoratorFactory(controller);
}
