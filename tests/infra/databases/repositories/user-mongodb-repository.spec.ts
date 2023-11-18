import { makeUserEntity } from "../../../test-helpers/mocks";
import mongoose from "mongoose";
import {
  MongoDBConnectorSingleton,
  UserMongoDBRepository,
  UserMongoDbModel,
} from "../../../../src/infra/databases";

mongoose.Promise = global.Promise;
const databaseConnector = MongoDBConnectorSingleton.getInstance();

type SutTypes = {
  sut: UserMongoDBRepository;
};

const makeSut = (): SutTypes => {
  const sut = new UserMongoDBRepository();
  return { sut };
};

describe("UserMongoDBRepository", () => {
  beforeAll(async () => {
    await databaseConnector.connect(process.env.MONGO_URL || "");
  });

  afterAll(async () => {
    await databaseConnector.disconnect();
  });

  afterEach(async () => {
    await UserMongoDbModel.deleteMany({});
  });

  describe("create", () => {
    it("Should store the new user in the database", async () => {
      const { sut } = makeSut();
      const userEntity = makeUserEntity();
      await sut.create(userEntity);
      const foundUser = await UserMongoDbModel.findOne({
        id: userEntity.id,
      }).exec();

      expect(foundUser.id).toEqual(userEntity.id);
      expect(foundUser.name).toEqual(userEntity.name);
      expect(foundUser.email).toEqual(userEntity.email);
      expect(foundUser.password).toEqual(userEntity.password);
    });

    it("Should return the created user", async () => {
      const { sut } = makeSut();
      const userEntity = makeUserEntity();
      const createdUser = await sut.create(userEntity);

      expect(createdUser).toEqual(userEntity);
    });

    it("Should throw if mongoose throws", async () => {
      const { sut } = makeSut();
      jest
        .spyOn(UserMongoDbModel.prototype, "save")
        .mockImplementationOnce(() => {
          throw new Error();
        });

      await expect(() => sut.create(makeUserEntity())).rejects.toThrow();
    });
  });

  describe("getByEmail", () => {
    it("Should return a user", async () => {
      const { sut } = makeSut();
      const userEntity = makeUserEntity();
      await sut.create(userEntity);
      const foundUser = await sut.getByEmail(userEntity.email);

      expect(foundUser?.id).toBeDefined();
      expect(foundUser?.name).toBe(userEntity.name);
      expect(foundUser?.email).toBe(userEntity.email);
      expect(foundUser?.password).toBe(userEntity.password);
    });

    it("Should return null if user was not found", async () => {
      const { sut } = makeSut();
      const foundUser = await sut.getByEmail(makeUserEntity().email);

      expect(foundUser).toBeNull();
    });

    it("Should throw if mongoose throws", async () => {
      const { sut } = makeSut();
      jest.spyOn(UserMongoDbModel, "findOne").mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(
        async () => await sut.getByEmail(makeUserEntity().email)
      ).rejects.toThrow();
    });
  });

  describe("getById", () => {
    it("Should return a user", async () => {
      const { sut } = makeSut();
      const userEntity = makeUserEntity();
      await sut.create(userEntity);
      const foundUser = await sut.getById(userEntity.id);

      expect(foundUser?.id).toBeDefined();
      expect(foundUser?.name).toBe(userEntity.name);
      expect(foundUser?.email).toBe(userEntity.email);
      expect(foundUser?.password).toBe(userEntity.password);
    });

    it("Should return null if user was not found", async () => {
      const { sut } = makeSut();
      const foundUser = await sut.getById(makeUserEntity().id);

      expect(foundUser).toBeNull();
    });

    it("Should throw if mongoose throws", async () => {
      const { sut } = makeSut();
      jest.spyOn(UserMongoDbModel, "findOne").mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(
        async () => await sut.getById(makeUserEntity().id)
      ).rejects.toThrow();
    });
  });
});
