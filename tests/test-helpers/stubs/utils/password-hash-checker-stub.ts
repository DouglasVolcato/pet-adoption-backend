import { PasswordHashCheckerInterface } from "../../../../src/data/protocols";

export class PasswordHashCheckerStub implements PasswordHashCheckerInterface {
  public validate(value: string, hashedValue: string): boolean {
    return true;
  }
}
