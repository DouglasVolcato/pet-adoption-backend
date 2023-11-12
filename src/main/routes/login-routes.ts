import { RouteDtoType, RouteEnumType } from "../protocols";
import { makeLoginControllerFactory } from "../factories";

export const LoginRoutes: RouteDtoType[] = [
  {
    url: "/login",
    type: RouteEnumType.POST,
    controller: makeLoginControllerFactory,
  },
];
