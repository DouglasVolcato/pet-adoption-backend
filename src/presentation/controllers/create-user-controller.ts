import { CreateUserControllerTypes, ValidatorInterface } from "../protocols";
import { ValidatorComposite } from "../../validation/composites";
import { CreateUserUseCase } from "../../domain/protocols";
import { FieldTypeEnum } from "../../validation/protocols";
import { ValidatorBuilder } from "../../validation/builders";
import { ControllerInterface } from "../../main/protocols";
import { badRequest, ok } from "../helpers";
import { Controller } from "./controller";

export class CreateUserController
  extends Controller
  implements ControllerInterface
{
  private readonly createUserService: CreateUserUseCase.Service;

  public constructor(createUserService: CreateUserUseCase.Service) {
    super();
    this.createUserService = createUserService;
  }

  protected async perform(
    request: CreateUserControllerTypes.Input
  ): CreateUserControllerTypes.Output {
    const updatedPet = await this.createUserService.execute(request);
    if (updatedPet instanceof Error) {
      return badRequest(updatedPet);
    }
    return ok(updatedPet);
  }

  protected getValidation(): ValidatorInterface {
    return new ValidatorComposite([
      new ValidatorBuilder().of("name").isRequired(),
      new ValidatorBuilder().of("name").isType(FieldTypeEnum.STRING),
      new ValidatorBuilder().of("email").isRequired(),
      new ValidatorBuilder().of("email").isType(FieldTypeEnum.STRING),
      new ValidatorBuilder().of("email").isEmail(),
      new ValidatorBuilder().of("password").isRequired(),
      new ValidatorBuilder().of("password").isType(FieldTypeEnum.STRING),
      new ValidatorBuilder().of("password").isMinLength(6),
    ]);
  }
}
