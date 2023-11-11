import { ControllerInputType } from "./controller-input-type";
import { ControllerOutputType } from "./controller-output-type";

export interface ControllerInterface {
  execute(
    request: ControllerInputType<any>
  ): Promise<ControllerOutputType<any | Error>>;
}
