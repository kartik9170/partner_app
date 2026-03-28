import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
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

const C = {
  surface: '#f0fcfa',
  onSurface: '#131e1c',
  primary: '#313c3b',
  secondary: '#366855',
  onSecondary: '#ffffff',
  tertiaryContainer: '#025d47',
  surfaceContainer: '#e4f0ee',
  surfaceContainerHigh: '#deebe8',
  surfaceContainerLow: '#eaf6f4',
  surfaceContainerLowest: '#ffffff',
  onSurfaceVariant: '#404944',
  outline: '#707974',
  outlineVariant: '#c0c9c3',
  secondaryContainer: '#b6ebd3',
  onSecondaryFixedVariant: '#1c4f3e',
};

function parseIdentifier(raw) {
  const t = String(raw || '').trim();
  if (!t) return { email: undefined, mobile: undefined };
  if (t.includes('@')) return { email: t.toLowerCase(), mobile: undefined };
  const digits = t.replace(/\D/g, '').slice(0, 10);
  return { email: undefined, mobile: digits || undefined };
}

export default function PartnerPasswordLoginScreen({ navigation, route }) {
  const { loginPartner, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const prefilled = route?.params?.prefilledMobile || '';

  const [identifier, setIdentifier] = useState(prefilled ? String(prefilled).replace(/\D/g, '').slice(0, 10) : '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const headerTop = Math.max(insets.top, 8);

  const loginPayload = useMemo(() => parseIdentifier(identifier), [identifier]);

  const onLogin = async () => {
    const { email, mobile } = loginPayload;
    if (!password || password.length < 6) {
      Alert.alert('Required', 'Enter a valid password (min 6 characters).');
      return;
    }
    if (email) {
      try {
        await loginPartner({ email, password });
      } catch (e) {
        Alert.alert('Login failed', e?.message || 'Try again.');
      }
      return;
    }
    if (mobile && mobile.length === 10) {
      try {
        await loginPartner({ mobile, password });
      } catch (e) {
        Alert.alert('Login failed', e?.message || 'Try again.');
      }
      return;
    }
    Alert.alert('Required', 'Enter a valid 10-digit mobile or email address.');
  };

  const onForgot = () => {
    Alert.alert('Forgot password?', 'Contact support or use Login with OTP from the previous screen.');
  };

  const openFooter = (title) => {
    Alert.alert(title, 'Link opens when your help site URL is configured.');
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.select({ ios: 'padding', android: undefined })}>
          <View style={[styles.header, { paddingTop: headerTop }]}>
            <Pressable onPress={() => navigation.goBack()} style={styles.headerSide} hitSlop={12}>
              <MaterialIcons name="close" size={24} color={C.secondary} />
            </Pressable>
            <View style={styles.headerTitleWrap} pointerEvents="none">
              <Text style={styles.headerTitle}>THE ATELIER</Text>
            </View>
            <View style={styles.headerSide} />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="lock-open" size={40} color={C.secondary} />
              </View>
              <Text style={styles.heroTitle}>Welcome Back</Text>
              <Text style={styles.heroSub}>Enter your credentials to access your professional workspace.</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Mobile Number or Email</Text>
              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="e.g. hello@atelier.com"
                placeholderTextColor={C.outline}
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />

              <View style={styles.passwordLabelRow}>
                <Text style={styles.labelInline}>Password</Text>
                <Pressable onPress={onForgot} hitSlop={8}>
                  <Text style={styles.forgotLink}>Forgot Password?</Text>
                </Pressable>
              </View>
              <View style={styles.passwordWrap}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={C.outline}
                  secureTextEntry={!showPassword}
                  style={styles.inputPassword}
                />
                <Pressable style={styles.eyeBtn} onPress={() => setShowPassword((p) => !p)} hitSlop={12}>
                  <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={22} color={C.outline} />
                </Pressable>
              </View>

              <Pressable
                onPress={onLogin}
                disabled={loading}
                style={({ pressed }) => [styles.loginBtn, pressed && styles.loginBtnPressed, loading && styles.loginBtnDisabled]}
              >
                <Text style={styles.loginBtnText}>{loading ? 'Please wait...' : 'Login'}</Text>
              </Pressable>

              <View style={styles.orBlock}>
                <View style={styles.orLineAbs} />
                <Text style={styles.orLabel}>or</Text>
              </View>

              <Pressable
                style={({ pressed }) => [styles.otpBtn, pressed && styles.otpBtnPressed]}
                onPress={() => navigation.goBack()}
              >
                <MaterialIcons name="sms" size={20} color={C.secondary} />
                <Text style={styles.otpBtnText}>Login with OTP</Text>
              </Pressable>
            </View>

            <View style={styles.decorWrap}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrsbdifbz2MaraZO9xQ76CyCzX5qb9fNK5hTSiwRx4TaYCdztm7dYrkzr9FO82TOxEfU8qnuxf00TFr_IDuBgKD-YuiB2o9C4P9ras74Ux5mV04XL1vV00wvn_JYOmXGdwWTT-BQGUbyrhLRgxBpWRiKVPQzKDPM_biF-VGRAlVBW5ZVQDf2kENjots082CyTYPfIZ3TQOkWECqgljzSyxZ25N8vaHRyMF0pSXWH8UbqWroUZOWk1njJe1ZcV5sk7UvJT1rN2ak2g',
                }}
                style={styles.decorImage}
              />
              <LinearGradient colors={['transparent', 'rgba(240,252,250,0.97)']} style={styles.decorGradient} />
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={styles.footerRegister}>
              <Text style={styles.footerMuted}>New to Atelier?</Text>
              <Pressable onPress={() => navigation.navigate('PartnerProfileSetup', { mobile: loginPayload.mobile || '' })}>
                <Text style={styles.footerRegisterLink}>Register Now</Text>
              </Pressable>
            </View>
            <Text style={styles.copyright}>© 2026 THE DIGITAL ATELIER. ALL RIGHTS RESERVED.</Text>
            <View style={styles.footerLinks}>
              <Pressable onPress={() => openFooter('Privacy Policy')}>
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </Pressable>
              <Pressable onPress={() => openFooter('Terms of Service')}>
                <Text style={styles.footerLink}>Terms of Service</Text>
              </Pressable>
              <Pressable onPress={() => openFooter('Support')}>
                <Text style={styles.footerLink}>Support</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  safe: { flex: 1, backgroundColor: C.surface },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 12,
    backgroundColor: 'rgba(240, 252, 250, 0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(192, 201, 195, 0.35)',
  },
  headerSide: { width: 40, height: 40, justifyContent: 'center' },
  headerTitleWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.primary,
    letterSpacing: 4,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  hero: { alignItems: 'center', marginBottom: 36 },
  iconCircle: {
    padding: 16,
    borderRadius: 999,
    backgroundColor: C.surfaceContainer,
    marginBottom: 22,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: C.onSurface,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 15,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 12,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: C.onSurfaceVariant,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  labelInline: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: C.onSurfaceVariant,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  forgotLink: {
    fontSize: 12,
    fontWeight: '600',
    color: C.onSecondaryFixedVariant,
  },
  input: {
    height: 56,
    backgroundColor: C.surfaceContainerHigh,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: C.onSurface,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  passwordWrap: { position: 'relative', minHeight: 56, justifyContent: 'center' },
  inputPassword: {
    minHeight: 56,
    backgroundColor: C.surfaceContainerHigh,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingRight: 48,
    paddingVertical: 16,
    fontSize: 16,
    color: C.onSurface,
  },
  eyeBtn: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  loginBtn: {
    marginTop: 22,
    height: 56,
    borderRadius: 12,
    backgroundColor: C.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnPressed: { backgroundColor: C.tertiaryContainer, transform: [{ scale: 0.99 }] },
  loginBtnDisabled: { opacity: 0.75 },
  loginBtnText: { color: C.onSecondary, fontSize: 17, fontWeight: '700' },
  orBlock: { marginVertical: 28, alignItems: 'center', justifyContent: 'center' },
  orLineAbs: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(192, 201, 195, 0.35)',
  },
  orLabel: {
    backgroundColor: C.surfaceContainerLowest,
    paddingHorizontal: 14,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: C.outline,
  },
  otpBtn: {
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: C.secondaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.surfaceContainerLowest,
  },
  otpBtnPressed: { backgroundColor: C.surfaceContainerLow },
  otpBtnText: { fontSize: 16, fontWeight: '700', color: C.secondary },
  decorWrap: {
    marginTop: 40,
    height: 192,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  decorImage: { width: '100%', height: '100%', opacity: 0.2 },
  decorGradient: { ...StyleSheet.absoluteFillObject },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 14,
    backgroundColor: C.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(192, 201, 195, 0.25)',
  },
  footerRegister: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  footerMuted: { fontSize: 14, color: C.onSurfaceVariant },
  footerRegisterLink: { fontSize: 14, fontWeight: '700', color: C.secondary },
  copyright: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: C.onSurfaceVariant,
    textAlign: 'center',
  },
  footerLinks: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20 },
  footerLink: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: C.onSurfaceVariant,
    textDecorationLine: 'underline',
  },
});
