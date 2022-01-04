import { Repository, SelectQueryBuilder } from 'typeorm';

import { InvalidQueryError } from '../errors/InvalidQueryError';
import { TFindResourceOptions, TQueryableFields } from '../types/query';

interface TQueryServiceOptions extends TFindResourceOptions {
    queryableFields: TQueryableFields;
}

export class QueryService<T> {
    private queryBuilder: SelectQueryBuilder<T>;
    private options: TQueryServiceOptions;
    constructor(repo: Repository<T>, options?: TQueryServiceOptions) {
        this.queryBuilder = repo.createQueryBuilder('model');
        this.options = options;
    }
    public search(): this {
        if (!this.options) {
            return this;
        }
        const searchOptions = this.options.body.search;
        if (!searchOptions) {
            return this;
        }
        const searchKey = searchOptions.key.toLowerCase();
        const searchValue = String(searchOptions.value);
        const searchColumns = this.options.queryableFields.search;
        if (!searchColumns.includes(searchKey)) {
            throw new InvalidQueryError();
        }

        this.queryBuilder.where(
            `model.${searchKey} ILIKE ':searchValue'`,
            { searchValue }
        );
        return this;
    }

    public async query(): Promise<[T[], number]> {
        return await this.queryBuilder.getManyAndCount();
    }

}
