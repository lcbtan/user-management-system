import { FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';

import { AppUser as UserModel } from '../models/AppUser';
import { AppUserService } from '../services/AppUserService';
import { PetService } from '../services/PetService';
import { User } from '../types/User';

@Service()
@Resolver(of => User)
export class UserResolver {

    constructor(
        private userService: AppUserService,
        private petService: PetService
        ) {}

    @Query(returns => [User])
    public users(): Promise<any> {
      return this.userService.find();
    }

    @FieldResolver()
    public async pets(@Root() user: UserModel): Promise<any> {
        return this.petService.findByUser(user);
    }

}
