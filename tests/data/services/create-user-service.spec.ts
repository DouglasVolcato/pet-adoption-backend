import { makeUserDto, makeUserEntity } from "../../test-helpers/mocks";
import { InvalidFieldError } from "../../../src/presentation/helpers";
import { CreateUserService } from "../../../src/data/services";
import {
  CreateUserRepositoryInterface,
  GetUserByEmailRepositoryInterface,
  IdGeneratorInterface,
  PasswordHasherInterface,
} from "../../../src/data/protocols";
import {
  CreateUserRepositoryStub,
  GetUserByEmailRepositoryStub,
  IdGeneratorStub,
  PasswordHasherStub,
} from "../../test-helpers/stubs";

type SutTypes = {
  sut: CreateUserService;
  createUserRepository: CreateUserRepositoryInterface;
  getUserByEmailRepository: GetUserByEmailRepositoryInterface;
  idGenerator: IdGeneratorInterface;
  passwordHasher: PasswordHasherInterface;
};

const makeSut = (): SutTypes => {
  const createUserRepository = new CreateUserRepositoryStub();
  const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
  const idGenerator = new IdGeneratorStub();
  const passwordHasher = new PasswordHasherStub();
  const sut = new CreateUserService(
    createUserRepository,
    getUserByEmailRepository,
    idGenerator,
    passwordHasher
  );
  return {
    sut,
    createUserRepository,
    getUserByEmailRepository,
    idGenerator,
    passwordHasher,
  };
};

describe("CreateUserService", () => {
  it("Should call GetUserByEmailRepository with correct values", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    const repositorySpy = jest.spyOn(getUserByEmailRepository, "getByEmail");
    const userDto = makeUserDto();
    await sut.execute(userDto);

    expect(repositorySpy).toHaveBeenCalledTimes(1);
    expect(repositorySpy).toHaveBeenCalledWith(userDto.email);
  });

  it("Should return an error if GetUserByEmailRepository finds a user", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    jest
      .spyOn(getUserByEmailRepository, "getByEmail")
      .mockReturnValueOnce(Promise.resolve(makeUserEntity()));
    const error = await sut.execute(makeUserDto());

    expect(error).toEqual(new InvalidFieldError("email"));
  });

  it("Should call idGenerator", async () => {
    const { sut, idGenerator, getUserByEmailRepository } = makeSut();
    jest
      .spyOn(getUserByEmailRepository, "getByEmail")
      .mockReturnValueOnce(Promise.resolve(null));
    const idGeneratorSpy = jest.spyOn(idGenerator, "generateId");
    await sut.execute(makeUserDto());

    expect(idGeneratorSpy).toHaveBeenCalledTimes(1);
  });

  it("Should call hasher with correct value", async () => {
    const { sut, passwordHasher, getUserByEmailRepository } = makeSut();
    jest
      .spyOn(getUserByEmailRepository, "getByEmail")
      .mockReturnValueOnce(Promise.resolve(null));
    const hasherSpy = jest.spyOn(passwordHasher, "hash");
    const userData = makeUserDto();
    await sut.execute(userData);

    expect(hasherSpy).toHaveBeenCalledTimes(1);
    expect(hasherSpy).toHaveBeenCalledWith(userData.password);
  });

  it("Should call CreateUserRepository with correct values", async () => {
    const {
      sut,
      createUserRepository,
      passwordHasher,
      idGenerator,
      getUserByEmailRepository,
    } = makeSut();
    jest
      .spyOn(getUserByEmailRepository, "getByEmail")
      .mockReturnValueOnce(Promise.resolve(null));
    const repositorySpy = jest.spyOn(createUserRepository, "create");
    const userEntity = makeUserEntity();
    const userDto = {
      name: userEntity.name,
      email: userEntity.email,
      password: "not_hashed_password",
    };
    jest.spyOn(passwordHasher, "hash").mockReturnValueOnce(userEntity.password);
    jest.spyOn(idGenerator, "generateId").mockReturnValueOnce(userEntity.id);
    await sut.execute(userDto);

    expect(repositorySpy).toHaveBeenCalledTimes(1);
    expect(repositorySpy).toHaveBeenCalledWith({ ...userEntity, admin: false });
  });

  it("Should return the same user entity CreateUserRepository returns", async () => {
    const { sut, createUserRepository, getUserByEmailRepository } = makeSut();
    jest
      .spyOn(getUserByEmailRepository, "getByEmail")
      .mockReturnValueOnce(Promise.resolve(null));
    const userData = makeUserEntity();
    jest
      .spyOn(createUserRepository, "create")
      .mockReturnValueOnce(Promise.resolve(userData));

    expect(await sut.execute(makeUserDto())).toEqual(userData);
  });

  it("Should throw if idGenerator throws", async () => {
    const { sut, idGenerator, getUserByEmailRepository } = makeSut();
    jest
      .spyOn(getUserByEmailRepository, "getByEmail")
      .mockReturnValueOnce(Promise.resolve(null));
    jest.spyOn(idGenerator, "generateId").mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(
      async () => await sut.execute(makeUserDto())
    ).rejects.toThrow();
  });

  it("Should throw if hasher throws", async () => {
    const { sut, passwordHasher, getUserByEmailRepository } = makeSut();
    jest
      .spyOn(getUserByEmailRepository, "getByEmail")
      .mockReturnValueOnce(Promise.resolve(null));
    jest.spyOn(passwordHasher, "hash").mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(
      async () => await sut.execute(makeUserDto())
    ).rejects.toThrow();
  });

  it("Should throw if GetUserByEmailRepository throws", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    jest
      .spyOn(getUserByEmailRepository, "getByEmail")
      .mockImplementationOnce(() => {
        throw new Error();
      });

    await expect(
      async () => await sut.execute(makeUserDto())
    ).rejects.toThrow();
  });

  it("Should throw if CreateUserRepository throws", async () => {
    const { sut, createUserRepository, getUserByEmailRepository } = makeSut();
    jest
      .spyOn(getUserByEmailRepository, "getByEmail")
      .mockReturnValueOnce(Promise.resolve(null));
    jest.spyOn(createUserRepository, "create").mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(
      async () => await sut.execute(makeUserDto())
    ).rejects.toThrow();
  });
});
