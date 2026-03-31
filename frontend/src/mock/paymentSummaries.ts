import paymentSummariesResponse from './data/paymentSummaries.json';

export async function fetchMockPaymentSummaries(): Promise<any> {
  return Promise.resolve(paymentSummariesResponse as any);
}
