import axios from "axios";
import { ClientGetRequestSenderInterface } from "../protocols";

export class AxiosAdapter implements ClientGetRequestSenderInterface {
  public async get(url: string, headers: any = {}): Promise<any> {
    const response = await axios.get(url, {
      validateStatus: () => true,
      headers,
    });
    return response.data;
  }
}
