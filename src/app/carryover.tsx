import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Spinner } from '@/components/Spinner';
import { Touchable } from '@/components/Touchable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeclarationPreview } from '@/components/DeclarationCard';
import { IconAlertCircle, IconCheckBold } from '@/components/icons';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StepTracker } from '@/components/StepTracker';
import { StickyFooter } from '@/components/StickyFooter';
import { TIMEOUT_MS } from '@/lib/check';
import { carryoverContent, type Tone } from '@/lib/carryover';
import { useFlow, useSelectedAlt } from '@/store/flow';
import { colors, fontSize, radius } from '@/theme';

const BADGE: Record<Tone, { bg: string; fg: string; icon?: 'check' | 'alert' }> = {
  neutral: { bg: '#C6FFDD', fg: colors.green, icon: 'check' },
  amber: { bg: colors.amberBg, fg: colors.ink, icon: 'alert' },
  muted: { bg: colors.band, fg: colors.muted },
};

const WHATS_NEXT = [
  { title: 'You confirm and pay.', detail: 'Your carryover terms are locked in as shown above.' },
  { title: 'The new insurer reviews.', detail: 'They can accept or reject carryover terms within 15 days.' },
  { title: 'Your current plan stays active.', detail: 'It only ends once the new policy is issued, so there is no gap in cover.' },
];

export default function Carryover() {
  const router = useRouter();
  const alt = useSelectedAlt();
  const { action, devNoBonus, devCarryoverLoading, setDev } = useFlow();
  const [timedOut, setTimedOut] = useState(false);

  // Dev-only loading demo (the prototype's "Loading" toggle), with the same 6s timeout + Retry.
  useEffect(() => {
    if (!devCarryoverLoading) return;
    const t = setTimeout(() => setTimedOut(true), TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [devCarryoverLoading]);

  const switching = action === 'switch';
  const content = carryoverContent(action, alt, !devNoBonus);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader onBack={() => router.back()} />
      <StepTracker withCompare={switching} current="carryover" />

      {devCarryoverLoading ? (
        <View style={styles.loading}>
          <Spinner />
          <Text style={styles.loadingText}>{timedOut ? 'This is taking longer than expected.' : 'Checking what carries over on your plan.'}</Text>
          {timedOut && (
            <View style={{ alignSelf: 'stretch' }}>
              <PrimaryButton variant="text" label="Retry" onPress={() => {
                setTimedOut(false);
                setDev({ devCarryoverLoading: false });
              }} />
            </View>
          )}
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.body}>
            <Text accessibilityRole="header" style={styles.title}>What carries over</Text>
            <Text style={[styles.sub, !switching && { marginBottom: 16 }]}>{content.subhead}</Text>
            {switching && (
              <View style={styles.altRow}>
                <Text style={[styles.sub, { marginBottom: 0, flexShrink: 1 }]}>
                  Switching to <Text style={styles.altName}>{alt.name}</Text> {'—'} not this one?
                </Text>
                <Touchable
                  accessibilityRole="link"
                  onPress={() => router.navigate('/whats-different')}
                  hitSlop={{ top: 14, bottom: 14, left: 8, right: 8 }}
                  style={styles.changeBtn}
                >
                  <Text style={styles.change}>Change it</Text>
                </Touchable>
              </View>
            )}

            {content.rows.map((r) => (
              <View key={r.key} style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{r.title}</Text>
                  <Text style={styles.rowDetail}>{r.detail}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: BADGE[r.tone].bg }]}>
                  {BADGE[r.tone].icon === 'check' && <IconCheckBold />}
                  {BADGE[r.tone].icon === 'alert' && <IconAlertCircle />}
                  <Text style={[styles.badgeText, { color: BADGE[r.tone].fg }]}>{r.badge}</Text>
                </View>
              </View>
            ))}

            <View style={{ marginTop: 12 }}>
              <DeclarationPreview />
            </View>

            {switching && (
              <View style={styles.next}>
                <Text style={styles.nextTitle}>What happens next</Text>
                {WHATS_NEXT.map((n, i) => (
                  <View key={n.title} style={styles.nextRow}>
                    <View style={styles.nextNum}><Text style={styles.nextNumText}>{i + 1}</Text></View>
                    <Text style={styles.nextDetail}>
                      <Text style={styles.nextDetailStrong}>{n.title}</Text> {n.detail}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
          <StickyFooter>
            <PrimaryButton label={'Continue to confirm →'} onPress={() => router.push('/confirm')} />
          </StickyFooter>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  body: { padding: 16, flexGrow: 1 },
  title: { fontFamily: 'Merriweather_700Bold', fontSize: fontSize.xl, lineHeight: 30, color: colors.ink, marginBottom: 4 },
  sub: { fontSize: fontSize.sm, color: colors.body, marginBottom: 4, lineHeight: 20 },
  altName: { fontWeight: '500', color: colors.ink },
  altRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 8, rowGap: 4, marginBottom: 8 },
  // Hit area meets the 44×48dp minimum via hitSlop instead of minHeight, so the visible text
  // keeps the row's own tight spacing instead of sitting in a 48px-tall centered box.
  changeBtn: {},
  change: { fontSize: fontSize.sm, fontWeight: '500', color: colors.brandBlue },
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, borderWidth: 1, borderColor: colors.line2, borderRadius: radius.lg, padding: 16, marginBottom: 10 },
  rowTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.ink },
  rowDetail: { fontSize: fontSize.xs, color: colors.body, marginTop: 4, lineHeight: 18 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.pill, paddingLeft: 8, paddingRight: 10, paddingVertical: 4, flexShrink: 0 },
  badgeText: { fontSize: fontSize.xs, fontWeight: '700' },
  next: { marginTop: 20 },
  nextTitle: { fontSize: fontSize.lg, fontWeight: '500', color: colors.ink },
  nextRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginTop: 14 },
  nextNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.band, alignItems: 'center', justifyContent: 'center' },
  nextNumText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.brandBlue },
  nextDetail: { flex: 1, fontSize: fontSize.sm, color: colors.body, lineHeight: 20 },
  nextDetailStrong: { fontWeight: '500', color: colors.ink },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 16 },
  loadingText: { fontSize: fontSize.sm, color: colors.body, textAlign: 'center' },
});
