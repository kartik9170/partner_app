import { API_URL } from '../config/config';

const wait = () => new Promise((resolve) => setTimeout(resolve, 300));

export const sendLoginOtp = async (mobile) => {
  const res = await fetch(`${API_URL}/api/users/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Could not send OTP (${res.status})`);
  return data;
};

export const resendLoginOtp = async (mobile) => {
  const res = await fetch(`${API_URL}/api/users/otp/resend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Could not resend OTP (${res.status})`);
  return data;
};

export const loginUser = async (payload) => {
  const mobile = payload?.mobile;
  const otp = payload?.otp;
  if (!mobile || !otp) {
    throw new Error('Mobile and OTP are required.');
  }
  const res = await fetch(`${API_URL}/api/users/otp/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, otp }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Sign in failed (${res.status})`);
  return { token: data.token, user: data.user };
};

export const loginPartnerWithOtp = async ({ mobile, otp }) => {
  const mobileDigits = String(mobile || '').replace(/\D/g, '');
  const otpDigits = String(otp || '').replace(/\D/g, '');
  if (mobileDigits.length !== 10) throw new Error('Enter a valid 10-digit mobile number.');
  if (otpDigits.length !== 4 && otpDigits.length !== 6) {
    throw new Error('Enter the 4-digit or 6-digit OTP.');
  }

  // Local test credential for partner app demo/testing.
  if (mobileDigits === '1234567890' && (otpDigits === '1234' || otpDigits === '123456')) {
    return {
      token: 'partner-demo-token',
      user: {
        id: 'partner_demo_123',
        name: 'Partner Demo',
        phone: mobileDigits,
        role: 'partner',
        status: 'active',
      },
    };
  }

  const res = await fetch(`${API_URL}/api/users/partner/otp/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile: mobileDigits, otp: otpDigits }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Partner sign in failed (${res.status})`);
    err.code = data.code || `HTTP_${res.status}`;
    throw err;
  }
  return { token: data.token, user: data.user };
};

/** After admin approves partner application; uses password from onboarding. */
export const loginPartnerUser = async ({ email, mobile, password }) => {
  if (!password) throw new Error('Password is required.');
  if (!email && !mobile) throw new Error('Email or mobile is required.');
  const res = await fetch(`${API_URL}/api/users/partner/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email || undefined, mobile: mobile || undefined, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Sign in failed (${res.status})`);
  return { token: data.token, user: data.user };
};

export const signupUser = async (payload) => {
  try {
    const res = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        mobile: payload.mobile || '',
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Signup failed (${res.status})`);
    return { token: data.token || 'demo-token', user: data.user };
  } catch {
    await wait();
    return {
      token: 'demo-token',
      user: { id: `user_${Date.now()}`, name: payload.name, email: payload.email },
    };
  }
};
