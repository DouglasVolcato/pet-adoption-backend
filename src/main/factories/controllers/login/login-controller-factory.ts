import { makeDbTransactionControllerDecoratorFactory } from "../..";
import { BcryptAdapter, JwtAdapter } from "../../../../infra/adapters";
import { UserMongoDBRepository } from "../../../../infra/databases";
import { LoginController } from "../../../../presentation/controllers";
import { LoginService } from "../../../../data/services";
import { ControllerInterface } from "../../../protocols";

export function makeLoginControllerFactory(): ControllerInterface {
  const getUserByEmailRepository = new UserMongoDBRepository();
  const passwordHashChecker = new BcryptAdapter(10);
  const tokenGenerator = new JwtAdapter();
  const loginService = new LoginService(
    getUserByEmailRepository,
    passwordHashChecker,
    tokenGenerator
  );
  const controller = new LoginController(loginService);
  return makeDbTransactionControllerDecoratorFactory(controller);
}
