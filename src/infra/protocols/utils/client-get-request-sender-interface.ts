export interface ClientGetRequestSenderInterface {
  get(url: string, headers?: any): Promise<any>;
}
