import { ClientGetRequestSenderInterface } from "../../infra/protocols";
import { GatewayInterface, GatewayOutputType } from "../protocols";
import { EnvVars } from "../../main/config";
import {
  PetCategoryEnum,
  PetEntityType,
  PetStatusEnum,
} from "../../domain/protocols";

export type CatsApiResponseType = {
  breeds: {
    name: string;
    description: string;
  }[];
  url: string;
};

export class CatsApiGateway implements GatewayInterface {
  private readonly clientGetRequestSender: ClientGetRequestSenderInterface;
  private readonly url: string;
  private readonly headers: any;
  private page: number;

  public constructor(clientGetRequestSender: ClientGetRequestSenderInterface) {
    this.url = "https://api.thecatapi.com/v1/images/search";
    this.headers = { "x-api-key": EnvVars.CATS_API_TOKEN() };
    this.clientGetRequestSender = clientGetRequestSender;
    this.page = 0;
  }

  public async request(): GatewayOutputType<PetEntityType[]> {
    const data: CatsApiResponseType[] = await this.clientGetRequestSender.get(
      `${this.url}?limit=80&order=Asc&page=${this.page}`,
      this.headers
    );
    this.page++;
    return data.map((pet) => ({
      id: "",
      createdAt: "",
      image: pet.url,
      name: pet.breeds?.length > 0 ? pet.breeds[0].name : "Cat",
      description: pet.breeds?.length > 0 ? pet.breeds[0].description : "",
      category: PetCategoryEnum.CATS,
      status: PetStatusEnum.FREE,
    }));
  }

  public requestFinished(): boolean {
    return this.page === 2;
  }
}
