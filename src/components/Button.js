import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { PARTNER_PRIMARY } from '../theme/partnerColors';
import { clamp, fontScale, moderateScale, verticalScale } from '../utils/responsive';

const CUSTOMER_PRIMARY = '#366855';

export default function Button({ title, onPress, variant = 'primary', disabled = false, loading = false, style, palette = 'customer' }) {
  const secondary = variant === 'secondary';
  const primaryColor = palette === 'partner' ? PARTNER_PRIMARY : CUSTOMER_PRIMARY;
  const dynamic = useMemo(
    () =>
      StyleSheet.create({
        primaryBg: { backgroundColor: primaryColor },
        primaryShadow: {
          shadowColor: primaryColor,
          shadowOpacity: 0.25,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
          elevation: 4,
        },
        darkText: { color: primaryColor },
      }),
    [primaryColor]
  );
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        secondary ? styles.secondary : dynamic.primaryBg,
        secondary ? styles.secondaryShadow : dynamic.primaryShadow,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? '#1E1E1E' : '#fff'} />
      ) : (
        <Text style={[styles.txt, secondary ? dynamic.darkText : styles.light]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: moderateScale(14),
    paddingVertical: clamp(verticalScale(13), 11, 16),
    paddingHorizontal: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(50),
  },
  secondary: {
    backgroundColor: '#EDE0D4',
    borderWidth: 1.5,
    borderColor: '#9dd2bb',
  },
  secondaryShadow: {
    shadowColor: '#1E1E1E',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  disabled: { opacity: 0.6 },
  txt: { fontWeight: '700', fontSize: fontScale(15), letterSpacing: 0.3 },
  light: { color: '#FFFFFF' },
});
