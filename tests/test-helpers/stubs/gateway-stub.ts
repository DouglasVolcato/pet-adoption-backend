import { makeRandonData } from "../mocks";
import {
  GatewayInterface,
  GatewayOutputType,
} from "../../../src/infra/protocols";

export class GatewayStub implements GatewayInterface {
  public async request(): GatewayOutputType<any> {
    return Promise.resolve(makeRandonData());
  }
}
