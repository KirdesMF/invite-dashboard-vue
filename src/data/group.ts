import { faker } from "@faker-js/faker";

export type Group = {
  uuid: string;
  color: string;
  name: string;
};

export function createGroup() {
  return {
    uuid: faker.datatype.uuid(),
    color: faker.internet.color(),
    name: faker.company.name(),
  };
}

/**
 * create a list of groups
 * @param count
 * @returns a list of groups
 */
export function createGroups(count: number) {
  const randomCount = faker.datatype.number({ min: 500, max: 1000 });
  return new Promise<Array<Group>>((resolve, reject) => {
    setTimeout(() => resolve(Array.from({ length: count }, createGroup)), randomCount);
  });
}
