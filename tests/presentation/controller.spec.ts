import { ControllerStub, ValidatorStub } from "../test-helpers/stubs";
import { ValidatorInterface } from "../../src/presentation/protocols";
import { RequiredFieldError, ok } from "../../src/presentation/helpers";
import { FakeData } from "../test-helpers/fake-data";
import { makeUserDto, makeUserEntity } from "../test-helpers/mocks";

type SutTypes = {
  sut: ControllerStub;
  validatorStub: ValidatorInterface;
};

const makeSut = (): SutTypes => {
  const validatorStub = new ValidatorStub();
  const sut = new ControllerStub();
  (sut as any).validator = validatorStub;
  return { sut, validatorStub };
};

describe("Controller", () => {
  it("Should call validator with correct values", async () => {
    const { sut, validatorStub } = makeSut();
    const compositeSpy = jest.spyOn(validatorStub, "validate");
    const data = makeUserDto();
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
    const response = await sut.execute(makeUserDto());

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new RequiredFieldError(fieldName));
  });

  it("Should call perform with correct values", async () => {
    const { sut } = makeSut();
    const performSpy = jest.spyOn(sut, "perform");
    const data = makeUserDto();
    await sut.execute(data);

    expect(performSpy).toHaveBeenCalledTimes(1);
    expect(performSpy).toHaveBeenCalledWith(data);
  });

  it("Should return what perform returns", async () => {
    const { sut } = makeSut();
    const data = makeUserDto();
    jest.spyOn(sut, "perform").mockReturnValueOnce(Promise.resolve(ok(data)));
    const response = await sut.execute(data);

    expect(response).toEqual(ok(data));
  });

  it("Should return a server error if perform throws", async () => {
    const { sut } = makeSut();
    const errorMessage = FakeData.phrase();
    jest.spyOn(sut, "perform").mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    const response = await sut.execute(makeUserDto());

    expect(response.statusCode).toBe(500);
    expect(response.data).toEqual(new Error(errorMessage));
  });

  it("Should return a server error if validator throws", async () => {
    const { sut, validatorStub } = makeSut();
    const errorMessage = FakeData.phrase();
    jest.spyOn(validatorStub, "validate").mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    const response = await sut.execute(makeUserDto());

    expect(response.statusCode).toBe(500);
    expect(response.data).toEqual(new Error(errorMessage));
  });
});
