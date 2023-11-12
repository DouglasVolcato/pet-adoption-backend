import { SearchPetsUseCase } from "../../../domain/protocols";
import {
  ControllerInputType,
  ControllerOutputType,
} from "../../../main/protocols";

export namespace SearchPetsControllerTypes {
  export type Input = ControllerInputType<SearchPetsUseCase.Input>;
  export type Output = ControllerOutputType<SearchPetsUseCase.Output>;
}
