import { UserEntityType } from "../../../domain/protocols";
import {
  ControllerInputType,
  ControllerOutputType,
} from "../../../main/protocols";

export namespace IndexPetsControllerTypes {
  export type Input = ControllerInputType<{
    user: UserEntityType;
  }>;
  export type Output = Promise<ControllerOutputType<void>>;
}
