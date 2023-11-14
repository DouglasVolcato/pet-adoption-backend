import { IndexPetsControllerTypes, ValidatorInterface } from "../protocols";
import { ValidatorComposite } from "../../validation/composites";
import { IndexPetsUseCase } from "../../domain/protocols";
import { ControllerInterface } from "../../main/protocols";
import { ok, unauthorized } from "../helpers";
import { Controller } from "./controller";

export class IndexPetsController
  extends Controller
  implements ControllerInterface
{
  private readonly indexPetsService: IndexPetsUseCase.Service;

  public constructor(indexPetsService: IndexPetsUseCase.Service) {
    super();
    this.indexPetsService = indexPetsService;
  }

  protected async perform(
    request: IndexPetsControllerTypes.Input
  ): IndexPetsControllerTypes.Output {
    if (!request.user.admin) {
      return unauthorized();
    }
    await this.indexPetsService.execute();
    return ok({});
  }

  protected getValidation(): ValidatorInterface {
    return new ValidatorComposite([]);
  }
}
