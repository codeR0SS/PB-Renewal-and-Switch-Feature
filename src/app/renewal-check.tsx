import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
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
import { PremiumCompare } from '@/components/PremiumCompare';
import { PremiumReveal } from '@/components/PremiumReveal';
import { VerdictCard } from '@/components/VerdictCard';
import { IconBack, IconDecide, IconDocument, IconPhone, IconShieldCheck, IconClock as IconClockLine } from '@/components/icons';
import { FIRST_RENEWAL_COPY, noticeCopy, resolveOutcome, tooLateCopy } from '@/lib/outcome';
import { STEP_MS, TIMEOUT_MS } from '@/lib/check';
import { formatRupees, LOADING_STEPS, POLICY } from '@/lib/content';
import { DEFAULT_ALT_ID, getAlt } from '@/lib/alternatives';
import { checkReduceMotion } from '@/lib/motion';
import { useFlow } from '@/store/flow';
import { colors, fontSize, radius } from '@/theme';

const INTRO_STEPS = [
  { icon: <IconDocument />, title: 'Uses public insurer data', detail: 'Not just our own word' },
  { icon: <IconClockLine size={22} color={colors.ink} />, title: 'Takes a few seconds', detail: 'Your renewal, checked while you wait' },
  { icon: <IconDecide />, title: 'You decide what to do', detail: 'Switch or stay, either way' },
];

