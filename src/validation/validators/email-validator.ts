import { EmailValidationAdapter } from "../../infra/adapters";
import { ValidatorInterface } from "../../presentation/protocols";
import { EmailValidationInterface } from "../protocols";
import {
  InvalidFieldError,
  RequiredFieldError,
} from "../../presentation/helpers";

export class EmailValidator implements ValidatorInterface {
  private readonly emailValidation: EmailValidationInterface;
  private readonly fieldName: string;

  public constructor(fieldName: string) {
    this.emailValidation = new EmailValidationAdapter();
    this.fieldName = fieldName;
  }

  public validate(data: any): Error | undefined {
    if (!data[this.fieldName]) {
      return new RequiredFieldError(this.fieldName);
    }
    if (!this.emailValidation.isEmail(data[this.fieldName])) {
      return new InvalidFieldError(this.fieldName);
    }
  }
}
