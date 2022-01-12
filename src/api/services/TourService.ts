// import { EventDispatcher, EventDispatcherInterface } from 'src/decorators/EventDispatcher';
import { BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { SelectQueryBuilder } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Tour, TOUR_QUERY_FIELDS } from '../models/Tour';
import { TourRepository } from '../repositories/TourRepository';
import {
    FilterQuery, FilterType, SearchQuery, SortQuery, TFindResourceOptions
} from '../types/query';

@Service()
export class TourService  {

    private static DEFAULT_PAGE = 1;
    private static DEFAULT_LIMIT = 3;

    constructor(
        @OrmRepository() private tourRepository: TourRepository,
        // @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async find(id: string): Promise<Tour> {
        return this.tourRepository.findOne({ id });
    }

    public async findAll(): Promise<Tour[]> {
        return this.tourRepository.findAllUnarchived();
    }

    public async createTour(tour: Tour): Promise<Tour> {
        return this.tourRepository.save(tour);
    }

    public async deleteTour(id: string): Promise<void> {
        await this.tourRepository.delete(id);
        return;
    }

    public async updateTour(id: string, tour: Tour): Promise<void> {
        // tour.id = id;
        this.tourRepository.update(id, tour);
        return;
    }

    public async findAndFilter({ query, body }: TFindResourceOptions): Promise<[Tour[], number]> {
        this.log.info('Find all Tours');
        this.log.info(`Query: `, query);
        this.log.info(`Body: `, body);
        const qb = this.tourRepository.createQueryBuilder('tour');

        // Fields
        const selectOptions = body.fields;
        if (selectOptions) {
            selectOptions.forEach((selectOption) => this.select(qb, selectOption));
        }

        // Search
        const searchOption = body.search;
        if (searchOption) {
            this.search(qb, searchOption);
        }

        // Filter
        const filterOptions = body.filter;
        if (filterOptions) {
            filterOptions.forEach((filterOption) => this.filter(qb, filterOption));
        }

        // Limit + Page // Paginate
        const limit = query.limit || TourService.DEFAULT_LIMIT;
        const page = query.page || TourService.DEFAULT_PAGE;
        this.paginate(qb, page, limit);

        // Sort
        const sortOptions = body.sort;
        if (sortOptions) {
            sortOptions.forEach((sortOption) => this.sort(qb, sortOption));
        }

        console.log('SQL: ', qb.getSql());
        // Execute
        return qb.getManyAndCount();
    }

    private search(qb: SelectQueryBuilder<Tour>, searchOption: SearchQuery): void {
        const searchKey = searchOption.key.toLowerCase();
        const searchValue = searchOption.value;
        const searchableCols = TOUR_QUERY_FIELDS.search;
        if (!searchableCols.includes(searchKey)) {
            throw new BadRequestError('Not Searchable Key');
        }
        qb.andWhere(`tour.${searchKey} ILIKE ('%' || :searchValue || '%')`, { searchValue });
    }

    private filter(qb: SelectQueryBuilder<Tour>, filterOption: FilterQuery): void {
        const filterKey = filterOption.key.toLowerCase();
        const filterType = filterOption.type;
        // String Type
        const filterableCols = TOUR_QUERY_FIELDS.filter;
        switch (filterType) {
            case FilterType.STRING:
                const filterValue = filterOption.string.value;
                if (!filterableCols.string.includes(filterKey)) {
                    throw new BadRequestError('Not Filterable Key');
                }
                qb.andWhere(`tour.${filterKey} = :filterValue`, { filterValue });
                break;
            case FilterType.NUMERIC:
                const { max, min } = filterOption.numeric;
                if (!filterableCols.numeric.includes(filterKey)) {
                    throw new BadRequestError('Not Filterable Key');
                }
                qb.andWhere(`tour.${filterKey} BETWEEN :min AND :max`, { min, max });
                break;
            default:
                throw new BadRequestError('Not Filterable Type');
        }
    }

    private sort(qb: SelectQueryBuilder<Tour>, sortOption: SortQuery): void {
        const sortKey = sortOption.key.toLowerCase();
        const sortValue = sortOption.value;
        const sortableCols = TOUR_QUERY_FIELDS.sort;
        if (!sortableCols.includes(sortKey)) {
            throw new BadRequestError('Not Sortable Key');
        }
        qb.addOrderBy(`tour.${sortKey}`, sortValue);
    }

    private paginate(qb: SelectQueryBuilder<Tour>, page: number, limit: number): void {
        qb.skip(limit * (page - 1)).take(limit);
    }

    private select(qb: SelectQueryBuilder<Tour>, selectOption: string): void {
        const selectableCols = TOUR_QUERY_FIELDS.select;
        if (!selectableCols.includes(selectOption)) {
            throw new BadRequestError('Not Selectable Key');
        }
        qb.select(`tour.${selectOption}`);
    }
}
