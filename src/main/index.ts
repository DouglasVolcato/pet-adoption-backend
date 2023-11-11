import { MongoDBConnector } from "../infra/databases";
import { ExpressAdapter } from "./adapters";
import { RouteDtoType } from "./protocols";
import { EnvVars } from "./config";

const port = EnvVars.PORT();
const databaseUrl = EnvVars.MONGO_DB_URL();
const routes: RouteDtoType[] = [];
const express = new ExpressAdapter(routes, Number(port));
const databaseConnector = new MongoDBConnector();

databaseConnector.connect(databaseUrl).then(async () => {
  await express.start().then(() => {
    console.log(`Server is running on port ${port}`);
  });
});
