import usersResponse from './data/users.json';

export async function fetchMockUsers(): Promise<any> {
  return Promise.resolve(usersResponse as any);
}
