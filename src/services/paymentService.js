import { API_URL } from '../config/config';

export async function recordCustomerPayment(payload) {
  const res = await fetch(`${API_URL}/api/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'payment_record_failed');
  }
  return res.json();
}
