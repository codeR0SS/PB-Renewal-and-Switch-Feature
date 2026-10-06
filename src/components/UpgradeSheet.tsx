import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Touchable } from '@/components/Touchable';
import { ComparisonTable } from '@/components/ComparisonTable';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Sheet } from '@/components/Sheet';
import type { DiffRow } from '@/lib/alternatives';
import { formatRupees } from '@/lib/content';
import { UPGRADE_DELTA, type UpgradeOffer } from '@/lib/upgrade';
import { colors, fontSize, MIN_TOUCH, radius } from '@/theme';

interface Props {
  offer: UpgradeOffer;
  rows: DiffRow[];
  more: DiffRow[];
  onConfirm: () => void;
}

/** Capped comparison of the picked plan against its Gold tier. Reuses the shared Sheet and ComparisonTable. */
export const UpgradeSheet = forwardRef<BottomSheetModal, Props>(function UpgradeSheet(
  { offer, rows, more, onConfirm },
  ref,
) {
  const close = () => (ref as React.RefObject<BottomSheetModal | null>).current?.dismiss();
  return (
    <Sheet ref={ref}>
      <Text style={styles.kicker}>UPGRADE COMPARISON</Text>
      <Text accessibilityRole="header" style={styles.title}>Your pick vs. {offer.goldName}</Text>
      <ComparisonTable yoursLabel="Your pick" altLabel="Gold" hideYoursTag altAccent={colors.brandBlue} rows={[...rows, ...more]} />
      <Text style={styles.delta}>
        {formatRupees(UPGRADE_DELTA)}/yr more than your checked plan. Still a paid upgrade {'—'} PolicyBazaar earns commission on it.
      </Text>
      <Touchable accessibilityRole="button" onPress={onConfirm} style={styles.confirm}>
        <Text style={styles.confirmText}>Switch to this upgrade</Text>
      </Touchable>
      <PrimaryButton variant="text" label="Keep my current pick" onPress={close} />
    </Sheet>
  );
});

const styles = StyleSheet.create({
  kicker: { fontSize: fontSize.xs, fontWeight: '500', color: colors.body, letterSpacing: 0.4, marginBottom: 4 },
  title: { fontFamily: 'Merriweather_700Bold', fontSize: fontSize.lg, lineHeight: 26, color: colors.ink, marginBottom: 16 },
  delta: { fontSize: fontSize.xs, color: colors.body, lineHeight: 18, marginTop: 12, marginBottom: 16 },
  confirm: { minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: colors.brandBlue, paddingVertical: 12, marginBottom: 4 },
  confirmText: { color: colors.white, fontSize: fontSize.sm, fontWeight: '500' },
});
