import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import useAuth from '../../hooks/useAuth';
import { resendLoginOtp } from '../../services/authService';

const OTP_LEN = 6;

const C = {
  surface: '#f0fcfa',
  primary: '#313c3b',
  secondary: '#366855',
  onSecondary: '#ffffff',
  tertiaryContainer: '#025d47',
  surfaceContainerHigh: '#deebe8',
  surfaceContainerLow: '#eaf6f4',
  surfaceContainerLowest: '#ffffff',
  onSurface: '#131e1c',
  onSurfaceVariant: '#404944',
  outline: '#707974',
  secondaryContainer: '#b6ebd3',
};

function formatDisplayMobile(dialCode, mobile10) {
  const m = String(mobile10 || '').replace(/\D/g, '').slice(0, 10);
  if (m.length !== 10) return `${dialCode} ${m}`;
  return `${dialCode} ${m.slice(0, 5)} ${m.slice(5)}`;
}

function isValidOtpCode(code) {
  return code.length === 4 || code.length === 6;
}

export default function PartnerOtpVerifyScreen({ navigation, route }) {
  const { loginPartnerOtp, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const mobile10 = String(route?.params?.mobile || '').replace(/\D/g, '').slice(0, 10);
  const dialCode = route?.params?.dialCode || '+91';

  useEffect(() => {
    if (mobile10.length !== 10) {
      Alert.alert('Invalid number', 'Go back and enter a valid 10-digit mobile.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    }
  }, [mobile10, navigation]);

  const [cells, setCells] = useState(() => Array(OTP_LEN).fill(''));
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [resendSec, setResendSec] = useState(45);
  const [resending, setResending] = useState(false);
  const refs = useRef([]);

  const headerTop = Math.max(insets.top, 8);
  const code = cells.join('').replace(/\D/g, '');

  useEffect(() => {
    if (resendSec <= 0) return undefined;
    const t = setTimeout(() => setResendSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [resendSec]);

  const setCell = useCallback((i, text) => {
    const d = text.replace(/\D/g, '');
    if (d.length > 1) {
      const chars = d.slice(0, OTP_LEN).split('');
      setCells((prev) => {
        const next = [...prev];
        chars.forEach((c, j) => {
          if (i + j < OTP_LEN) next[i + j] = c;
        });
        return next;
      });
      const focusIdx = Math.min(i + chars.length, OTP_LEN - 1);
      setTimeout(() => refs.current[focusIdx]?.focus(), 0);
      return;
    }
    setCells((prev) => {
      const next = [...prev];
      next[i] = d;
      return next;
    });
    if (d && i < OTP_LEN - 1) {
      setTimeout(() => refs.current[i + 1]?.focus(), 0);
    }
  }, []);

  const onVerify = async () => {
    if (mobile10.length !== 10) {
      Alert.alert('Error', 'Invalid mobile. Go back and enter your number again.');
      return;
    }
    if (!isValidOtpCode(code)) {
      Alert.alert('Required', 'Enter the full code from your SMS (4 or 6 digits, depending on your provider).');
      return;
    }
    try {
      await loginPartnerOtp({ mobile: mobile10, otp: code });
    } catch (e) {
      const msg = e?.message || '';
      if (msg.toLowerCase().includes('partner not found') || msg.toLowerCase().includes('no active partner')) {
        Alert.alert('Register required', 'This number is not registered as partner yet.');
        navigation.navigate('PartnerProfileSetup', { mobile: mobile10 });
        return;
      }
      Alert.alert('Verification failed', msg || 'Try again.');
    }
  };

  const onResend = async () => {
    if (resendSec > 0 || resending) return;
    setResending(true);
    try {
      await resendLoginOtp(mobile10);
      setResendSec(45);
      setCells(Array(OTP_LEN).fill(''));
      refs.current[0]?.focus();
      Alert.alert('Sent', 'A new code has been sent.');
    } catch (e) {
      Alert.alert('Resend failed', e?.message || 'Try again later.');
    } finally {
      setResending(false);
    }
  };

  const mmSs = `${String(Math.floor(resendSec / 60)).padStart(2, '0')}:${String(resendSec % 60).padStart(2, '0')}`;

  return (
    <View style={styles.root}>
      <LinearGradient colors={['rgba(234,246,244,0.5)', 'transparent']} style={styles.bottomDecor} pointerEvents="none" />

      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.select({ ios: 'padding', android: undefined })}>
          <View style={[styles.header, { paddingTop: headerTop }]}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={12}>
              <MaterialIcons name="arrow-back" size={24} color={C.secondary} />
            </Pressable>
            <Text style={styles.headerTitle}>Verification</Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.intro}>
              <Text style={styles.h2}>Enter Verification Code</Text>
              <Text style={styles.bodyText}>
                We have sent a 6-digit code to <Text style={styles.bodyStrong}>{formatDisplayMobile(dialCode, mobile10)}</Text>. Please enter it below to verify
                your identity.
              </Text>
            </View>

            <View style={styles.otpRow}>
              {cells.map((digit, i) => (
                <View
                  key={i}
                  style={[
                    styles.otpCellWrap,
                    focusedIdx === i && styles.otpCellWrapFocused,
                  ]}
                >
                  <TextInput
                    ref={(r) => {
                      refs.current[i] = r;
                    }}
                    value={digit}
                    onChangeText={(t) => setCell(i, t)}
                    onFocus={() => setFocusedIdx(i)}
                    onBlur={() => setFocusedIdx((f) => (f === i ? -1 : f))}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === 'Backspace' && !cells[i] && i > 0) {
                        refs.current[i - 1]?.focus();
                      }
                    }}
                    keyboardType="number-pad"
                    selectTextOnFocus
                    style={styles.otpInput}
                    placeholder="•"
                    placeholderTextColor={C.outline}
                  />
                </View>
              ))}
            </View>

            <Pressable
              onPress={onVerify}
              disabled={loading || !isValidOtpCode(code)}
              style={({ pressed }) => [
                styles.verifyBtn,
                pressed && styles.verifyBtnPressed,
                (loading || !isValidOtpCode(code)) && styles.verifyBtnDisabled,
              ]}
            >
              <Text style={styles.verifyBtnText}>{loading ? 'Verifying...' : 'Verify & Continue'}</Text>
            </Pressable>

            <View style={styles.resendBlock}>
              <View style={styles.timerRow}>
                <MaterialIcons name="schedule" size={18} color={C.onSurfaceVariant} />
                <Text style={styles.timerText}>{resendSec > 0 ? `Resend in ${mmSs}` : 'You can resend now'}</Text>
              </View>
              <Pressable onPress={onResend} disabled={resendSec > 0 || resending}>
                <Text style={[styles.resendLink, (resendSec > 0 || resending) && styles.resendLinkDisabled]}>
                  {resending ? 'Sending...' : 'Resend Code'}
                </Text>
              </Pressable>
            </View>

            <View style={styles.quoteSection}>
              <View style={styles.quoteGlow} />
              <View style={styles.quoteCard}>
                <Text style={styles.quoteText}>
                  &quot;Emerald Pro helps you focus on your craft while we handle the verification. Your security is our top priority.&quot;
                </Text>
                <MaterialIcons name="verified-user" size={72} color={C.secondary} style={styles.quoteWatermark} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const BOX = 54;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  bottomDecor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '34%',
    zIndex: 0,
  },
  safe: { flex: 1, zIndex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 12,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'rgba(240, 252, 250, 0.88)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(192, 201, 195, 0.3)',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: '700',
    color: C.secondary,
    letterSpacing: -0.3,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    maxWidth: 448,
    width: '100%',
    alignSelf: 'center',
  },
  intro: { marginBottom: 36 },
  h2: {
    fontSize: 28,
    fontWeight: '800',
    color: C.primary,
    lineHeight: 34,
    marginBottom: 14,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
    color: C.onSurfaceVariant,
    opacity: 0.95,
  },
  bodyStrong: { fontWeight: '600', color: C.primary },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 36,
  },
  otpCellWrap: {
    flex: 1,
    maxWidth: BOX,
    aspectRatio: 1,
    backgroundColor: C.surfaceContainerHigh,
    borderRadius: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpCellWrapFocused: {
    borderBottomColor: C.secondary,
  },
  otpInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: C.primary,
    padding: 0,
  },
  verifyBtn: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: C.secondary,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: C.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  verifyBtnPressed: { backgroundColor: C.tertiaryContainer, transform: [{ scale: 0.99 }] },
  verifyBtnDisabled: { opacity: 0.45 },
  verifyBtnText: { color: C.onSecondary, fontSize: 17, fontWeight: '700' },
  resendBlock: { alignItems: 'center', gap: 14 },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timerText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: C.onSurfaceVariant,
  },
  resendLink: {
    fontSize: 14,
    color: C.outline,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  resendLinkDisabled: { opacity: 0.45 },
  quoteSection: { marginTop: 48, position: 'relative' },
  quoteGlow: {
    position: 'absolute',
    top: -36,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: C.secondaryContainer,
    opacity: 0.2,
  },
  quoteCard: {
    padding: 22,
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(54, 104, 85, 0.35)',
    overflow: 'hidden',
    position: 'relative',
  },
  quoteText: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 20,
    color: C.onSurfaceVariant,
    opacity: 0.75,
    paddingRight: 48,
    zIndex: 1,
  },
  quoteWatermark: {
    position: 'absolute',
    right: -8,
    top: -8,
    opacity: 0.1,
  },
});
