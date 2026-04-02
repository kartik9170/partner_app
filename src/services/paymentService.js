export async function recordCustomerPayment(payload) {
  return {
    ok: true,
    payment: {
      id: `pay_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...payload,
    },
  };
}
