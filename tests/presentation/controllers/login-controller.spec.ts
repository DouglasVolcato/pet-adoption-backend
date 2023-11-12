import { badRequest, ok, serverError } from "../../../src/presentation/helpers";
import { LoginControllerTypes } from "../../../src/presentation/protocols";
import { LoginController } from "../../../src/presentation/controllers";
import { FieldTypeEnum } from "../../../src/validation/protocols";
import { LoginUseCase } from "../../../src/domain/protocols";
import { LoginServiceStub } from "../../test-helpers/stubs";
import { makeUserEntity } from "../../test-helpers/mocks";
import { FakeData } from "../../test-helpers/fake-data";
import {
  FieldTypeValidator,
  RequiredFieldValidator,
} from "../../../src/validation/validators";

const makeValidRequest = (): LoginControllerTypes.Input => ({
  email: FakeData.email(),
  password: FakeData.password(),
});

type SutTypes = {
  sut: LoginController;
  loginService: LoginUseCase.Service;
};

const makeSut = (): SutTypes => {
  const loginService = new LoginServiceStub();
  const sut = new LoginController(loginService);
  return { sut, loginService };
};

describe("ChangePetStatusController", () => {
  test("Should set correct validator", async () => {
    const { sut } = makeSut();
    const validatorComposite = (sut as any).validator;
    const validators = (validatorComposite as any).validators;

    expect(validators).toEqual([
      new RequiredFieldValidator("email"),
      new FieldTypeValidator("email", FieldTypeEnum.STRING),
      new RequiredFieldValidator("password"),
      new FieldTypeValidator("password", FieldTypeEnum.STRING),
    ]);
  });

  test("Should a bad request if validator return an error", async () => {
    const { sut } = makeSut();
    const error = new Error(FakeData.phrase());
    jest.spyOn((sut as any).validator, "validate").mockReturnValueOnce(error);
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(badRequest(error));
  });

  test("Should call LoginService with correct values", async () => {
    const { sut, loginService } = makeSut();
    const request = makeValidRequest();
    const loginServiceSpy = jest.spyOn(loginService, "execute");
    await sut.execute(request);

    expect(loginServiceSpy).toHaveBeenCalledTimes(1);
    expect(loginServiceSpy).toHaveBeenCalledWith(request);
  });

  test("Should return ok", async () => {
    const { sut, loginService } = makeSut();
    const authData = { user: makeUserEntity(), token: FakeData.word() };
    jest
      .spyOn(loginService, "execute")
      .mockReturnValueOnce(Promise.resolve(authData));
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(ok(authData));
  });

  test("Should return a bad request if LoginService returns an error", async () => {
    const { sut, loginService } = makeSut();
    const error = new Error(FakeData.phrase());
    jest
      .spyOn(loginService, "execute")
      .mockReturnValueOnce(Promise.resolve(error));
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(badRequest(error));
  });

  test("Should return a server error if LoginService throws", async () => {
    const { sut, loginService } = makeSut();
    const error = new Error(FakeData.phrase());
    jest.spyOn(loginService, "execute").mockImplementationOnce(() => {
      throw error;
    });
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(serverError(error));
  });
});
