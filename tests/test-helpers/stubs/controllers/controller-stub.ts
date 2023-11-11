import { Controller } from "../../../../src/presentation/controllers/controller";
import { ok } from "../../../../src/presentation/helpers";
import { ValidatorInterface } from "../../../../src/presentation/protocols";
import { ValidatorStub } from "./../validators/validator-stub";
import {
  ControllerInputType,
  ControllerInterface,
  ControllerOutputType,
} from "../../../../src/main/protocols";

export class ControllerStub extends Controller implements ControllerInterface {
  public constructor() {
    super();
  }

  public async perform(
    request: ControllerInputType<any>
  ): Promise<ControllerOutputType<any | Error>> {
    return ok({});
  }

  protected getValidation(): ValidatorInterface {
    return new ValidatorStub();
  }
}
