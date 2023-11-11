import { IdGeneratorInterface } from "../../../../src/data/protocols";
import { FakeData } from "../../fake-data";

export class IdGeneratorStub implements IdGeneratorInterface {
  public generateId(): string {
    return FakeData.id();
  }
}
