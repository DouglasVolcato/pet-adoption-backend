import { compareSync, hashSync } from "bcrypt";
import { BcryptAdapter } from "../../../src/infra/adapters";
import { FakeData } from "../../test-helpers/fake-data";

jest.mock("bcrypt", () => ({
  hashSync: jest.fn(),
  compareSync: jest.fn(),
}));

type SutTypes = {
  sut: BcryptAdapter;
  hashSalt: number;
};

const makeSut = (): SutTypes => {
  const hashSalt = 10;
  const sut = new BcryptAdapter(hashSalt);
  return { sut, hashSalt };
};

describe("BcryptAdapter", () => {
  describe("hash", () => {
    it("Should call hash with correct value", () => {
      const { sut, hashSalt } = makeSut();
      const passwordInput = FakeData.password();
      sut.hash(passwordInput);

      expect(hashSync).toHaveBeenCalledWith(passwordInput, hashSalt);
      expect(hashSync).toHaveBeenCalledTimes(1);
    });

    it("Should return the generated hash", () => {
      const { sut } = makeSut();
      const hashedPassword = FakeData.word();
      (hashSync as jest.Mock).mockReturnValueOnce(hashedPassword);
      const generatedHash = sut.hash(FakeData.password());

      expect(generatedHash).toBe(hashedPassword);
    });

    it("Should throw if hash throws", () => {
      const { sut } = makeSut();
      (hashSync as jest.Mock).mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => sut.hash(FakeData.password())).toThrow();
    });
  });

  describe("validate", () => {
    it("Should call validate with correct value", () => {
      const { sut } = makeSut();
      const password = FakeData.password();
      const hashedPassword = FakeData.word();
      sut.validate(password, hashedPassword);

      expect(compareSync).toHaveBeenCalledWith(password, hashedPassword);
      expect(compareSync).toHaveBeenCalledTimes(1);
    });

    it("Should return true if validate returns true", () => {
      const { sut } = makeSut();
      (compareSync as jest.Mock).mockReturnValueOnce(true);
      const generatedHash = sut.validate(FakeData.password(), FakeData.word());

      expect(generatedHash).toBe(true);
    });

    it("Should return false if validate returns false", () => {
      const { sut } = makeSut();
      (compareSync as jest.Mock).mockReturnValueOnce(false);
      const generatedHash = sut.validate(FakeData.password(), FakeData.word());

      expect(generatedHash).toBe(false);
    });

    it("Should throw if bcrypt throws", () => {
      const { sut } = makeSut();
      (compareSync as jest.Mock).mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() =>
        sut.validate(FakeData.password(), FakeData.word())
      ).toThrow();
    });
  });
});
