import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Sheet } from '@/components/Sheet';
import { IconArrowRight, IconSwitch } from '@/components/icons';
import { formatRupees, POLICY } from '@/lib/content';
import { useFlow, useSelectedAlt } from '@/store/flow';
import { colors, fontSize, radius } from '@/theme';

interface Props {
  onContinue: () => void;
}

/** Shown from What's Different, right before Carryover: a quick from/to recap so the
 * switch itself registers, not just the premium saving. Nothing here is a payment step. */
export const SwitchConfirmSheet = forwardRef<BottomSheetModal, Props>(function SwitchConfirmSheet({ onContinue }, ref) {
  const alt = useSelectedAlt();
  const devLongPremium = useFlow((s) => s.devLongPremium);
  const altPremium = devLongPremium ? 184629 : alt.premiumNum;
  const close = () => (ref as React.RefObject<BottomSheetModal | null>).current?.dismiss();

  return (
    <Sheet ref={ref}>
      <View style={styles.iconBadge}>
        <IconSwitch />
      </View>
      <Text accessibilityRole="header" style={styles.title}>Confirm the switch</Text>
      <Text style={styles.sub}>You're moving your cover, not just the price. Here's the plan change:</Text>

      <View style={styles.swapBox}>
        <View style={styles.planCol}>
          <Text style={styles.kicker}>CURRENT</Text>
          <Text style={styles.planName}>{POLICY.planName}</Text>
          <Text style={styles.planSub}>{POLICY.insurer}</Text>
        </View>
        <IconArrowRight color={colors.muted} />
        <View style={styles.planCol}>
          <Text style={styles.kicker}>SWITCHING TO</Text>
          <Text style={styles.planName}>{alt.name}</Text>
          <Text style={styles.planSub}>{formatRupees(altPremium)}/yr</Text>
        </View>
      </View>

      <Text style={styles.reassure}>
        Your {POLICY.insurer} plan stays active until the new policy is issued, so there's no gap in cover. Next, you'll see exactly what carries over {'—'} nothing is confirmed or paid for yet.
      </Text>

      <PrimaryButton label="Continue" onPress={onContinue} />
      <PrimaryButton variant="text" label="Go back to comparison" onPress={close} />
    </Sheet>
  );
});

const styles = StyleSheet.create({
  iconBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.band, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { fontFamily: 'Merriweather_700Bold', fontSize: fontSize.lg, lineHeight: 26, color: colors.ink, marginBottom: 4 },
  sub: { fontSize: fontSize.sm, color: colors.body, lineHeight: 20, marginBottom: 16 },

  swapBox: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.line2, borderRadius: radius.lg, padding: 14, marginBottom: 14 },
  planCol: { flex: 1 },
  kicker: { fontSize: 11, fontWeight: '600', color: colors.body, letterSpacing: 0.4, marginBottom: 4 },
  planName: { fontSize: fontSize.sm, fontWeight: '700', color: colors.ink },
  planSub: { fontSize: fontSize.xs, color: colors.body, marginTop: 2 },

  reassure: { fontSize: fontSize.xs, color: colors.body, lineHeight: 18, marginBottom: 20 },
});
