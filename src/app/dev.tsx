import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Touchable } from '@/components/Touchable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFlow } from '@/store/flow';
import { colors, fontSize, MIN_TOUCH } from '@/theme';

// Dev-only prototype controls (replaces the HTML "PROTOTYPE CONTROLS" panel).
// Lives on its own route, outside every real screen's component tree.
export default function Dev() {
  const router = useRouter();
  const s = useFlow();

  if (!__DEV__) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>Prototype controls</Text>
        <Text style={styles.sub}>Dev only — not part of the product.</Text>

        <Group label="Home timing">
          <Opt label="Expiring today" on={s.homeTiming === 'today'} onPress={() => s.setHomeTiming('today')} />
          <Opt label="Renews in 52 days" on={s.homeTiming === 'later'} onPress={() => s.setHomeTiming('later')} />
        </Group>
        <Group label="Verdict">
          <Opt label="Stay" on={s.verdict === 'stay'} onPress={() => s.setVerdict('stay')} />
          <Opt label="Switch" on={s.verdict === 'switch'} onPress={() => s.setVerdict('switch')} />
        </Group>
        <Group label="Check outcome (what the backend would report)">
          <Opt label="Normal data: follows the verdict" on={s.devDataState === 'normal'} onPress={() => s.setDev({ devDataState: 'normal' })} />
          <Opt label="First renewal (no prior year)" on={s.devDataState === 'first'} onPress={() => s.setDev({ devDataState: 'first' })} />
          <Opt label="Claim data unavailable" on={s.devDataState === 'unavailable'} onPress={() => s.setDev({ devDataState: 'unavailable' })} />
          <Text style={styles.hint}>
            "Too late to switch" is not a toggle: it fires on its own when Home is "Expiring today" and the result would point at switching (Switch verdict, or data unavailable).
          </Text>
        </Group>
        <Group label="Renewal Check">
          <Opt label="Show first-time intro again" on={!s.introSeen} onPress={s.resetIntro} />
          <Opt label="Make the check hang (see 6s timeout)" on={s.devCheckHangs} onPress={() => s.setDev({ devCheckHangs: !s.devCheckHangs })} />
          <Opt label="Evidence data is stale (7+ months)" on={s.devStaleData} onPress={() => s.setDev({ devStaleData: !s.devStaleData })} />
        </Group>
        <Group label="What's different">
          <Opt label="Long premium number (₹1,84,629)" on={s.devLongPremium} onPress={() => s.setDev({ devLongPremium: !s.devLongPremium })} />
        </Group>
        <Group label="What carries over">
          <Opt label="No claim bonus yet (first policy year)" on={s.devNoBonus} onPress={() => s.setDev({ devNoBonus: !s.devNoBonus })} />
          <Opt label="Show loading + 6s timeout" on={s.devCarryoverLoading} onPress={() => s.setDev({ devCarryoverLoading: !s.devCarryoverLoading })} />
        </Group>
        <Group label="Confirm">
          <Opt label="Fail the next payment (once)" on={s.devPaymentFailsNext} onPress={() => s.setDev({ devPaymentFailsNext: !s.devPaymentFailsNext })} />
        </Group>

        <Opt label="Done" on={false} onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 16, gap: 6 }}>
      <Text style={styles.group}>{label}</Text>
      {children}
    </View>
  );
}

function Opt({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Touchable accessibilityRole="button" accessibilityState={{ selected: on }} onPress={onPress} style={[styles.opt, on && styles.optOn]}>
      <Text style={[styles.optText, on && { color: colors.white }]}>{label}</Text>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.amberBg },
  body: { padding: 16 },
  title: { fontSize: fontSize.lg, fontWeight: '700', color: colors.amberText },
  sub: { fontSize: fontSize.xs, color: colors.amberText, marginBottom: 16 },
  hint: { fontSize: fontSize.xs, color: colors.amberText, lineHeight: 18 },
  group: { fontSize: fontSize.xs, fontWeight: '600', color: colors.amberText },
  opt: { minHeight: MIN_TOUCH, justifyContent: 'center', paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.white },
  optOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  optText: { fontSize: fontSize.sm, color: colors.body },
});
