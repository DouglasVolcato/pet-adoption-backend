import { GatewayOutputType } from "../../../apis/protocols";
import { PetEntityType } from "../../../domain/protocols";

export interface PetSearcherInterface {
  request(): GatewayOutputType<PetEntityType[]>;
}
