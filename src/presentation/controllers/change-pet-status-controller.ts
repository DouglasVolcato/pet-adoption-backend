import { ChangePetStatusUseCase } from "../../domain/protocols";
import { ValidatorComposite } from "../../validation/composites";
import { badRequest, ok, unauthorized } from "../helpers";
import { FieldTypeEnum } from "../../validation/protocols";
import { ValidatorBuilder } from "../../validation/builders";
import { ControllerInterface } from "../../main/protocols";
import { Controller } from "./controller";
import {
  ChangePetStatusControllerTypes,
  ValidatorInterface,
} from "../protocols";

export class ChangePetStatusController
  extends Controller
  implements ControllerInterface
{
  private readonly changePetStatusService: ChangePetStatusUseCase.Service;

  public constructor(changePetStatusService: ChangePetStatusUseCase.Service) {
    super();
    this.changePetStatusService = changePetStatusService;
  }

  protected async perform(
    request: ChangePetStatusControllerTypes.Input
  ): ChangePetStatusControllerTypes.Output {
    if (!request.user.admin) {
      return unauthorized();
    }
    const { petId, newStatus } = request;
    const updatedPet = await this.changePetStatusService.execute({
      petId,
      newStatus,
    });
    if (updatedPet instanceof Error) {
      return badRequest(updatedPet);
    }
    return ok(updatedPet);
  }

  protected getValidation(): ValidatorInterface {
    return new ValidatorComposite([
      new ValidatorBuilder().of("petId").isRequired(),
      new ValidatorBuilder().of("petId").isType(FieldTypeEnum.STRING),
      new ValidatorBuilder().of("newStatus").isRequired(),
      new ValidatorBuilder().of("newStatus").isType(FieldTypeEnum.STRING),
    ]);
  }
}
