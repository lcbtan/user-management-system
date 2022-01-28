import * as express from 'express';
import rateLimit from 'express-rate-limit';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

import { env } from '../../env';

@Middleware({ type: 'before' })
export class RateLimiterMiddleware implements ExpressMiddlewareInterface {
  public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
    return rateLimit({
      windowMs: env.limit.rateWindowTime * 60 * 1000,
      max: env.limit.rateLimit,
      message: 'Too many requests from this IP, please try again next hour.',
    })(req, res, next);
  }
}
