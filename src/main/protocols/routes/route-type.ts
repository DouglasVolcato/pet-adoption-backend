import { ControllerInterface } from "../controllers/controller-interface";
import { MiddlewareInterface } from "../middlewares/middleware-interface";

export enum RouteEnumType {
  GET = "get",
  POST = "post",
  DELETE = "delete",
  PUT = "put",
  PATCH = "patch",
}

export type RouteDtoType = {
  type: RouteEnumType;
  url: string;
  controller: () => ControllerInterface;
  middleware?: () => MiddlewareInterface;
};
