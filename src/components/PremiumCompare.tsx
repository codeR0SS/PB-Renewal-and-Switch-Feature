import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { Circle, Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';
import { formatRupees } from '@/lib/content';
import { checkReduceMotion } from '@/lib/motion';

interface Props {
  lastYear: number;
  thisYear: number;
}

/**
 * "Premium last year → this year" crossfade: the old label+price dissolve up and away while the
 * new ones rise in underneath, both anchored to the same spot (no position measurement needed,
 * unlike PremiumReveal's shrink-to-target — here nothing relocates, it just swaps in place).
 * The export's exit also adds a CSS blur; React Native has no cross-platform equivalent to
 * animate, so the exit relies on fade + rise + scale alone, which still reads clearly.
 */
export function PremiumCompare({ lastYear, thisYear }: Props) {
  const increase = thisYear - lastYear;
  const increasePct = Math.round((increase / lastYear) * 100);

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    let live = true;
    checkReduceMotion().then((v) => { if (live) setReducedMotion(v); }).catch(() => {});
    return () => { live = false; };
  }, []);

  const [strikeWidth, setStrikeWidth] = useState(0);
  const onOldPriceLayout = (e: LayoutChangeEvent) => setStrikeWidth(e.nativeEvent.layout.width);

  const [strikeT] = useState(() => new Animated.Value(0));
  const [oldT] = useState(() => new Animated.Value(0));
  const [newT] = useState(() => new Animated.Value(0));
  const [pillT] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reducedMotion || strikeWidth === 0) return;
    const seq = Animated.parallel([
      Animated.timing(strikeT, { toValue: 1, duration: 350, delay: 450, easing: Easing.out(Easing.ease), useNativeDriver: false }),
      Animated.timing(oldT, { toValue: 1, duration: 500, delay: 1050, easing: Easing.bezier(0.4, 0, 1, 1), useNativeDriver: false }),
      Animated.timing(newT, { toValue: 1, duration: 550, delay: 1350, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: false }),
      Animated.timing(pillT, { toValue: 1, duration: 450, delay: 1850, easing: Easing.bezier(0.25, 0.1, 0.25, 1), useNativeDriver: false }),
    ]);
    seq.start();
    return () => seq.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Animated.Value refs are stable; re-run only when the target we measure changes.
  }, [reducedMotion, strikeWidth]);

  const settled = reducedMotion;
  const oldStyle = settled
    ? { opacity: 0 }
    : { opacity: oldT.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
        transform: [
          { translateY: oldT.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) },
          { scale: oldT.interpolate({ inputRange: [0, 1], outputRange: [1, 0.9] }) },
        ] };
  const newStyle = settled
    ? { opacity: 1 }
    : { opacity: newT,
        transform: [
          { translateY: newT.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) },
          { scale: newT.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) },
        ] };

  return (
    <View style={styles.box}>
      <View style={styles.stack}>
        <Animated.Text style={[styles.label, styles.stacked, oldStyle]}>Premium last year</Animated.Text>
        <Animated.Text style={[styles.label, newStyle]}>Premium this year</Animated.Text>
      </View>
      <View style={styles.priceRow}>
        <View style={styles.stack}>
          <Animated.View style={[styles.stacked, oldStyle]}>
            <Text onLayout={onOldPriceLayout} style={styles.price}>{formatRupees(lastYear)}</Text>
            <Animated.View style={[styles.strike, { width: settled ? 0 : strikeT.interpolate({ inputRange: [0, 1], outputRange: [0, strikeWidth] }) }]} />
          </Animated.View>
          <Animated.Text style={[styles.price, newStyle]}>{formatRupees(thisYear)}</Animated.Text>
        </View>
        <Svg width={63} height={28} viewBox="0 0 60 28" fill="none">
          <Defs>
            <LinearGradient id="sparkFade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.22} />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d="M3,21 C20,23 38,3 57,6 L57,27 L3,27 Z" fill="url(#sparkFade)" />
          <Path d="M3,21 C20,23 38,3 57,6" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={2} strokeLinecap="round" />
          <Circle cx={3} cy={21} r={3} fill="rgba(255,255,255,0.5)" />
          <Circle cx={57} cy={6} r={3.5} fill="#FFFFFF" stroke="#0B3FA8" strokeWidth={1.5} />
        </Svg>
      </View>

      <Animated.View
        style={[
          styles.pill,
          { opacity: settled ? 1 : pillT, transform: [{ translateY: settled ? 0 : pillT.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }) }] },
        ]}
      >
        <Svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M12 19V5M5 12l7-7 7 7" />
        </Svg>
        <Text style={styles.pillStrong}>+{formatRupees(increase)} ({increasePct}%)</Text>
        <Text style={styles.pillMuted}>vs {formatRupees(lastYear)} last year</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { marginTop: 18, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 14 },
  // New renders in normal flow (sizes the stack); old is layered absolutely on top of it.
  stack: { position: 'relative' },
  stacked: { position: 'absolute', left: 0, top: 0 },
  label: { fontSize: 11, color: 'rgba(255,255,255,0.65)' },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 4 },
  price: { fontFamily: 'Roboto', fontSize: 32, fontWeight: '700', color: '#FFFFFF', lineHeight: 36 },
  strike: { position: 'absolute', left: 0, top: 16, height: 3, backgroundColor: '#FFFFFF', borderRadius: 2 },
  pill: {
    alignSelf: 'flex-start', marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10,
  },
  pillStrong: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  pillMuted: { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
});
