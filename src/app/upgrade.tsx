import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Touchable } from '@/components/Touchable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconAlertCircle, IconBack } from '@/components/icons';
import { PrimaryButton } from '@/components/PrimaryButton';
import { UpgradeSheet } from '@/components/UpgradeSheet';
import { formatRupees } from '@/lib/content';
import { GOLD_BLURB, upgradeComparison, upgradeOffer } from '@/lib/upgrade';
import { useFlow, useSelectedAlt } from '@/store/flow';
import { colors, fontSize, MIN_TOUCH, radius } from '@/theme';

/**
 * "Looking for more cover?" Optional, PB-as-seller, kept visibly separate from the verdict.
 * The offer is computed from whichever plan is being confirmed right now (action + marketplace pick),
 * so it is correct for renewing, for switching, and for every alternative.
 */
export default function Upgrade() {
  const router = useRouter();
  const alt = useSelectedAlt();
  const action = useFlow((s) => s.action);
  const setUpgrade = useFlow((s) => s.setUpgrade);
  const sheetRef = useRef<BottomSheetModal>(null);

  const offer = upgradeOffer(action, alt);
  const { rows, more } = upgradeComparison(action, alt);

  const confirm = () => {
    // Tie the upgrade to the base plan it was chosen for; planToBuy ignores it if that base ever changes.
    setUpgrade({ name: offer.goldName, oneYear: offer.goldOneYear, baseKey: offer.baseKey });
    sheetRef.current?.dismiss();
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <Touchable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}>
          <IconBack size={20} />
        </Touchable>
        <Text accessibilityRole="header" style={styles.title}>Looking for more cover?</Text>
        <View style={{ width: MIN_TOUCH }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.current}>
          <Text style={styles.currentText}>
            Your checked plan {'—'} <Text style={styles.strong}>{offer.base.name}, {formatRupees(offer.base.oneYear)}/yr</Text> {'—'} stays your main recommendation either way. This is an optional upgrade, not a replacement for it.
          </Text>
        </View>

        <View style={styles.paid}>
          <IconAlertCircle />
          <Text style={styles.paidText}>This is a paid upgrade. PolicyBazaar earns commission on it {'—'} unlike the switch check itself.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.badge}><Text style={styles.badgeText}>Upgrade</Text></View>
            <Text style={styles.price}>
              {formatRupees(offer.goldOneYear)}
              <Text style={styles.unit}>/yr</Text>
            </Text>
          </View>
          <Text style={styles.name}>{offer.goldName}</Text>
          <Text style={styles.blurb}>{GOLD_BLURB}</Text>
          <Touchable accessibilityRole="button" onPress={() => sheetRef.current?.present()} style={styles.compare}>
            <Text style={styles.compareText}>See full comparison</Text>
          </Touchable>
        </View>

        <Text style={styles.footnote}>Not interested? Your checked plan is unaffected {'—'} no action needed.</Text>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Back" onPress={() => router.back()} />
      </View>

      <UpgradeSheet ref={sheetRef} offer={offer} rows={rows} more={more} onConfirm={confirm} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.line },
  back: { width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },
  title: { flex: 1, textAlign: 'center', fontSize: fontSize.sm, fontWeight: '500', color: colors.ink },
  body: { padding: 16 },
  current: { backgroundColor: colors.band, borderWidth: 1, borderColor: colors.line, borderRadius: 8, padding: 12, marginBottom: 16 },
  currentText: { fontSize: fontSize.sm, color: colors.body, lineHeight: 20 },
  strong: { fontWeight: '500', color: colors.ink },
  paid: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: colors.amberBg, borderWidth: 1, borderColor: colors.warningBorder, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 },
  paidText: { flex: 1, fontSize: fontSize.sm, fontWeight: '500', color: colors.ink, lineHeight: 20 },
  card: { borderWidth: 1, borderColor: colors.line2, borderRadius: radius.lg, padding: 16, marginBottom: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  badge: { backgroundColor: colors.band, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.brandBlue },
  price: { fontSize: fontSize.lg, fontWeight: '700', color: colors.ink },
  unit: { fontSize: fontSize.xs, fontWeight: '400', color: colors.body },
  name: { fontSize: fontSize.lg, fontWeight: '500', color: colors.ink, marginBottom: 4 },
  blurb: { fontSize: fontSize.xs, color: colors.body, lineHeight: 18, marginBottom: 16 },
  compare: { minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.brandBlue, backgroundColor: colors.white, borderRadius: 8 },
  compareText: { fontSize: fontSize.sm, fontWeight: '500', color: colors.brandBlue },
  footnote: { fontSize: fontSize.xs, color: colors.body, textAlign: 'center', marginTop: 8, lineHeight: 18 },
  footer: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.white },
});
