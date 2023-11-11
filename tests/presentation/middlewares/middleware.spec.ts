import { ValidatorInterface } from "../../../src/presentation/protocols";
import { FakeData } from "../../test-helpers/fake-data";
import { makeRandonData } from "../../test-helpers/mocks";
import { ValidatorStub, MiddlewareStub } from "../../test-helpers/stubs";
import {
  RequiredFieldError,
  ServerError,
} from "../../../src/presentation/helpers";

type SutTypes = {
  sut: MiddlewareStub;
  validatorStub: ValidatorInterface;
};

const makeSut = (): SutTypes => {
  const validatorStub = new ValidatorStub();
  const sut = new MiddlewareStub();
  (sut as any).validator = validatorStub;
  return { sut, validatorStub };
};

describe("Middleware", () => {
  it("Should call validator with correct values", async () => {
    const { sut, validatorStub } = makeSut();
    const compositeSpy = jest.spyOn(validatorStub, "validate");
    const data = makeRandonData();
    await sut.execute(data);

    expect(compositeSpy).toHaveBeenCalledTimes(1);
    expect(compositeSpy).toHaveBeenCalledWith(data);
  });

  it("Should return a bad request if validator returns an error", async () => {
    const { sut, validatorStub } = makeSut();
    const fieldName = FakeData.word();
    jest
      .spyOn(validatorStub, "validate")
      .mockReturnValueOnce(new RequiredFieldError(fieldName));
    const output = await sut.execute(makeRandonData());

    expect(output).toEqual(new RequiredFieldError(fieldName));
  });

  it("Should call perform with correct values", async () => {
    const { sut } = makeSut();
    const performSpy = jest.spyOn(sut, "perform");
    const data = makeRandonData();
    await sut.execute(data);

    expect(performSpy).toHaveBeenCalledTimes(1);
    expect(performSpy).toHaveBeenCalledWith(data);
  });

  it("Should return what perform returns", async () => {
    const { sut } = makeSut();
    const data = makeRandonData();
    jest.spyOn(sut, "perform").mockReturnValueOnce(Promise.resolve(data));
    const output = await sut.execute(data);

    expect(output).toEqual(data);
  });

  it("Should return a server error if perform throws", async () => {
    const { sut } = makeSut();
    const errorMessage = FakeData.phrase();
    jest.spyOn(sut, "perform").mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });
    const output = await sut.execute(makeRandonData());

    expect(output).toEqual(new ServerError(errorMessage));
  });

  it("Should return a server error if validator throws", async () => {
    const { sut, validatorStub } = makeSut();
    const errorMessage = FakeData.phrase();
    jest.spyOn(validatorStub, "validate").mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });
    const output = await sut.execute(makeRandonData());

    expect(output).toEqual(new ServerError(errorMessage));
  });
});
