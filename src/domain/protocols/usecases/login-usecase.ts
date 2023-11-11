import { UserEntityType } from "../entities/user-entity-type";

export namespace LoginUseCase {
  export interface Service {
    execute(input: Input): Output;
  }
  export type Input = {
    email: string;
    password: string;
  };
  export type Output = Promise<{ user: UserEntityType; token: string } | Error>;
}
