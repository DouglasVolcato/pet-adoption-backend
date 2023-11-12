import { CreateUserControllerTypes, ValidatorInterface } from "../protocols";
import { ValidatorComposite } from "../../validation/composites";
import { IndexPetsUseCase } from "../../domain/protocols";
import { ControllerInterface } from "../../main/protocols";
import { Controller } from "./controller";
import { ok } from "../helpers";

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
    request: CreateUserControllerTypes.Input
  ): CreateUserControllerTypes.Output {
    await this.indexPetsService.execute();
    return ok({});
  }

  protected getValidation(): ValidatorInterface {
    return new ValidatorComposite([]);
  }
}
