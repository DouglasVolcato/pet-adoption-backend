import { ClientGetRequestSenderInterface } from "../../../src/infra/protocols";
import { makeRandonData } from "../mocks";

export class ClientGetRequestSenderStub
  implements ClientGetRequestSenderInterface
{
  public async get(url: string, headers?: any): Promise<any> {
    return Promise.resolve(makeRandonData());
  }
}
