import { UnauthorizedError } from "..";
import { ControllerOutputType } from "../../../main/protocols";

export const unauthorized = (): ControllerOutputType<Error> => ({
  statusCode: 401,
  data: new UnauthorizedError(),
});
