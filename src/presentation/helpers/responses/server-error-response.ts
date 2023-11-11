import { ControllerOutputType } from "../../../main/protocols";
import { ServerError } from "..";

export const serverError = (
  error = new ServerError()
): ControllerOutputType<Error> => ({
  statusCode: 500,
  data: error,
});
