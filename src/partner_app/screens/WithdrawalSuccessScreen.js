import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PartnerBottomNav from '../../components/PartnerBottomNav';
import { P } from '../../theme/partnerTokens';
import { fontScale } from '../../utils/responsive';

export default function WithdrawalSuccessScreen({ navigation, route }) {
  const showPreview = route?.name === 'PartnerWithdrawSuccessPreview';
  const amount = route?.params?.amount ?? '0.00';

  const goDashboard = () => {
    if (showPreview) {
      navigation.navigate('PartnerHomePreview');
      return;
    }
    navigation.getParent()?.navigate('Dashboard');
  };

  const goEarnings = () => {
    if (showPreview) {
      navigation.navigate('PartnerEarningsPreview');
      return;
    }
    navigation.navigate('EarningsHome');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={[styles.content, showPreview && styles.contentWithNav]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successIconWrap}>
          <MaterialIcons name="check-circle" size={56} color={P.onSecondaryContainer} />
        </View>

        <Text style={styles.title}>Withdrawal Requested</Text>
        <Text style={styles.subtitle}>
          Your request for ${amount} has been submitted successfully.
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>Processing</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estimated Time</Text>
            <Text style={styles.infoValue}>Within 24 hours</Text>
          </View>
          <View style={[styles.infoRow, styles.infoRowLast]}>
            <Text style={styles.infoLabel}>Method</Text>
            <Text style={styles.infoValue}>Bank Transfer</Text>
          </View>
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>What happens next?</Text>
          <View style={styles.stepRow}>
            <View style={styles.stepIconWrap}>
              <MaterialIcons name="adjust" size={18} color={P.secondary} />
            </View>
            <Text style={styles.stepText}>Request received and queued</Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepIconWrap}>
              <MaterialIcons name="schedule" size={18} color={P.secondary} />
            </View>
            <Text style={styles.stepText}>Bank processing starts shortly</Text>
          </View>
          <View style={[styles.stepRow, styles.stepRowLast]}>
            <View style={styles.stepIconWrap}>
              <MaterialIcons name="account-balance-wallet" size={18} color={P.secondary} />
            </View>
            <Text style={styles.stepText}>Amount will be credited within 24 hours</Text>
          </View>
        </View>

        <Pressable onPress={goDashboard} style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}>
          <Text style={styles.primaryBtnText}>Go To Dashboard</Text>
        </Pressable>

        <Pressable onPress={goEarnings} style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}>
          <Text style={styles.secondaryBtnText}>Back to Earnings</Text>
        </Pressable>
      </ScrollView>

      {showPreview ? (
        <PartnerBottomNav
          activeKey="pay"
          onPressItem={(key) => {
            if (key === 'home') navigation.navigate('PartnerHomePreview');
            if (key === 'book') navigation.navigate('PartnerBookPreview');
            if (key === 'pay') navigation.navigate('PartnerEarningsPreview');
            if (key === 'profile') navigation.navigate('PartnerProfileSetup');
          }}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: P.surface },
  content: { paddingHorizontal: 22, paddingTop: 32, paddingBottom: 28 },
  contentWithNav: { paddingBottom: 120 },
  successIconWrap: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignSelf: 'center',
    backgroundColor: P.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: P.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    color: P.primary,
    fontSize: fontScale(28),
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 12,
    textAlign: 'center',
    color: P.onSurfaceVariant,
    fontSize: fontScale(15),
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  infoCard: {
    borderRadius: 20,
    backgroundColor: P.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: `${P.outlineVariant}40`,
    padding: 20,
    marginBottom: 16,
    shadowColor: P.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  infoRowLast: { marginBottom: 0 },
  infoLabel: { color: P.onSurfaceVariant, fontSize: fontScale(13) },
  infoValue: { color: P.secondary, fontSize: fontScale(13), fontWeight: '700' },
  timelineCard: {
    borderRadius: 20,
    backgroundColor: P.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: `${P.outlineVariant}40`,
    padding: 20,
    marginBottom: 32,
    shadowColor: P.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  timelineTitle: {
    color: P.secondary,
    fontSize: fontScale(16),
    fontWeight: '700',
    marginBottom: 18,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  stepRowLast: { marginBottom: 0 },
  stepIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${P.secondaryContainer}99`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { color: P.onSecondaryContainer, fontSize: fontScale(14), flex: 1, lineHeight: 20, fontWeight: '500' },
  primaryBtn: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: P.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: P.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryBtnText: { color: P.onSecondary, fontSize: fontScale(17), fontWeight: '700' },
  secondaryBtn: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: P.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: `${P.outlineVariant}55`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { color: P.secondary, fontSize: fontScale(15), fontWeight: '700' },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
});
