import { GatewayInterface, GatewayOutputType } from "../protocols";
import { PetEntityType } from "../../domain/protocols";

export class PetSearchGatewayComposite implements GatewayInterface {
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
