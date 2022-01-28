import { Connection } from 'typeorm';
import { Factory, Seed } from 'typeorm-seeding';
import * as uuid from 'uuid';

import { AppUser, AppUserRole } from '../../api/models/AppUser';

export class CreateAdmin implements Seed {
  public seed(factory: Factory, connection: Connection): Promise<AppUser> {
    const em = connection.createEntityManager();

    const user = new AppUser();
    user.id = uuid.v1();
    user.firstName = 'Root';
    user.lastName = 'Admin';
    user.email = 'root@admin.com';
    user.username = 'admin';
    user.password = 'admin';
    user.address = 'Sample admin address';
    user.postCode = '1111';
    user.contactNo = '12345678901';
    user.role = AppUserRole.ADMIN;
    return em.save(user);
  }
}
