import { FieldTypeValidator } from "../../../src/validation/validators";
import { FieldTypeEnum } from "../../../src/validation/protocols";
import { FakeData } from "../../test-helpers/fake-data";
import {
  InvalidFieldError,
  RequiredFieldError,
} from "../../../src/validation/errors";

type SutTypes = {
  sut: FieldTypeValidator;
};

const makeSut = (fieldName: string, fieldType: FieldTypeEnum): SutTypes => {
  const sut = new FieldTypeValidator(fieldName, fieldType);
  return { sut };
};

describe("FieldTypeValidator", () => {
  test("Should return an error if field does not exist", () => {
    const { sut } = makeSut("invalid_field", FieldTypeEnum.STRING);
    const error = sut.validate({});

    expect(error).toBeInstanceOf(RequiredFieldError);
  });

  test("Should return an error if field is not a string but should be a string", () => {
    const { sut } = makeSut("invalid_field", FieldTypeEnum.STRING);
    const error = sut.validate({ invalid_field: FakeData.numberInteger() });

    expect(error).toBeInstanceOf(InvalidFieldError);
  });

  test("Should return an error if field is not a number but should be a number", () => {
    const { sut } = makeSut("invalid_field", FieldTypeEnum.NUMBER);
    const error = sut.validate({ invalid_field: FakeData.word() });

    expect(error).toBeInstanceOf(InvalidFieldError);
  });

  test("Should return an error if field is not a boolean but should be a boolean", () => {
    const { sut } = makeSut("invalid_field", FieldTypeEnum.BOOLEAN);
    const error = sut.validate({ invalid_field: FakeData.numberInteger() });

    expect(error).toBeInstanceOf(InvalidFieldError);
  });

  test("Should return an error if field is not a array but should be an array", () => {
    const { sut } = makeSut("invalid_field", FieldTypeEnum.ARRAY);
    const error = sut.validate({ invalid_field: FakeData.numberInteger() });

    expect(error).toBeInstanceOf(InvalidFieldError);
  });

  test("Should return an error if field is not an object but should be an object", () => {
    const { sut } = makeSut("invalid_field", FieldTypeEnum.OBJECT);
    const error = sut.validate({ invalid_field: FakeData.numberInteger() });

    expect(error).toBeInstanceOf(InvalidFieldError);
  });

  //////

  test("Should return undefined if field is a string and should be a string", () => {
    const { sut } = makeSut("valid_field", FieldTypeEnum.STRING);
    const error = sut.validate({ valid_field: FakeData.word() });

    expect(error).toBeUndefined();
  });

  test("Should return undefined if field is a number and should be a number", () => {
    const { sut } = makeSut("valid_field", FieldTypeEnum.NUMBER);
    const error = sut.validate({ valid_field: FakeData.numberInteger() });

    expect(error).toBeUndefined();
  });

  test("Should return undefined if field is true and should be a boolean", () => {
    const { sut } = makeSut("valid_field", FieldTypeEnum.BOOLEAN);
    const error = sut.validate({ valid_field: true });

    expect(error).toBeUndefined();
  });

  test("Should return undefined if field is false and should be a boolean", () => {
    const { sut } = makeSut("valid_field", FieldTypeEnum.BOOLEAN);
    const error = sut.validate({ valid_field: false });

    expect(error).toBeUndefined();
  });

  test("Should return undefined if field is a array and should be an array", () => {
    const { sut } = makeSut("valid_field", FieldTypeEnum.ARRAY);
    const error = sut.validate({ valid_field: [] });

    expect(error).toBeUndefined();
  });

  test("Should return undefined if field is an object and should be an object", () => {
    const { sut } = makeSut("valid_field", FieldTypeEnum.OBJECT);
    const error = sut.validate({ valid_field: {} });

    expect(error).toBeUndefined();
  });
});
