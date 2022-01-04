// import { EventDispatcher, EventDispatcherInterface } from 'src/decorators/EventDispatcher';
import { BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Tour, TOUR_QUERY_FIELDS } from '../models/Tour';
import { TourRepository } from '../repositories/TourRepository';
import { TFindResourceOptions } from '../types/query';

@Service()
export class TourService  {
    constructor(
        @OrmRepository() private tourRepository: TourRepository,
        // @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async findAll({ query, body }: TFindResourceOptions): Promise<[Tour[], number]> {
        this.log.info('Find all Tours');
        this.log.info(`Query: `, query);
        this.log.info(`Body: `, body);
        const qb = this.tourRepository.createQueryBuilder('tour');
        // Search
        const searchOptions = body.search;
        const searchKey = searchOptions.key.toLowerCase();
        const searchValue = searchOptions.value;
        const searchableCols = TOUR_QUERY_FIELDS.search;
        if (!searchableCols.includes(searchKey)) {
            throw new BadRequestError('Not Searchable');
        }
        qb.where(`tour.${searchKey} ILIKE ('%' || :searchValue || '%')`, { searchValue });

        // Filter

        this.log.info('SQL: ', qb.getSql());
        // Execute
        return qb.getManyAndCount();
    }
}
