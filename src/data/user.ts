import { faker } from "@faker-js/faker";

export type User = {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
  avatar: string;
};

export function createUser(): User {
  return {
    uuid: faker.datatype.uuid(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    job_title: faker.name.jobTitle(),
    avatar: faker.image.avatar(),
  };
}

export function createUsers(count: number) {
  const randomCount = faker.datatype.number({ min: 500, max: 1000 });

  return new Promise<Array<User>>((resolve, reject) => {
    setTimeout(() => resolve(Array.from({ length: count }, createUser)), randomCount);
  });
}
