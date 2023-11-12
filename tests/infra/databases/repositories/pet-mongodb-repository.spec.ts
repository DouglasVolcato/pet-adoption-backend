import { PetSearchParamsType } from "../../../../src/data/protocols";
import { makePetEntity } from "../../../test-helpers/mocks";
import { FakeData } from "../../../test-helpers/fake-data";
import mongoose from "mongoose";
import {
  PetCategoryEnum,
  PetStatusEnum,
} from "../../../../src/domain/protocols";
import {
  MongoDBConnector,
  PetMongoDBRepository,
  PetMongoDbModel,
} from "../../../../src/infra/databases";

mongoose.Promise = global.Promise;
const databaseConnector = new MongoDBConnector();

type SutTypes = {
  sut: PetMongoDBRepository;
};

const makeSut = (): SutTypes => {
  const sut = new PetMongoDBRepository();
  return { sut };
};

describe("PetMongoDBRepository", () => {
  beforeAll(async () => {
    await databaseConnector.connect(process.env.MONGO_URL || "");
  });

  afterAll(async () => {
    await databaseConnector.disconnect();
  });

  afterEach(async () => {
    await PetMongoDbModel.deleteMany({});
  });

  describe("createPets", () => {
    it("Should store the new pet in the database", async () => {
      const { sut } = makeSut();
      const petEntity1 = makePetEntity();
      const petEntity2 = makePetEntity();
      await sut.createPets([petEntity1, petEntity2]);
      const foundPet1 = await PetMongoDbModel.findOne({
        id: petEntity1.id,
      }).exec();
      const foundPet2 = await PetMongoDbModel.findOne({
        id: petEntity2.id,
      }).exec();

      expect(foundPet1.id).toEqual(petEntity1.id);
      expect(foundPet1.name).toEqual(petEntity1.name);
      expect(foundPet1.description).toEqual(petEntity1.description);
      expect(foundPet1.image).toEqual(petEntity1.image);
      expect(foundPet1.createdAt).toEqual(petEntity1.createdAt);
      expect(foundPet1.category).toEqual(petEntity1.category);
      expect(foundPet1.status).toEqual(petEntity1.status);
      expect(foundPet2.id).toEqual(petEntity2.id);
      expect(foundPet2.name).toEqual(petEntity2.name);
      expect(foundPet2.description).toEqual(petEntity2.description);
      expect(foundPet2.image).toEqual(petEntity2.image);
      expect(foundPet2.createdAt).toEqual(petEntity2.createdAt);
      expect(foundPet2.category).toEqual(petEntity2.category);
      expect(foundPet2.status).toEqual(petEntity2.status);
    });

    it("Should return undefined", async () => {
      const { sut } = makeSut();
      const petEntity = makePetEntity();
      const createdPet = await sut.createPets([petEntity]);

      expect(createdPet).toBeUndefined();
    });

    it("Should throw if mongoose throws", async () => {
      const { sut } = makeSut();
      jest.spyOn(PetMongoDbModel, "insertMany").mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(
        async () => await sut.createPets([makePetEntity()])
      ).rejects.toThrow();
    });
  });

  describe("updateStatus", () => {
    it("Should update the status of the existing pet in the database", async () => {
      const { sut } = makeSut();
      const petEntity = makePetEntity();
      petEntity.status = PetStatusEnum.FREE;
      await sut.createPets([petEntity]);
      const newStatus: PetStatusEnum = PetStatusEnum.ADOPTED;
      const updatedPet = await sut.updateStatus(petEntity.id, newStatus);

      expect(updatedPet?.id).toEqual(petEntity.id);
      expect(updatedPet?.status).toEqual(newStatus);
    });

    it("Should return null if the pet is not found", async () => {
      const { sut } = makeSut();
      const invalidId = FakeData.id();
      const newStatus: PetStatusEnum = PetStatusEnum.ADOPTED;
      const output = await sut.updateStatus(invalidId, newStatus);

      expect(output).toBeNull();
    });

    it("Should throw if mongoose throws", async () => {
      const { sut } = makeSut();
      jest
        .spyOn(PetMongoDbModel, "findOneAndUpdate")
        .mockImplementationOnce(() => {
          throw new Error();
        });

      await expect(
        async () => await sut.updateStatus(FakeData.id(), PetStatusEnum.ADOPTED)
      ).rejects.toThrow();
    });
  });

  describe("deleteAllPets", () => {
    it("Should delete all pets from the database", async () => {
      const { sut } = makeSut();
      const petEntity1 = makePetEntity();
      const petEntity2 = makePetEntity();
      await sut.createPets([petEntity1, petEntity2]);
      await sut.deleteAllPets();

      const pets = await PetMongoDbModel.find({});
      expect(pets).toHaveLength(0);
    });

    it("Should throw if mongoose throws", async () => {
      const { sut } = makeSut();
      jest.spyOn(PetMongoDbModel, "deleteMany").mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(async () => await sut.deleteAllPets()).rejects.toThrow();
    });
  });

  describe("getPets", () => {
    it("Should return all pets when no search parameters are provided", async () => {
      const { sut } = makeSut();
      await sut.createPets([
        makePetEntity(),
        makePetEntity(),
        makePetEntity(),
        makePetEntity(),
        makePetEntity(),
        makePetEntity(),
      ]);
      const searchParams: PetSearchParamsType = {
        limit: 3,
        offset: 0,
      };
      const pets = await sut.getPets(searchParams);

      expect(pets).toHaveLength(3);
    });

    it("Should return pets matching the provided term in name or description", async () => {
      const { sut } = makeSut();
      await sut.createPets([
        {
          ...makePetEntity(),
          name: "Cat",
          description: "Cute animal",
        },
        {
          ...makePetEntity(),
          name: "Dog",
          description: "Friendly dog",
        },
        {
          ...makePetEntity(),
          name: "Any pet",
          description: "Cute cat",
        },
        {
          ...makePetEntity(),
          name: "Any pet",
          description: "Cute dog",
        },
      ]);
      const searchParams: PetSearchParamsType = {
        limit: 10,
        offset: 0,
        term: "Cat",
      };
      const pets = await sut.getPets(searchParams);

      expect(pets).toHaveLength(2);
    });

    it("Should return pets matching the provided category", async () => {
      const { sut } = makeSut();
      const petEntity1 = { ...makePetEntity(), category: PetCategoryEnum.CATS };
      const petEntity2 = { ...makePetEntity(), category: PetCategoryEnum.DOGS };
      await sut.createPets([petEntity1, petEntity2]);
      const searchParams: PetSearchParamsType = {
        limit: 10,
        offset: 0,
        category: PetCategoryEnum.CATS,
      };
      const pets = await sut.getPets(searchParams);

      expect(pets).toHaveLength(1);
      expect(pets[0].category).toEqual(PetCategoryEnum.CATS);
    });

    it("Should return pets matching the provided status", async () => {
      const { sut } = makeSut();
      const petEntity1 = { ...makePetEntity(), status: PetStatusEnum.FREE };
      const petEntity2 = { ...makePetEntity(), status: PetStatusEnum.ADOPTED };
      await sut.createPets([petEntity1, petEntity2]);
      const searchParams: PetSearchParamsType = {
        limit: 10,
        offset: 0,
        status: PetStatusEnum.FREE,
      };
      const pets = await sut.getPets(searchParams);

      expect(pets).toHaveLength(1);
      expect(pets[0].status).toEqual(PetStatusEnum.FREE);
    });

    it("Should return pets matching the provided createdAt date", async () => {
      const { sut } = makeSut();
      const petEntity1 = makePetEntity();
      const petEntity2 = makePetEntity();
      await sut.createPets([petEntity1, petEntity2]);
      const searchParams: PetSearchParamsType = {
        limit: 10,
        offset: 0,
        createdAt: petEntity1.createdAt,
      };
      const pets = await sut.getPets(searchParams);

      expect(pets).toHaveLength(1);
      expect(pets[0].createdAt).toEqual(petEntity1.createdAt);
    });

    it("Should return an empty array if no pets match the search criteria", async () => {
      const { sut } = makeSut();
      const petEntity = makePetEntity();
      await sut.createPets([petEntity]);
      const searchParams: PetSearchParamsType = {
        limit: 10,
        offset: 0,
        term: "Nonexistent",
        category: PetCategoryEnum.DOGS,
        status: PetStatusEnum.ADOPTED,
        createdAt: "2022-01-01",
      };
      const pets = await sut.getPets(searchParams);

      expect(pets).toHaveLength(0);
    });

    it("Should throw if mongoose throws", async () => {
      const { sut } = makeSut();
      jest.spyOn(PetMongoDbModel, "find").mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(
        async () => await sut.getPets({ limit: 10, offset: 10 })
      ).rejects.toThrow();
    });
  });
});
