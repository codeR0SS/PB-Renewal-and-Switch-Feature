import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Touchable } from '@/components/Touchable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconAlertCircle, IconEnvelope } from '@/components/icons';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RiderSheet } from '@/components/RiderSheet';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StepTracker } from '@/components/StepTracker';
import { StickyFooter } from '@/components/StickyFooter';
import { planToBuy, RENEWAL_YEAR } from '@/lib/checkout';
import { formatRupees } from '@/lib/content';
import {
  checkoutTotal, getRider, nextCheckYear, ridersTotal, termPrice, threeYearPrice, threeYearSavings, type Term,
} from '@/lib/pricing';
import { useFlow, useSelectedAlt } from '@/store/flow';
import { colors, fontSize, MIN_TOUCH, radius } from '@/theme';

export default function Confirm() {
  const router = useRouter();
  const alt = useSelectedAlt();
  const { action, term, riderIds, confirmedUpgrade, setTerm, setRiderIds, setUpgrade } = useFlow();
  const riderRef = useRef<BottomSheetModal>(null);

  const switching = action === 'switch';
  // One source of truth: the plan comes from (action, pick), the price from (plan, term, riders).
  const plan = planToBuy(action, alt, confirmedUpgrade);
  const total = checkoutTotal({ oneYear: plan.oneYear, term, riderIds });
  const verb = switching ? 'Start switch' : 'Renew';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader onBack={() => router.back()} />
      <StepTracker withCompare={switching} current="confirm" />

      <>
        <ScrollView contentContainerStyle={styles.body}>
            <Text accessibilityRole="header" style={styles.title}>Confirm</Text>

            <View style={styles.planCard}>
              <Text style={styles.kicker}>{switching ? 'Switching to' : 'Renewing'}</Text>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>
                {formatRupees(termPrice(plan.oneYear, term))} <Text style={styles.perYear}>{term === 3 ? '/ 3 years' : '/ year'}</Text>
              </Text>
              {plan.upgraded && (
                <>
                  <Text style={styles.amber}>
                    Paid upgrade of {plan.base.name}. PolicyBazaar earns commission on it.
                  </Text>
                  <Touchable accessibilityRole="button" onPress={() => setUpgrade(null)} style={styles.undo}>
                    <Text style={styles.undoText}>Switch back to {plan.base.name}</Text>
                  </Touchable>
                </>
              )}
              {switching && (
                <View style={styles.hospitalNotice}>
                  <IconAlertCircle size={16} />
                  <Text style={styles.hospitalNoticeText}>
                    {alt.overlapCovered !== undefined
                      ? 'Hospital network changes slightly — reviewed on the previous screen.'
                      : 'Hospital network differs — reviewed on the previous screen.'}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.terms}>
              <TermCard term={1} selected={term === 1} onPress={setTerm} price={formatRupees(plan.oneYear)} />
              <TermCard
                term={3}
                selected={term === 3}
                onPress={setTerm}
                price={formatRupees(threeYearPrice(plan.oneYear))}
                save={`Save ${formatRupees(threeYearSavings(plan.oneYear))} vs 3× the 1-year price`}
              />
            </View>
            {term === 3 && (
              <View style={styles.termNote}>
                <Text style={styles.termNoteText}>
                  You won't get a fresh Renewal Check again until {nextCheckYear(RENEWAL_YEAR, 3)} {'—'} your rate is locked in either way, whether or not a cheaper option shows up later.
                </Text>
              </View>
            )}

            {/* Link 1: riders, a set of small add-ons on top of the chosen plan. */}
            <Touchable accessibilityRole="button" onPress={() => riderRef.current?.present()} style={styles.otherLink}>
              <Text style={styles.otherLinkText}>See other options for this policy</Text>
            </Touchable>
            {/* Link 2: a richer tier of the SAME plan. Gold-accented so it never reads as the first link. */}
            {!plan.upgraded && (
              <Touchable accessibilityRole="button" onPress={() => router.push('/upgrade')} style={styles.upgradeLink}>
                <Text style={styles.upgradeText}>Looking for more cover? See upgrade options {'→'}</Text>
              </Touchable>
            )}
          </ScrollView>

          <RiderSheet
            ref={riderRef}
            planName={plan.name}
            oneYear={plan.oneYear}
            term={term}
            riderIds={riderIds}
            onConfirm={(ids) => {
              setRiderIds(ids);
              riderRef.current?.dismiss();
            }}
          />

          <StickyFooter>
            {/* Compact on purpose: the footer is always on screen, so every line here costs the term picker space. */}
            {riderIds.length > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel} numberOfLines={1}>
                  {riderIds.length} rider{riderIds.length === 1 ? '' : 's'} {'·'} {riderIds.map((id) => getRider(id).name).join(', ')}
                </Text>
                <Text style={styles.breakdownValue}>+{formatRupees(ridersTotal(riderIds, term))}</Text>
              </View>
            )}
            <View style={styles.deliveryBox}>
              <IconEnvelope size={14} />
              <Text style={styles.delivery}>
                Documents, invoice, and your declaration will be sent to{' '}
                <Text style={styles.deliveryValue}>rohit@{'•••••'}.com {'·'} +91 98{'•••'} 4021</Text>. Wrong details?{' '}
                <Text style={styles.deliveryLink}>Update in Account Settings {'→'}</Text>
              </Text>
            </View>
            <PrimaryButton
              label={`${verb} at ${formatRupees(total)}${term === 3 ? ' (3 years)' : ''}`}
              onPress={() => router.push('/payment')}
            />
          </StickyFooter>
        </>
    </SafeAreaView>
  );
}

