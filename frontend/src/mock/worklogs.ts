import worklogsResponse from './data/worklogs.json';

export async function fetchMockWorklogs(): Promise<any> {
  return Promise.resolve(worklogsResponse as any);
}
