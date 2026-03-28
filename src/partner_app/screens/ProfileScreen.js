import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useAuth from '../../hooks/useAuth';
import { P } from '../../theme/partnerTokens';
import { ROLES } from '../../utils/constants';
import { fontScale } from '../../utils/responsive';

function InfoRow({ label, value, isLast }) {
  return (
    <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const { user, role, setRole, logout } = useAuth();

  const displayRole = typeof role === 'string' ? role : String(role ?? '—');

  const openPerformance = () => {
    navigation.getParent()?.navigate('Earnings', { screen: 'Performance' });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.screenTitle}>Partner Profile</Text>

        <View style={styles.userCard}>
          <InfoRow label="Name" value={user?.name || '—'} />
          <InfoRow label="Email" value={user?.email || '—'} />
          <InfoRow label="Current Role" value={displayRole} isLast />
        </View>

        <Pressable
          onPress={() => navigation.navigate('ProfessionalProfile')}
          style={({ pressed }) => [styles.menuCard, pressed && styles.menuPressed]}
          accessibilityRole="button"
          accessibilityLabel="Professional Details"
        >
          <View style={styles.menuIconWrap}>
            <MaterialIcons name="work" size={22} color={P.secondary} />
          </View>
          <Text style={styles.menuTitle}>Professional Details</Text>
          <MaterialIcons name="chevron-right" size={22} color={P.outline} />
        </Pressable>

        <Pressable
          onPress={openPerformance}
          style={({ pressed }) => [styles.menuCard, pressed && styles.menuPressed]}
          accessibilityRole="button"
          accessibilityLabel="Performance"
        >
          <View style={styles.menuIconWrap}>
            <MaterialIcons name="insights" size={22} color={P.secondary} />
          </View>
          <Text style={styles.menuTitle}>Performance</Text>
          <MaterialIcons name="chevron-right" size={22} color={P.outline} />
        </Pressable>

        <View style={styles.actions}>
          <Pressable
            onPress={() => setRole(ROLES.CUSTOMER)}
            style={({ pressed }) => [styles.switchBtn, pressed && styles.btnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Switch to Customer"
          >
            <Text style={styles.switchBtnText}>Switch to Customer</Text>
          </Pressable>

          <Pressable
            onPress={logout}
            style={({ pressed }) => [styles.logoutBtn, pressed && styles.btnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Logout"
          >
            <Text style={styles.logoutBtnText}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: P.surface,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 28,
  },
  screenTitle: {
    fontSize: fontScale(26),
    fontWeight: '800',
    color: P.primary,
    letterSpacing: -0.4,
    marginBottom: 20,
  },
  userCard: {
    backgroundColor: P.surfaceContainerLowest,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${P.outlineVariant}55`,
    paddingHorizontal: 18,
    paddingVertical: 4,
    marginBottom: 14,
    shadowColor: P.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  infoRow: {
    paddingVertical: 14,
  },
  infoRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: `${P.outlineVariant}99`,
  },
  infoLabel: {
    fontSize: fontScale(12),
    fontWeight: '600',
    color: P.onSurfaceVariant,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  infoValue: {
    fontSize: fontScale(16),
    fontWeight: '600',
    color: P.primary,
    lineHeight: 22,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: P.surfaceContainerLowest,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${P.outlineVariant}55`,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    minHeight: 58,
    shadowColor: P.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  menuPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  menuIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${P.secondaryContainer}80`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTitle: {
    flex: 1,
    fontSize: fontScale(16),
    fontWeight: '700',
    color: P.primary,
  },
  actions: {
    marginTop: 20,
    gap: 12,
  },
  switchBtn: {
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: P.primaryFixed,
    borderWidth: 1,
    borderColor: `${P.secondaryFixedDim}99`,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: P.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  switchBtnText: {
    fontSize: fontScale(16),
    fontWeight: '700',
    color: P.secondary,
  },
  logoutBtn: {
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: P.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: P.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 5,
  },
  logoutBtnText: {
    fontSize: fontScale(16),
    fontWeight: '700',
    color: P.onSecondary,
  },
  btnPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
});
