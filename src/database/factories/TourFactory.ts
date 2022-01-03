import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import { Tour, TourDifficulty } from '../../api/models/Tour';

define(Tour, (faker: typeof Faker) => {
    const name = faker.name.title();
    const duration = faker.random.number({min: 1});
    const difficultyValues = Object.values(TourDifficulty);
    const difficulty = difficultyValues[Math.floor(Math.random() * difficultyValues.length)];
    const price = faker.commerce.price();

    const tour = new Tour();
    tour.name = name;
    tour.duration = duration;
    tour.difficulty = difficulty;
    tour.price = Number(price);
    return tour;
});
