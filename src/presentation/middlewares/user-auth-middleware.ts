import { GetUserByTokenUserUseCase } from "../../domain/protocols";
import { MiddlewareInterface } from "../../main/protocols";
import { ValidatorBuilder } from "../../validation/builders";
import { ValidatorComposite } from "../../validation/composites";
import { UnauthorizedError } from "../helpers";
import { ValidatorInterface } from "../protocols";
import { Middleware } from "./middleware";

export class UserAuthMiddleware
  extends Middleware
  implements MiddlewareInterface
{
  private readonly getUserByTokenService: GetUserByTokenUserUseCase.Service;

  public constructor(getUserByTokenService: GetUserByTokenUserUseCase.Service) {
    super();
    this.getUserByTokenService = getUserByTokenService;
  }

  protected async perform(request: any): Promise<any | Error> {
    const authorizationSplit = request.authorization.split(" ");
    if (!authorizationSplit || authorizationSplit[0] !== "Bearer") {
      return new UnauthorizedError();
    }
    const foundUser = await this.getUserByTokenService.execute({
      token: authorizationSplit[1],
    });
    if (!foundUser || foundUser instanceof Error) {
      return new UnauthorizedError();
    }
    return { user: foundUser };
  }

  protected getValidation(): ValidatorInterface {
    return new ValidatorComposite([
      new ValidatorBuilder().of("authorization").isRequired(),
    ]);
  }
}
