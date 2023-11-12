import { TokenDecrypterInterface } from "../../../../src/data/protocols";
import { makeRandonData } from "../../mocks";

export class TokenDecrypterStub implements TokenDecrypterInterface {
  public decryptToken(token: string, secret: string): any | undefined {
    return makeRandonData();
  }
}
