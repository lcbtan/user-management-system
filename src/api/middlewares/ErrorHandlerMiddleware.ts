import { classToPlain } from 'class-transformer';
import * as express from 'express';
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { env } from '../../env';
import { JSendError } from '../controllers/responses/error';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  public isProduction = env.isProduction;

  constructor(@Logger(__filename) private log: LoggerInterface) {}

  public error(error: HttpError, req: express.Request, res: express.Response, next: express.NextFunction): void {
    const errorCode = error.httpCode || 500;
    res.status(errorCode);
    const err = new JSendError(
      {
        name: error.name,
        message: error.message,
        // eslint-disable-next-line @typescript-eslint/dot-notation
        errors: error[`errors`] || [],
      },
      errorCode
    );
    res.json(classToPlain(err));

    if (this.isProduction) {
      this.log.error(error.name, error.message);
    } else {
      this.log.error(error.name, error.stack);
    }
  }
}
