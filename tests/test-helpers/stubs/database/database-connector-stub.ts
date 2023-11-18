import { DatabaseConnectorInterface } from "../../../../src/presentation/protocols";

export class DatabaseConnectorStub implements DatabaseConnectorInterface {
  public async connect(databaseUrl: string): Promise<void> {
    return await Promise.resolve();
  }
  public async disconnect(): Promise<void> {
    return await Promise.resolve();
  }
  public async startTransaction(): Promise<void> {
    return await Promise.resolve();
  }
  public async commitTransaction(): Promise<void> {
    return await Promise.resolve();
  }
  public async rollbackTransaction(): Promise<void> {
    return await Promise.resolve();
  }
}
