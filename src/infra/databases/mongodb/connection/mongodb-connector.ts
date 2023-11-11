import mongoose from "mongoose";

export class MongoDBConnector {
  public async connect(databaseUrl: string): Promise<void> {
    await mongoose.connect(databaseUrl);
  }

  public async disconnect(): Promise<void> {
    await mongoose.connection.close();
  }
}
