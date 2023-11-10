import { MiddlewareInterface, ControllerInputType } from "../../main/protocols";
import { ServerError } from "../helpers";
import { ValidatorInterface } from "../protocols";

export abstract class Middleware implements MiddlewareInterface {
  private readonly validator: ValidatorInterface;

  public constructor() {
    this.validator = this.getValidation();
  }

  protected abstract perform(
    request: ControllerInputType<any>
  ): Promise<any | Error>;

  protected abstract getValidation(): ValidatorInterface;

  public async execute(
    request: ControllerInputType<any>
  ): Promise<any | Error> {
    try {
      const error = this.validator.validate(request);
      if (error !== undefined) return error;
      return await this.perform(request);
    } catch (error: any) {
      return new ServerError(error.message);
    }
  }
}
