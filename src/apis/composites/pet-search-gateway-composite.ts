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

  public async request(): GatewayOutputType<PetEntityType[]> {
    for (const gateway of this.gateways) {
      if (gateway.requestFinished()) continue;
      const pets: PetEntityType[] = await gateway.request();
      return pets;
    }
    return [];
  }

  public requestFinished(): boolean {
    for (const gateway of this.gateways) {
      if (!gateway.requestFinished()) {
        return false;
      }
    }
    return true;
  }
}
