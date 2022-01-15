import { Action } from 'routing-controllers';
import { Connection } from 'typeorm';

import { AppUser } from '../api/models/AppUser';

export function currentUserChecker(connection: Connection): (action: Action) => Promise<AppUser | undefined> {
  return function innerCurrentUserChecker(action: Action): Promise<AppUser | undefined> {
    return action.request.user;
  };
}
