import { RouteDtoType, RouteEnumType } from "../protocols";
import {
  makeChangePetStatusControllerFactory,
  makeIndexPetsControllerFactory,
  makeSearchPetsControllerFactory,
  makeUserAuthMiddleware,
} from "../factories";

export const PetRoutes: RouteDtoType[] = [
  {
    url: "/pet",
    type: RouteEnumType.POST,
    controller: makeIndexPetsControllerFactory,
    middleware: makeUserAuthMiddleware,
  },
  {
    url: "/pet",
    type: RouteEnumType.PUT,
    controller: makeChangePetStatusControllerFactory,
    middleware: makeUserAuthMiddleware,
  },
  {
    url: "/pet",
    type: RouteEnumType.GET,
    controller: makeSearchPetsControllerFactory,
  },
];
