import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Touchable } from '@/components/Touchable';
import { EvidenceSheet } from '@/components/EvidenceSheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Spinner } from '@/components/Spinner';
import { StepTracker } from '@/components/StepTracker';
import { StickyFooter } from '@/components/StickyFooter';
import { NoticeCard } from '@/components/NoticeCard';
import { PlanSummaryCard } from '@/components/PlanSummaryCard';
import { VerdictCard } from '@/components/VerdictCard';
import { IconBack, IconDecide, IconDocument, IconPhone, IconShieldCheck, IconClock as IconClockLine } from '@/components/icons';
import { FIRST_RENEWAL_COPY, noticeCopy, resolveOutcome, tooLateCopy } from '@/lib/outcome';
import { STEP_MS, TIMEOUT_MS } from '@/lib/check';
import { formatRupees, LOADING_STEPS, POLICY } from '@/lib/content';
import { DEFAULT_ALT_ID, getAlt } from '@/lib/alternatives';
import { useFlow } from '@/store/flow';
import { colors, fontSize, radius } from '@/theme';

const INTRO_STEPS = [
  { icon: <IconDocument />, title: 'Uses public insurer data', detail: 'Not just our own word' },
  { icon: <IconClockLine color={colors.ink} />, title: 'Takes a few seconds', detail: 'Your renewal, checked while you wait' },
  { icon: <IconDecide />, title: 'You decide what to do', detail: 'Switch or stay, either way' },
];

type Phase = 'intro' | 'loading' | 'verdict';

