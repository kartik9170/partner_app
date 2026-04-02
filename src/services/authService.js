const wait = () => new Promise((resolve) => setTimeout(resolve, 300));
const DEMO_OTP_CODES = new Set(['1234', '123456']);

function normalizeMobile(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 10);
}

export const sendLoginOtp = async (mobile) => {
  const cleanMobile = normalizeMobile(mobile);
  if (cleanMobile.length !== 10) throw new Error('Enter a valid 10-digit mobile number.');
  await wait();
  return { success: true, message: 'Demo OTP sent. Use 1234.', otpHint: '1234' };
};

export const resendLoginOtp = async (mobile) => {
  const cleanMobile = normalizeMobile(mobile);
  if (cleanMobile.length !== 10) throw new Error('Enter a valid 10-digit mobile number.');
  await wait();
  return { success: true, message: 'Demo OTP resent. Use 1234.', otpHint: '1234' };
};

export const loginUser = async (payload) => {
  const mobile = normalizeMobile(payload?.mobile);
  const otp = payload?.otp;
  if (!mobile || !otp) {
    throw new Error('Mobile and OTP are required.');
  }
  if (!DEMO_OTP_CODES.has(String(otp).trim())) {
    throw new Error('Invalid OTP. Use demo OTP 1234.');
  }
  await wait();
  return {
    token: `customer-token-${mobile}`,
    user: {
      id: `user_${mobile}`,
      name: 'Atelier Customer',
      mobile,
      role: 'customer',
      status: 'active',
    },
  };
};

export const loginPartnerWithOtp = async ({ mobile, otp }) => {
  const mobileDigits = String(mobile || '').replace(/\D/g, '');
  const otpDigits = String(otp || '').replace(/\D/g, '');
  if (mobileDigits.length !== 10) throw new Error('Enter a valid 10-digit mobile number.');
  if (otpDigits.length !== 4 && otpDigits.length !== 6) {
    throw new Error('Enter the 4-digit or 6-digit OTP.');
  }

  // Local test credential for partner app demo/testing.
  if (mobileDigits === '1234567890' && DEMO_OTP_CODES.has(otpDigits)) {
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

  if (!DEMO_OTP_CODES.has(otpDigits)) {
    const err = new Error('Invalid OTP. Use demo OTP 1234.');
    err.code = 'INVALID_OTP';
    throw err;
  }

  await wait();
  return {
    token: `partner-token-${mobileDigits}`,
    user: {
      id: `partner_${mobileDigits}`,
      name: 'Atelier Partner',
      phone: mobileDigits,
      role: 'partner',
      status: 'active',
    },
  };
};

/** After admin approves partner application; uses password from onboarding. */
export const loginPartnerUser = async ({ email, mobile, password }) => {
  if (!password) throw new Error('Password is required.');
  if (!email && !mobile) throw new Error('Email or mobile is required.');
  if (String(password).length < 6) throw new Error('Password must be at least 6 characters.');
  const cleanMobile = normalizeMobile(mobile);
  await wait();
  return {
    token: `partner-token-${Date.now()}`,
    user: {
      id: cleanMobile ? `partner_${cleanMobile}` : `partner_${String(email).toLowerCase()}`,
      name: 'Atelier Partner',
      email: email || '',
      phone: cleanMobile,
      role: 'partner',
      status: 'active',
    },
  };
};

export const signupUser = async (payload) => {
  await wait();
  return {
    token: 'demo-token',
    user: {
      id: `user_${Date.now()}`,
      name: payload?.name || 'Atelier User',
      email: payload?.email || '',
      mobile: normalizeMobile(payload?.mobile),
    },
  };
};
