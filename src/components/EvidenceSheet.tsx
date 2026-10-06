import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Sheet } from '@/components/Sheet';
import { EVIDENCE_DATE, EVIDENCE_DATE_STALE, evidenceCopy, evidenceFreshness } from '@/lib/evidence';
import { DEFAULT_ALT_ID, getAlt } from '@/lib/alternatives';
import { resolveOutcome } from '@/lib/outcome';
import { useFlow } from '@/store/flow';
import { colors, fontSize, radius } from '@/theme';

export const EvidenceSheet = forwardRef<BottomSheetModal>(function EvidenceSheet(_, ref) {
  const { verdict, homeTiming, devDataState, devStaleData } = useFlow();
  // Evidence backs what the screen actually claims. Only a real switch outcome names the recommended
  // plan; stay and first renewal describe market rates. It never follows the user's later marketplace pick.
  const outcome = resolveOutcome({ homeTiming, verdict, dataState: devDataState });
  const copy = evidenceCopy(outcome === 'switch' ? 'switch' : 'stay', getAlt(DEFAULT_ALT_ID).name);
  const { dateLine, stale } = evidenceFreshness(devStaleData ? EVIDENCE_DATE_STALE : EVIDENCE_DATE, new Date());
  const close = () => (ref as React.RefObject<BottomSheetModal | null>).current?.dismiss();

  return (
    <Sheet ref={ref}>
      <Text accessibilityRole="header" style={styles.title}>How we checked this</Text>

      <View style={styles.box}>
        <Text style={styles.kicker}>DATA SOURCE</Text>
        <Text style={styles.strong}>IRDAI-published claim-settlement ratios</Text>
        <Text style={styles.small}>Publicly available, not PolicyBazaar's own rating.</Text>
        <Text style={[styles.small, { marginTop: 4 }]}>{dateLine}</Text>
      </View>

      {stale && (
        <View style={styles.stale}>
          <Text style={styles.staleText}>
            This data is more than 6 months old. We'll show the newest figures once the regulator publishes an update — the verdict may change then.
          </Text>
        </View>
      )}

      <View style={styles.box}>
        <Text style={styles.kicker}>WHAT WAS COMPARED</Text>
        <Text style={styles.body}>{copy.compared}</Text>
      </View>

      <View style={[styles.box, { marginBottom: 20 }]}>
        <Text style={styles.kicker}>WHAT THIS ISN'T</Text>
        <Text style={styles.body}>{copy.notThis}</Text>
      </View>

      <PrimaryButton label="Close" onPress={close} />
    </Sheet>
  );
});

const styles = StyleSheet.create({
  title: { fontFamily: 'Merriweather_700Bold', fontSize: fontSize.lg, lineHeight: 26, color: colors.ink, marginBottom: 12 },
  box: { borderWidth: 1, borderColor: colors.line2, borderRadius: radius.lg, padding: 16, marginBottom: 12 },
  kicker: { fontSize: fontSize.xs, fontWeight: '500', color: colors.body, letterSpacing: 0.4, marginBottom: 4 },
  strong: { fontSize: fontSize.sm, fontWeight: '500', color: colors.ink, marginBottom: 4 },
  small: { fontSize: fontSize.xs, color: colors.body },
  body: { fontSize: fontSize.xs, color: colors.body, lineHeight: 18 },
  stale: { backgroundColor: colors.amberBg, borderWidth: 1, borderColor: colors.warningBorder, borderRadius: radius.md, padding: 12, marginBottom: 12 },
  staleText: { fontSize: fontSize.xs, color: colors.ink, lineHeight: 18 },
});
