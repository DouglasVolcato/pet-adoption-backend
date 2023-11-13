import { RequiredFieldError } from "../../../src/presentation/helpers";
import { PetEntityType } from "../../../src/domain/protocols";
import { ExpressAdapter } from "../../../src/main/adapters";
import { makePetEntity } from "../../test-helpers/mocks";
import { PetRoutes } from "../../../src/main/routes";
import { EnvVars } from "../../../src/main/config";
import { Express } from "express";
import request from "supertest";
import {
  MongoDBConnector,
  PetMongoDbModel,
  UserMongoDbModel,
} from "../../../src/infra/databases";

const savePetInDatabase = async (pet: PetEntityType): Promise<void> => {
  await new PetMongoDbModel(pet).save();
};

const route = "/pet";
const databaseConnector = new MongoDBConnector();
let frameworkAdapter: ExpressAdapter;
let app: Express;

describe("Search pets route", () => {
  beforeAll(async () => {
    frameworkAdapter = new ExpressAdapter(PetRoutes, Number(EnvVars.PORT()));
    app = (frameworkAdapter as any).app;
    await databaseConnector.connect(process.env.MONGO_URL || "");
    await frameworkAdapter.start();
  });

  afterAll(async () => {
    await frameworkAdapter.stop();
    await databaseConnector.disconnect();
  });

  beforeEach(async () => {
    await PetMongoDbModel.deleteMany({});
    await UserMongoDbModel.deleteMany({});
  });

  describe(`GET ${route}`, () => {
    test("Should return the found pets", async () => {
      const pet = makePetEntity();
      await savePetInDatabase(pet);
      const response = await request(app)
        .get(`${route}?limit=10&offset=0`)
        .send();

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([pet]);
    });

    test("Should return bad request if limit is not provided", async () => {
      await savePetInDatabase(makePetEntity());
      const response = await request(app).get(`${route}?offset=0`).send();

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(new RequiredFieldError("limit").message);
    });

    test("Should return bad request if offset is not provided", async () => {
      await savePetInDatabase(makePetEntity());
      const response = await request(app).get(`${route}?limit=10`).send();

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(
        new RequiredFieldError("offset").message
      );
    });
  });
});
