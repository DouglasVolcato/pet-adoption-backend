import { PetEntityType } from "../../domain/protocols";
import { GatewayInterface, GatewayOutputType } from "../protocols";

export class PetSearchGatewayComposite implements GatewayInterface {
  private gateways!: GatewayInterface[];

  public constructor(gateways: GatewayInterface[]) {
    this.gateways = gateways;
  }

  public async request(): GatewayOutputType<PetEntityType[]> {
    const gatewayPromises: Promise<PetEntityType[]>[] = this.gateways.map(
      (gateway) => gateway.request()
    );
    const results: PetEntityType[][] = await Promise.all(gatewayPromises);
    return results.flat();
  }
}
