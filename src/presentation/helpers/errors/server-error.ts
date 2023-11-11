export class ServerError extends Error {
  public constructor(message: string = "Server error") {
    super(message);
    this.name = "ServerError";
  }
}
