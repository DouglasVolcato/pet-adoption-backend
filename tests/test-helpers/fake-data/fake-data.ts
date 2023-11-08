import { faker } from "@faker-js/faker";

export const FakeData = {
  email: (): string => faker.internet.email(),
  password: (): string => faker.internet.password(),
  word: (): string => faker.word.sample(),
};
