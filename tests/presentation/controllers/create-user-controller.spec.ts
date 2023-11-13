import { CreateUserController } from "../../../src/presentation/controllers/create-user-controller";
import { badRequest, ok, serverError } from "../../../src/presentation/helpers";
import { CreateUserControllerTypes } from "../../../src/presentation/protocols";
import { makeUserDto, makeUserEntity } from "../../test-helpers/mocks";
import { CreateUserUseCase } from "../../../src/domain/protocols";
import { CreateUserServiceStub } from "../../test-helpers/stubs";
import { FieldTypeEnum } from "../../../src/validation/protocols";
import { FakeData } from "../../test-helpers/fake-data";
import {
  EmailValidator,
  FieldTypeValidator,
  MinLengthValidator,
  RequiredFieldValidator,
} from "../../../src/validation/validators";

const makeValidRequest = (): CreateUserControllerTypes.Input => makeUserDto();

type SutTypes = {
  sut: CreateUserController;
  createUserService: CreateUserUseCase.Service;
};

const makeSut = (): SutTypes => {
  const createUserService = new CreateUserServiceStub();
  const sut = new CreateUserController(createUserService);
  return { sut, createUserService };
};

describe("CreateUserController", () => {
  test("Should set correct validator", async () => {
    const { sut } = makeSut();
    const validatorComposite = (sut as any).validator;
    const validators = (validatorComposite as any).validators;

    expect(validators).toEqual([
      new RequiredFieldValidator("name"),
      new FieldTypeValidator("name", FieldTypeEnum.STRING),
      new RequiredFieldValidator("email"),
      new FieldTypeValidator("email", FieldTypeEnum.STRING),
      new EmailValidator("email"),
      new RequiredFieldValidator("password"),
      new FieldTypeValidator("password", FieldTypeEnum.STRING),
      new MinLengthValidator("password", 6),
    ]);
  });

  test("Should return a bad request if validator return an error", async () => {
    const { sut } = makeSut();
    const error = new Error(FakeData.phrase());
    jest.spyOn((sut as any).validator, "validate").mockReturnValueOnce(error);
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(badRequest(error));
  });

  test("Should call CreateUserService with correct values", async () => {
    const { sut, createUserService } = makeSut();
    const request = makeValidRequest();
    const createUserServiceSpy = jest.spyOn(createUserService, "execute");
    await sut.execute(request);

    expect(createUserServiceSpy).toHaveBeenCalledTimes(1);
    expect(createUserServiceSpy).toHaveBeenCalledWith(request);
  });

  test("Should return the created user without the password", async () => {
    const { sut, createUserService } = makeSut();
    const createdUser = makeUserEntity();
    jest
      .spyOn(createUserService, "execute")
      .mockReturnValueOnce(Promise.resolve(createdUser));
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(
      ok({
        id: createdUser.id,
        email: createdUser.email,
        admin: createdUser.admin,
        name: createdUser.name,
      })
    );
  });

  test("Should return a bad request if CreateUserService returns an error", async () => {
    const { sut, createUserService } = makeSut();
    const error = new Error(FakeData.phrase());
    jest
      .spyOn(createUserService, "execute")
      .mockReturnValueOnce(Promise.resolve(error));
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(badRequest(error));
  });

  test("Should return a server error if CreateUserService throws", async () => {
    const { sut, createUserService } = makeSut();
    const error = new Error(FakeData.phrase());
    jest.spyOn(createUserService, "execute").mockImplementationOnce(() => {
      throw error;
    });
    const output = await sut.execute(makeValidRequest());

    expect(output).toEqual(serverError(error));
  });
});
