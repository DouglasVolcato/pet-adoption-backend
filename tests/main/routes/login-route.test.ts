import { UserEntityType } from "../../../src/domain/protocols";
import { ExpressAdapter } from "../../../src/main/adapters";
import { makeUserEntity } from "../../test-helpers/mocks";
import { BcryptAdapter } from "../../../src/infra/adapters";
import { FakeData } from "../../test-helpers/fake-data";
import { LoginRoutes } from "../../../src/main/routes";
import { EnvVars } from "../../../src/main/config";
import { Express } from "express";
import request from "supertest";
import {
  MongoDBConnector,
  UserMongoDbModel,
} from "../../../src/infra/databases";
import {
  InvalidFieldError,
  RequiredFieldError,
} from "../../../src/presentation/helpers";

const saveUserInDatabase = async (user: UserEntityType): Promise<void> => {
  await new UserMongoDbModel({
    ...user,
    password: new BcryptAdapter(10).hash(user.password),
  }).save();
};

const route = "/login";
const databaseConnector = new MongoDBConnector();
let frameworkAdapter: ExpressAdapter;
let app: Express;

describe("Login route", () => {
  beforeAll(async () => {
    frameworkAdapter = new ExpressAdapter(LoginRoutes, Number(EnvVars.PORT()));
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
    test("Should return 200 with the logged user and token", async () => {
      const userData = makeUserEntity();
      const requestBody = {
        email: userData.email,
        password: userData.password,
      };
      await saveUserInDatabase(userData);
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.password).not.toBeDefined();
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.email).toBe(userData.email);
    });

    test("Should return 400 if does not receive password", async () => {
      const requestBody = {
        email: FakeData.email(),
      };
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(
        new RequiredFieldError("password").message
      );
    });

    test("Should return 400 if does not receive email", async () => {
      const requestBody = { password: FakeData.word() };
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(new RequiredFieldError("email").message);
    });

    test("Should return 400 if email is not registered", async () => {
      const requestBody = {
        email: FakeData.email(),
        password: FakeData.word(),
      };
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(new InvalidFieldError("email").message);
    });

    test("Should return 400 if password is wrong", async () => {
      const userData = makeUserEntity();
      const requestBody = {
        email: userData.email,
        password: "invalid_password",
      };
      await saveUserInDatabase(userData);
      const response = await request(app).post(route).send(requestBody);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(
        new InvalidFieldError("password").message
      );
    });
  });
});
