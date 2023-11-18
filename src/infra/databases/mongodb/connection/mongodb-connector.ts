import { DatabaseConnectorInterface } from "../../../../presentation/protocols";
import mongoose from "mongoose";

export class MongoDBConnectorSingleton implements DatabaseConnectorInterface {
  private session: mongoose.ClientSession | undefined;

  public static getInstance(): DatabaseConnectorInterface {
    return new this();
  }

  public async connect(databaseUrl: string): Promise<void> {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(databaseUrl);
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.connection.close();
  }

  public async startTransaction(): Promise<void> {
    if (!this.session) {
      this.session = await mongoose.startSession();
      this.session.startTransaction();
    }
  }

  public async commitTransaction(): Promise<void> {
    if (this.session) {
      await this.session.commitTransaction();
      this.session.endSession();
      this.session = undefined;
    }
  }

  public async rollbackTransaction(): Promise<void> {
    if (this.session) {
      await this.session.abortTransaction();
      this.session.endSession();
      this.session = undefined;
    }
  }
}
