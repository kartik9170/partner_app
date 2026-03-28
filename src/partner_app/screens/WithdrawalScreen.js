import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { P } from '../../theme/partnerTokens';
import { fontScale } from '../../utils/responsive';
import PartnerBottomNav from '../../components/PartnerBottomNav';

const BANKS = [
  { id: 'chase', label: 'Chase Business', meta: '•••• 8829' },
  { id: 'mercury', label: 'Mercury Bank', meta: '•••• 1104' },
];

const PREVIEW_NAV_LIFT = 82;

export default function WithdrawalScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const showPreviewNav = route?.name === 'PartnerWithdrawPreview';
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('chase');

  const setPercentAmount = (percent) => {
    const base = 12450.8;
    const value = ((base * percent) / 100).toFixed(2);
    setAmount(value);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <Pressable onPress={() => navigation.goBack()} style={styles.topIconBtn}>
            <MaterialIcons name="arrow-back" size={22} color={P.secondary} />
          </Pressable>
          <Text style={styles.topTitle}>Withdrawal</Text>
        </View>
        <MaterialIcons name="notifications" size={22} color={P.secondary} />
      </View>

      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={[styles.content, showPreviewNav && styles.contentWithNav]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroOuter}>
            <LinearGradient
              colors={[P.primary, P.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroGlow} />
              <Text style={styles.heroLabel}>Available Balance</Text>
              <Text style={styles.heroAmount}>$12,450.80</Text>
              <View style={styles.heroFooter}>
                <MaterialIcons name="lock" size={14} color={P.tertiaryFixed} />
                <Text style={styles.heroFooterText}>Secured by Atelier Vault</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Enter Amount</Text>
              <Text style={styles.currencyChip}>USD</Text>
            </View>
            <View style={styles.amountInputWrap}>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={`${P.outline}99`}
                style={styles.amountInput}
                underlineColorAndroid="transparent"
              />
              <View style={styles.amountUnderline} />
            </View>
            <View style={styles.percentRow}>
              <Pressable style={styles.percentBtn} onPress={() => setPercentAmount(25)}>
                <Text style={styles.percentText}>25%</Text>
              </Pressable>
              <Pressable style={styles.percentBtn} onPress={() => setPercentAmount(50)}>
                <Text style={styles.percentText}>50%</Text>
              </Pressable>
              <Pressable style={[styles.percentBtn, styles.percentBtnActive]} onPress={() => setPercentAmount(100)}>
                <Text style={[styles.percentText, styles.percentTextActive]}>100%</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitleBank}>Destination Bank</Text>
            <View style={styles.bankList}>
              {BANKS.map((bank) => {
                const active = selectedBank === bank.id;
                return (
                  <Pressable
                    key={bank.id}
                    onPress={() => setSelectedBank(bank.id)}
                    style={[styles.bankCard, active && styles.bankCardActive]}
                  >
                    <View style={styles.bankIconWrap}>
                      <MaterialIcons name="account-balance" size={22} color={P.secondary} />
                    </View>
                    <View style={styles.bankInfo}>
                      <Text style={styles.bankName}>{bank.label}</Text>
                      <Text style={styles.bankMeta}>{bank.meta}</Text>
                    </View>
                    <View style={[styles.radio, active && styles.radioActive]}>
                      {active ? <View style={styles.radioDot} /> : null}
                    </View>
                  </Pressable>
                );
              })}
              <Pressable style={styles.addBankBtn}>
                <MaterialIcons name="add" size={20} color={P.onSurfaceVariant} />
                <Text style={styles.addBankText}>Link New Account</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Processing Fee</Text>
              <Text style={styles.summaryValue}>$0.00 (Free)</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated Arrival</Text>
              <Text style={styles.summaryValue}>1-3 Business Days</Text>
            </View>
          </View>

          <View style={styles.scrollSpacer} />
        </ScrollView>

        <LinearGradient
          colors={[`${P.background}00`, P.background, P.background]}
          locations={[0, 0.45, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.footerFade}
          pointerEvents="none"
        />
        <View
          style={[
            styles.footerBar,
            {
              paddingBottom: 16 + insets.bottom,
              bottom: showPreviewNav ? PREVIEW_NAV_LIFT : 0,
            },
          ]}
        >
          <Pressable
            onPress={() => {
              const value = amount?.trim()?.length ? amount : '12,450.80';
              if (showPreviewNav) navigation.navigate('PartnerWithdrawSuccessPreview', { amount: value });
              else navigation.navigate('WithdrawSuccess', { amount: value });
            }}
            style={({ pressed }) => [styles.requestBtn, pressed && styles.pressed]}
          >
            <Text style={styles.requestText}>Request Withdrawal</Text>
            <MaterialIcons name="send" size={20} color={P.onSecondary} />
          </Pressable>
        </View>
      </View>

      {showPreviewNav ? (
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
  safeArea: { flex: 1, backgroundColor: P.background },
  topBar: {
    height: 64,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(240, 252, 250, 0.82)',
  },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  topIconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },
  topTitle: { color: P.secondary, fontSize: fontScale(18), fontWeight: '700' },
  body: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 120 },
  contentWithNav: { paddingBottom: 200 },
  heroOuter: { marginBottom: 32 },
  heroCard: {
    borderRadius: 32,
    padding: 32,
    overflow: 'hidden',
    shadowColor: P.onSurface,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  heroGlow: {
    position: 'absolute',
    top: -32,
    right: -32,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: `${P.secondaryContainer}1A`,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: fontScale(12),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  heroAmount: { color: P.onPrimary, fontSize: fontScale(36), fontWeight: '900', marginBottom: 16 },
  heroFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroFooterText: {
    color: P.tertiaryFixed,
    fontSize: fontScale(10),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  section: { marginBottom: 40 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { color: P.onSurface, fontSize: fontScale(18), fontWeight: '700' },
  sectionTitleBank: { color: P.onSurface, fontSize: fontScale(18), fontWeight: '700', marginBottom: 24 },
  currencyChip: {
    color: P.secondary,
    fontSize: fontScale(12),
    fontWeight: '700',
    backgroundColor: `${P.secondaryContainer}66`,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  amountInputWrap: {
    borderRadius: 16,
    backgroundColor: P.surfaceContainerHigh,
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  amountInput: { color: P.primary, fontSize: fontScale(30), fontWeight: '800', padding: 0 },
  amountUnderline: {
    marginTop: 8,
    alignSelf: 'center',
    width: '90%',
    height: 2,
    backgroundColor: '#408A71',
  },
  percentRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  percentBtn: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: P.surfaceContainer,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentBtnActive: { backgroundColor: P.secondary, shadowColor: P.secondary, shadowOpacity: 0.25, shadowRadius: 12, elevation: 4 },
  percentText: { color: P.onSurfaceVariant, fontSize: fontScale(13), fontWeight: '600' },
  percentTextActive: { color: P.onSecondary },
  bankList: { gap: 16 },
  bankCard: {
    borderRadius: 24,
    backgroundColor: P.surfaceContainerLow,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bankCardActive: {
    backgroundColor: P.surfaceContainerLowest,
    borderColor: 'transparent',
    shadowColor: P.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 6,
  },
  bankIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: P.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: P.onSurface,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bankInfo: { flex: 1 },
  bankName: { color: P.onSurface, fontSize: fontScale(14), fontWeight: '700' },
  bankMeta: { color: P.onSurfaceVariant, fontSize: fontScale(12), marginTop: 4 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: P.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: P.secondary, backgroundColor: P.secondary },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: P.onSecondary },
  addBankBtn: {
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: P.outlineVariant,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  addBankText: { color: P.onSurfaceVariant, fontSize: fontScale(14), fontWeight: '600' },
  summaryCard: {
    borderRadius: 32,
    backgroundColor: `${P.surfaceContainer}4D`,
    padding: 24,
    marginBottom: 24,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { color: P.onSurfaceVariant, fontSize: fontScale(12) },
  summaryValue: { color: P.onSurface, fontSize: fontScale(12), fontWeight: '700' },
  scrollSpacer: { height: 8 },
  footerFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 140,
  },
  footerBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  requestBtn: {
    borderRadius: 16,
    minHeight: 56,
    backgroundColor: P.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
    shadowColor: P.secondary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  requestText: { color: P.onSecondary, fontSize: fontScale(17), fontWeight: '700' },
  pressed: { transform: [{ scale: 0.98 }] },
});
