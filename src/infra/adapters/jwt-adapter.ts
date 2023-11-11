import { JwtPayload, sign, verify } from "jsonwebtoken";
import {
  TokenDecrypterInterface,
  TokenGeneratorInterface,
} from "../../data/protocols";

export class JwtAdapter
  implements TokenGeneratorInterface, TokenDecrypterInterface
{
  public generateToken(content: any, secret: string): string {
    return sign(content, secret, {
      expiresIn: 86400,
    });
  }

  public decryptToken(token: string, secret: string): any | undefined {
    try {
      const payload = verify(token, secret) as JwtPayload;
      return payload;
    } catch (error) {
      return undefined;
    }
  }
}
