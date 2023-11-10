import { MiddlewareInputType } from "./middleware-input-type";
import { MiddlewareOutputType } from "./middleware-output-type";

export interface MiddlewareInterface {
  execute(request: MiddlewareInputType<any>): MiddlewareOutputType<any>;
}
