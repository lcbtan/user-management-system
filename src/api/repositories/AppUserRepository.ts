import { EntityRepository, Repository } from 'typeorm';

import { AppUser } from '../models/AppUser';

@EntityRepository(AppUser)
export class AppUserRepository extends Repository<AppUser>  {

}
