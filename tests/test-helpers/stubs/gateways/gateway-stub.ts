import { makeRandonData } from "../../mocks";
import {
  GatewayInterface,
  GatewayOutputType,
} from "../../../../src/apis/protocols";

export class GatewayStub implements GatewayInterface {
  public async *request(): GatewayOutputType<any> {
    return Promise.resolve(makeRandonData());
  }
  public requestFinished(): boolean {
    return false;
  }
}
