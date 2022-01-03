import { Connection } from 'typeorm';
import { Factory, Seed, times } from 'typeorm-seeding';

import { AppUser } from '../../api/models/AppUser';
import { Tour } from '../../api/models/Tour';

export class CreateTours implements Seed {
    public async seed(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();
        await times(3, async () => {
            const user = await factory(AppUser)().seed();
            return await times(3, async () => {
                const tour = await factory(Tour)().make();
                tour.guide = user;
                return await em.save(tour);
            });
        });
    }
}
