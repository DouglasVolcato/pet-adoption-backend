import { ClientGetRequestSenderInterface } from "../../infra/protocols";
import { GatewayInterface, GatewayOutputType } from "../protocols";
import { EnvVars } from "../../main/config";
import {
  PetCategoryEnum,
  PetEntityType,
  PetStatusEnum,
} from "../../domain/protocols";

export type DogsApiResponseType = {
  breeds: {
    name: string;
    description: string;
  }[];
  url: string;
};

export class DogsApiGateway implements GatewayInterface {
  private readonly clientGetRequestSender: ClientGetRequestSenderInterface;
  private readonly url: string;
  private readonly headers: any;
  private page: number;

  public constructor(clientGetRequestSender: ClientGetRequestSenderInterface) {
    this.url = "https://api.thedogapi.com/v1/images/search";
    this.headers = { "x-api-key": EnvVars.DOGS_API_TOKEN() };
    this.clientGetRequestSender = clientGetRequestSender;
    this.page = 0;
  }

  public async request(): GatewayOutputType<PetEntityType[]> {
    const data: DogsApiResponseType[] = await this.clientGetRequestSender.get(
      `${this.url}?limit=80&order=Asc&page=${this.page}`,
      this.headers
    );
    this.page++;
    return data.map((pet) => ({
      id: "",
      createdAt: "",
      image: pet.url,
      name: pet.breeds?.length > 0 ? pet.breeds[0].name : "Dog",
      description: pet.breeds?.length > 0 ? pet.breeds[0].description : "",
      category: PetCategoryEnum.DOGS,
      status: PetStatusEnum.FREE,
    }));
  }

  public requestFinished(): boolean {
    return this.page === 2;
    return this.page === 100;
  }
}
