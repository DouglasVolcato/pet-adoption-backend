import { SearchPetsControllerTypes, ValidatorInterface } from "../protocols";
import { ValidatorComposite } from "../../validation/composites";
import { SearchPetsUseCase } from "../../domain/protocols";
import { FieldTypeEnum } from "../../validation/protocols";
import { ValidatorBuilder } from "../../validation/builders";
import { ControllerInterface } from "../../main/protocols";
import { Controller } from "./controller";
import { ok } from "../helpers";

export class SearchPetsController
  extends Controller
  implements ControllerInterface
{
  private readonly searchPetsService: SearchPetsUseCase.Service;

  public constructor(searchPetsService: SearchPetsUseCase.Service) {
    super();
    this.searchPetsService = searchPetsService;
  }

  protected async perform(
    request: SearchPetsControllerTypes.Input
  ): SearchPetsControllerTypes.Output {
    const foundPets = await this.searchPetsService.execute(request);
    return ok(foundPets);
  }

  protected getValidation(): ValidatorInterface {
    return new ValidatorComposite([
      new ValidatorBuilder().of("limit").isRequired(),
      new ValidatorBuilder().of("limit").isType(FieldTypeEnum.NUMBER),
      new ValidatorBuilder().of("offset").isRequired(),
      new ValidatorBuilder().of("offset").isType(FieldTypeEnum.NUMBER),
    ]);
  }
}
