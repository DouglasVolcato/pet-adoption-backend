import { GatewayInterface, GatewayOutputType } from "../protocols";
import { PetEntityType } from "../../domain/protocols";
import { PetSearcherInterface } from "../../data/protocols";

export class PetSearchGatewayComposite
  implements GatewayInterface, PetSearcherInterface
{
  private gateways!: GatewayInterface[];

  public constructor(gateways: GatewayInterface[]) {
    this.gateways = gateways;
  }

  public async *request(): GatewayOutputType<PetEntityType[]> {
    for (const gateway of this.gateways) {
      for await (const pets of gateway.request()) {
        yield pets;
      }
    }
  }
}
