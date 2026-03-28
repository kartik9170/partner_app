import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { sendLoginOtp } from '../../services/authService';

const initialData = {
  fullName: '',
  mobile: '',
  serviceArea: '',
  experience: '',
  serviceLatitude: null,
  serviceLongitude: null,
};

function looksLikeLatLon(str) {
  const s = String(str || '').trim();
  const m = /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/.exec(s);
  if (!m) return false;
  const lat = parseFloat(m[1], 10);
  const lng = parseFloat(m[2], 10);
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
}

function formatExpoAddress(g) {
  if (!g || typeof g !== 'object') return '';
  const streetLine = [g.streetNumber, g.street].filter(Boolean).join(' ').trim();
  const locality = g.district || g.subregion || '';
  const city = g.city || '';
  const region = g.region || '';
  const parts = [];
  if (streetLine) parts.push(streetLine);
  else if (g.name && !looksLikeLatLon(g.name)) parts.push(String(g.name).trim());
  if (locality && !parts.includes(locality)) parts.push(locality);
  if (city && city !== locality && !parts.includes(city)) parts.push(city);
  if (region && region !== city && !parts.includes(region)) parts.push(region);
  if (g.postalCode) parts.push(g.postalCode);
  if (g.country && !parts.includes(g.country)) parts.push(g.country);
  return parts.filter(Boolean).join(', ');
}

async function reverseGeocodeNominatim(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'AtelierPartnerApp/1.0',
    },
  });
  if (!res.ok) return '';
  const data = await res.json().catch(() => ({}));
  return String(data.display_name || '').trim();
}

async function resolveReadableAddress(latitude, longitude) {
  const geocoded = await Location.reverseGeocodeAsync({ latitude, longitude });
  const g = geocoded?.[0] || {};
  let label = formatExpoAddress(g);
  const weak = !label || label.length < 6 || looksLikeLatLon(label);
  if (weak) {
    const nom = await reverseGeocodeNominatim(latitude, longitude);
    if (nom) label = nom;
  }
  return { label: label && !looksLikeLatLon(label) ? label : '', latitude, longitude };
}

const EXPERIENCE_OPTIONS = ['Select Level', '1-3 Years', '3-7 Years', '7-10 Years', '10+ Years (Master)'];

