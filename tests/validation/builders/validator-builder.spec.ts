import { FieldTypeEnum } from "../../../src/validation/protocols";
import { ValidatorBuilder } from "../../../src/validation/builders";
import { FakeData } from "../../test-helpers/fake-data";
import {
  EmailValidator,
  FieldTypeValidator,
  MinLengthValidator,
  RequiredFieldValidator,
} from "../../../src/validation/validators";

type SutTypes = {
  sut: ValidatorBuilder;
};

const makeSut = (): SutTypes => {
  const sut = new ValidatorBuilder();
  return { sut };
};

describe("ValidatorBuilder", () => {
  test("Of method should set the field name and return the class instance", () => {
    const { sut } = makeSut();
    const fieldName = FakeData.word();
    const data = sut.of(fieldName);

    expect(data).toBeInstanceOf(ValidatorBuilder);
    expect((data as any).fieldName).toBe(fieldName);
  });

  test("IsRequired method should return a RequiredFieldValidator", () => {
    const { sut } = makeSut();
    const validator = sut.of(FakeData.word()).isRequired();

    expect(validator).toBeInstanceOf(RequiredFieldValidator);
  });

  test("IsEmail method should return a EmailValidator", () => {
    const { sut } = makeSut();
    const validator = sut.of(FakeData.word()).isEmail();

    expect(validator).toBeInstanceOf(EmailValidator);
  });

  test("IsMinLength method should return a MinLengthValidator", () => {
    const { sut } = makeSut();
    const validator = sut.of(FakeData.word()).isMinLength(7);

    expect(validator).toBeInstanceOf(MinLengthValidator);
  });

  test("IsType method should return a FieldTypeValidator", () => {
    const { sut } = makeSut();
    const validator = sut.of(FakeData.word()).isType(FieldTypeEnum.STRING);

    expect(validator).toBeInstanceOf(FieldTypeValidator);
  });
});
