import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Touchable } from '@/components/Touchable';
import { IconClose } from '@/components/icons';
import { Sheet } from '@/components/Sheet';
import { ALTERNATIVES, YOUR_PLAN } from '@/lib/alternatives';
import { formatRupees, POLICY } from '@/lib/content';
import { useFlow } from '@/store/flow';
import { colors, fontSize, MIN_TOUCH, radius } from '@/theme';

/** "Not keen on X? See other options": four verified insurers, same evidence standard each. */
export const MarketplaceSheet = forwardRef<BottomSheetModal>(function MarketplaceSheet(_, ref) {
  const selectAlt = useFlow((s) => s.selectAlt);
  const close = () => (ref as React.RefObject<BottomSheetModal | null>).current?.dismiss();

  const header = (
    <View style={styles.headRow}>
      <View>
        <Text style={styles.headKicker}>Comparing against your plan</Text>
        <Text style={styles.headPlan}>
          Young Star Silver {formatRupees(POLICY.premium)}
          <Text style={styles.headUnit}>/yr</Text>
        </Text>
      </View>
      <Touchable accessibilityLabel="Close" onPress={close} style={styles.close}>
        <IconClose />
      </Touchable>
    </View>
  );

  return (
    <Sheet ref={ref} header={header}>
      <Text style={styles.intro}>Other insurers:</Text>
      {ALTERNATIVES.map((a) => (
        <View key={a.id} style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.name}>{a.name}</Text>
            <Text style={styles.price}>
              {formatRupees(a.premiumNum)}
              <Text style={styles.unit}>/yr</Text>
            </Text>
          </View>
          <Text style={styles.facts}>
            Claim settlement {a.claim} {'·'} Coverage {YOUR_PLAN.cover} {'·'} {a.hospitals} hospitals nearby
          </Text>
          <Touchable
            accessibilityRole="button"
            onPress={() => {
              selectAlt(a.id);
              close();
            }}
            style={styles.choose}>
            <Text style={styles.chooseText}>Choose this</Text>
          </Touchable>
        </View>
      ))}
    </Sheet>
  );
});

const styles = StyleSheet.create({
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headKicker: { fontSize: fontSize.xs, color: colors.body },
  headPlan: { fontSize: fontSize.sm, fontWeight: '700', color: colors.ink },
  headUnit: { fontSize: fontSize.xs, fontWeight: '400', color: colors.body },
  close: { width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center', marginRight: -8 },
  intro: { fontSize: fontSize.sm, fontWeight: '500', color: colors.ink, marginBottom: 12 },
  card: { borderWidth: 1, borderColor: colors.line2, borderRadius: radius.lg, padding: 16, marginBottom: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 8 },
  name: { flex: 1, fontSize: fontSize.sm, fontWeight: '700', color: colors.ink },
  price: { fontSize: fontSize.lg, fontWeight: '700', color: colors.ink },
  unit: { fontSize: fontSize.xs, fontWeight: '400', color: colors.body },
  facts: { fontSize: fontSize.xs, color: colors.body, marginBottom: 12, lineHeight: 18 },
  choose: { minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.brandBlue, backgroundColor: colors.white, borderRadius: 8 },
  chooseText: { fontSize: fontSize.sm, fontWeight: '500', color: colors.brandBlue },
});
