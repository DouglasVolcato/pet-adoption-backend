import { GetPetsRepositoryInterface } from "../../../src/data/protocols";
import { SearchPetsService } from "../../../src/data/services";
import { FakeData } from "../../test-helpers/fake-data";
import { makePetEntity } from "../../test-helpers/mocks";
import { GetPetsRepositoryStub } from "../../test-helpers/stubs";
import { SearchPetsUseCase } from "../../../src/domain/protocols";

const makePetSearchParama = (): SearchPetsUseCase.Input => ({
  limit: FakeData.numberInteger(),
  offset: FakeData.numberInteger(),
});

type SutTypes = {
  sut: SearchPetsService;
  getPetsRepository: GetPetsRepositoryInterface;
};

const makeSut = (): SutTypes => {
  const getPetsRepository = new GetPetsRepositoryStub();
  const sut = new SearchPetsService(getPetsRepository);
  return { getPetsRepository, sut };
};

describe("SearchPetsService", () => {
  test("Should call GetPetsRepository with correct values", async () => {
    const { sut, getPetsRepository } = makeSut();
    const getPetsRepositorySpy = jest.spyOn(getPetsRepository, "getPets");
    const searchParams = makePetSearchParama();
    await sut.execute(searchParams);

    expect(getPetsRepositorySpy).toHaveBeenCalledTimes(1);
    expect(getPetsRepositorySpy).toHaveBeenCalledWith(searchParams);
  });

  test("Should return the found pets", async () => {
    const { sut, getPetsRepository } = makeSut();
    const foundPets = [makePetEntity(), makePetEntity()];
    jest
      .spyOn(getPetsRepository, "getPets")
      .mockReturnValueOnce(Promise.resolve(foundPets));
    const output = await sut.execute(makePetSearchParama());

    expect(output).toEqual(foundPets);
  });

  test("Should throw if GetPetsRepository throws", async () => {
    const { sut, getPetsRepository } = makeSut();
    jest.spyOn(getPetsRepository, "getPets").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(
      async () => await sut.execute(makePetSearchParama())
    ).rejects.toThrow();
  });
});
