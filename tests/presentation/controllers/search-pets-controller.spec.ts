import { badRequest, ok, serverError } from "../../../src/presentation/helpers";
import { SearchPetsControllerTypes } from "../../../src/presentation/protocols";
import { SearchPetsController } from "../../../src/presentation/controllers";
import { SearchPetsUseCase } from "../../../src/domain/protocols";
import { SearchPetsServiceStub } from "../../test-helpers/stubs";
import { FieldTypeEnum } from "../../../src/validation/protocols";
import { makePetEntity } from "../../test-helpers/mocks";
import { FakeData } from "../../test-helpers/fake-data";
import {
  FieldTypeValidator,
  RequiredFieldValidator,
} from "../../../src/validation/validators";

const makeValidRequest = (): SearchPetsControllerTypes.Input => ({
  limit: FakeData.numberInteger(),
  offset: FakeData.numberInteger(),
});

type SutTypes = {
  sut: SearchPetsController;
  searchPetsService: SearchPetsUseCase.Service;
};

const makeSut = (): SutTypes => {
  const searchPetsService = new SearchPetsServiceStub();
  const sut = new SearchPetsController(searchPetsService);
  return { sut, searchPetsService };
};

describe("ChangePetStatusController", () => {
  test("Should set correct validator", async () => {
    const { sut } = makeSut();
    const validatorComposite = (sut as any).validator;
    const validators = (validatorComposite as any).validators;

    expect(validators).toEqual([
      new RequiredFieldValidator("limit"),
      new FieldTypeValidator("limit", FieldTypeEnum.NUMBER),
      new RequiredFieldValidator("offset"),
      new FieldTypeValidator("offset", FieldTypeEnum.NUMBER),
    ]);
  });

  test("Should a bad request if validator return an error", async () => {
    const { sut } = makeSut();
    const error = new Error(FakeData.phrase());
    jest.spyOn((sut as any).validator, "validate").mockReturnValueOnce(error);
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(badRequest(error));
  });

  test("Should call SearchPetsService with correct values", async () => {
    const { sut, searchPetsService } = makeSut();
    const request = makeValidRequest();
    const searchPetsServiceSpy = jest.spyOn(searchPetsService, "execute");
    await sut.execute(request);

    expect(searchPetsServiceSpy).toHaveBeenCalledTimes(1);
    expect(searchPetsServiceSpy).toHaveBeenCalledWith(request);
  });

  test("Should return ok", async () => {
    const { sut, searchPetsService } = makeSut();
    const foundPets = [makePetEntity(), makePetEntity()];
    jest
      .spyOn(searchPetsService, "execute")
      .mockReturnValueOnce(Promise.resolve(foundPets));
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(ok(foundPets));
  });

  test("Should return a server error if SearchPetsService throws", async () => {
    const { sut, searchPetsService } = makeSut();
    const error = new Error(FakeData.phrase());
    jest.spyOn(searchPetsService, "execute").mockImplementationOnce(() => {
      throw error;
    });
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(serverError(error));
  });
});
