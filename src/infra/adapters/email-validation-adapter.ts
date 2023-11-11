import { validate } from "email-validator";
import { EmailValidationInterface } from "../../validation/protocols";

export class EmailValidationAdapter implements EmailValidationInterface {
  public isEmail(value: string): boolean {
    return validate(value);
  }
}
