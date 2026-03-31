import freelancersResponse from './data/freelancers.json';

export async function fetchMockFreelancers(): Promise<any> {
  return Promise.resolve(freelancersResponse as any);
}
