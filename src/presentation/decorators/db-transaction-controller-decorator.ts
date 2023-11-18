import { DatabaseConnectorInterface } from "../protocols";
import {
  ControllerInterface,
  ControllerOutputType,
} from "../../main/protocols";

export class DbTransactionControllerDecorator implements ControllerInterface {
  private readonly controller: ControllerInterface;
  private readonly databaseConnector: DatabaseConnectorInterface;

  public constructor(
    controller: ControllerInterface,
    databaseConnector: DatabaseConnectorInterface
  ) {
    this.controller = controller;
    this.databaseConnector = databaseConnector;
  }

  public async execute(request: any): Promise<ControllerOutputType<any>> {
    await this.databaseConnector.startTransaction();
    const output = await this.controller.execute(request);
    if (output.statusCode === 500) {
      await this.databaseConnector.rollbackTransaction();
    } else {
      await this.databaseConnector.commitTransaction();
    }
    return output;
  }
}
