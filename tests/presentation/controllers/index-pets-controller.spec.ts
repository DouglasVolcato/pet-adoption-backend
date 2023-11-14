import { IndexPetsControllerTypes } from "../../../src/presentation/protocols";
import { IndexPetsController } from "../../../src/presentation/controllers";
import { IndexPetsUseCase } from "../../../src/domain/protocols";
import { IndexPetsServiceStub } from "../../test-helpers/stubs";
import { makeUserEntity } from "../../test-helpers/mocks";
import { FakeData } from "../../test-helpers/fake-data";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../../src/presentation/helpers";

const makeValidRequest = (admin = true): IndexPetsControllerTypes.Input => ({
  user: { ...makeUserEntity(), admin },
});

type SutTypes = {
  sut: IndexPetsController;
  indexPetsService: IndexPetsUseCase.Service;
};

const makeSut = (): SutTypes => {
  const indexPetsService = new IndexPetsServiceStub();
  const sut = new IndexPetsController(indexPetsService);
  return { sut, indexPetsService };
};

describe("IndexPetsController", () => {
  test("Should set correct validator", async () => {
    const { sut } = makeSut();
    const validatorComposite = (sut as any).validator;
    const validators = (validatorComposite as any).validators;

    expect(validators).toEqual([]);
  });

  test("Should a bad request if validator return an error", async () => {
    const { sut } = makeSut();
    const error = new Error(FakeData.phrase());
    jest.spyOn((sut as any).validator, "validate").mockReturnValueOnce(error);
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(badRequest(error));
  });

  test("Should an unauthorized error if user is not an admin", async () => {
    const { sut } = makeSut();
    const output = await sut.execute(makeValidRequest(false));

    expect(output).toEqual(unauthorized());
  });

  test("Should call IndexPetsService with correct values", async () => {
    const { sut, indexPetsService } = makeSut();
    const indexPetsServiceSpy = jest.spyOn(indexPetsService, "execute");
    await sut.execute(makeValidRequest());

    expect(indexPetsServiceSpy).toHaveBeenCalledTimes(1);
    expect(indexPetsServiceSpy).toHaveBeenCalledWith();
  });

  test("Should return ok", async () => {
    const { sut, indexPetsService } = makeSut();
    jest
      .spyOn(indexPetsService, "execute")
      .mockReturnValueOnce(Promise.resolve());
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(ok({}));
  });

  test("Should return a server error if IndexPetsService throws", async () => {
    const { sut, indexPetsService } = makeSut();
    const error = new Error(FakeData.phrase());
    jest.spyOn(indexPetsService, "execute").mockImplementationOnce(() => {
      throw error;
    });
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(serverError(error));
  });
});
