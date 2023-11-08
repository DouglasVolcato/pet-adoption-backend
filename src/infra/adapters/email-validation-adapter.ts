import { validate } from "email-validator";
import { EmailValidatorInterface } from "../../validation/protocols";

export class EmailValidationAdapter implements EmailValidatorInterface {
  public isEmail(value: string): boolean {
    return validate(value);
  }
}
