import { RequiredFieldError } from "../../../src/presentation/helpers";
import { RequiredFieldValidator } from "../../../src/validation/validators";
import { FakeData } from "../../test-helpers/fake-data";

const mockData = () => ({
  any_field1: FakeData.word(),
  any_field2: FakeData.word(),
});

type SutTypes = {
  sut: RequiredFieldValidator;
};

const makeSut = (fieldName: string): SutTypes => {
  const sut = new RequiredFieldValidator(fieldName);
  return { sut };
};

describe("RequiredFieldValidator", () => {
  test("Should return an error if field does not exist", () => {
    const { sut } = makeSut("wrong_field");
    const result = sut.validate(mockData());

    expect(result).toBeInstanceOf(RequiredFieldError);
  });

  test("Should return undefined if field exists", () => {
    const { sut } = makeSut("any_field1");
    const result = sut.validate(mockData());

    expect(result).toBeUndefined();
  });
});
