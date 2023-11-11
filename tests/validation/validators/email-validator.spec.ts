import { EmailValidationStub } from "../../test-helpers/stubs";
import { EmailValidationInterface } from "../../../src/validation/protocols";
import { EmailValidator } from "../../../src/validation/validators";
import { FakeData } from "../../test-helpers/fake-data";
import {
  InvalidFieldError,
  RequiredFieldError,
} from "../../../src/presentation/helpers";

const mockData = () => ({
  email_field: FakeData.email(),
});

type SutTypes = {
  sut: EmailValidator;
  emailValidation: EmailValidationInterface;
};

const makeSut = (fieldName: string): SutTypes => {
  const emailValidation = new EmailValidationStub();
  const sut = new EmailValidator(fieldName);
  (sut as any).emailValidation = emailValidation;
  return { sut, emailValidation };
};

describe("EmailValidator", () => {
  test("Should call EmailValidation with correct values", () => {
    const { sut, emailValidation } = makeSut("email_field");
    const validationSpy = jest.spyOn(emailValidation, "isEmail");
    const data = mockData();
    sut.validate(data);

    expect(validationSpy).toHaveBeenCalledTimes(1);
    expect(validationSpy).toHaveBeenCalledWith(data.email_field);
  });

  test("Should return an error if field does not exist", () => {
    const { sut } = makeSut("invalid_field");
    const error = sut.validate(mockData());

    expect(error).toBeInstanceOf(RequiredFieldError);
  });

  test("Should return an error if EmailValidation returns false", () => {
    const { sut, emailValidation } = makeSut("email_field");
    jest.spyOn(emailValidation, "isEmail").mockReturnValueOnce(false);
    const result = sut.validate(mockData());

    expect(result).toBeInstanceOf(InvalidFieldError);
  });

  test("Should throw if EmailValidation throws", () => {
    const { sut, emailValidation } = makeSut("email_field");
    jest.spyOn(emailValidation, "isEmail").mockImplementationOnce(() => {
      throw new Error();
    });

    expect(() => sut.validate(mockData())).toThrow();
  });

  test("Should return undefined on success", () => {
    const { sut } = makeSut("email_field");
    const result = sut.validate(mockData());

    expect(result).toBeUndefined();
  });
});
