import * as express from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

import { env } from '../../env';

@Middleware({ type: 'before' })
export class BodyPayloadLimiterMiddleware implements ExpressMiddlewareInterface {
  public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
    return express.json({ limit: env.limit.bodyPayloadLimit })(req, res, next);
  }
}
