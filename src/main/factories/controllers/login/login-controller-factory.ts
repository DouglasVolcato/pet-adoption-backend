import { BcryptAdapter, JwtAdapter } from "../../../../infra/adapters";
import { UserMongoDBRepository } from "../../../../infra/databases";
import { LoginController } from "../../../../presentation/controllers";
import { LoginService } from "../../../../data/services";

export function makeLoginControllerFactory(): LoginController {
  const getUserByEmailRepository = new UserMongoDBRepository();
  const passwordHashChecker = new BcryptAdapter(10);
  const tokenGenerator = new JwtAdapter();
  const loginService = new LoginService(
    getUserByEmailRepository,
    passwordHashChecker,
    tokenGenerator
  );
  return new LoginController(loginService);
}
