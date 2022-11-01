import { faker } from "@faker-js/faker";

export type Campaign = {
  uuid: string;
  name: string;
  type: "campaign";
};

export function createCampaign(): Campaign {
  return {
    uuid: faker.datatype.uuid(),
    name: faker.company.name(),
    type: "campaign",
  };
}

/**
 * create a list of groups
 * @param count
 * @returns a list of groups
 */
export function createCampaigns(count: number) {
  const randomCount = faker.datatype.number({ min: 500, max: 1000 });

  return new Promise<Array<Campaign>>((resolve, reject) => {
    setTimeout(() => resolve(Array.from({ length: count }, createCampaign)), randomCount);
  });
}
