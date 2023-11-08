import { hashSync, compareSync } from "bcrypt";
import {
  PasswordHashCheckerInterface,
  PasswordHasherInterface,
} from "../../data/protocols";

export class BcryptAdapter
  implements PasswordHasherInterface, PasswordHashCheckerInterface
{
  private readonly hashSalt: number;

  public constructor(hashSalt: number) {
    this.hashSalt = hashSalt;
  }

  public hash(value: string): string {
    return hashSync(value, this.hashSalt);
  }

  public validate(value: string, hashedValue: string): boolean {
    return compareSync(value, hashedValue);
  }
}
