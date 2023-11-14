import { GatewayOutputType } from "../../../../src/apis/protocols";
import { PetSearcherInterface } from "../../../../src/data/protocols";
import { PetEntityType } from "../../../../src/domain/protocols";

export class PetSearcherStub implements PetSearcherInterface {
  public async request(): GatewayOutputType<PetEntityType[]> {
    return Promise.resolve([]);
  }
  public requestFinished(): boolean {
    return false;
  }
}
