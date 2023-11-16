import { GatewayOutputType } from "./gateway-output-type";

export interface GatewayInterface {
  request(): GatewayOutputType<any>;
}
