import { EmailValidatorInterface } from "../validation/protocols";
import { validate } from "email-validator";

export class EmailValidationAdapter implements EmailValidatorInterface {
  public isEmail(value: string): boolean {
    return validate(value);
  }
}
