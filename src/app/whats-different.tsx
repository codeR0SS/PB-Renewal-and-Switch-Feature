import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Touchable } from '@/components/Touchable';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MarketplaceSheet } from '@/components/MarketplaceSheet';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StepTracker } from '@/components/StepTracker';
import { IconCheckThick, IconThumbsBox } from '@/components/icons';
import { type DiffRow, YOUR_PLAN } from '@/lib/alternatives';
import { formatRupees, POLICY } from '@/lib/content';
import { useFlow, useSelectedAlt } from '@/store/flow';
import { colors, fontSize, radius } from '@/theme';

const LONG_PREMIUM = 184629; // dev-only overflow test value from the prototype
const TEAL = '#1F8A93';

export default function WhatsDifferent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const alt = useSelectedAlt();
  const devLongPremium = useFlow((s) => s.devLongPremium);
  const selectAlt = useFlow((s) => s.selectAlt);
  const marketRef = useRef<BottomSheetModal>(null);

  const altPremium = devLongPremium ? LONG_PREMIUM : alt.premiumNum;
  const saving = POLICY.premium - altPremium;
  const core: DiffRow[] = [
    { label: 'Coverage', yours: YOUR_PLAN.cover, alt: YOUR_PLAN.cover },
    { label: 'Claim settlement', yours: YOUR_PLAN.claim, alt: alt.claim, altBetter: parseFloat(alt.claim) > parseFloat(YOUR_PLAN.claim) },
    { label: 'Hospital network', yours: `${YOUR_PLAN.hospitals} nearby`, alt: `${alt.hospitals} nearby`, altBetter: alt.hospitals > YOUR_PLAN.hospitals },
  ];
  const rows = [...core, ...(alt.extras ?? [])];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader onBack={() => router.back()} />
      <StepTracker withCompare current="compare" />

      <ScrollView contentContainerStyle={styles.body}>
        <Text accessibilityRole="header" style={styles.title}>What's different</Text>
        <Text style={styles.sub}>Only what changed is shown and not every clause.</Text>

        <View key={alt.id} style={styles.grid}>
          <View style={styles.row}>
            <View style={styles.labelCell} />
            <LinearGradient colors={['#E8EEFF', '#FFFFFF']} style={[styles.yoursCell, styles.yoursHeadCell]}>
              <Text style={styles.headName}>Young Star Silver</Text>
              <Text style={styles.headSub}>(yours)</Text>
            </LinearGradient>
            <View style={styles.altCell}>
              <Text style={styles.headName}>{alt.name}</Text>
            </View>
          </View>

          {rows.map((r) => (
            <View key={r.label} style={styles.row}>
              <View style={styles.labelCell}><Text style={styles.labelText}>{r.label}</Text></View>
              <View style={styles.yoursCell}>
                <Text style={styles.valueText}>{r.yours}</Text>
                {r.yoursSub && <Text style={styles.subText}>{r.yoursSub}</Text>}
              </View>
              <View style={styles.altCell}>
                <View style={styles.altValueRow}>
                  {r.altBetter && <IconCheckThick color={TEAL} />}
                  <Text style={[styles.valueText, r.altBetter && styles.valueTextBetter]}>{r.alt}</Text>
                </View>
                {r.altSub && <Text style={styles.subText}>{r.altSub}</Text>}
              </View>
            </View>
          ))}

          <View style={styles.row}>
            <View style={[styles.labelCell, styles.premiumLabelCell]}><Text style={styles.premiumLabelText}>Yearly premium</Text></View>
            <View style={[styles.yoursCell, styles.yoursPremiumCell]}>
              <Text style={styles.premiumPrice}>{formatRupees(POLICY.premium)}<Text style={styles.premiumUnit}>/yr</Text></Text>
              <Text style={styles.currentPlanText}>Current plan</Text>
              <View style={styles.currentBadge}><IconCheckThick size={12} color={colors.white} strokeWidth={3.2} /></View>
            </View>
            <View style={styles.altPremiumCell}>
              <Text style={styles.premiumPrice}>{formatRupees(altPremium)}<Text style={styles.premiumUnit}>/yr</Text></Text>
              <Touchable accessibilityRole="button" onPress={() => selectAlt(alt.id)} style={styles.selectBtn}>
                <Text style={styles.selectBtnText}>Select</Text>
              </Touchable>
            </View>
          </View>
        </View>

        {saving > 0 && (
          <View style={styles.callout}>
            <View style={styles.calloutTail} />
            <IconThumbsBox />
            <Text style={styles.calloutText}>{formatRupees(saving)}/year less, with a higher claim-settlement ratio</Text>
          </View>
        )}

        {!alt.extras && (
          <Text style={styles.hint}>
            Further differences (checkups, room rent and similar) aren't available for this plan yet, so none are shown.
          </Text>
        )}
        <Text style={styles.hint}>Sample figures for this prototype — no real second insurer was compared.</Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <PrimaryButton label={'See what carries over →'} onPress={() => router.push('/carryover')} />
        <Touchable accessibilityRole="button" onPress={() => marketRef.current?.present()} style={styles.otherLink}>
          <Text style={styles.otherText}>Not keen on {alt.name.split(' ').slice(0, 2).join(' ')}? See other options</Text>
        </Touchable>
      </View>

      <MarketplaceSheet ref={marketRef} />
    </SafeAreaView>
  );
}

