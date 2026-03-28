import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { P } from '../theme/partnerTokens';

/** Partner chrome — aligned with post-login Material tokens (HTML design system). */
export const PARTNER = {
  bg: '#FDF8F5',
  bgMint: P.surface,
  charcoal: P.primary,
  accent: P.secondary,
  accentDeep: P.tertiaryContainer,
  mint: P.secondaryContainer,
  mintSoft: 'rgba(54, 104, 85, 0.12)',
  border: P.outlineVariant,
  muted: P.onSurfaceVariant,
  white: P.surfaceContainerLowest,
};

export function BookiLogo({ size = 44, compact = false }) {
  const s = compact ? size * 0.72 : size;
  return (
    <View style={styles.logoRow}>
      <Text style={[styles.logoText, { fontSize: s, color: PARTNER.charcoal }]}>BOO</Text>
      <Text style={[styles.logoText, { fontSize: s, color: PARTNER.accent }]}>K</Text>
      <Text style={[styles.logoText, { fontSize: s, color: PARTNER.charcoal }]}>I</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontWeight: '900', letterSpacing: -1.5 },
});
