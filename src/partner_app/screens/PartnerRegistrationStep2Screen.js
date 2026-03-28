import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SERVICE_CHAPTERS = [
  { id: 'facial', label: 'Facial', icon: 'face' },
  { id: 'hair', label: 'Hair', icon: 'content-cut' },
  { id: 'waxing', label: 'Waxing', icon: 'self-improvement' },
  { id: 'spa', label: 'Spa', icon: 'spa' },
  { id: 'packages', label: 'Packages', icon: 'work-outline' },
  { id: 'bridal', label: 'Bridal', icon: 'auto-awesome' },
  { id: 'salon-skin', label: 'Salon & skin', icon: 'spa' },
  { id: 'nails', label: 'Nails', icon: 'palette' },
  { id: 'makeup', label: 'Makeup', icon: 'brush' },
  { id: 'threading', label: 'Threading', icon: 'visibility' },
];

export default function PartnerRegistrationStep2Screen({ navigation, route }) {
  const form = route?.params?.form || {};
  const [selectedChapters, setSelectedChapters] = useState(form.selectedChapters || []);
  const selectedCount = useMemo(() => selectedChapters.length, [selectedChapters]);

  const toggleChapter = (chapterId) => {
    setSelectedChapters((prev) => (prev.includes(chapterId) ? prev.filter((v) => v !== chapterId) : [...prev, chapterId]));
  };

  const goNext = () => {
    if (selectedChapters.length === 0) {
      Alert.alert('Required', 'At least one service chapter select karo.');
      return;
    }
    const selectedLabels = SERVICE_CHAPTERS.filter((c) => selectedChapters.includes(c.id)).map((c) => c.label);
    navigation.navigate('PartnerRegisterStep3', {
      form: {
        ...form,
        skills: selectedLabels,
        selectedChapters,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#366855" />
        </Pressable>
        <Text style={styles.headerTitle}>Partner Registration</Text>
        <Text style={styles.stepBadge}>Step 02/04</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          Define Your <Text style={styles.titleAccent}>Artistry.</Text>
        </Text>
        <Text style={styles.sub}>Select categories and treatments that represent your expertise.</Text>

        <View style={styles.chapterSection}>
          <Text style={styles.chapterHeading}>Service Chapters</Text>
          <View style={styles.chapterGrid}>
            {SERVICE_CHAPTERS.map((item) => {
              const selected = selectedChapters.includes(item.id);
              return (
                <Pressable key={item.id} style={[styles.chapterCard, selected && styles.chapterCardActive]} onPress={() => toggleChapter(item.id)}>
                  <View style={[styles.chapterIconWrap, selected && styles.chapterIconWrapActive]}>
                    <MaterialIcons name={item.icon} size={20} color={selected ? '#ffffff' : '#366855'} />
                  </View>
                  <Text style={[styles.chapterLabel, selected && styles.chapterLabelActive]}>{item.label}</Text>
                  {selected ? (
                    <View style={styles.chapterCheck}>
                      <MaterialIcons name="check" size={10} color="#ffffff" />
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.menuCard}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Your Signature Menu</Text>
            <Text style={styles.menuCount}>{selectedCount} selected</Text>
          </View>
          <View style={styles.menuChipWrap}>
            {selectedChapters.length === 0 ? (
              <Text style={styles.menuHint}>Choose chapters above to build your partner profile.</Text>
            ) : (
              SERVICE_CHAPTERS.filter((c) => selectedChapters.includes(c.id)).map((c) => (
                <View key={c.id} style={styles.menuChip}>
                  <MaterialIcons name={c.icon} size={13} color="#1c4f3e" />
                  <Text style={styles.menuChipText}>{c.label}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightDot} />
          <Text style={styles.insightTitle}>Pro Tip</Text>
          <Text style={styles.insightText}>
            More relevant chapters increase your visibility in partner matching and make approvals faster.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="help-outline" size={18} color="#366855" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Pressable onPress={goNext} style={styles.nextBtn}>
          <Text style={styles.nextText}>Continue</Text>
          <MaterialIcons name="arrow-forward" size={18} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0fcfa' },
  header: { height: 62, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#366855', fontWeight: '800', fontSize: 16 },
  stepBadge: { color: 'rgba(54,104,85,0.5)', fontWeight: '700', fontSize: 11 },
  progressTrack: { height: 4, width: '100%', backgroundColor: '#e4f0ee' },
  progressFill: { height: 4, width: '50%', backgroundColor: '#366855' },
  content: { padding: 16, paddingBottom: 100 },
  title: { color: '#313c3b', fontSize: 31, fontWeight: '800' },
  titleAccent: { color: '#366855' },
  sub: { color: '#5f6b66', marginTop: 8, marginBottom: 14 },
  chapterSection: {
    marginBottom: 14,
  },
  chapterHeading: {
    color: '#313c3b',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 10,
  },
  chapterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  chapterCard: {
    width: '31.5%',
    minHeight: 68,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d0ddda',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 6,
  },
  chapterCardActive: {
    borderColor: '#366855',
    backgroundColor: 'rgba(54,104,85,0.08)',
  },
  chapterIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#deebe8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  chapterIconWrapActive: {
    backgroundColor: '#366855',
  },
  chapterLabel: {
    color: '#313c3b',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  chapterLabelActive: {
    color: '#1c4f3e',
  },
  chapterCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#366855',
  },
  menuCard: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#deebe8',
    padding: 12,
  },
  menuHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  menuTitle: { color: '#313c3b', fontWeight: '800', fontSize: 17 },
  menuCount: { color: '#366855', fontSize: 12, fontWeight: '700' },
  menuChipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  menuHint: { color: '#707974', fontSize: 12 },
  menuChip: {
    borderRadius: 999,
    backgroundColor: '#b6ebd3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  menuChipText: { color: '#1c4f3e', fontWeight: '700', fontSize: 12 },
  insightCard: {
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: '#1c4f3e',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  insightDot: { width: 7, height: 7, borderRadius: 999, backgroundColor: '#8bd5b9', marginBottom: 8 },
  insightTitle: { color: '#ffffff', fontSize: 15, fontWeight: '800', marginBottom: 3 },
  insightText: { color: 'rgba(255,255,255,0.82)', fontSize: 12, lineHeight: 18 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 86,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: { height: 44, minWidth: 88, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6, backgroundColor: '#f4f9f8' },
  backText: { color: '#366855', fontWeight: '700' },
  nextBtn: { height: 48, flex: 1, marginLeft: 10, borderRadius: 12, backgroundColor: '#366855', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  nextText: { color: '#fff', fontWeight: '800' },
});
