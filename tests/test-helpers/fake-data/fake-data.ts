import { faker } from "@faker-js/faker";

export const FakeData = {
  email: (): string => faker.internet.email(),
};
