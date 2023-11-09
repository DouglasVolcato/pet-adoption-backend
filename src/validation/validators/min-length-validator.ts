import { ValidatorInterface } from "../../presentation/protocols";
import { InvalidFieldError, RequiredFieldError } from "../errors";

export class MinLengthValidator implements ValidatorInterface {
  private readonly fieldName: string;
  private readonly minFieldLength: number;

  public constructor(fieldName: string, minFieldLength: number) {
    this.fieldName = fieldName;
    this.minFieldLength = minFieldLength;
  }

  public validate(data: any): Error | undefined {
    if (!data[this.fieldName]) {
      return new RequiredFieldError(this.fieldName);
    }
    if (typeof data[this.fieldName] !== "string") {
      return new InvalidFieldError(this.fieldName);
    }
    if (data[this.fieldName].length < this.minFieldLength) {
      return new InvalidFieldError(this.fieldName);
    }
  }
}
