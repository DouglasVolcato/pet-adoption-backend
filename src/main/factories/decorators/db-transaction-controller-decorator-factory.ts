import { MongoDBConnectorSingleton } from "../../../infra/databases";
import { DbTransactionControllerDecorator } from "../../../presentation/decorators";
import { ControllerInterface } from "../../protocols";

export function makeDbTransactionControllerDecoratorFactory(
  controller: ControllerInterface
): DbTransactionControllerDecorator {
  const databaseConnector = MongoDBConnectorSingleton.getInstance();
  return new DbTransactionControllerDecorator(controller, databaseConnector);
}
