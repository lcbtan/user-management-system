import { EventSubscriber, On } from 'event-dispatch';

import { Logger } from '../../lib/logger';
import { AppUser } from '../models/AppUser';
import { events } from './events';

const log = new Logger(__filename);

@EventSubscriber()
export class AppUserEventSubscriber {
  @On(events.user.created)
  public onUserCreate(user: AppUser): void {
    log.info(`User ${user.toString()} created!`);
  }
}
