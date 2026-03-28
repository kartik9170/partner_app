import React from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { P } from '../../theme/partnerTokens';
import { fontScale } from '../../utils/responsive';
import PartnerBottomNav from '../../components/PartnerBottomNav';

export default function ServiceCompletionScreen({ navigation, route }) {
  const booking = route?.params?.booking;
  const showPreviewNav = route?.name === 'PartnerServiceCompletionPreview';
  const receiptId = booking?.id ? `EP-${String(booking.id).slice(-6).toUpperCase()}` : 'EP-942023-BT';

  const shareWhatsapp = async () => {
    const message = encodeURIComponent(
      `Service completed successfully for ${booking?.customerName || 'client'}.\nReceipt: ${receiptId}\nAmount: INR ${booking?.amount || 260}`
    );
    const url = `https://wa.me/?text=${message}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return;
    }
    Alert.alert('WhatsApp unavailable', 'Unable to open WhatsApp on this device.');
  };

  const goDashboard = () => {
    if (showPreviewNav) {
      navigation.navigate('PartnerHomePreview');
      return;
    }
    navigation.getParent()?.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <MaterialIcons name="menu" size={22} color={P.secondary} />
          <Text style={styles.brand}>Emerald Pro</Text>
        </View>
        <View style={styles.avatarWrap}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6OZSAbapjti9j3kLSo33ZErNhw13X9UtZ09QLkV3AztnUVDrnhJvFCX8De8Bnuy5HCKk1b7jcH4BUWFXvBg6ELX5pf0HuJ5DWP0mi77x7xMLnDlJax5Sp6gyAQDVotE1BTj_aaWK63OKtFodoiPukcARETjsqILk22rQdyIWuDhdd1O2CxsCaSrdx4CO8NFwf83hJ3Gkh-1zNDWYqD28H-KSE8sDjZAnkik2k2Vv_6K9cxbJTL7KyoX6N_PFn8JeIwq_KeVGvRRo',
            }}
            style={styles.avatar}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, showPreviewNav && styles.contentPreview]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successWrap}>
          <View style={styles.successIcon}>
            <MaterialIcons name="check-circle" size={40} color={P.onSecondaryContainer} />
          </View>
          <Text style={styles.successTitle}>Service Completed</Text>
          <Text style={styles.successSub}>
            The transaction for {booking?.customerName || 'Elena Gilbert'} has been processed successfully.
          </Text>
        </View>

        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <View>
              <Text style={styles.receiptLabel}>Receipt</Text>
              <Text style={styles.receiptId}>#{receiptId}</Text>
            </View>
            <View style={styles.paidPill}>
              <Text style={styles.paidPillText}>Paid</Text>
            </View>
          </View>

          <View style={styles.lineItem}>
            <View>
              <Text style={styles.itemName}>Advanced Microneedling</Text>
              <Text style={styles.itemSub}>60 mins session</Text>
            </View>
            <Text style={styles.itemPrice}>$180.00</Text>
          </View>
          <View style={styles.lineItem}>
            <View>
              <Text style={styles.itemName}>Post-Care Serum Kit</Text>
              <Text style={styles.itemSub}>Home treatment</Text>
            </View>
            <Text style={styles.itemPrice}>$45.00</Text>
          </View>
          <View style={styles.lineItem}>
            <View>
              <Text style={styles.itemName}>Professional Tip</Text>
              <Text style={styles.itemSub}>Gratuity</Text>
            </View>
            <Text style={styles.itemPrice}>$35.00</Text>
          </View>

          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalTitle}>Total Amount</Text>
            <Text style={styles.totalAmount}>$260.00</Text>
          </View>

          <View style={styles.methodRow}>
            <View style={styles.methodBox}>
              <Text style={styles.methodLabel}>METHOD</Text>
              <View style={styles.methodValueRow}>
                <MaterialIcons name="credit-card" size={14} color={P.primary} />
                <Text style={styles.methodValue}>Visa **** 4242</Text>
              </View>
            </View>
            <View style={styles.methodBox}>
              <Text style={styles.methodLabel}>DATE</Text>
              <View style={styles.methodValueRow}>
                <MaterialIcons name="calendar-today" size={14} color={P.primary} />
                <Text style={styles.methodValue}>Oct 24, 2023</Text>
              </View>
            </View>
          </View>
        </View>

        <Pressable onPress={goDashboard} style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}>
          <Text style={styles.primaryBtnText}>Back to Dashboard</Text>
        </Pressable>

        <Pressable onPress={shareWhatsapp} style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}>
          <MaterialIcons name="share" size={18} color="#059669" />
          <Text style={styles.secondaryBtnText}>Share via WhatsApp</Text>
        </Pressable>

        <Pressable onPress={() => Alert.alert('Print', 'Print receipt action can be connected here.')}>
          <Text style={styles.printText}>Print Physical Receipt</Text>
        </Pressable>
      </ScrollView>

      {showPreviewNav ? (
        <PartnerBottomNav
          activeKey="home"
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
  topBar: {
    height: 64,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(236, 253, 245, 0.82)',
  },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  brand: { color: P.secondary, fontSize: fontScale(20), fontWeight: '800' },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: P.surfaceContainer,
  },
  avatar: { width: '100%', height: '100%' },
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 },
  contentPreview: { paddingBottom: 120 },
  successWrap: { alignItems: 'center', marginBottom: 40 },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: P.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: P.secondary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  successTitle: { color: P.primary, fontSize: fontScale(30), fontWeight: '800', textAlign: 'center' },
  successSub: {
    color: P.onSurfaceVariant,
    fontSize: fontScale(15),
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
    opacity: 0.85,
    paddingHorizontal: 8,
  },
  receiptCard: {
    borderRadius: 12,
    backgroundColor: P.surfaceContainerLowest,
    padding: 32,
    shadowColor: P.onSurface,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 40,
    elevation: 4,
    marginBottom: 40,
  },
  receiptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  receiptLabel: {
    color: P.secondary,
    fontSize: fontScale(14),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  receiptId: { color: P.onSurfaceVariant, fontSize: fontScale(12) },
  paidPill: {
    backgroundColor: P.tertiaryFixed,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  paidPillText: {
    color: P.onTertiaryFixedVariant,
    fontSize: fontScale(10),
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  lineItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 },
  itemName: { color: P.primary, fontSize: fontScale(15), fontWeight: '600' },
  itemSub: { color: P.onSurfaceVariant, fontSize: fontScale(12), marginTop: 4 },
  itemPrice: { color: P.primary, fontSize: fontScale(15), fontWeight: '700' },
  divider: { height: 1, backgroundColor: `${P.outlineVariant}33`, marginBottom: 24 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  totalTitle: { color: P.primary, fontSize: fontScale(18), fontWeight: '800' },
  totalAmount: { color: P.secondary, fontSize: fontScale(28), fontWeight: '800' },
  methodRow: { flexDirection: 'row', gap: 12 },
  methodBox: { flex: 1, borderRadius: 8, backgroundColor: P.surfaceContainerLow, padding: 16 },
  methodLabel: { color: P.onSurfaceVariant, fontSize: fontScale(10), fontWeight: '800', letterSpacing: 1.5, marginBottom: 4 },
  methodValueRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  methodValue: { color: P.primary, fontSize: fontScale(13), fontWeight: '700' },
  primaryBtn: {
    minHeight: 56,
    borderRadius: 12,
    backgroundColor: P.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: P.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryBtnText: { color: P.onSecondary, fontSize: fontScale(18), fontWeight: '700' },
  secondaryBtn: {
    minHeight: 56,
    borderRadius: 12,
    backgroundColor: `${P.surfaceContainerHighest}80`,
    borderWidth: 1,
    borderColor: `${P.outlineVariant}1A`,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  secondaryBtnText: { color: P.onSurface, fontSize: fontScale(16), fontWeight: '700' },
  printText: {
    color: P.onSecondaryFixedVariant,
    fontSize: fontScale(14),
    fontWeight: '700',
    textAlign: 'center',
    textDecorationLine: 'underline',
    textDecorationColor: P.secondaryFixed,
    marginBottom: 16,
  },
  pressed: { transform: [{ scale: 0.98 }] },
});
