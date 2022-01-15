import { Connection } from 'typeorm/connection/Connection';
import { Factory, Seed } from 'typeorm-seeding';

import { AppUser } from '../../api/models/AppUser';

export class CreateAppUsers implements Seed {
  public async seed(factory: Factory, connection: Connection): Promise<any> {
    await factory(AppUser)().seedMany(10);
  }
}
