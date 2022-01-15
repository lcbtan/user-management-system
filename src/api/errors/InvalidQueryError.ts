import { HttpError } from 'routing-controllers';

export class InvalidQueryError extends HttpError {
  constructor() {
    super(400, 'Invalid query input!');
  }
}
