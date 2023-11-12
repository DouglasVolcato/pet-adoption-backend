import { UserAuthMiddleware } from "../../../../presentation/middlewares";
import { UserMongoDBRepository } from "../../../../infra/databases";
import { GetUserByTokenService } from "../../../../data/services";
import { JwtAdapter } from "../../../../infra/adapters";

export function makeUserAuthMiddleware(): UserAuthMiddleware {
  const tokenDecrypter = new JwtAdapter();
  const getUserByIdRepository = new UserMongoDBRepository();
  const getUserByTokenService = new GetUserByTokenService(
    tokenDecrypter,
    getUserByIdRepository
  );
  return new UserAuthMiddleware(getUserByTokenService);
}
