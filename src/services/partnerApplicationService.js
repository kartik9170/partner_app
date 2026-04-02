export async function submitPartnerApplicationApi(payload) {
  return {
    ok: true,
    application: {
      id: `local-app-${Date.now()}`,
      status: 'verification_pending',
      accessStatus: 'pending',
      ...payload,
    },
  };
}
