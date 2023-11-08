import { EmailValidationAdapter } from "../../../src/infra/adapters";
import { validate } from "email-validator";
import { FakeData } from "../../test-helpers/fake-data";

jest.mock("email-validator", () => ({
  validate: jest.fn(),
}));

type SutTypes = {
  sut: EmailValidationAdapter;
};

const makeSut = (): SutTypes => {
  const sut = new EmailValidationAdapter();
  return { sut };
};

describe("EmailValidatorAdapter", () => {
  test("Should call email-validator with correct values", () => {
    const { sut } = makeSut();
    const emailInput = FakeData.email();
    sut.isEmail(emailInput);

    expect(validate).toHaveBeenCalledTimes(1);
    expect(validate).toHaveBeenCalledWith(emailInput);
  });

  test("Should return true if email-validator returns true", () => {
    const { sut } = makeSut();
    (validate as jest.Mock).mockReturnValueOnce(true);
    const output = sut.isEmail(FakeData.email());

    expect(output).toBe(true);
  });

  test("Should return false if email-validator returns false", () => {
    const { sut } = makeSut();
    (validate as jest.Mock).mockReturnValueOnce(false);
    const output = sut.isEmail(FakeData.email());

    expect(output).toBe(false);
  });

  test("Should throw if email-validator throws", () => {
    const { sut } = makeSut();
    (validate as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });

    expect(() => sut.isEmail(FakeData.email())).toThrow();
  });
});
