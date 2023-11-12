import { GetUserByTokenService } from "../../../src/data/services";
import { InvalidFieldError } from "../../../src/presentation/helpers";
import { makeUserEntity } from "../../test-helpers/mocks";
import { FakeData } from "../../test-helpers/fake-data";
import { EnvVars } from "../../../src/main/config";
import {
  GetUserByIdRepositoryInterface,
  TokenDecrypterInterface,
} from "../../../src/data/protocols";
import {
  GetUserByIdRepositoryStub,
  TokenDecrypterStub,
} from "../../test-helpers/stubs";

type SutTypes = {
  sut: GetUserByTokenService;
  tokenDecrypter: TokenDecrypterInterface;
  getUserByIdRepository: GetUserByIdRepositoryInterface;
};

const makeSut = (): SutTypes => {
  const tokenDecrypter = new TokenDecrypterStub();
  const getUserByIdRepository = new GetUserByIdRepositoryStub();
  const sut = new GetUserByTokenService(tokenDecrypter, getUserByIdRepository);
  return { sut, tokenDecrypter, getUserByIdRepository };
};

describe("GetUserByTokenService", () => {
  it("Should call TokenDecrypter with correct token", async () => {
    const { sut, tokenDecrypter } = makeSut();
    const tokenValidatorSpy = jest.spyOn(tokenDecrypter, "decryptToken");
    const token = FakeData.id();
    await sut.execute({ token });

    expect(tokenValidatorSpy).toHaveBeenCalledTimes(1);
    expect(tokenValidatorSpy).toHaveBeenCalledWith(token, EnvVars.SECRET());
  });

  it("Should return an error if TokenDecrypter returns undefined", async () => {
    const { sut, tokenDecrypter } = makeSut();
    jest.spyOn(tokenDecrypter, "decryptToken").mockReturnValueOnce(undefined);
    const error = await sut.execute({ token: FakeData.id() });

    expect(error).toEqual(new InvalidFieldError("token"));
  });

  it("Should call GetUserByIdRepository with correct user id", async () => {
    const { sut, tokenDecrypter, getUserByIdRepository } = makeSut();
    const validUserId = FakeData.id();
    const getUserByIdRepositorySpy = jest.spyOn(
      getUserByIdRepository,
      "getById"
    );
    jest
      .spyOn(tokenDecrypter, "decryptToken")
      .mockReturnValueOnce({ id: validUserId });
    await sut.execute({ token: FakeData.id() });

    expect(getUserByIdRepositorySpy).toHaveBeenCalledTimes(1);
    expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(validUserId);
  });

  it("Should return an error if GetUserByIdRepository returns null", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest
      .spyOn(getUserByIdRepository, "getById")
      .mockReturnValueOnce(Promise.resolve(null));
    const error = await sut.execute({ token: FakeData.id() });

    expect(error).toEqual(new InvalidFieldError("token"));
  });

  it("Should return the found user", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const userData = makeUserEntity();
    jest
      .spyOn(getUserByIdRepository, "getById")
      .mockReturnValueOnce(Promise.resolve(userData));
    const user = await sut.execute({ token: FakeData.id() });

    expect(user).toEqual(userData);
  });

  it("Should throw if GetUserByIdRepository throws", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, "getById").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(
      async () => await sut.execute({ token: FakeData.id() })
    ).rejects.toThrow();
  });

  it("Should throw if TokenDecrypter throws", async () => {
    const { sut, tokenDecrypter } = makeSut();
    jest.spyOn(tokenDecrypter, "decryptToken").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(
      async () => await sut.execute({ token: FakeData.id() })
    ).rejects.toThrow();
  });
});
