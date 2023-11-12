import { ExpressAdapter } from "../../../src/main/adapters";
import { makeUserEntity } from "../../test-helpers/mocks";
import { FakeData } from "../../test-helpers/fake-data";
import { UserRoutes } from "../../../src/main/routes";
import { EnvVars } from "../../../src/main/config";
import { Express } from "express";
import request from "supertest";
import {
  InvalidFieldError,
  RequiredFieldError,
} from "../../../src/presentation/helpers";
import {
  MongoDBConnector,
  UserMongoDbModel,
} from "../../../src/infra/databases";

const route = "/user";
const databaseConnector = new MongoDBConnector();
let frameworkAdapter: ExpressAdapter;
let app: Express;

describe("Create user route", () => {
  beforeAll(async () => {
    frameworkAdapter = new ExpressAdapter(UserRoutes, Number(EnvVars.PORT()));
    app = (frameworkAdapter as any).app;
    await databaseConnector.connect(process.env.MONGO_URL || "");
    await frameworkAdapter.start();
  });

  afterAll(async () => {
    await frameworkAdapter.stop();
    await databaseConnector.disconnect();
  });

  beforeEach(async () => {
    await UserMongoDbModel.deleteMany({});
  });

  describe(`POST ${route}`, () => {
    test("Should return 200 with the created user", async () => {
      const requestBody = makeUserEntity();
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.password).toBeDefined();
      expect(response.body.name).toBe(requestBody.name);
      expect(response.body.email).toBe(requestBody.email);
    });

    test("Should return 400 if does not receive name", async () => {
      const requestBody = makeUserEntity();
      delete (requestBody as any).name;
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(new RequiredFieldError("name").message);
    });

    test("Should return 400 if does not receive password", async () => {
      const requestBody = makeUserEntity();
      delete (requestBody as any).password;
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(
        new RequiredFieldError("password").message
      );
    });

    test("Should return 400 if does not receive email", async () => {
      const requestBody = makeUserEntity();
      delete (requestBody as any).email;
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(new RequiredFieldError("email").message);
    });

    test("Should return 400 if email is not valid", async () => {
      const requestBody = { ...makeUserEntity(), email: FakeData.word() };
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(new InvalidFieldError("email").message);
    });

    test("Should return 400 email is already registered", async () => {
      const requestBody = makeUserEntity();
      await new UserMongoDbModel(requestBody).save();
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(new InvalidFieldError("email").message);
    });
  });
});
