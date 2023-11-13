import express, { Express, NextFunction, Request, Response } from "express";
import { ServerError } from "../../presentation/helpers";
import bodyParser from "body-parser";
import cors from "cors";
import {
  ControllerInterface,
  MiddlewareInterface,
  RouteDtoType,
} from "../protocols";

export class ExpressAdapter {
  private readonly routes: RouteDtoType[];
  private readonly app: Express;
  private readonly port: number;
  private server: any;

  public constructor(routes: RouteDtoType[], port: number) {
    this.routes = routes;
    this.port = port;
    this.server = null;
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  public async start(): Promise<void> {
    Promise.resolve((this.server = this.app.listen(this.port)));
  }

  public async stop(): Promise<void> {
    if (this.server) {
      Promise.resolve(this.server.close());
      this.server = null;
    }
  }

  private setupMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(cors());
  }

  private setupRoutes(): void {
    for (const route of this.routes) {
      this.app[route.type](
        route.url,
        this.setUpMiddleware(route.middleware),
        async (req: Request, res: Response) => {
          const controller: ControllerInterface = route.controller();
          const response = await controller.execute({
            ...req.body,
            ...req.params,
            ...req.query,
            ...req.headers,
          });
          const isError = response.data instanceof Error;
          const body = isError
            ? { error: response.data.message }
            : response.data;
          res.status(response.statusCode).json(body);
        }
      );
    }
  }

  private setUpMiddleware(
    middleware: (() => MiddlewareInterface) | undefined
  ): any {
    if (!middleware) {
      return async function setUpMiddleware(
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        next();
      };
    } else {
      return async function setUpMiddleware(
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        const output = await middleware().execute({
          ...req.body,
          ...req.params,
          ...req.headers,
        });
        if (output instanceof ServerError) {
          res.status(500).json({ error: output.message });
          return;
        }
        if (output instanceof Error) {
          res.status(401).json({ error: output.message });
          return;
        }
        req.body = { ...req.body, ...output };
        next();
      };
    }
  }
}