export default function PartnerProfileSetupScreen({ navigation, route }) {
  const preMobile = String(route?.params?.mobile || '').replace(/\D/g, '').slice(0, 10);
  const [form, setForm] = useState({ ...initialData, mobile: preMobile });
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSentText, setOtpSentText] = useState('Verify');
  const [locating, setLocating] = useState(false);
  const [experienceIdx, setExperienceIdx] = useState(0);

  const cleanMobile = String(form.mobile || '').replace(/\D/g, '').slice(0, 10);
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const setServiceAreaText = (v) =>
    setForm((p) => ({
      ...p,
      serviceArea: v,
      serviceLatitude: null,
      serviceLongitude: null,
    }));

  const onVerifyOtp = async () => {
    if (cleanMobile.length !== 10) return Alert.alert('Required', 'Enter valid mobile number first.');
    setSendingOtp(true);
    try {
      await sendLoginOtp(cleanMobile);
      setOtpSentText('Resend');
      Alert.alert('OTP sent', 'Now enter the 4-digit OTP.');
    } catch (e) {
      Alert.alert('OTP error', e?.message || 'Could not send OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  const detectLiveLocation = async () => {
    try {
      setLocating(true);
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission needed', 'Please allow location permission.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      const { label, latitude, longitude } = await resolveReadableAddress(pos.coords.latitude, pos.coords.longitude);
      if (!label) {
        Alert.alert(
          'Address not found',
          'Could not turn GPS into a street or area name. Check internet and try again, or type your service area manually. Your exact coordinates are not shown on purpose — clients need a readable place.',
        );
        setForm((p) => ({
          ...p,
          serviceLatitude: latitude,
          serviceLongitude: longitude,
        }));
        return;
      }
      setForm((p) => ({
        ...p,
        serviceArea: label,
        serviceLatitude: latitude,
        serviceLongitude: longitude,
      }));
    } catch (e) {
      Alert.alert('Location error', e?.message || 'Could not detect live location.');
    } finally {
      setLocating(false);
    }
  };

  const goNext = () => {
    if (!form.fullName.trim()) return Alert.alert('Required', 'Full name is required.');
    if (cleanMobile.length !== 10) return Alert.alert('Required', '10-digit mobile is required.');
    if (!String(form.serviceArea || '').trim()) return Alert.alert('Required', 'Service area fill karo ya live location use karo.');
    if (experienceIdx === 0) return Alert.alert('Required', 'Experience level select karo.');

    navigation.navigate('PartnerRegisterStep2', {
      form: {
        ...form,
        mobile: cleanMobile,
        serviceArea: String(form.serviceArea || '').trim(),
        serviceLatitude: form.serviceLatitude,
        serviceLongitude: form.serviceLongitude,
        experience: EXPERIENCE_OPTIONS[experienceIdx],
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.select({ ios: 'padding', android: undefined })}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <MaterialIcons name="arrow-back" size={22} color="#366855" />
          </Pressable>
          <Text style={styles.headerTitle}>Partner Registration</Text>
          <Text style={styles.brand}>ATELIER</Text>
        </View>

        <View style={styles.progressRow}>
          <View style={[styles.progressBar, styles.progressBarActive]} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
        </View>
        <Text style={styles.progressText}>Step 1 of 4: Profile Details</Text>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtom8K1XoEqJ0MDud8da1vtuzJ6XlqOC8Uz9d9VwDWjSRixUbfIufjQNF250H6zRUizYeMrKNBUNq12UqFmtJ0Oeb1VCr_KGXGwa6fpC84AQ2yUGQgypDhmZGWUoYkCf2B3pGSFFVR-zUuW3jlspI3EvAAYi-Q80gPT3Rtol9BbNsngdAWNslrEy2KXbvx0Vqwu4syOGjuFV6yqbeypAlt0pd0EYQZ3DRngk79uK1qU9n_1P7S8oRqitTS1jOX9LlelvHhS__xk-Y',
              }}
              style={styles.heroImage}
            />
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>Welcome to the Elite Circle.</Text>
              <Text style={styles.heroSub}>Let's set up your professional digital atelier.</Text>
            </View>
          </View>

          <Text style={styles.mainTitle}>Personal & Business Details</Text>
          <Text style={styles.sub}>Tell us about your craft and where you operate.</Text>

          <Field label="Full Name" value={form.fullName} onChangeText={(v) => update('fullName', v)} placeholder="e.g. Alexander Sterling" />

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.phoneRow}>
              <View style={styles.phoneInputWrap}>
                <TextInput
                  value={cleanMobile}
                  onChangeText={(v) => update('mobile', v.replace(/\D/g, '').slice(0, 10))}
                  placeholder="+1 (555) 000-0000"
                  keyboardType="phone-pad"
                  placeholderTextColor="#9aa6a1"
                  style={styles.input}
                />
              </View>
              <Pressable style={styles.verifyBtnInline} onPress={onVerifyOtp} disabled={sendingOtp}>
                <Text style={styles.verifyBtnInlineText}>{sendingOtp ? 'Sending...' : otpSentText}</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.gridWrap}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Service Area</Text>
              <TextInput
                value={form.serviceArea}
                onChangeText={setServiceAreaText}
                placeholder="City / Area (manual or live)"
                placeholderTextColor="#707974"
                style={styles.input}
              />
              <Pressable style={styles.liveBtn} onPress={detectLiveLocation} disabled={locating}>
                <MaterialIcons name="my-location" size={14} color="#1c4f3e" />
                <Text style={styles.liveBtnText}>{locating ? 'Detecting...' : 'Use Live Location'}</Text>
              </Pressable>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.label}>Years of Experience</Text>
              <Pressable
                style={styles.selectBox}
                onPress={() => {
                  const next = (experienceIdx + 1) % EXPERIENCE_OPTIONS.length;
                  setExperienceIdx(next);
                  update('experience', EXPERIENCE_OPTIONS[next]);
                }}
              >
                <Text style={[styles.selectText, experienceIdx === 0 && styles.placeholder]}>{EXPERIENCE_OPTIONS[experienceIdx]}</Text>
                <MaterialIcons name="star" size={16} color="#707974" />
              </Pressable>
            </View>
          </View>

          <View style={styles.infoBox}>
            <MaterialIcons name="verified-user" size={20} color="#366855" />
            <Text style={styles.infoText}>
              By continuing, you agree to our Partner Terms and acknowledge that we verify professional credentials for quality assurance.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.helpBtn}>
            <MaterialIcons name="help-outline" size={20} color="#366855" />
          </Pressable>
          <Pressable style={styles.continueBtn} onPress={goNext}>
            <Text style={styles.continueText}>Continue</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType = 'default', autoCapitalize = 'sentences' }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor="#9aa6a1"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0fcfa' },
  flex: { flex: 1 },
  header: { height: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  iconBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#366855', fontWeight: '800', fontSize: 16 },
  brand: { color: '#285A48', fontWeight: '900', fontSize: 13 },
  progressRow: { flexDirection: 'row', gap: 5, paddingHorizontal: 24 },
  progressBar: { flex: 1, height: 4, borderRadius: 999, backgroundColor: '#d9e5e3' },
  progressBarActive: { backgroundColor: '#366855' },
  progressText: { marginTop: 8, marginLeft: 24, color: '#366855', fontSize: 10, fontWeight: '800', letterSpacing: 1.1, textTransform: 'uppercase' },
  content: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 110 },
  hero: { height: 190, borderRadius: 28, overflow: 'hidden', marginBottom: 24, backgroundColor: '#c4d4cf' },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 18, paddingVertical: 18, backgroundColor: 'rgba(19,30,28,0.45)' },
  heroTitle: { color: '#f0fcfa', fontWeight: '800', fontSize: 23 },
  heroSub: { color: '#d9e5e3', marginTop: 2, fontSize: 13 },
  mainTitle: { color: '#313c3b', fontWeight: '800', fontSize: 22 },
  sub: { color: '#5f6b66', marginTop: 5, marginBottom: 14 },
  fieldWrap: { marginBottom: 12 },
  label: { color: '#366855', fontSize: 11, fontWeight: '700', marginBottom: 7, letterSpacing: 0.6, textTransform: 'uppercase' },
  input: {
    minHeight: 50,
    borderRadius: 13,
    backgroundColor: '#deebe8',
    paddingHorizontal: 14,
    color: '#313c3b',
    fontSize: 15,
    borderWidth: 0,
    outlineWidth: 0,
  },
  phoneRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  phoneInputWrap: { flex: 1 },
  verifyBtnInline: {
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: '#b6ebd3',
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnInlineText: { color: '#1c4f3e', fontWeight: '800', fontSize: 12 },
  gridWrap: { flexDirection: 'row', gap: 10, marginBottom: 6 },
  gridItem: { flex: 1 },
  selectBox: {
    minHeight: 50,
    borderRadius: 13,
    backgroundColor: '#deebe8',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: { color: '#313c3b', fontSize: 13, fontWeight: '600', flex: 1, paddingRight: 8 },
  placeholder: { color: '#707974', fontWeight: '500' },
  liveBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    minHeight: 30,
    borderRadius: 999,
    paddingHorizontal: 10,
    backgroundColor: '#b6ebd3',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveBtnText: { color: '#1c4f3e', fontSize: 11, fontWeight: '700' },
  infoBox: {
    marginTop: 6,
    backgroundColor: '#eaf6f4',
    borderWidth: 1,
    borderColor: 'rgba(192,201,195,0.45)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoText: { flex: 1, color: '#404944', lineHeight: 18, fontSize: 12 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 92,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  helpBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f8f7' },
  continueBtn: {
    flex: 1,
    marginLeft: 12,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#366855',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  continueText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
