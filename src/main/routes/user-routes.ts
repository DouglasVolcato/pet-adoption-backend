import { makeCreateUserControllerFactory } from "../factories";
import { RouteDtoType, RouteEnumType } from "../protocols";

export const UserRoutes: RouteDtoType[] = [
  {
    url: "/user",
    type: RouteEnumType.POST,
    controller: makeCreateUserControllerFactory,
  },
];
