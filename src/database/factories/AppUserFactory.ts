import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import * as uuid from 'uuid';

import { AppUser, AppUserRole } from '../../api/models/AppUser';

define(AppUser, (faker: typeof Faker, settings: { role: string }) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);
  const email = faker.internet.email(firstName, lastName);
  const username = faker.internet.userName(firstName, lastName);
  const address = faker.address.country();
  const postCode = faker.address.zipCode();
  const contactNo = faker.phone.phoneNumber();

  const user = new AppUser();
  user.id = uuid.v1();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.username = username;
  user.password = '1234';
  user.address = address;
  user.postCode = postCode;
  user.contactNo = contactNo;

  user.role = AppUserRole.USER;
  return user;
});
