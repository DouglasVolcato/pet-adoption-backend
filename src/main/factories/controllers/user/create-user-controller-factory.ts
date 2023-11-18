import { CreateUserController } from "../../../../presentation/controllers";
import { BcryptAdapter, UuidAdapter } from "../../../../infra/adapters";
import { makeDbTransactionControllerDecoratorFactory } from "../..";
import { UserMongoDBRepository } from "../../../../infra/databases";
import { CreateUserService } from "../../../../data/services";
import { ControllerInterface } from "../../../protocols";

export function makeCreateUserControllerFactory(): ControllerInterface {
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
  const controller = new CreateUserController(createUserService);
  return makeDbTransactionControllerDecoratorFactory(controller);
}
