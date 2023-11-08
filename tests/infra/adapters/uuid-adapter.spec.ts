import { UuidAdapter } from "../../../src/infra/adapters";
import { v4 } from "uuid";
import { FakeData } from "../../test-helpers/fake-data";

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

type SutTypes = {
  sut: UuidAdapter;
};

const makeSut = (): SutTypes => {
  const sut = new UuidAdapter();
  return { sut };
};

describe("UuidAdapter", () => {
  it("Should call v4", () => {
    const { sut } = makeSut();
    sut.generateId();

    expect(v4).toHaveBeenCalledTimes(1);
  });

  it("Should return generated uuid", () => {
    const { sut } = makeSut();
    const generatedId = FakeData.id();
    (v4 as jest.Mock).mockReturnValueOnce(generatedId);
    const generatedUuid = sut.generateId();

    expect(generatedUuid).toBe(generatedId);
  });

  it("Should throw if v4 throws", () => {
    const { sut } = makeSut();
    (v4 as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });

    expect(() => sut.generateId()).toThrow();
  });
});
