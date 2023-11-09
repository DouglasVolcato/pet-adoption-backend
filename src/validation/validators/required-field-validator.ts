import { ValidatorInterface } from "../../presentation/protocols";
import { RequiredFieldError } from "../../presentation/helpers";

export class RequiredFieldValidator implements ValidatorInterface {
  private readonly fieldName: string;

  public constructor(fieldName: string) {
    this.fieldName = fieldName;
  }

  public validate(data: any): Error | undefined {
    if (!data[this.fieldName]) {
      return new RequiredFieldError(this.fieldName);
    }
  }
}
