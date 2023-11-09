import { badRequest, serverError } from "../helpers";
import { ValidatorInterface } from "../protocols";
import {
  ControllerInterface,
  ControllerInputType,
  ControllerOutputType,
} from "../../main/protocols";

export abstract class Controller implements ControllerInterface {
  private readonly validator: ValidatorInterface;

  public constructor() {
    this.validator = this.getValidation();
  }

  protected abstract perform(
    request: ControllerInputType<any>
  ): Promise<ControllerOutputType<any | Error>>;

  protected abstract getValidation(): ValidatorInterface;

  public async execute(
    request: ControllerInputType<any>
  ): Promise<ControllerOutputType<any | Error>> {
    try {
      const error = this.validator.validate(request);
      if (error !== undefined) return badRequest(error);
      return await this.perform(request);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
