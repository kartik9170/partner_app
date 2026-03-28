import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useAuth from '../../hooks/useAuth';
import { P } from '../../theme/partnerTokens';
import { fontScale } from '../../utils/responsive';

function Field({ label, value, onChangeText, keyboardType, placeholder }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={`${P.outline}99`}
        keyboardType={keyboardType}
        style={styles.fieldInput}
        underlineColorAndroid="transparent"
      />
      <View style={styles.fieldUnderline} />
    </View>
  );
}

export default function PartnerEditProfileScreen({ navigation }) {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(String(user?.phone || user?.mobile || ''));
  const [address, setAddress] = useState(user?.address || '');
  const [avatar, setAvatar] = useState(
    user?.avatar ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  );

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to update your photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setAvatar(result.assets[0].uri);
    }
  };

  const save = () => {
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      avatar,
    });
    Alert.alert('Saved', 'Your profile has been updated.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerIcon} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={P.secondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.photoRow}>
          <Pressable onPress={pickPhoto} style={styles.photoCircle}>
            <Image source={{ uri: avatar }} style={styles.photoImg} />
            <View style={styles.photoBadge}>
              <MaterialIcons name="add-a-photo" size={18} color={P.secondary} />
            </View>
          </Pressable>
          <Pressable onPress={pickPhoto} hitSlop={8}>
            <Text style={styles.photoLink}>Photo Upload +</Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <Field label="Name" value={name} onChangeText={setName} placeholder="Full name" />
          <Field label="Email ID" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="Email" />
          <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Phone" />
          <Field label="Address" value={address} onChangeText={setAddress} placeholder="Address" />
        </View>

        <Pressable onPress={save} style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}>
          <Text style={styles.saveBtnText}>Save</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: P.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    minHeight: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: `${P.outlineVariant}66`,
  },
  headerIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: fontScale(18), fontWeight: '800', color: P.primary },
  scroll: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 32 },
  photoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: P.secondaryContainer,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoImg: { width: '100%', height: '100%' },
  photoBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: P.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${P.outlineVariant}99`,
  },
  photoLink: { fontSize: fontScale(16), fontWeight: '700', color: P.secondary },
  form: { marginBottom: 28 },
  fieldBlock: { marginBottom: 22 },
  fieldLabel: { fontSize: fontScale(14), color: P.onSurfaceVariant, marginBottom: 8, fontWeight: '500' },
  fieldInput: {
    fontSize: fontScale(16),
    fontWeight: '600',
    color: P.primary,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  fieldUnderline: { height: 1, backgroundColor: `${P.outlineVariant}cc` },
  saveBtn: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: P.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveBtnText: { fontSize: fontScale(17), fontWeight: '800', color: P.primary },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
});
