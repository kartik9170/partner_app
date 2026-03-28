import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { sendLoginOtp } from '../../services/authService';

const DIAL_CODES = ['+91', '+1', '+44', '+971'];

const C = {
  surface: '#f0fcfa',
  primary: '#313c3b',
  secondary: '#366855',
  onSecondary: '#ffffff',
  surfaceContainerHigh: '#deebe8',
  surfaceContainerLow: '#eaf6f4',
  surfaceContainerLowest: '#ffffff',
  onSurfaceVariant: '#404944',
  outline: '#707974',
  outlineVariant: '#c0c9c3',
  surfaceVariant: '#d9e5e3',
  secondaryContainer: '#b6ebd3',
  tertiaryFixed: '#a6f2d4',
  gradientEnd: '#025d47',
};

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const [mobile, setMobile] = useState('');
  const [dialCode, setDialCode] = useState('+91');
  const [ccOpen, setCcOpen] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const cleanMobile = mobile.replace(/\D/g, '').slice(0, 10);

  const onClose = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Splash');
  };

  const onSendOtp = async () => {
    if (cleanMobile.length !== 10) {
      Alert.alert('Invalid number', 'Enter valid 10-digit mobile number.');
      return;
    }
    setSendingOtp(true);
    try {
      await sendLoginOtp(cleanMobile);
      navigation.navigate('PartnerOtpVerify', { mobile: cleanMobile, dialCode });
    } catch (e) {
      Alert.alert('OTP error', e?.message || 'Could not send OTP.');
    } finally {
      setSendingOtp(false);
    }
  };

  const openFooter = (label) => {
    Alert.alert(label, 'Link opens when your help site URL is configured.');
  };

  const headerPadTop = Math.max(insets.top, 8);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeTop} edges={['bottom']}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.select({ ios: 'padding', android: undefined })}>
          {/* Top bar — matches HTML fixed header */}
          <View style={[styles.topBar, { paddingTop: headerPadTop }]}>
            <Pressable onPress={onClose} style={styles.iconCircle} hitSlop={12}>
              <MaterialIcons name="close" size={24} color={C.secondary} />
            </Pressable>
            <Text style={styles.topBarTitle} numberOfLines={1}>
              Partner Portal
            </Text>
            <View style={styles.topBarSpacer} />
          </View>

          <View style={[styles.mainRow, !isWide && styles.mainCol]}>
            {/* Left editorial panel — md+ in HTML */}
            {isWide && (
              <View style={styles.leftPanel}>
                <View style={[styles.blob, styles.blobTop]} />
                <View style={[styles.blob, styles.blobBottom]} />
                <View style={styles.leftInner}>
                  <View style={styles.accentRule} />
                  <Text style={styles.leftHeadline}>
                    Your craft,{'\n'}
                    <Text style={styles.leftHeadlineAccent}>elevated.</Text>
                  </Text>
                  <Text style={styles.leftBody}>
                    Join the exclusive circle of beauty and wellness professionals redefining the service experience.
                  </Text>
                  <View style={styles.featureGrid}>
                    <View style={styles.featureCard}>
                      <MaterialIcons name="insights" size={28} color={C.secondary} style={styles.featureIcon} />
                      <Text style={styles.featureTitle}>Growth Analytics</Text>
                    </View>
                    <View style={styles.featureCard}>
                      <MaterialIcons name="calendar-today" size={28} color={C.secondary} style={styles.featureIcon} />
                      <Text style={styles.featureTitle}>Smart Scheduling</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={[styles.scrollContent, isWide && styles.scrollContentWide]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.formColumn}>
                <View style={styles.brandRow}>
                  <MaterialIcons name="spa" size={26} color={C.secondary} />
                  <Text style={styles.brandTag}>ATELIER PARTNER</Text>
                </View>
                <Text style={styles.panelTitle}>Partner Portal</Text>
                <Text style={styles.panelSub}>Please enter your registered mobile number to proceed.</Text>

                <View style={styles.formBlock}>
                  <Text style={styles.fieldLabel}>Mobile Number</Text>
                  <View style={styles.mobileRow}>
                    <Pressable style={styles.ccBox} onPress={() => setCcOpen(true)}>
                      <Text style={styles.ccText}>{dialCode}</Text>
                      <MaterialIcons name="keyboard-arrow-down" size={20} color={C.onSurfaceVariant} />
                    </Pressable>
                    <View style={styles.inputGrow}>
                      <TextInput
                        value={cleanMobile}
                        onChangeText={(v) => setMobile(v.replace(/\D/g, '').slice(0, 10))}
                        keyboardType="phone-pad"
                        placeholder="98765 43210"
                        placeholderTextColor={C.outlineVariant}
                        style={styles.mobileInput}
                      />
                    </View>
                  </View>

                  <Pressable onPress={onSendOtp} disabled={sendingOtp} style={({ pressed }) => [styles.gradientPress, pressed && styles.pressed]}>
                    <LinearGradient colors={[C.secondary, C.gradientEnd]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.gradientBtn}>
                      <Text style={styles.gradientBtnText}>{sendingOtp ? 'Sending...' : 'Send OTP'}</Text>
                      <MaterialIcons name="arrow-forward" size={22} color={C.onSecondary} />
                    </LinearGradient>
                  </Pressable>
                </View>

                <View style={styles.orWrap}>
                  <View style={styles.orLine} />
                  <Text style={styles.orText}>OR</Text>
                  <View style={styles.orLine} />
                </View>

                <Pressable
                  style={({ pressed }) => [styles.outlineBtn, pressed && styles.outlineBtnPressed]}
                  onPress={() => navigation.navigate('PartnerPasswordLogin', { prefilledMobile: cleanMobile })}
                >
                  <MaterialIcons name="lock" size={22} color={C.primary} />
                  <Text style={styles.outlineBtnText}>Login with Password</Text>
                </Pressable>

                <View style={styles.registerBlock}>
                  <Text style={styles.registerHint}>New to Atelier?</Text>
                  <Pressable onPress={() => navigation.navigate('PartnerProfileSetup', { mobile: cleanMobile })}>
                    <Text style={styles.registerLink}>Register Now</Text>
                  </Pressable>
                </View>

                <View style={styles.footerLinks}>
                  <Pressable onPress={() => openFooter('Privacy')}>
                    <Text style={styles.footerLink}>Privacy</Text>
                  </Pressable>
                  <Pressable onPress={() => openFooter('Terms')}>
                    <Text style={styles.footerLink}>Terms</Text>
                  </Pressable>
                  <Pressable onPress={() => openFooter('Help Center')}>
                    <Text style={styles.footerLink}>Help Center</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {isWide && (
        <View style={styles.cornerDecor} pointerEvents="none">
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK1nwIPrwMe78SGwevIClK9uB-9QCxRR67KiWas8LCUsxldmeWWgE14agAIqnzBPxN-f3FQLiBfS_zRMMAlQYADatnci1q4hvVcyiqotQjAjey40OhMkuH8_rKO29SLE2OPbKAYJ-phGnbZktky9_51Th5IYphmtcAC83S1R9Zr563aIhvsB2JyDZB5S9pE6bDTrq3_YKuq7YFJpXqnhzqPRjgaVXJmHVAVVe6WL1H3ohl5m7Hf65LXTOyUyLr12ghoQ8GBT6tzU4',
            }}
            style={styles.cornerImage}
          />
        </View>
      )}

      <Modal visible={ccOpen} transparent animationType="fade" onRequestClose={() => setCcOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalDim} onPress={() => setCcOpen(false)} accessibilityRole="button" accessibilityLabel="Close country picker" />
          <View style={styles.modalCenter}>
            <View style={styles.modalSheet}>
              {DIAL_CODES.map((c) => (
                <Pressable
                  key={c}
                  style={styles.modalRow}
                  onPress={() => {
                    setDialCode(c);
                    setCcOpen(false);
                  }}
                >
                  <Text style={[styles.modalRowText, dialCode === c && styles.modalRowTextActive]}>{c}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  safeTop: { flex: 1, backgroundColor: C.surface },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 12,
    backgroundColor: 'rgba(240, 252, 250, 0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(192, 201, 195, 0.35)',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: -0.3,
  },
  topBarSpacer: { width: 40 },
  mainRow: { flex: 1, flexDirection: 'row' },
  mainCol: { flexDirection: 'column' },
  leftPanel: {
    width: '50%',
    backgroundColor: C.surfaceContainerLow,
    paddingHorizontal: 48,
    paddingVertical: 48,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    opacity: 0.22,
    borderRadius: 120,
  },
  blobTop: {
    width: 280,
    height: 280,
    top: -60,
    left: -60,
    backgroundColor: C.secondaryContainer,
    transform: [{ rotate: '12deg' }, { scaleX: 1.1 }],
  },
  blobBottom: {
    width: 240,
    height: 240,
    bottom: -50,
    right: -40,
    backgroundColor: C.tertiaryFixed,
    opacity: 0.35,
    transform: [{ rotate: '-8deg' }],
  },
  leftInner: { maxWidth: 520, zIndex: 2 },
  accentRule: { width: 64, height: 4, backgroundColor: C.secondary, borderRadius: 999, marginBottom: 32 },
  leftHeadline: {
    fontSize: 48,
    fontWeight: '800',
    color: C.primary,
    lineHeight: 54,
    letterSpacing: -1,
  },
  leftHeadlineAccent: { color: C.secondary },
  leftBody: {
    marginTop: 20,
    fontSize: 18,
    lineHeight: 28,
    color: C.onSurfaceVariant,
    maxWidth: 480,
  },
  featureGrid: { marginTop: 40, flexDirection: 'row', gap: 24 },
  featureCard: {
    flex: 1,
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 12,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: { marginBottom: 10 },
  featureTitle: { fontSize: 13, fontWeight: '600', color: C.primary },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 32, paddingTop: 28, paddingBottom: 48 },
  scrollContentWide: { paddingVertical: 56, paddingHorizontal: 64, alignItems: 'center' },
  formColumn: { width: '100%', maxWidth: 420 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  brandTag: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3.2,
    color: C.secondary,
    textTransform: 'uppercase',
  },
  panelTitle: { fontSize: 34, fontWeight: '700', color: C.primary, letterSpacing: -0.5 },
  panelSub: { marginTop: 10, fontSize: 15, color: C.onSurfaceVariant, lineHeight: 22 },
  formBlock: { marginTop: 36 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: C.onSurfaceVariant,
    marginLeft: 4,
    marginBottom: 12,
  },
  mobileRow: { flexDirection: 'row', gap: 12, height: 56, alignItems: 'stretch' },
  ccBox: {
    width: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    backgroundColor: C.surfaceContainerHigh,
    borderRadius: 12,
  },
  ccText: { fontSize: 15, fontWeight: '700', color: C.primary },
  inputGrow: {
    flex: 1,
    backgroundColor: C.surfaceContainerHigh,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  mobileInput: { fontSize: 18, fontWeight: '600', color: C.primary, paddingVertical: 0, minHeight: 52 },
  gradientPress: { marginTop: 28, borderRadius: 999, overflow: 'hidden', shadowColor: '#1a3d32', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 12, elevation: 6 },
  pressed: { opacity: 0.94, transform: [{ scale: 0.99 }] },
  gradientBtn: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  gradientBtnText: { color: C.onSecondary, fontSize: 17, fontWeight: '700' },
  orWrap: { flexDirection: 'row', alignItems: 'center', marginTop: 36, marginBottom: 8 },
  orLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(217, 229, 227, 0.65)' },
  orText: {
    paddingHorizontal: 18,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: C.outline,
    textTransform: 'uppercase',
    backgroundColor: C.surface,
  },
  outlineBtn: {
    marginTop: 16,
    height: 56,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(192, 201, 195, 0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: C.surface,
  },
  outlineBtnPressed: { backgroundColor: C.surfaceContainerLow },
  outlineBtnText: { fontSize: 16, fontWeight: '700', color: C.primary },
  registerBlock: { marginTop: 28, alignItems: 'center', gap: 6 },
  registerHint: { fontSize: 14, color: C.onSurfaceVariant },
  registerLink: {
    fontSize: 18,
    fontWeight: '800',
    color: C.secondary,
    textDecorationLine: 'underline',
    textDecorationColor: C.secondaryContainer,
  },
  footerLinks: {
    marginTop: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 22,
    flexWrap: 'wrap',
  },
  footerLink: { fontSize: 10, fontWeight: '800', letterSpacing: 1.8, color: C.outlineVariant, textTransform: 'uppercase' },
  cornerDecor: {
    position: 'absolute',
    right: 28,
    bottom: 36,
    width: 160,
    height: 160,
    opacity: 0.12,
    borderRadius: 80,
    overflow: 'hidden',
  },
  cornerImage: { width: '100%', height: '100%' },
  modalRoot: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(19, 30, 28, 0.35)',
  },
  modalCenter: { width: '100%', paddingHorizontal: 24, zIndex: 1, alignItems: 'center' },
  modalSheet: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.outlineVariant,
  },
  modalRow: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.surfaceVariant },
  modalRowText: { fontSize: 17, fontWeight: '600', color: C.primary },
  modalRowTextActive: { color: C.secondary, fontWeight: '800' },
});
