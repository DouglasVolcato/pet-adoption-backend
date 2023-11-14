import { IndexPetsService } from "../../../src/data/services";
import { makePetEntity } from "../../test-helpers/mocks";
import { FakeData } from "../../test-helpers/fake-data";
import {
  CreatePetsRepositoryIntereface,
  DeleteAllPetsRepositoryIntereface,
  IdGeneratorInterface,
  PetSearcherInterface,
} from "../../../src/data/protocols";
import {
  CreatePetsRepositoryStub,
  DeleteAllPetsRepositoryStub,
  IdGeneratorStub,
  PetSearcherStub,
} from "../../test-helpers/stubs";

type SutTypes = {
  sut: IndexPetsService;
  deleteAllPetsRepository: DeleteAllPetsRepositoryIntereface;
  petSearcher: PetSearcherInterface;
  createPetsRepository: CreatePetsRepositoryIntereface;
  idGenerator: IdGeneratorInterface;
};

const makeSut = (): SutTypes => {
  const deleteAllPetsRepository = new DeleteAllPetsRepositoryStub();
  const petSearcher = new PetSearcherStub();
  const createPetsRepository = new CreatePetsRepositoryStub();
  const idGenerator = new IdGeneratorStub();
  const sut = new IndexPetsService(
    deleteAllPetsRepository,
    petSearcher,
    createPetsRepository,
    idGenerator
  );
  return {
    deleteAllPetsRepository,
    petSearcher,
    createPetsRepository,
    idGenerator,
    sut,
  };
};

describe("indexPetsService", () => {
  test("Should call DeleteAllPetsRepository", async () => {
    const { sut, deleteAllPetsRepository, petSearcher } = makeSut();
    const deleteAllPetsRepositorySpy = jest.spyOn(
      deleteAllPetsRepository,
      "deleteAllPets"
    );
    jest.spyOn(petSearcher, "requestFinished").mockReturnValueOnce(true);
    await sut.execute();

    expect(deleteAllPetsRepositorySpy).toHaveBeenCalledTimes(1);
  });

  test("Should throw if DeleteAllPetsRepository throws", async () => {
    const { sut, deleteAllPetsRepository } = makeSut();
    jest
      .spyOn(deleteAllPetsRepository, "deleteAllPets")
      .mockImplementationOnce(() => {
        throw new Error();
      });

    expect(async () => await sut.execute()).rejects.toThrow();
  });

  test("Should call PetSearcher", async () => {
    const { sut, petSearcher } = makeSut();
    const petSearcherSpy = jest.spyOn(petSearcher, "request");
    jest
      .spyOn(petSearcher, "requestFinished")
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    await sut.execute();

    expect(petSearcherSpy).toHaveBeenCalledTimes(1);
  });

  test("Should stop calling PetSearcher when the request has finished", async () => {
    const { sut, petSearcher } = makeSut();
    const petSearcherSpy = jest.spyOn(petSearcher, "request");
    jest
      .spyOn(petSearcher, "requestFinished")
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    await sut.execute();

    expect(petSearcherSpy).toHaveBeenCalledTimes(3);
  });

  test("Should throw if PetSearcher throws", async () => {
    const { sut, petSearcher } = makeSut();
    jest.spyOn(petSearcher, "request").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.execute()).rejects.toThrow();
  });

  test("Should call CreatePetsRepository with correct values", async () => {
    const { sut, petSearcher, createPetsRepository, idGenerator } = makeSut();
    const petId = FakeData.id();
    const creationData = new Date().toISOString().split("T")[0];
    const foundPets = [makePetEntity(), makePetEntity()];
    const createPetsRepositorySpy = jest.spyOn(
      createPetsRepository,
      "createPets"
    );
    jest
      .spyOn(petSearcher, "request")
      .mockReturnValueOnce(Promise.resolve(foundPets));
    jest.spyOn(idGenerator, "generateId").mockReturnValueOnce(petId);
    jest.spyOn(idGenerator, "generateId").mockReturnValueOnce(petId);
    jest
      .spyOn(petSearcher, "requestFinished")
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    await sut.execute();

    expect(createPetsRepositorySpy).toHaveBeenCalledTimes(1);
    expect(createPetsRepositorySpy).toHaveBeenCalledWith(
      foundPets.map((obj) => ({ ...obj, id: petId, createdAt: creationData }))
    );
  });

  test("Should throw if CreatePetsRepository throws", async () => {
    const { sut, createPetsRepository } = makeSut();
    jest
      .spyOn(createPetsRepository, "createPets")
      .mockImplementationOnce(() => {
        throw new Error();
      });

    expect(async () => await sut.execute()).rejects.toThrow();
  });

  test("Should throw if IdGenerator throws", async () => {
    const { sut, idGenerator } = makeSut();
    jest.spyOn(idGenerator, "generateId").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.execute()).rejects.toThrow();
  });
});
