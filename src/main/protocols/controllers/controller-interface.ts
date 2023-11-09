export type ControllerInputType<T> = T;
export type ControllerOutputType<T> = {
  statusCode: number;
  data: T;
};
export interface ControllerInterface {
  execute(
    request: ControllerInputType<any>
  ): Promise<ControllerOutputType<any | Error>>;
}
