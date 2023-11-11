import { ControllerOutputType } from "../../../main/protocols";

export const badRequest = (error: Error): ControllerOutputType<Error> => ({
  statusCode: 400,
  data: error,
});
