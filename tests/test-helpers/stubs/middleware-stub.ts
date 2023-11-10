import { Middleware } from "../../../src/presentation/middlewares/middleware";
import { ok } from "../../../src/presentation/helpers";
import { ValidatorInterface } from "../../../src/presentation/protocols";
import { ValidatorStub } from "./validator-stub";
import {
  MiddlewareInputType,
  MiddlewareInterface,
  MiddlewareOutputType,
} from "../../../src/main/protocols";

export class MiddlewareStub extends Middleware implements MiddlewareInterface {
  public constructor() {
    super();
  }

  public async perform(
    request: MiddlewareInputType<any>
  ): Promise<MiddlewareOutputType<any | Error>> {
    return ok({});
  }

  protected getValidation(): ValidatorInterface {
    return new ValidatorStub();
  }
}
