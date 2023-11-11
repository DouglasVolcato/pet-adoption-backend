import { UpdatePetStatusRepositoryIntereface } from "../../../src/data/protocols";
import { ChangePetStatusService } from "../../../src/data/services";
import { PetStatusEnum } from "../../../src/domain/protocols";
import { InvalidFieldError } from "../../../src/presentation/helpers";
import { FakeData } from "../../test-helpers/fake-data";
import { makePetEntity } from "../../test-helpers/mocks";
import { UpdatePetStatusRepositoryStub } from "../../test-helpers/stubs";

type SutTypes = {
  sut: ChangePetStatusService;
  updatePetStatusRepository: UpdatePetStatusRepositoryIntereface;
};

const makeSut = (): SutTypes => {
  const updatePetStatusRepository = new UpdatePetStatusRepositoryStub();
  const sut = new ChangePetStatusService(updatePetStatusRepository);
  return { updatePetStatusRepository, sut };
};

describe("ChangePetStatusService", () => {
  test("Should call UpdatePetStatusRepository with correct values", async () => {
    const { sut, updatePetStatusRepository } = makeSut();
    const petId = FakeData.id();
    const newStatus = PetStatusEnum.ADOPTED;
    const updatePetStatusRepositorySpy = jest.spyOn(
      updatePetStatusRepository,
      "updateStatus"
    );
    await sut.execute({ petId, newStatus });

    expect(updatePetStatusRepositorySpy).toHaveBeenCalledTimes(1);
    expect(updatePetStatusRepositorySpy).toHaveBeenCalledWith(petId, newStatus);
  });

  test("Should return the updated pet", async () => {
    const { sut, updatePetStatusRepository } = makeSut();
    const petData = makePetEntity();
    jest
      .spyOn(updatePetStatusRepository, "updateStatus")
      .mockReturnValueOnce(Promise.resolve(petData));
    const output = await sut.execute({
      petId: FakeData.id(),
      newStatus: PetStatusEnum.ADOPTED,
    });

    expect(output).toEqual(petData);
  });

  test("Should return an error if UpdatePetStatusRepository returns null", async () => {
    const { sut, updatePetStatusRepository } = makeSut();
    jest
      .spyOn(updatePetStatusRepository, "updateStatus")
      .mockReturnValueOnce(Promise.resolve(null));
    const output = await sut.execute({
      petId: FakeData.id(),
      newStatus: PetStatusEnum.ADOPTED,
    });

    expect(output).toEqual(new InvalidFieldError("id"));
  });

  test("Should throw if UpdatePetStatusRepository throws", async () => {
    const { sut, updatePetStatusRepository } = makeSut();
    jest
      .spyOn(updatePetStatusRepository, "updateStatus")
      .mockImplementationOnce(() => {
        throw new Error();
      });

    expect(
      async () =>
        await sut.execute({
          petId: FakeData.id(),
          newStatus: PetStatusEnum.ADOPTED,
        })
    ).rejects.toThrow();
  });
});
