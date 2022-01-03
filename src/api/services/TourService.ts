// import { EventDispatcher, EventDispatcherInterface } from 'src/decorators/EventDispatcher';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Tour } from '../models/Tour';
import { TourRepository } from '../repositories/TourRepository';

@Service()
export class TourService  {
    constructor(
        @OrmRepository() private tourRepository: TourRepository,
        // @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public findAll(): Promise<Tour[]> {
        this.log.info('Find all Tours');
        return this.tourRepository.findAllUnarchived();
    }
}
