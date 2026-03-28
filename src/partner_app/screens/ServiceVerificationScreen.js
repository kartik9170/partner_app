import React, { useRef, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { P } from '../../theme/partnerTokens';
import { fontScale } from '../../utils/responsive';

export default function ServiceVerificationScreen({ navigation, route }) {
  const booking = route?.params?.booking;
  const [otp, setOtp] = useState(['', '', '', '']);
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const details = {
    serviceName: booking?.serviceName || booking?.service?.name || 'Luxury Silk Press',
    customerName: booking?.customerName || 'Sarah Jenkins',
    time: booking?.time || '14:00 - 15:30',
  };

  const onOtpChange = (index, value) => {
    const next = value.replace(/[^0-9]/g, '').slice(-1);
    setOtp((prev) => prev.map((digit, i) => (i === index ? next : digit)));
    if (next && index < 3) refs[index + 1]?.current?.focus();
  };

  const verifyAndContinue = () => {
    if (otp.join('').length < 4) {
      Alert.alert('Invalid OTP', 'Please enter the 4-digit verification code.');
      return;
    }
    const doneRoute =
      route?.name === 'PartnerServiceVerificationPreview'
        ? 'PartnerServiceCompletionPreview'
        : 'ServiceCompletion';

    navigation.replace(doneRoute, {
      booking,
      verifiedOtp: otp.join(''),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <MaterialIcons name="close" size={22} color="#064e3b" />
        </Pressable>
        <Text style={styles.brand}>Emerald Pro</Text>
        <View style={styles.avatarWrap}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-nEVZ6gwRxQ1x7eINweOvr_FlCIU1CD_atOjbNI1nMQgyk-h6OTCUTUcKJLCQjUGKSYFwuylxX71JTqzmmcKy6vwPJrm0bX8ifBEY2_rzycPhvmFT3UrsG5UZVsOuZPWHl7VZ0YEwpZ5cKqGcv3fcRrz6WWHk9DW0ZqISvD5H5z96pT5JYBEe_YwJV5GX_XZMYDkeaRaYNS3TTRWAUDV_YA7SgOGGe_vf0KPnn6usYRKH1zAq7wCm3ExXJ9j4RNaJVJK6IH-_ENE',
            }}
            style={styles.avatar}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBlock}>
          <View style={styles.secureBadge}>
            <MaterialIcons name="verified-user" size={18} color={P.onSecondaryContainer} />
            <Text style={styles.secureText}>SECURE VERIFICATION</Text>
          </View>
          <Text style={styles.title}>Service Check-in</Text>
          <Text style={styles.subTitle}>
            Please enter the 4-digit code provided by the client to verify and start the session.
          </Text>
        </View>

        <View style={styles.serviceCard}>
          <View style={styles.serviceIcon}>
            <MaterialIcons name="spa" size={24} color={P.secondary} />
          </View>
          <View style={styles.serviceBody}>
            <Text style={styles.serviceName}>{details.serviceName}</Text>
            <Text style={styles.clientName}>Client: {details.customerName}</Text>
            <View style={styles.timeRow}>
              <MaterialIcons name="schedule" size={16} color={P.outline} />
              <Text style={styles.timeText}>{details.time}</Text>
            </View>
          </View>
        </View>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={`otp-${index}`}
              ref={refs[index]}
              value={digit}
              onChangeText={(value) => onOtpChange(index, value)}
              style={styles.otpBox}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              placeholder="-"
              placeholderTextColor={P.outlineVariant}
              underlineColorAndroid="transparent"
            />
          ))}
        </View>

        <Pressable onPress={verifyAndContinue} style={({ pressed }) => [styles.verifyBtn, pressed && styles.pressed]}>
          <Text style={styles.verifyBtnText}>Verify & Start Service</Text>
          <MaterialIcons name="arrow-forward" size={20} color={P.onSecondary} />
        </Pressable>

        <View style={styles.linksBlock}>
          <Pressable
            onPress={() => Alert.alert('Code Sent', 'A new OTP has been sent to the client.')}
            style={styles.resendRow}
          >
            <MaterialIcons name="refresh" size={18} color={P.onSecondaryFixedVariant} />
            <Text style={styles.resendText}>Resend Code</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable onPress={() => Alert.alert('Support', 'Please contact support for verification issues.')}>
            <Text style={styles.supportText}>Having trouble? Contact Support</Text>
          </Pressable>
        </View>

        <View style={styles.footerCard}>
          <View style={styles.shieldWrap}>
            <MaterialIcons name="shield" size={18} color={P.onTertiaryFixed} />
          </View>
          <Text style={styles.footerText}>
            End-to-end encrypted session verification for Emerald Pro professionals.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: P.surface },
  topBar: {
    height: 64,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(236, 253, 245, 0.82)',
  },
  iconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  brand: { color: '#064e3b', fontSize: fontScale(20), fontWeight: '800' },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${P.outlineVariant}26`,
    backgroundColor: P.surfaceContainerHigh,
  },
  avatar: { width: '100%', height: '100%' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32, flexGrow: 1 },
  headerBlock: { marginBottom: 40 },
  secureBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${P.secondaryContainer}66`,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 24,
  },
  secureText: { color: P.onSecondaryContainer, fontSize: fontScale(11), fontWeight: '700', letterSpacing: 1 },
  title: { color: P.primary, fontSize: fontScale(30), fontWeight: '800', marginBottom: 16, lineHeight: 36 },
  subTitle: { color: P.onSurfaceVariant, fontSize: fontScale(15), lineHeight: 22 },
  serviceCard: {
    borderRadius: 12,
    backgroundColor: P.surfaceContainerLow,
    borderWidth: 1,
    borderColor: `${P.outlineVariant}1A`,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: P.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceBody: { flex: 1 },
  serviceName: { color: P.primary, fontSize: fontScale(18), fontWeight: '700' },
  clientName: { color: P.onSurfaceVariant, fontSize: fontScale(14), marginTop: 4 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  timeText: { color: P.outline, fontSize: fontScale(12), fontWeight: '600' },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  otpBox: {
    width: 64,
    height: 80,
    borderRadius: 12,
    borderBottomWidth: 2,
    borderBottomColor: P.outlineVariant,
    borderWidth: 0,
    backgroundColor: P.surfaceContainerLowest,
    color: P.primary,
    fontSize: fontScale(30),
    fontWeight: '800',
    shadowColor: P.onSurface,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  verifyBtn: {
    minHeight: 56,
    borderRadius: 999,
    backgroundColor: P.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
    shadowColor: P.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  verifyBtnText: { color: P.onSecondary, fontSize: fontScale(17), fontWeight: '700' },
  linksBlock: { alignItems: 'center', paddingTop: 24, gap: 24 },
  resendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resendText: { color: P.onSecondaryFixedVariant, fontSize: fontScale(14), fontWeight: '600' },
  divider: { width: '33%', height: 1, backgroundColor: `${P.outlineVariant}33` },
  supportText: { color: P.onSurfaceVariant, fontSize: fontScale(14), fontWeight: '500' },
  footerCard: {
    marginTop: 32,
    borderRadius: 12,
    backgroundColor: `${P.surfaceDim}66`,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  shieldWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: P.tertiaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    flex: 1,
    color: P.onSurfaceVariant,
    fontSize: fontScale(11),
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    lineHeight: 16,
  },
  pressed: { transform: [{ scale: 0.98 }] },
});
