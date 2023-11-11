import { UserDtoType } from "../dtos/user-dto-type";
import { UserEntityType } from "../entities/user-entity-type";

export namespace CreateUserUseCase {
  export interface Service {
    execute(input: Input): Output;
  }
  export type Input = UserDtoType;
  export type Output = Promise<UserEntityType | Error>;
}
