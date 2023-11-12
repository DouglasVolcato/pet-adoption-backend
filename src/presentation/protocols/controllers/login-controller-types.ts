import { LoginUseCase } from "../../../domain/protocols";
import {
  ControllerInputType,
  ControllerOutputType,
} from "../../../main/protocols";

export namespace LoginControllerTypes {
  export type Input = ControllerInputType<LoginUseCase.Input>;
  export type Output = ControllerOutputType<LoginUseCase.Output>;
}
