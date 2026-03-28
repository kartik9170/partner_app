import React from 'react';
import {
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BookiLogo, PARTNER } from '../../components/BookiAuthChrome';
import { clamp, fontScale, moderateScale, verticalScale } from '../../utils/responsive';

const FEATURES = [
  { icon: 'calendar-month', label: 'Manage bookings' },
  { icon: 'insights', label: 'Insights' },
  { icon: 'payments', label: 'Get paid' },
];

export default function SplashScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const blobL = clamp(width * 0.58, 200, 280);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=80',
        }}
        style={styles.bg}
        imageStyle={styles.bgImage}
      >
        <View
          style={[
            styles.overlay,
            {
              paddingTop: insets.top + 8,
              paddingBottom: Math.max(insets.bottom, 10),
            },
          ]}
        >
          <View
            pointerEvents="none"
            style={[styles.blobMint, { width: blobL, height: blobL, borderRadius: blobL / 2 }]}
          />
          <View
            pointerEvents="none"
            style={[
              styles.blobSoft,
              {
                width: blobL * 0.85,
                height: blobL * 0.85,
                borderRadius: (blobL * 0.85) / 2,
              },
            ]}
          />
          <View pointerEvents="none" style={styles.sparkle} />

          <View style={styles.topBadge}>
            <MaterialIcons name="work-outline" size={14} color={PARTNER.accent} />
            <Text style={styles.badgeText}>Partner app</Text>
          </View>

          <View style={styles.center}>
            <BookiLogo size={50} />
            <Text style={styles.headline}>Grow your business,{'\n'}on your schedule</Text>
            <Text style={styles.sub}>
              Accept bookings, track earnings, and manage your professional profile — all in one partner workspace.
            </Text>

            <View style={styles.featureRow}>
              {FEATURES.map((f) => (
                <View key={f.label} style={styles.featureChip}>
                  <MaterialIcons name={f.icon} size={18} color={PARTNER.accent} />
                  <Text style={styles.featureText}>{f.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.bottom}>
            <Pressable
              onPress={() => navigation.navigate('Login')}
              style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
            >
              <Text style={styles.ctaText}>Get started</Text>
              <MaterialIcons name="arrow-forward" size={20} color={PARTNER.white} />
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('PartnerProfileSetup', { mobile: '' })}
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryPressed]}
            >
              <Text style={styles.secondaryText}>New partner? Register</Text>
            </Pressable>
            <Text style={styles.hint}>Verified onboarding · Partner support</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: PARTNER.bg, overflow: 'hidden' },
  bg: { flex: 1, width: '100%', overflow: 'hidden' },
  bgImage: { opacity: 0.12 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(253,248,245,0.94)',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(22),
    overflow: 'hidden',
  },
  blobMint: {
    position: 'absolute',
    top: verticalScale(36),
    right: -moderateScale(48),
    backgroundColor: PARTNER.mint,
    opacity: 0.45,
    transform: [{ scaleX: 1.15 }],
  },
  blobSoft: {
    position: 'absolute',
    bottom: verticalScale(200),
    left: -moderateScale(64),
    backgroundColor: PARTNER.accent,
    opacity: 0.08,
  },
  sparkle: {
    position: 'absolute',
    top: '22%',
    right: '10%',
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(54,104,85,0.22)',
    opacity: 0.65,
  },
  topBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(54,104,85,0.18)',
  },
  badgeText: {
    fontSize: fontScale(11),
    fontWeight: '700',
    color: PARTNER.charcoal,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
  },
  headline: {
    marginTop: verticalScale(20),
    textAlign: 'center',
    fontSize: fontScale(26),
    fontWeight: '800',
    color: PARTNER.charcoal,
    lineHeight: fontScale(32),
    letterSpacing: -0.6,
    paddingHorizontal: 8,
  },
  sub: {
    marginTop: verticalScale(14),
    textAlign: 'center',
    fontSize: fontScale(14),
    lineHeight: fontScale(21),
    color: PARTNER.muted,
    paddingHorizontal: moderateScale(8),
    maxWidth: 340,
  },
  featureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: verticalScale(22),
    paddingHorizontal: 4,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(54,104,85,0.1)',
  },
  featureText: {
    fontSize: fontScale(12),
    fontWeight: '600',
    color: PARTNER.charcoal,
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
  },
  cta: {
    width: '100%',
    maxWidth: 400,
    minHeight: 54,
    borderRadius: 8,
    backgroundColor: PARTNER.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 5,
  },
  ctaPressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  ctaText: {
    color: PARTNER.white,
    fontSize: fontScale(17),
    fontWeight: '700',
  },
  secondaryBtn: {
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  secondaryPressed: { opacity: 0.75 },
  secondaryText: {
    fontSize: fontScale(15),
    fontWeight: '700',
    color: PARTNER.accent,
  },
  hint: {
    marginTop: verticalScale(4),
    marginBottom: 0,
    fontSize: fontScale(11),
    color: PARTNER.muted,
    letterSpacing: 0.4,
  },
});
