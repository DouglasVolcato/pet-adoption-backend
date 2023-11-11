import {
  PasswordHashCheckerInterface,
  TokenGeneratorInterface,
} from "../../../src/data/protocols";
import { LoginService } from "../../../src/data/services/login-service";
import { EnvVars } from "../../../src/main/config";
import { InvalidFieldError } from "../../../src/presentation/helpers";
import { FakeData } from "../../test-helpers/fake-data";
import { makeLoginDto, makeUserEntity } from "../../test-helpers/mocks";
import {
  GetUserByEmailRepositoryStub,
  PasswordHashCheckerStub,
  TokenGeneratorStub,
} from "../../test-helpers/stubs";

type SutTypes = {
  sut: LoginService;
  getUserByEmailRepository: GetUserByEmailRepositoryStub;
  passwordHashChecker: PasswordHashCheckerInterface;
  tokenGenerator: TokenGeneratorInterface;
};

const makeSut = (): SutTypes => {
  const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
  const passwordHashChecker = new PasswordHashCheckerStub();
  const tokenGenerator = new TokenGeneratorStub();
  const sut = new LoginService(
    getUserByEmailRepository,
    passwordHashChecker,
    tokenGenerator
  );
  return {
    sut,
    getUserByEmailRepository,
    passwordHashChecker,
    tokenGenerator,
  };
};

describe("LoginService", () => {
  it("Should call GetUserByEmailRepository with received email", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    const loginDto = makeLoginDto();
    const repositorySpy = jest.spyOn(getUserByEmailRepository, "getByEmail");
    await sut.execute(loginDto);

    expect(repositorySpy).toHaveBeenCalledTimes(1);
    expect(repositorySpy).toHaveBeenCalledWith(loginDto.email);
  });

  it("Should call HashChecker with correct values", async () => {
    const { sut, passwordHashChecker, getUserByEmailRepository } = makeSut();
    const loginDto = makeLoginDto();
    const foundUser = makeUserEntity();
    const hashValidatorSpy = jest.spyOn(passwordHashChecker, "validate");
    jest
      .spyOn(getUserByEmailRepository, "getByEmail")
      .mockReturnValueOnce(Promise.resolve(foundUser));
    await sut.execute(loginDto);

    expect(hashValidatorSpy).toHaveBeenCalledTimes(1);
    expect(hashValidatorSpy).toHaveBeenCalledWith(
      loginDto.password,
      foundUser.password
    );
  });

  it("Should call TokenGenerator with correct values", async () => {
    const { sut, tokenGenerator, getUserByEmailRepository } = makeSut();
    const foundUser = makeUserEntity();
    const tokenGeneratorSpy = jest.spyOn(tokenGenerator, "generateToken");
    jest
      .spyOn(getUserByEmailRepository, "getByEmail")
      .mockReturnValueOnce(Promise.resolve(foundUser));
    await sut.execute(makeLoginDto());

    expect(tokenGeneratorSpy).toHaveBeenCalledTimes(1);
    expect(tokenGeneratorSpy).toHaveBeenCalledWith(
      { id: foundUser.id },
      EnvVars.SECRET()
    );
  });

  it("Should return the generated token and the logged user", async () => {
    const { sut, tokenGenerator, getUserByEmailRepository } = makeSut();
    const generatedToken = FakeData.word();
    const foundUser = makeUserEntity();
    jest
      .spyOn(tokenGenerator, "generateToken")
      .mockReturnValueOnce(generatedToken);
    jest
      .spyOn(getUserByEmailRepository, "getByEmail")
      .mockReturnValueOnce(Promise.resolve(foundUser));
    const output = await sut.execute(makeLoginDto());

    expect(output).toEqual({ token: generatedToken, user: foundUser });
  });

  it("Should return an error if user was not found", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    jest
      .spyOn(getUserByEmailRepository, "getByEmail")
      .mockReturnValueOnce(Promise.resolve(null));
    const error = await sut.execute(makeLoginDto());

    expect(error).toEqual(new InvalidFieldError("email"));
  });

  it("Should return an error if password is invalid", async () => {
    const { sut, passwordHashChecker } = makeSut();
    jest.spyOn(passwordHashChecker, "validate").mockReturnValueOnce(false);
    const error = await sut.execute(makeLoginDto());

    expect(error).toEqual(new InvalidFieldError("password"));
  });

  it("Should throw if GetUserByEmailRepository throws", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    jest
      .spyOn(getUserByEmailRepository, "getByEmail")
      .mockImplementationOnce(() => {
        throw new Error();
      });

    expect(async () => await sut.execute(makeLoginDto())).rejects.toThrow();
  });

  it("Should throw if HashChecker throws", async () => {
    const { sut, passwordHashChecker } = makeSut();
    jest.spyOn(passwordHashChecker, "validate").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.execute(makeLoginDto())).rejects.toThrow();
  });

  it("Should throw if TokenGenerator throws", async () => {
    const { sut, tokenGenerator } = makeSut();
    jest.spyOn(tokenGenerator, "generateToken").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(async () => await sut.execute(makeLoginDto())).rejects.toThrow();
  });
});
