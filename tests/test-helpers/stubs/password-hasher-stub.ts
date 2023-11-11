import { PasswordHasherInterface } from "../../../src/data/protocols";
import { FakeData } from "../fake-data";

export class PasswordHasherStub implements PasswordHasherInterface {
  public hash(value: string): string {
    return FakeData.password();
  }
}
