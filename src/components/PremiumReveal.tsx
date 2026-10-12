import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { formatRupees } from '@/lib/content';
import { checkReduceMotion } from '@/lib/motion';

interface Props {
  oldPrice: number;
  newPrice: number;
}

/**
 * "Suggested plan premium" reveal: the old price strikes through, shrinks and slides into its
 * final small position while the new price grows in underneath it — then the savings pill
 * follows. The shrink target is measured (onLayout), not a hardcoded offset, since the premium
 * figures are live data and vary in digit width.
 */
export function PremiumReveal({ oldPrice, newPrice }: Props) {
  const savingPct = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

  // Default to animating: on web the native-module check can fail to resolve at all, and a
  // silent "never animates" default is worse than the rare case of animating when reduced
  // motion was actually requested but the check didn't report back in time.
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    let live = true;
    checkReduceMotion()
      .then((v) => { if (live) setReducedMotion(v); })
      .catch(() => {});
    return () => { live = false; };
  }, []);

  const [oldPos, setOldPos] = useState<{ x: number; y: number } | null>(null);
  const [overlayWidth, setOverlayWidth] = useState(0);
  const onOldLayout = (e: LayoutChangeEvent) => {
    const { x, y } = e.nativeEvent.layout;
    setOldPos({ x, y });
  };
  const onOverlayLayout = (e: LayoutChangeEvent) => setOverlayWidth(e.nativeEvent.layout.width);

  const [strikeT] = useState(() => new Animated.Value(0));
  const [moveT] = useState(() => new Animated.Value(0));
  const [growT] = useState(() => new Animated.Value(0));
  const [overlayFadeT] = useState(() => new Animated.Value(1));
  const [oldFinalT] = useState(() => new Animated.Value(0));
  const [pillT] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reducedMotion || !oldPos || overlayWidth === 0) return;
    const seq = Animated.parallel([
      Animated.timing(strikeT, { toValue: 1, duration: 350, delay: 500, easing: Easing.out(Easing.ease), useNativeDriver: false }),
      Animated.timing(moveT, { toValue: 1, duration: 600, delay: 1100, easing: Easing.bezier(0.65, 0, 0.35, 1), useNativeDriver: false }),
      Animated.timing(growT, { toValue: 1, duration: 500, delay: 1300, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: false }),
      Animated.timing(overlayFadeT, { toValue: 0, duration: 150, delay: 1650, easing: Easing.linear, useNativeDriver: false }),
      Animated.timing(oldFinalT, { toValue: 1, duration: 150, delay: 1650, easing: Easing.linear, useNativeDriver: false }),
      Animated.timing(pillT, { toValue: 1, duration: 450, delay: 2000, easing: Easing.bezier(0.25, 0.1, 0.25, 1), useNativeDriver: false }),
    ]);
    seq.start();
    return () => seq.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Animated.Value refs are stable; re-run only when the targets we measure change.
  }, [reducedMotion, oldPos, overlayWidth]);

  const settled = reducedMotion; // reduced motion: show the final numbers immediately, no reveal
  const newOpacity = settled ? 1 : growT;
  const newScale = settled ? 1 : growT.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });
  const oldOpacity = settled ? 1 : oldFinalT;

  return (
    <View style={styles.box}>
      <Text style={styles.label}>Suggested plan premium</Text>
      <View style={styles.priceRow}>
        <Animated.Text style={[styles.newPrice, { opacity: newOpacity, transform: [{ scale: newScale }] }]}>
          {formatRupees(newPrice)}
        </Animated.Text>
        <View onLayout={onOldLayout}>
          <Animated.Text style={[styles.oldPrice, { opacity: oldOpacity }]}>{formatRupees(oldPrice)}</Animated.Text>
        </View>

        {!settled && oldPos && (
          <Animated.View
            pointerEvents="none"
            onLayout={onOverlayLayout}
            style={[
              styles.overlayWrap,
              {
                opacity: overlayFadeT,
                transform: [
                  { translateX: moveT.interpolate({ inputRange: [0, 1], outputRange: [0, oldPos.x] }) },
                  { translateY: moveT.interpolate({ inputRange: [0, 1], outputRange: [0, oldPos.y] }) },
                  { scale: moveT.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] }) },
                ],
              },
            ]}
          >
            <Animated.Text
              style={[
                styles.overlayText,
                { color: moveT.interpolate({ inputRange: [0, 1], outputRange: ['#FFFFFF', 'rgba(255,255,255,0.5)'] }) },
              ]}
            >
              {formatRupees(oldPrice)}
            </Animated.Text>
            <Animated.View style={[styles.strike, { width: strikeT.interpolate({ inputRange: [0, 1], outputRange: [0, overlayWidth] }) }]} />
          </Animated.View>
        )}
      </View>

      <Animated.View
        style={[
          styles.pill,
          { opacity: settled ? 1 : pillT, transform: [{ translateY: settled ? 0 : pillT.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }) }] },
        ]}
      >
        <Svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M12 5V19M5 12l7 7 7-7" />
        </Svg>
        <Text style={styles.pillStrong}>Save {formatRupees(oldPrice - newPrice)} ({savingPct}%)</Text>
        <Text style={styles.pillMuted}>on current premium</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { marginTop: 18, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 14 },
  label: { fontSize: 11, color: 'rgba(255,255,255,0.65)' },
  priceRow: { position: 'relative', flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 4, flexWrap: 'wrap' },
  newPrice: { fontFamily: 'Roboto', fontSize: 32, fontWeight: '700', color: '#FFFFFF', lineHeight: 36 },
  oldPrice: {
    fontFamily: 'Roboto', fontSize: 16, fontWeight: '500', color: 'rgba(255,255,255,0.5)', lineHeight: 20,
    textDecorationLine: 'line-through', textDecorationColor: 'rgba(255,255,255,0.4)',
  },
  overlayWrap: { position: 'absolute', left: 0, top: 0 },
  overlayText: { fontFamily: 'Roboto', fontSize: 32, fontWeight: '700', lineHeight: 36 },
  strike: { position: 'absolute', left: 0, top: 16, height: 3, backgroundColor: '#FFFFFF', borderRadius: 2 },
  pill: {
    alignSelf: 'flex-start', marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10,
  },
  pillStrong: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  pillMuted: { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
});
