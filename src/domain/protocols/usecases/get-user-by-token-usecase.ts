import { UserEntityType } from "../entities/user-entity-type";

export namespace GetUserByTokenUserUseCase {
  export interface Service {
    execute(input: Input): Output;
  }
  export type Input = {
    token: string;
  };
  export type Output = Promise<UserEntityType | Error>;
}
