import { GetUserByTokenUserUseCase } from "../../../src/domain/protocols";
import { UserAuthMiddleware } from "../../../src/presentation/middlewares";
import { GetUserByTokenServiceStub } from "../../test-helpers/stubs";
import { makeUserEntity } from "../../test-helpers/mocks";
import { FakeData } from "../../test-helpers/fake-data";
import {
  RequiredFieldError,
  ServerError,
  UnauthorizedError,
} from "../../../src/presentation/helpers";

const makeAuthenticatedRequest = () => {
  return { authorization: `Bearer ${FakeData.word()}` };
};

type SutTypes = {
  sut: UserAuthMiddleware;
  getUserByTokenServiceStub: GetUserByTokenUserUseCase.Service;
};

const makeSut = (): SutTypes => {
  const getUserByTokenServiceStub = new GetUserByTokenServiceStub();
  const sut = new UserAuthMiddleware(getUserByTokenServiceStub);
  return { sut, getUserByTokenServiceStub };
};

describe("UserAuthMiddleware", () => {
  it("Should call GetUserByTokenService with correct token", async () => {
    const { sut, getUserByTokenServiceStub } = makeSut();
    const token = FakeData.word();
    const request = { authorization: `Bearer ${token}` };
    const getUserByTokenServiceSpy = jest.spyOn(
      getUserByTokenServiceStub,
      "execute"
    );
    await sut.execute(request);

    expect(getUserByTokenServiceSpy).toHaveBeenCalledTimes(1);
    expect(getUserByTokenServiceSpy).toHaveBeenCalledWith({ token });
  });

  it("Should return the found user", async () => {
    const { sut, getUserByTokenServiceStub } = makeSut();
    const userData = makeUserEntity();
    jest
      .spyOn(getUserByTokenServiceStub, "execute")
      .mockReturnValueOnce(Promise.resolve(userData));
    const output = await sut.execute(makeAuthenticatedRequest());

    expect(output).toEqual({ user: userData });
  });

  it("Should return an error if GetUserByTokenService returns an error", async () => {
    const { sut, getUserByTokenServiceStub } = makeSut();
    const request = makeAuthenticatedRequest();
    jest
      .spyOn(getUserByTokenServiceStub, "execute")
      .mockReturnValueOnce(Promise.resolve(new Error()));
    const output = await sut.execute(request);

    expect(output).toEqual(new UnauthorizedError());
  });

  it("Should return an error if GetUserByTokenService throws", async () => {
    const { sut, getUserByTokenServiceStub } = makeSut();
    const errorMessage = FakeData.phrase();
    jest
      .spyOn(getUserByTokenServiceStub, "execute")
      .mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });
    const output = await sut.execute(makeAuthenticatedRequest());

    expect(output).toEqual(new ServerError(errorMessage));
  });

  it("Should return an error if authorization is not provided", async () => {
    const { sut } = makeSut();
    const output = await sut.execute({});

    expect(output).toEqual(new RequiredFieldError("authorization"));
  });

  it("Should return an error if authorization is invalid", async () => {
    const { sut } = makeSut();
    const output = await sut.execute({ authorization: FakeData.word() });

    expect(output).toEqual(new UnauthorizedError());
  });
});
