import { LoginUseCase, UserEntityType } from "../../../domain/protocols";
import {
  ControllerInputType,
  ControllerOutputType,
} from "../../../main/protocols";

export namespace LoginControllerTypes {
  export type Input = ControllerInputType<LoginUseCase.Input>;
  export type Output = Promise<
    ControllerOutputType<Error | { user: UserEntityType; token: string }>
  >;
}
