import { CreateUserController } from "../../../../presentation/controllers";
import { BcryptAdapter, UuidAdapter } from "../../../../infra/adapters";
import { UserMongoDBRepository } from "../../../../infra/databases";
import { CreateUserService } from "../../../../data/services";

export function makeCreateUserControllerFactory(): CreateUserController {
  const createUserRepository = new UserMongoDBRepository();
  const getUserByEmailRepository = new UserMongoDBRepository();
  const idGenerator = new UuidAdapter();
  const passwordHasher = new BcryptAdapter(10);
  const createUserService = new CreateUserService(
    createUserRepository,
    getUserByEmailRepository,
    idGenerator,
    passwordHasher
  );
  return new CreateUserController(createUserService);
}
