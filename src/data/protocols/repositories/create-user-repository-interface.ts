import { UserEntityType } from "../../../domain/protocols";

export interface CreateUserRepositoryInterface {
  create(userEntity: UserEntityType): Promise<UserEntityType>;
}
