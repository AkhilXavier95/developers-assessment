import timeEntriesResponse from './data/timeEntries.json';

export async function fetchMockTimeEntries(): Promise<any> {
  return Promise.resolve(timeEntriesResponse as any);
}