export default function RenewalCheck() {
  const router = useRouter();
  const { verdict, homeTiming, introSeen, markIntroSeen, devCheckHangs, devDataState } = useFlow();
  // The verdict is about the recommended plan; a later marketplace pick must never rewrite it.
  const recommended = getAlt(DEFAULT_ALT_ID);
  const [phase, setPhase] = useState<Phase>(introSeen ? 'loading' : 'intro');
  const [attempt, setAttempt] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const evidenceRef = useRef<BottomSheetModal>(null);

  // (Re)start loading from a handler, not an effect: reset the step/timeout state, then run the timers.
  const startLoading = () => {
    setStepIdx(0);
    setTimedOut(false);
    setPhase('loading');
    setAttempt((a) => a + 1);
  };

  useEffect(() => {
    if (phase !== 'loading') return;
    const stepTimer = setInterval(() => setStepIdx((i) => Math.min(i + 1, LOADING_STEPS.length - 1)), STEP_MS);
    // Happy path finishes all steps; the dev "hang" flag lets the 6s timeout be seen.
    const done = devCheckHangs ? null : setTimeout(() => setPhase('verdict'), STEP_MS * LOADING_STEPS.length);
    const timeout = setTimeout(() => {
      clearInterval(stepTimer);
      setTimedOut(true);
    }, TIMEOUT_MS);
    return () => {
      clearInterval(stepTimer);
      if (done) clearTimeout(done);
      clearTimeout(timeout);
    };
  }, [phase, attempt, devCheckHangs]);

  const setAction = useFlow((s) => s.setAction);
  // The user's choice is recorded separately from the verdict: they may renew despite a switch verdict.
  const choose = (action: 'renew' | 'switch', to: '/carryover' | '/whats-different') => {
    setAction(action);
    router.push(to);
  };
  const saving = POLICY.premium - recommended.premiumNum;
  // One pure function decides what this screen shows. "Too late to switch" is not a demo toggle:
  // it fires from the real Home state (expiring today) whenever the result would point at switching.
  const outcome = resolveOutcome({ homeTiming, verdict, dataState: devDataState });
  const isSwitch = outcome === 'switch';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {phase !== 'intro' && <ScreenHeader onBack={() => router.back()} />}
      {phase !== 'intro' && <StepTracker withCompare={isSwitch} current="verdict" />}

      {phase === 'intro' && (
        <>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.introHero}>
              <View style={styles.introHeroTop}>
                <Touchable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.introRoundBtn}>
                  <IconBack size={20} />
                </Touchable>
                <Touchable accessibilityLabel="Call us" style={styles.introRoundBtn}>
                  <IconPhone />
                </Touchable>
              </View>
              <View style={styles.introHeroCenter}>
                <View style={styles.introBadgeRings} pointerEvents="none">
                  <View style={[styles.ring, { width: 180, height: 180, borderRadius: 90, opacity: 0.5 }]} />
                  <View style={[styles.ring, { width: 130, height: 130, borderRadius: 65, opacity: 0.65 }]} />
                  <View style={[styles.ring, { width: 84, height: 84, borderRadius: 42, opacity: 0.85 }]} />
                </View>
                <View style={styles.introBadge}>
                  <IconShieldCheck />
                </View>
                <View style={styles.introPill}>
                  <Text style={styles.introPillText}>NEW · RENEWAL CHECK</Text>
                </View>
                <Text style={styles.introTitle}>See if your renewal price is fair, in seconds</Text>
              </View>
            </View>

            <View style={styles.introBody}>
              <Text style={styles.howLabel}>How it works</Text>
              <View style={styles.dotted} />
              {INTRO_STEPS.map((s, i) => (
                <View key={s.title} style={[styles.howRow, i < INTRO_STEPS.length - 1 && styles.howRowDivider]}>
                  <View style={styles.howIcon}>{s.icon}</View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.howTitle}>{s.title}</Text>
                    <Text style={styles.howDetail}>{s.detail}</Text>
                  </View>
                </View>
              ))}
              <View style={styles.note}>
                <Text style={styles.noteText}>
                  This is a genuine PolicyBazaar feature, shown right here in your renewal screen — not a separate app or link.
                </Text>
              </View>
            </View>
          </ScrollView>
          <StickyFooter>
            <PrimaryButton
              label="Got it, check my renewal"
              onPress={() => {
                markIntroSeen();
                startLoading();
              }}
            />
          </StickyFooter>
        </>
      )}

      {phase === 'loading' && (
        <View style={styles.loading}>
          <Spinner />
          <Text style={styles.loadingText}>{timedOut ? 'This is taking longer than expected.' : LOADING_STEPS[stepIdx]}</Text>
          {timedOut && (
            <View style={{ alignSelf: 'stretch' }}>
              <PrimaryButton variant="text" label="Retry" onPress={startLoading} />
            </View>
          )}
        </View>
      )}

      {phase === 'verdict' && (
        <>
          <ScrollView contentContainerStyle={styles.body}>
            <Text accessibilityRole="header" style={styles.srOnly}>Renewal Check</Text>
            {outcome === 'switch' && (
              <VerdictCard
                illustration="compare"
                headline="A better option exists."
                detail={
                  <>
                    {recommended.name} — same coverage, <Text style={styles.detailHighlight}>{formatRupees(saving)}/year less</Text>, and a higher claim-settlement ratio.
                  </>
                }
                onPressEvidence={() => evidenceRef.current?.present()}
              />
            )}
            {outcome === 'stay' && (
              <VerdictCard
                headline="Your current plan still holds up."
                detail="Premium up ₹463 (8%) from last year. Coverage and network unchanged."
                onPressEvidence={() => evidenceRef.current?.present()}
              />
            )}
            {/* First renewal is a real, backed verdict that just can't show a % change: still "Checked". */}
            {outcome === 'first' && (
              <VerdictCard
                headline={FIRST_RENEWAL_COPY.headline}
                detail={FIRST_RENEWAL_COPY.detail}
                onPressEvidence={() => evidenceRef.current?.present()}
              />
            )}
            {/* No verdict at all (nothing verified, or nothing actionable): no tag, no evidence link. */}
            {outcome === 'unavailable' && <NoticeCard variant="unavailable" {...noticeCopy('unavailable')} />}
            {outcome === 'too-late' && <NoticeCard variant="too-late" {...tooLateCopy()} />}
            <PlanSummaryCard urgent={homeTiming === 'today'} />
          </ScrollView>
          <StickyFooter>
            {isSwitch ? (
              <>
                <PrimaryButton label={'See what’s different →'} onPress={() => choose('switch', '/whats-different')} />
                <PrimaryButton variant="text" label="Renew as-is anyway" onPress={() => choose('renew', '/carryover')} />
              </>
            ) : (
              <PrimaryButton label="Renew as-is" onPress={() => choose('renew', '/carryover')} />
            )}
          </StickyFooter>
        </>
      )}
      <EvidenceSheet ref={evidenceRef} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  body: { padding: 16, flexGrow: 1 },
  srOnly: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 16 },
  loadingText: { fontSize: fontSize.sm, color: colors.body, textAlign: 'center' },

  introHero: { height: 290, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: '#D5F5FF' },
  introHeroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  introRoundBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  introHeroCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 8 },
  introBadgeRings: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.8)' },
  introBadge: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.white, borderWidth: 2, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  introPill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: colors.brandBlue },
  introPillText: { fontSize: fontSize.xs, fontWeight: '500', color: colors.white, letterSpacing: 0.4 },
  introTitle: { marginTop: 12, maxWidth: 300, textAlign: 'center', fontFamily: 'Merriweather_700Bold', fontSize: fontSize.xl, lineHeight: 30, color: colors.ink },

  introBody: { flex: 1, paddingTop: 14, paddingHorizontal: 16 },
  howLabel: { fontSize: fontSize.lg, fontWeight: '500', marginBottom: 6, color: colors.ink },
  dotted: { borderTopWidth: 2, borderStyle: 'dotted', borderTopColor: colors.ink + '40', marginBottom: 2 },
  howRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10 },
  howRowDivider: { borderBottomWidth: 1.5, borderStyle: 'dotted', borderBottomColor: colors.ink + '26' },
  howIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F5F8', alignItems: 'center', justifyContent: 'center' },
  howTitle: { fontSize: fontSize.sm, fontWeight: '500', color: colors.ink },
  howDetail: { fontSize: fontSize.xs, color: colors.body, marginTop: 2 },
  note: { marginTop: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.line2, backgroundColor: colors.band, borderRadius: radius.md, padding: 14 },
  noteText: { fontSize: fontSize.xs, color: colors.ink, lineHeight: 20 },
  detailHighlight: { color: '#7CF0A8', fontWeight: '700' },
});
