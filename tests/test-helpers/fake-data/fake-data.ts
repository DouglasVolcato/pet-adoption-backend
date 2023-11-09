import { faker } from "@faker-js/faker";

export const FakeData = {
  email: (): string => faker.internet.email(),
  password: (): string => faker.internet.password(),
  word: (length = 10): string => faker.string.alphanumeric({ length }),
  id: (): string => faker.string.uuid(),
  numberInteger: (): number => faker.number.int(),
};
