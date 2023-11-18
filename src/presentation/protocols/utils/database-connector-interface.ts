export interface DatabaseConnectorInterface {
  connect(databaseUrl: string): Promise<void>;
  disconnect(): Promise<void>;
  startTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
}
