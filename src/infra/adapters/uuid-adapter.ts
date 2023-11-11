import { IdGeneratorInterface } from "../../data/protocols";
import { v4 } from "uuid";

export class UuidAdapter implements IdGeneratorInterface {
  public generateId(): string {
    return v4();
  }
}