function TermCard({ term, selected, onPress, price, save }: {
  term: Term; selected: boolean; onPress: (t: Term) => void; price: string; save?: string;
}) {
  return (
    <Touchable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={() => onPress(term)}
      style={[styles.term, selected ? styles.termOn : styles.termOff]}>
      <Text style={[styles.termKicker, selected && styles.termKickerOn]}>{term === 1 ? '1 year' : '3 years'}</Text>
      <Text style={styles.termPrice}>{price}</Text>
      {save ? <Text style={styles.save}>{save}</Text> : null}
    </Touchable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  body: { padding: 16, flexGrow: 1 },
  title: { fontFamily: 'Merriweather_700Bold', fontSize: fontSize.xl, lineHeight: 30, color: colors.ink, marginBottom: 16 },
  planCard: { borderWidth: 1, borderColor: colors.line2, borderRadius: radius.lg, padding: 16, marginBottom: 16 },
  kicker: { fontSize: fontSize.xs, color: colors.body },
  planName: { fontSize: fontSize.sm, fontWeight: '700', color: colors.ink, marginTop: 4 },
  planPrice: { fontFamily: 'Merriweather_700Bold', fontSize: fontSize.xl, color: colors.ink, marginTop: 8 },
  perYear: { fontFamily: 'Roboto', fontSize: fontSize.sm, fontWeight: '400', color: colors.body },
  undo: { minHeight: MIN_TOUCH, justifyContent: 'center', alignSelf: 'flex-start' },
  undoText: { fontSize: fontSize.xs, color: colors.muted, textDecorationLine: 'underline' },
  amber: { fontSize: fontSize.xs, color: colors.amberText, marginTop: 8, lineHeight: 18 },
  hospitalNotice: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: colors.amberBg, borderWidth: 1, borderColor: colors.warningBorder, borderRadius: 8, padding: 12, marginTop: 12 },
  hospitalNoticeText: { flex: 1, fontSize: fontSize.xs, lineHeight: 18, color: colors.ink },
  terms: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  term: { flex: 1, borderRadius: radius.lg, padding: 16, minHeight: MIN_TOUCH },
  termOn: { borderWidth: 1.5, borderColor: colors.brandBlue, backgroundColor: colors.band, padding: 15.5 },
  termOff: { borderWidth: 1, borderColor: colors.line2, backgroundColor: colors.white },
  termKicker: { fontSize: fontSize.xs, color: colors.body, marginBottom: 2 },
  termKickerOn: { color: colors.brandBlue, fontWeight: '500' },
  termPrice: { fontSize: fontSize.sm, fontWeight: '700', color: colors.ink },
  save: { fontSize: fontSize.xs, color: colors.green, fontWeight: '500', marginTop: 4, lineHeight: 16 },
  termNote: { backgroundColor: colors.band, borderWidth: 1, borderColor: colors.line2, borderRadius: radius.lg, padding: 16, marginBottom: 16 },
  termNoteText: { fontSize: fontSize.sm, color: colors.body, lineHeight: 20 },
  otherLink: { minHeight: 44, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  otherLinkText: { fontSize: fontSize.sm, fontWeight: '500', color: colors.brandBlue },
  upgradeLink: { minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderRadius: 8, backgroundColor: colors.amberBg, borderWidth: 1, borderColor: colors.warningBorder, paddingHorizontal: 12 },
  upgradeText: { fontSize: fontSize.sm, fontWeight: '500', color: colors.ink, textAlign: 'center' },
  // A contact/account fact, not a price line — gets its own quiet card (like a checkout's
  // "purchase protected" notice) instead of blending into the price breakdown above it.
  deliveryBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: colors.band, borderRadius: radius.md, padding: 10 },
  delivery: { flex: 1, fontSize: fontSize.xs, color: colors.body, lineHeight: 18 },
  deliveryValue: { fontWeight: '500', color: colors.ink },
  deliveryLink: { fontWeight: '500', color: colors.brandBlue },
  // A real line item (label left, price right) instead of one run-on sentence — same
  // lineRow/lineLabel/lineValue shape payment.tsx already uses for this exact breakdown.
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  breakdownLabel: { flex: 1, fontSize: fontSize.xs, color: colors.body },
  breakdownValue: { fontSize: fontSize.xs, fontWeight: '700', color: colors.ink },
});
