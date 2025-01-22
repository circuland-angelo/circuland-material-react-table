import { faker } from '@faker-js/faker';

export interface Person {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
}

export const createPersonData = (length: number): Person[] => {
  return Array.from({ length }).map(() => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    city: faker.location.city(),
  }));
};
