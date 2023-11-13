import { BcryptAdapter, JwtAdapter } from "../../../src/infra/adapters";
import { UnauthorizedError } from "../../../src/presentation/helpers";
import { UserEntityType } from "../../../src/domain/protocols";
import { ExpressAdapter } from "../../../src/main/adapters";
import { makeUserEntity } from "../../test-helpers/mocks";
import { FakeData } from "../../test-helpers/fake-data";
import { PetRoutes } from "../../../src/main/routes";
import { EnvVars } from "../../../src/main/config";
import { Express } from "express";
import request from "supertest";
import {
  MongoDBConnector,
  UserMongoDbModel,
} from "../../../src/infra/databases";

const makeAuthUser = async (): Promise<{
  user: UserEntityType;
  token: string;
}> => {
  const user = makeUserEntity();
  await saveUserInDatabase(user);
  const token = getAuthToken(user);
  return { user, token };
};

const getAuthToken = (user: UserEntityType): string => {
  return new JwtAdapter().generateToken({ id: user.id }, EnvVars.SECRET());
};

const saveUserInDatabase = async (user: UserEntityType): Promise<void> => {
  await new UserMongoDbModel({
    ...user,
    password: new BcryptAdapter(10).hash(user.password),
  }).save();
};

const route = "/pet";
const databaseConnector = new MongoDBConnector();
let frameworkAdapter: ExpressAdapter;
let app: Express;

describe("Index pets route", () => {
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
    await UserMongoDbModel.deleteMany({});
  });

  describe(`POST ${route}`, () => {
    test("Should return status code 200", async () => {
      const { token } = await makeAuthUser();
      const response = await request(app)
        .post(route)
        .set("authorization", `Bearer ${token}`)
        .send();

      expect(response.statusCode).toBe(200);
    });

    test("Should return 400 if token is in invalid format", async () => {
      const { token } = await makeAuthUser();
      const response = await request(app)
        .post(route)
        .set("authorization", `${token}`)
        .send();

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toEqual(new UnauthorizedError().message);
    });

    test("Should return 400 if token is invalid", async () => {
      const response = await request(app)
        .post(route)
        .set("authorization", `Bearer ${FakeData.word()}`)
        .send();

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toEqual(new UnauthorizedError().message);
    });
  });
});
