import { EnvVars } from "../../../main/config";
import { ClientGetRequestSenderInterface } from "../../protocols";

export class DogsApiGateway {
  private readonly clientGetRequestSender: ClientGetRequestSenderInterface;
  private readonly url: string;
  private readonly headers: any;

  public constructor(clientGetRequestSender: ClientGetRequestSenderInterface) {
    this.url = "https://api.thedogapi.com/v1/images/search";
    this.headers = { "x-api-key": EnvVars.DOGS_API_TOKEN() };
    this.clientGetRequestSender = clientGetRequestSender;
  }

  public async request(): Promise<any[]> {
    const data = await this.clientGetRequestSender.get(this.url, this.headers);
    return data;
  }
}
