import { config } from "dotenv";
import { EnvVars } from "../../../src/main/config";

jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

const mockEnvVariables = () => ({
  PORT: "8888",
  MONGO_DB_URL: "mongodb://localhost:27017/mydb",
  SECRET: "super_secret",
});

const defaultEnvVariables = () => ({
  PORT: "7777",
  MONGO_DB_URL: "",
  SECRET: "384f83ny48yr384yr8",
});

type SutTypes = {
  sut: typeof EnvVars;
};

const makeSut = (): SutTypes => {
  process.env.PORT = mockEnvVariables().PORT;
  process.env.MONGO_DB_URL = mockEnvVariables().MONGO_DB_URL;
  process.env.SECRET = mockEnvVariables().SECRET;
  const sut = EnvVars;
  return { sut };
};

describe("Environment Variables", () => {
  it("Should correctly read environment variables when defined", () => {
    const { sut } = makeSut();

    expect(sut.PORT()).toBe(mockEnvVariables().PORT);
    expect(sut.MONGO_DB_URL()).toBe(mockEnvVariables().MONGO_DB_URL);
    expect(sut.SECRET()).toBe(mockEnvVariables().SECRET);
    expect(config).toHaveBeenCalledTimes(3);
  });

  it("Should return default values if environment variables are not defined", () => {
    const { sut } = makeSut();
    process.env = {};
    (config as jest.Mock).mockReturnValueOnce({
      parsed: {},
    });

    expect(sut.PORT()).toBe(defaultEnvVariables().PORT);
    expect(sut.MONGO_DB_URL()).toBe(defaultEnvVariables().MONGO_DB_URL);
    expect(sut.SECRET()).toBe(defaultEnvVariables().SECRET);
  });

  it("Should return default values if dotenv throws", () => {
    const { sut } = makeSut();
    process.env = {};
    (config as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.PORT()).toBe(defaultEnvVariables().PORT);
    expect(sut.MONGO_DB_URL()).toBe(defaultEnvVariables().MONGO_DB_URL);
    expect(sut.SECRET()).toBe(defaultEnvVariables().SECRET);
  });
});
