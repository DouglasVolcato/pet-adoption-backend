import { LoginControllerTypes, ValidatorInterface } from "../protocols";
import { ValidatorComposite } from "../../validation/composites";
import { FieldTypeEnum } from "../../validation/protocols";
import { ValidatorBuilder } from "../../validation/builders";
import { ControllerInterface } from "../../main/protocols";
import { LoginUseCase } from "../../domain/protocols";
import { badRequest, ok } from "../helpers";
import { Controller } from "./controller";

export class LoginController extends Controller implements ControllerInterface {
  private readonly loginService: LoginUseCase.Service;

  public constructor(loginService: LoginUseCase.Service) {
    super();
    this.loginService = loginService;
  }

  protected async perform(
    request: LoginControllerTypes.Input
  ): LoginControllerTypes.Output {
    const output = await this.loginService.execute(request);
    if (output instanceof Error) {
      return badRequest(output);
    }
    return ok({
      token: output.token,
      user: {
        id: output.user.id,
        name: output.user.name,
        email: output.user.email,
        admin: output.user.admin,
      },
    });
  }

  protected getValidation(): ValidatorInterface {
    return new ValidatorComposite([
      new ValidatorBuilder().of("email").isRequired(),
      new ValidatorBuilder().of("email").isType(FieldTypeEnum.STRING),
      new ValidatorBuilder().of("password").isRequired(),
      new ValidatorBuilder().of("password").isType(FieldTypeEnum.STRING),
    ]);
  }
}