const HERO_HEIGHT = 290; // compact top-card height the splash contracts into

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

  // Intro splash: default to animating — on web the reduced-motion check can fail to resolve
  // at all, and a silent "never animates" default is worse than the rare case of animating
  // when reduced motion was actually requested but the check didn't report back in time.
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    let live = true;
    checkReduceMotion().then((v) => { if (live) setReducedMotion(v); }).catch(() => {});
    return () => { live = false; };
  }, []);
  const splashSettled = reducedMotion;

  const [heroFull, setHeroFull] = useState<number | null>(null);
  const [controlsReady, setControlsReady] = useState(false);
  const [footerReady, setFooterReady] = useState(false);
  const onIntroViewportLayout = (e: LayoutChangeEvent) => {
    if (heroFull !== null) return; // measure once
    const h = e.nativeEvent.layout.height;
    heroHeightT.setValue(h); // jump in the same tick so the flex:1 -> fixed-height switch is invisible
    setHeroFull(h);
  };

  const [heroHeightT] = useState(() => new Animated.Value(0));
  const [ring1T] = useState(() => new Animated.Value(0));
  const [ring2T] = useState(() => new Animated.Value(0));
  const [ring3T] = useState(() => new Animated.Value(0));
  const [badgeT] = useState(() => new Animated.Value(0));
  const [pillT] = useState(() => new Animated.Value(0));
  const [headlineT] = useState(() => new Animated.Value(0));
  const [topButtonsT] = useState(() => new Animated.Value(0));
  const [bodyT] = useState(() => new Animated.Value(0));
  const [footerT] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (splashSettled || heroFull === null) return;
    const seq = Animated.parallel([
      Animated.timing(ring1T,      { toValue: 1, duration: 450, delay:    0, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: false }),
      Animated.timing(ring2T,      { toValue: 1, duration: 450, delay:   90, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: false }),
      Animated.timing(ring3T,      { toValue: 1, duration: 450, delay:  180, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: false }),
      Animated.timing(badgeT,      { toValue: 1, duration: 500, delay:  150, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: false }),
      Animated.timing(pillT,       { toValue: 1, duration: 500, delay:  450, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: false }),
      Animated.timing(headlineT,   { toValue: 1, duration: 550, delay:  600, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: false }),
      Animated.timing(heroHeightT, { toValue: HERO_HEIGHT, duration: 700, delay: 1550, easing: Easing.bezier(0.65, 0, 0.35, 1), useNativeDriver: false }),
      Animated.timing(bodyT,       { toValue: 1, duration: 450, delay: 2150, easing: Easing.bezier(0.25, 0.1, 0.25, 1), useNativeDriver: false }),
    ]);
    seq.start();

    const controlsAnim = Animated.timing(topButtonsT, { toValue: 1, duration: 400, delay: 1550, easing: Easing.out(Easing.ease), useNativeDriver: false });
    controlsAnim.start(({ finished }) => { if (finished) setControlsReady(true); });

    const footerAnim = Animated.timing(footerT, { toValue: 1, duration: 350, delay: 2250, easing: Easing.out(Easing.ease), useNativeDriver: false });
    footerAnim.start(({ finished }) => { if (finished) setFooterReady(true); });

    return () => { seq.stop(); controlsAnim.stop(); footerAnim.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Animated.Value refs are stable; re-run only when the targets we measure/gate on change.
  }, [splashSettled, heroFull]);

  const heroDynamicStyle =
    splashSettled ? { height: HERO_HEIGHT } :
    heroFull === null ? styles.introHeroFull :
    { height: heroHeightT };
  const contentScaleT = splashSettled ? 1 : heroHeightT.interpolate({
    inputRange: [HERO_HEIGHT, heroFull ?? HERO_HEIGHT + 1],
    outputRange: [1, 1.08],
    extrapolate: 'clamp',
  });

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
  const premiumIncrease = POLICY.premium - POLICY.lastYearPremium;
  const premiumIncreasePct = Math.round((premiumIncrease / POLICY.lastYearPremium) * 100);
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
          <ScrollView onLayout={onIntroViewportLayout} contentContainerStyle={{ flexGrow: 1 }}>
            <Animated.View style={[styles.introHero, heroDynamicStyle]}>
              <Animated.View
                style={[styles.introHeroTop, { opacity: splashSettled ? 1 : topButtonsT }]}
                pointerEvents={splashSettled || controlsReady ? 'auto' : 'none'}
              >
                <Touchable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.introRoundBtn}>
                  <IconBack size={20} />
                </Touchable>
                <Touchable accessibilityLabel="Call us" style={styles.introRoundBtn}>
                  <IconPhone />
                </Touchable>
              </Animated.View>
              <Animated.View style={[styles.introHeroCenter, { transform: [{ scale: contentScaleT }] }]}>
                <View style={styles.introIllustrationGroup}>
                  <View style={styles.introBadgeRings} pointerEvents="none">
                    {/* Fixed radii measured off the reference export: ring diameter ≈ 2.1x / 3.2x / 4.3x
                        the badge's own diameter, fading as they widen (innermost most opaque). Sized the
                        same at rest as during the full-bleed entrance — they don't shrink with the hero. */}
                    <Animated.View style={[styles.ring, { width: 180, height: 180, borderRadius: 90 },
                      splashSettled ? { opacity: 0.85 } : {
                        opacity: ring1T.interpolate({ inputRange: [0, 1], outputRange: [0, 0.85] }),
                        transform: [{ scale: ring1T.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
                      }]} />
                    <Animated.View style={[styles.ring, { width: 267, height: 267, borderRadius: 140 },
                      splashSettled ? { opacity: 0.65 } : {
                        opacity: ring2T.interpolate({ inputRange: [0, 1], outputRange: [0, 0.65] }),
                        transform: [{ scale: ring2T.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
                      }]} />
                    <Animated.View style={[styles.ring, { width: 362, height: 362, borderRadius: 190 },
                      splashSettled ? { opacity: 0.5 } : {
                        opacity: ring3T.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }),
                        transform: [{ scale: ring3T.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
                      }]} />
                  </View>
                  <Animated.View style={[styles.introBadge, splashSettled ? { opacity: 1 } : {
                    opacity: badgeT,
                    transform: [{ scale: badgeT.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1] }) }],
                  }]}>
                    <IconShieldCheck />
                  </Animated.View>
                  <Animated.View style={[styles.introPill, splashSettled ? { opacity: 1 } : {
                    opacity: pillT,
                    transform: [{ translateY: pillT.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
                  }]}>
                    <Text style={styles.introPillText}>NEW · RENEWAL CHECK</Text>
                  </Animated.View>
                </View>
                <Animated.Text style={[styles.introTitle, splashSettled ? { opacity: 1 } : {
                  opacity: headlineT,
                  transform: [{ translateY: headlineT.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
                }]}>
                  See if your renewal price is fair, in seconds
                </Animated.Text>
              </Animated.View>
            </Animated.View>

            {(splashSettled || heroFull !== null) && (
              <Animated.View style={[styles.introBody, splashSettled ? { opacity: 1 } : {
                opacity: bodyT,
                transform: [{ translateY: bodyT.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
              }]}>
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
              </Animated.View>
            )}
          </ScrollView>
          {/* overlay: never reserves flex space, so the hero genuinely owns the full screen
              during the splash instead of a footer-height strip being carved out of it. */}
          <StickyFooter
            overlay
            style={{ opacity: splashSettled ? 1 : footerT }}
            pointerEvents={splashSettled || footerReady ? 'auto' : 'none'}
          >
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
              >
                <PremiumReveal oldPrice={POLICY.premium} newPrice={recommended.premiumNum} />
              </VerdictCard>
            )}
            {outcome === 'stay' && (
              <VerdictCard
                headline="Your current plan still holds up."
                detail={`Premium up ${formatRupees(premiumIncrease)} (${premiumIncreasePct}%) from last year. Coverage and network unchanged.`}
                onPressEvidence={() => evidenceRef.current?.present()}
              >
                <PremiumCompare lastYear={POLICY.lastYearPremium} thisYear={POLICY.premium} />
              </VerdictCard>
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

  introHero: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: '#D5F5FF' },
  introHeroFull: { flex: 1 },
  introHeroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  introRoundBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  introHeroCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 8 },
  introIllustrationGroup: { alignItems: 'center' },
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
