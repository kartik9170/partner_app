import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useBooking from '../../hooks/useBooking';
import { P } from '../../theme/partnerTokens';
import { BOOKING_STATUS } from '../../utils/constants';
import { fontScale } from '../../utils/responsive';

export default function BookingRequestDetailScreen({ navigation, route }) {
  const { updateBooking } = useBooking();
  const booking = route?.params?.booking;
  const [countdown, setCountdown] = useState(165);

  const details = useMemo(
    () => ({
      id: booking?.id,
      serviceName: booking?.serviceName || booking?.service?.name || 'Bridal Makeup + Hair Styling',
      duration: booking?.duration || booking?.service?.duration || '3 hours',
      distance: booking?.distance || '2.5 km away',
      amount: booking?.amount || booking?.service?.price || 4999,
      date: booking?.date || 'Tomorrow',
      time: booking?.time || '10:00 AM',
      address: booking?.address || 'Bandra West, Mumbai',
    }),
    [booking]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (value) => {
    const mins = Math.floor(value / 60);
    const secs = value % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const acceptBooking = () => {
    if (details.id) updateBooking(details.id, { status: BOOKING_STATUS.ACCEPTED });
    const acceptedRoute =
      route?.name === 'PartnerBookDetailPreview' ? 'PartnerAcceptedBookDetailPreview' : 'AcceptedBookingDetail';
    navigation.replace(acceptedRoute, {
      booking: {
        ...booking,
        status: BOOKING_STATUS.ACCEPTED,
      },
    });
  };

  const declineBooking = () => {
    if (details.id) updateBooking(details.id, { status: BOOKING_STATUS.REJECTED });
    Alert.alert('Declined', 'Booking request declined.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  const amountDisplay =
    typeof details.amount === 'number'
      ? `₹${details.amount.toLocaleString('en-IN')}`
      : `₹${details.amount}`;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <View style={styles.profileWrap}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAweLJSpjUV7HD4vQfsOpw5xu3BUVhvhiBMeqWnexNZN06uo2ZAYG_sM6EikK1bzGKGksQkMaUAZKqN1tbXs6DVKyOTeIqHy1_S1G1ituAygATN4GrNbxD0KuWyq4QeIFpQjNxun7lxORugeWrb_6WzOotVuQt4aA73YlfVMcgUfMC-XOIplkZwknFlkigDOnsEMpxWIRkwsnyS3dAgGl0HM_L2_WPiVD77S4syUr9F5dn198E4mw6jkgplqKdMn1246eNvYeUbB48',
              }}
              style={styles.profileImg}
            />
          </View>
          <Text style={styles.topBrand}>The Atelier</Text>
        </View>
        <View style={styles.onlineWrap}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>ONLINE</Text>
        </View>
      </View>

      <View style={styles.mainFill}>
        <LinearGradient
          colors={[P.surfaceContainerLow, P.surface, P.surfaceDim]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.alertPill}>
            <MaterialIcons name="notifications-active" size={18} color={P.onErrorContainer} />
            <Text style={styles.alertPillText}>URGENT REQUEST</Text>
          </View>
          <Text style={styles.mainTitle}>New Booking Request!</Text>
          <Text style={styles.mainSub}>
            Respond within <Text style={styles.timerText}>{formatCountdown(countdown)}</Text>
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>SERVICE REQUESTED</Text>
            <Text style={styles.cardTitle}>{details.serviceName}</Text>
            <View style={styles.twoCol}>
              <View style={styles.metricBox}>
                <MaterialIcons name="schedule" size={20} color={P.secondary} />
                <View>
                  <Text style={styles.metricLabel}>DURATION</Text>
                  <Text style={styles.metricValue}>{details.duration}</Text>
                </View>
              </View>
              <View style={styles.metricBox}>
                <MaterialIcons name="near-me" size={20} color={P.secondary} />
                <View>
                  <Text style={styles.metricLabel}>DISTANCE</Text>
                  <Text style={styles.metricValue}>{details.distance}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.earningsCard}>
            <Text style={styles.earningsLabel}>ESTIMATED EARNINGS</Text>
            <Text style={styles.earningsValue}>{amountDisplay}</Text>
            <Text style={styles.earningsSub}>Net payout after platform fees</Text>
          </View>

          <View style={styles.dateCard}>
            <Text style={styles.dateCardLabel}>APPOINTMENT TIME</Text>
            <View style={styles.dateRow}>
              <MaterialIcons name="calendar-today" size={18} color={P.secondary} />
              <Text style={styles.dateDay}>{details.date}</Text>
            </View>
            <Text style={styles.dateTime}>{details.time}</Text>
          </View>

          <View style={styles.mapCard}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaW8IOQhtVKTz5SULQcBzOO-m1CmBGlIotLphHRbycECmCt9mwQyo8suu06zVcW3zZYnr3tflyZICWM3Kr2vFM3xrTSlI3x_mnwVHADUBQqPUv4eruEJiSDzThUHoqOrwF7DTpBjkfxBhHk4ZZyPDxiDdqDcgRC1D4NpyZig3lab9DKZJHJQLxvj-VCeYdKXTOVl9cPK5zu26JIEMSg6sgX49MSenICs9H3qYxcKKPvkALnAx6A8h7Dpok2hRUSFVi2_k2CXBpReM',
              }}
              style={styles.mapImage}
            />
            <View style={styles.mapOverlay} />
            <View style={styles.locationPill}>
              <MaterialIcons name="location-on" size={16} color={P.secondary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {details.address}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={styles.bottomActions}>
        <Pressable style={({ pressed }) => [styles.acceptBtn, pressed && styles.pressed]} onPress={acceptBooking}>
          <Text style={styles.acceptText}>ACCEPT</Text>
          <MaterialIcons name="check-circle" size={20} color={P.onSecondary} />
        </Pressable>
        <Pressable style={({ pressed }) => [styles.declineBtn, pressed && styles.pressed]} onPress={declineBooking}>
          <Text style={styles.declineText}>DECLINE REQUEST</Text>
        </Pressable>
      </View>
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
    backgroundColor: 'rgba(236, 253, 245, 0.82)',
  },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: P.primaryContainer,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImg: { width: '100%', height: '100%' },
  topBrand: { color: '#064e3b', fontSize: fontScale(18), fontWeight: '700' },
  onlineWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: P.secondary },
  onlineText: { color: '#064e3b', fontSize: fontScale(11), fontWeight: '800', letterSpacing: 0.5 },
  mainFill: { flex: 1, position: 'relative' },
  content: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 180 },
  alertPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: P.errorContainer,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 16,
    shadowColor: P.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  alertPillText: { color: P.onErrorContainer, fontSize: fontScale(10), fontWeight: '800', letterSpacing: 2 },
  mainTitle: { textAlign: 'center', color: P.onSurface, fontSize: fontScale(30), fontWeight: '800' },
  mainSub: { textAlign: 'center', color: P.onSurfaceVariant, marginTop: 4, marginBottom: 20, fontSize: fontScale(16) },
  timerText: { color: P.error, fontWeight: '800', fontSize: fontScale(18), fontVariant: ['tabular-nums'] },
  card: {
    borderRadius: 16,
    backgroundColor: P.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: P.surfaceContainerHighest,
    padding: 24,
    marginBottom: 16,
    shadowColor: P.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  cardLabel: {
    color: P.onSurfaceVariant,
    fontSize: fontScale(10),
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
    opacity: 0.7,
  },
  cardTitle: { color: P.primary, fontSize: fontScale(24), fontWeight: '700', lineHeight: 30, marginBottom: 20 },
  twoCol: { flexDirection: 'row', gap: 12 },
  metricBox: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: `${P.surfaceContainer}80`,
    borderWidth: 1,
    borderColor: `${P.outlineVariant}4D`,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricLabel: { color: P.onSurfaceVariant, fontSize: fontScale(10), fontWeight: '700' },
  metricValue: { color: P.primary, fontSize: fontScale(13), fontWeight: '700' },
  earningsCard: {
    borderRadius: 16,
    backgroundColor: P.primary,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: P.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  earningsLabel: {
    color: P.primaryFixedDim,
    fontSize: fontScale(10),
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
    opacity: 0.85,
  },
  earningsValue: { color: P.onPrimary, fontSize: fontScale(44), fontWeight: '800', lineHeight: 48 },
  earningsSub: { color: P.primaryFixedDim, fontSize: fontScale(11), marginTop: 8, fontWeight: '500' },
  dateCard: {
    borderRadius: 16,
    backgroundColor: P.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: `${P.outlineVariant}33`,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  dateCardLabel: {
    color: P.onSurfaceVariant,
    fontSize: fontScale(10),
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
    opacity: 0.7,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  dateDay: { color: P.primary, fontSize: fontScale(20), fontWeight: '700' },
  dateTime: { color: P.secondary, fontSize: fontScale(36), fontWeight: '800' },
  mapCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 128,
    borderWidth: 1,
    borderColor: `${P.outlineVariant}4D`,
    marginBottom: 8,
  },
  mapImage: { width: '100%', height: '100%' },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: `${P.primary}1A` },
  locationPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(240, 252, 250, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  locationText: { color: P.primary, fontSize: fontScale(12), fontWeight: '700', flex: 1 },
  bottomActions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderColor: P.surfaceContainerHighest,
    backgroundColor: 'rgba(240, 252, 250, 0.92)',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },
  acceptBtn: {
    minHeight: 64,
    borderRadius: 16,
    backgroundColor: P.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: P.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  acceptText: { color: P.onSecondary, fontSize: fontScale(20), fontWeight: '800' },
  declineBtn: { minHeight: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  declineText: {
    color: P.onSurfaceVariant,
    fontSize: fontScale(12),
    fontWeight: '700',
    letterSpacing: 2,
  },
  pressed: { transform: [{ scale: 0.97 }] },
});
