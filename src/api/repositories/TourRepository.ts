import { EntityRepository, Not, Repository } from 'typeorm';

import { Tour } from '../models/Tour';

@EntityRepository(Tour)
export class TourRepository extends Repository<Tour> {
    public findAllUnarchived(): Promise<Tour[]> {
        return this.find({
            isArchived: Not(true),
        });
    }
}