const CELL_PAD = 6;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  body: { padding: 16, flexGrow: 1 },
  title: { fontSize: fontSize.lg, fontWeight: '700', color: colors.ink },
  sub: { fontSize: fontSize.xs, color: colors.muted, marginTop: 4, marginBottom: 16 },

  grid: { borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.md, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'stretch' },
  labelCell: { flex: 1.15, backgroundColor: colors.band, paddingHorizontal: 10, paddingVertical: 12, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: colors.borderStrong, borderStyle: 'dashed' },
  labelText: { fontSize: fontSize.xs, color: colors.body },
  yoursCell: { flex: 1, paddingHorizontal: CELL_PAD, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1.5, borderRightWidth: 1.5, borderLeftColor: colors.brandBlue, borderRightColor: colors.brandBlue, borderBottomWidth: 1, borderBottomColor: colors.borderStrong, borderStyle: 'dashed' },
  yoursHeadCell: { borderTopWidth: 1.5, borderTopColor: colors.brandBlue, borderTopLeftRadius: radius.md, borderTopRightRadius: radius.md, paddingVertical: 12 },
  altCell: { flex: 1, paddingHorizontal: CELL_PAD, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: colors.borderStrong, borderStyle: 'dashed' },
  headName: { fontSize: fontSize.xs, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  headSub: { fontSize: 11, color: colors.muted, marginTop: 2 },
  valueText: { fontSize: fontSize.xs, color: colors.body, textAlign: 'center' },
  valueTextBetter: { fontWeight: '700', color: colors.ink },
  subText: { fontSize: 11, color: colors.muted, marginTop: 2, textAlign: 'center' },
  altValueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },

  premiumLabelCell: { borderBottomWidth: 0 },
  premiumLabelText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.ink },
  yoursPremiumCell: { position: 'relative', borderBottomWidth: 1.5, borderBottomColor: colors.brandBlue, borderBottomLeftRadius: radius.md, borderBottomRightRadius: radius.md, paddingVertical: 14 },
  altPremiumCell: { flex: 1, paddingHorizontal: CELL_PAD, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', gap: 8 },
  premiumPrice: { fontSize: fontSize.sm, fontWeight: '700', color: colors.ink },
  premiumUnit: { fontSize: 11, fontWeight: '400', color: colors.muted },
  currentPlanText: { fontSize: 11, color: colors.muted, marginTop: 4, textAlign: 'center' },
  currentBadge: { position: 'absolute', right: 0, bottom: 0, width: 26, height: 22, backgroundColor: colors.brandBlue, borderTopLeftRadius: 10, borderTopRightRadius: 0, borderBottomRightRadius: 10, borderBottomLeftRadius: 0, alignItems: 'center', justifyContent: 'center' },
  selectBtn: { minHeight: 44, width: '100%', borderRadius: 8, backgroundColor: colors.brandBlue, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  selectBtnText: { fontSize: fontSize.sm, fontWeight: '500', color: colors.white },

  callout: { position: 'relative', alignSelf: 'flex-end', maxWidth: 250, marginTop: 12, backgroundColor: colors.green, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  calloutTail: { position: 'absolute', top: -5, right: 46, width: 12, height: 12, backgroundColor: colors.green, transform: [{ rotate: '45deg' }] },
  calloutText: { flex: 1, fontSize: fontSize.xs, lineHeight: 18, color: colors.white, fontWeight: '500' },

  hint: { fontSize: fontSize.xs, color: colors.muted, marginTop: 8, lineHeight: 18 },
  footer: { paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.white, gap: 8 },
  otherLink: { minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1, borderColor: colors.brandBlue },
  otherText: { fontSize: fontSize.sm, fontWeight: '500', color: colors.brandBlue, textAlign: 'center' },
});
