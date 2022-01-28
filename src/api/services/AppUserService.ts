import { BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { AppUser } from '../models/AppUser';
import { AppUserRepository } from '../repositories/AppUserRepository';
import { events } from '../subscribers/events';

@Service()
export class AppUserService {
  constructor(
    @OrmRepository() private userRepository: AppUserRepository,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  public find(): Promise<AppUser[]> {
    this.log.info('Find all users');
    return this.userRepository.find();
  }

  public findOne(id: string): Promise<AppUser | undefined> {
    this.log.info('Find one user');
    return this.userRepository.findOneOrFail({ id });
  }

  public async create(user: AppUser): Promise<AppUser> {
    this.log.info('Create a new user => ', user.toString());
    user.id = uuid.v1();
    const newUser = await this.userRepository.save(user);
    this.eventDispatcher.dispatch(events.user.created, newUser);
    return newUser;
  }

  public async update(id: string, user: Partial<AppUser>): Promise<void> {
    this.log.info('Update a user');
    await this.userRepository.findOneOrFail({ id });
    await this.userRepository.update(id, user);
  }

  public async delete(id: string): Promise<void> {
    this.log.info('Delete a user');
    await this.userRepository.delete(id);
  }

  public async deleteMany(ids: string[]): Promise<void> {
    this.log.info('Delete a user');
    const appUsers = await this.userRepository.findByIds(ids);
    if (appUsers.length !== ids.length) {
      throw new BadRequestError('Not all ids are existing.');
    }
    await this.userRepository.delete(ids);
  }
}
