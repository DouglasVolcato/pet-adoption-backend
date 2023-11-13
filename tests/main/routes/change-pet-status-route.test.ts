import { makePetEntity, makeUserEntity } from "../../test-helpers/mocks";
import { BcryptAdapter, JwtAdapter } from "../../../src/infra/adapters";
import { ExpressAdapter } from "../../../src/main/adapters";
import { FakeData } from "../../test-helpers/fake-data";
import { PetRoutes } from "../../../src/main/routes";
import { EnvVars } from "../../../src/main/config";
import { Express } from "express";
import request from "supertest";
import {
  InvalidFieldError,
  RequiredFieldError,
  UnauthorizedError,
} from "../../../src/presentation/helpers";
import {
  MongoDBConnector,
  PetMongoDbModel,
  UserMongoDbModel,
} from "../../../src/infra/databases";
import {
  PetStatusEnum,
  UserEntityType,
  PetEntityType,
} from "../../../src/domain/protocols";

const makeValidPet = async (
  status = PetStatusEnum.FREE
): Promise<PetEntityType> => {
  const pet = { ...makePetEntity(), status };
  await new PetMongoDbModel(pet).save();
  return pet;
};

const makeAuthUser = async (
  admin = true
): Promise<{
  user: UserEntityType;
  token: string;
}> => {
  const user = { ...makeUserEntity(), admin: true };
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

describe("Change pet status route", () => {
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

  describe(`PUT ${route}`, () => {
    test("Should return the updated pet", async () => {
      const pet = await makeValidPet(PetStatusEnum.FREE);
      const { token } = await makeAuthUser();
      const requestBody = {
        petId: pet.id,
        newStatus: PetStatusEnum.ADOPTED,
      };
      const response = await request(app)
        .put(route)
        .set("authorization", `Bearer ${token}`)
        .send(requestBody);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ ...pet, status: PetStatusEnum.ADOPTED });
    });

    test("Should return bad request if petId was not given", async () => {
      const { token } = await makeAuthUser();
      const requestBody = {
        newStatus: PetStatusEnum.ADOPTED,
      };
      const response = await request(app)
        .put(route)
        .set("authorization", `Bearer ${token}`)
        .send(requestBody);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(new RequiredFieldError("petId").message);
    });

    test("Should return bad request if newStatus was not given", async () => {
      const pet = await makeValidPet(PetStatusEnum.FREE);
      const { token } = await makeAuthUser();
      const requestBody = {
        petId: pet.id,
      };
      const response = await request(app)
        .put(route)
        .set("authorization", `Bearer ${token}`)
        .send(requestBody);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(
        new RequiredFieldError("newStatus").message
      );
    });

    test("Should return bad request if petId is not valid", async () => {
      const { token } = await makeAuthUser();
      const requestBody = {
        petId: FakeData.id(),
        newStatus: PetStatusEnum.ADOPTED,
      };
      const response = await request(app)
        .put(route)
        .set("authorization", `Bearer ${token}`)
        .send(requestBody);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(new InvalidFieldError("id").message);
    });

    test("Should return 401 if token is in invalid format", async () => {
      const { token } = await makeAuthUser();
      const response = await request(app)
        .put(route)
        .set("authorization", `${token}`)
        .send();

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toEqual(new UnauthorizedError().message);
    });

    test("Should return 401 if token is invalid", async () => {
      const response = await request(app)
        .put(route)
        .set("authorization", `Bearer ${FakeData.word()}`)
        .send();

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toEqual(new UnauthorizedError().message);
    });
  });
});
