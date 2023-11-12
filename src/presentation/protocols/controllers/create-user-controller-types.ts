import { CreateUserUseCase, UserEntityType } from "../../../domain/protocols";
import {
  ControllerInputType,
  ControllerOutputType,
} from "../../../main/protocols";

export namespace CreateUserControllerTypes {
  export type Input = ControllerInputType<CreateUserUseCase.Input>;
  export type Output = Promise<ControllerOutputType<Error | UserEntityType>>;
}
