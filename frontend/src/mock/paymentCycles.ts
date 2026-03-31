import paymentCyclesResponse from './data/paymentCycles.json';

export async function fetchMockPaymentCycles(): Promise<any> {
  return Promise.resolve(paymentCyclesResponse as any);
}
