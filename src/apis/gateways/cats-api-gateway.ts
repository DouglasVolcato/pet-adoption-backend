import { ClientGetRequestSenderInterface } from "../../infra/protocols";
import { GatewayInterface, GatewayOutputType } from "../protocols";
import { PetEntityType } from "../../domain/protocols";
import { EnvVars } from "../../main/config";

export class CatsApiGateway implements GatewayInterface {
  private readonly clientGetRequestSender: ClientGetRequestSenderInterface;
  private readonly url: string;
  private readonly headers: any;

  public constructor(clientGetRequestSender: ClientGetRequestSenderInterface) {
    this.url = "https://api.thecatapi.com/v1/images/search";
    this.headers = { "x-api-key": EnvVars.CATS_API_TOKEN() };
    this.clientGetRequestSender = clientGetRequestSender;
  }

  public async request(): GatewayOutputType<PetEntityType[]> {
    const data = await this.clientGetRequestSender.get(this.url, this.headers);
    return data;
  }
}
