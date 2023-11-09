import { sign, verify } from "jsonwebtoken";
import { JwtAdapter } from "../../../src/infra/adapters";
import { makeUserEntity } from "../../test-helpers/mocks";
import { FakeData } from "../../test-helpers/fake-data";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

type SutTypes = {
  sut: JwtAdapter;
};

const makeSut = (): SutTypes => {
  const sut = new JwtAdapter();
  return { sut };
};

describe("JwtAdapter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GenerateToken", () => {
    it("Should call jwt library", () => {
      const { sut } = makeSut();
      sut.generateToken({ id: makeUserEntity().id }, FakeData.word());

      expect(sign).toHaveBeenCalledTimes(1);
    });

    it("Should return generated token", () => {
      const { sut } = makeSut();
      const token = FakeData.id();
      (sign as jest.Mock).mockReturnValueOnce(token);
      const generatedToken = sut.generateToken(
        { id: makeUserEntity().id },
        FakeData.word()
      );

      expect(generatedToken).toBe(token);
    });

    it("Should throw if jwt throws", () => {
      const { sut } = makeSut();
      (sign as jest.Mock).mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() =>
        sut.generateToken({ id: makeUserEntity().id }, FakeData.word())
      ).toThrow();
    });
  });

  describe("DecryptToken", () => {
    it("Should call jwt library", () => {
      const { sut } = makeSut();
      (verify as jest.Mock).mockReturnValueOnce({ id: FakeData.word() });
      sut.decryptToken(FakeData.id(), FakeData.word());

      expect(verify).toHaveBeenCalledTimes(1);
    });

    it("Should return the decrypted data", () => {
      const { sut } = makeSut();
      const data = { id: makeUserEntity().id };
      (verify as jest.Mock).mockReturnValueOnce(data);
      const generatedToken = sut.decryptToken(FakeData.id(), FakeData.word());

      expect(generatedToken).toBe(data);
    });

    it("Should return undefined if jwt throws", () => {
      const { sut } = makeSut();
      (verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error();
      });
      const result = sut.decryptToken(FakeData.id(), FakeData.word());

      expect(result).toBeUndefined();
    });
  });
});
