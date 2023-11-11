import { TokenGeneratorInterface } from "../../../src/data/protocols";
import { FakeData } from "../fake-data";

export class TokenGeneratorStub implements TokenGeneratorInterface {
  public generateToken(content: any, secret: string): string {
    return FakeData.password();
  }
}
