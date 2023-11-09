import { faker } from "@faker-js/faker";

export const FakeData = {
  email: (): string => faker.internet.email(),
  password: (): string => faker.internet.password(),
  word: (length = 10): string => faker.word.sample({ length }),
  id: (): string => faker.database.mongodbObjectId(),
  numberInteger: (): number => faker.number.int(),
};
