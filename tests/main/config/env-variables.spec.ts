import { config } from "dotenv";
import { EnvVars } from "../../../src/main/config";
import { FakeData } from "../../test-helpers/fake-data";

jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

const mockEnvVariables = {
  PORT: FakeData.numberInteger.toString(),
  MONGO_DB_URL: FakeData.url(),
  SECRET: FakeData.password(),
  CATS_API_TOKEN: FakeData.password(),
  DOGS_API_TOKEN: FakeData.password(),
};

const defaultEnvVariables = {
  PORT: "7777",
  MONGO_DB_URL: "",
  SECRET: "384f83ny48yr384yr8",
  CATS_API_TOKEN: "",
  DOGS_API_TOKEN: "",
};

type SutTypes = {
  sut: typeof EnvVars;
};

const makeSut = (): SutTypes => {
  process.env.PORT = mockEnvVariables.PORT;
  process.env.MONGO_DB_URL = mockEnvVariables.MONGO_DB_URL;
  process.env.SECRET = mockEnvVariables.SECRET;
  process.env.CATS_API_TOKEN = mockEnvVariables.CATS_API_TOKEN;
  process.env.DOGS_API_TOKEN = mockEnvVariables.DOGS_API_TOKEN;
  const sut = EnvVars;
  return { sut };
};

describe("Environment Variables", () => {
  it("Should correctly read environment variables when defined", () => {
    const { sut } = makeSut();

    expect(sut.PORT()).toBe(mockEnvVariables.PORT);
    expect(sut.MONGO_DB_URL()).toBe(mockEnvVariables.MONGO_DB_URL);
    expect(sut.SECRET()).toBe(mockEnvVariables.SECRET);
    expect(sut.CATS_API_TOKEN()).toBe(mockEnvVariables.CATS_API_TOKEN);
    expect(sut.DOGS_API_TOKEN()).toBe(mockEnvVariables.DOGS_API_TOKEN);
    expect(config).toHaveBeenCalledTimes(5);
  });

  it("Should return default values if environment variables are not defined", () => {
    const { sut } = makeSut();
    process.env = {};
    (config as jest.Mock).mockReturnValueOnce({
      parsed: {},
    });

    expect(sut.PORT()).toBe(defaultEnvVariables.PORT);
    expect(sut.MONGO_DB_URL()).toBe(defaultEnvVariables.MONGO_DB_URL);
    expect(sut.SECRET()).toBe(defaultEnvVariables.SECRET);
    expect(sut.CATS_API_TOKEN()).toBe(defaultEnvVariables.CATS_API_TOKEN);
    expect(sut.DOGS_API_TOKEN()).toBe(defaultEnvVariables.DOGS_API_TOKEN);
  });

  it("Should return default values if dotenv throws", () => {
    const { sut } = makeSut();
    process.env = {};
    (config as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.PORT()).toBe(defaultEnvVariables.PORT);
    expect(sut.MONGO_DB_URL()).toBe(defaultEnvVariables.MONGO_DB_URL);
    expect(sut.SECRET()).toBe(defaultEnvVariables.SECRET);
    expect(sut.CATS_API_TOKEN()).toBe(defaultEnvVariables.CATS_API_TOKEN);
    expect(sut.DOGS_API_TOKEN()).toBe(defaultEnvVariables.DOGS_API_TOKEN);
  });
});
