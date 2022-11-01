import { faker } from "@faker-js/faker";

export type Model = {
  uuid: string;
  name: string;
  type: "model";
};

export function createModel(): Model {
  return {
    uuid: faker.datatype.uuid(),
    name: faker.company.name(),
    type: "model",
  };
}

/**
 * create a list of groups
 * @param count
 * @returns a list of groups
 */
export function createModels(count: number) {
  const randomCount = faker.datatype.number({ min: 500, max: 1000 });

  return new Promise<Array<Model>>((resolve, reject) => {
    setTimeout(() => resolve(Array.from({ length: count }, createModel)), randomCount);
  });
}
