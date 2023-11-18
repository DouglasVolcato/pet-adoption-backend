import mongoose from "mongoose";
import { DatabaseConnectorInterface } from "../../../../presentation/protocols";

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
    } else {
      throw new Error("Transaction already in progress.");
    }
  }

  public async commitTransaction(): Promise<void> {
    if (this.session) {
      await this.session.commitTransaction();
      this.session.endSession();
      this.session = undefined;
    } else {
      throw new Error("No active transaction to commit.");
    }
  }

  public async rollbackTransaction(): Promise<void> {
    if (this.session) {
      await this.session.abortTransaction();
      this.session.endSession();
      this.session = undefined;
    } else {
      throw new Error("No active transaction to rollback.");
    }
  }
}
