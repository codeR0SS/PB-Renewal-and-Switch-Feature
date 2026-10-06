import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { Touchable } from '@/components/Touchable';
import { Circle, G, Path, Rect, Svg } from 'react-native-svg';
import { IconArrowRight, IconCheckBold } from '@/components/icons';
import { colors, fontSize, radius } from '@/theme';

interface Props {
  headline: string;
  detail: ReactNode;
  onPressEvidence: () => void;
  /** 'compare' (two overlapping plan cards) for a Switch verdict; 'shield' otherwise. */
  illustration?: 'shield' | 'compare';
}

// Deliberately neutral — identical treatment for Stay, Switch and First renewal. Never colour this by
// outcome; the ripple/badge/illustration chrome is purely decorative, not a status signal.
export function VerdictCard({ headline, detail, onPressEvidence, illustration = 'shield' }: Props) {
  const compare = illustration === 'compare';
  return (
    <LinearGradient colors={['#0A2A6E', '#0B3FA8', '#0065FF']} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.card}>
      <Svg width={260} height={260} viewBox="0 0 260 260" style={styles.ringsTopRight} pointerEvents="none">
        <Circle cx={130} cy={130} r={124} stroke="#FFFFFF" strokeOpacity={0.08} fill="none" />
        <Circle cx={130} cy={130} r={94} stroke="#FFFFFF" strokeOpacity={0.1} fill="none" />
        <Circle cx={130} cy={130} r={64} fill="#FFFFFF" fillOpacity={0.06} stroke="#FFFFFF" strokeOpacity={0.14} />
      </Svg>

      {compare ? (
        <Svg width={79} height={75} viewBox="0 0 124 108" style={styles.compareTopRight} pointerEvents="none">
          <G transform="rotate(-9 40 40)">
            <Rect x={8} y={14} width={72} height={52} rx={12} fill="#FFFFFF" fillOpacity={0.14} stroke="#FFFFFF" strokeOpacity={0.3} />
            <Rect x={20} y={28} width={30} height={5} rx={2.5} fill="#FFFFFF" fillOpacity={0.35} />
            <Rect x={20} y={40} width={46} height={5} rx={2.5} fill="#FFFFFF" fillOpacity={0.22} />
          </G>
          <G transform="rotate(6 70 58)">
            <Rect x={30} y={40} width={76} height={56} rx={14} fill="#06205A" fillOpacity={0.4} />
            <Rect x={30} y={34} width={76} height={56} rx={14} fill="#FFFFFF" />
            <Path d="M30 48c0-7.7 6.3-14 14-14h48c7.7 0 14 6.3 14 14v2H30z" fill="#F2F7FF" />
            <Path d="M52 49 L64 53.5 V63 C64 70 59 75 52 78 C45 75 40 70 40 63 V53.5 Z" fill="#0065FF" />
            <Path d="M52 49 L64 53.5 V63 C64 70 59 75 52 78 Z" fill="#FFFFFF" fillOpacity={0.18} />
            <Path d="M46.5 63 L50.5 67 L58 58.5" stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
            <Rect x={72} y={56} width={24} height={5} rx={2.5} fill="#D6E0FF" />
            <Rect x={72} y={66} width={16} height={5} rx={2.5} fill="#D6E0FF" />
          </G>
          <Path d="M14 88 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#FFFFFF" fillOpacity={0.75} />
          <Path d="M118 62 l1.4 3.6 3.6 1.4 -3.6 1.4 -1.4 3.6 -1.4 -3.6 -3.6 -1.4 3.6 -1.4z" fill="#7CF0A8" />
          <Circle cx={8} cy={50} r={2.2} fill="#FFFFFF" fillOpacity={0.45} />
        </Svg>
      ) : (
        <Svg width={80} height={80} viewBox="0 0 88 88" style={styles.badgeBottomRight} pointerEvents="none">
          <Circle cx={44} cy={44} r={40} fill="#FFFFFF" fillOpacity={0.08} stroke="#FFFFFF" strokeOpacity={0.22} />
          <Circle cx={44} cy={44} r={28} fill="#FFFFFF" fillOpacity={0.1} />
          <Path d="M44 24 L62 31 V45 C62 56 54 64 44 69 C34 64 26 56 26 45 V31 Z" fill="#06205A" fillOpacity={0.35} />
          <Path d="M44 21 L62 28 V42 C62 53 54 61 44 66 C34 61 26 53 26 42 V28 Z" fill="#FFFFFF" />
          <Path d="M36 43 L42 49 L53 37" stroke="#0065FF" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      )}

      <View style={styles.tag}>
        <IconCheckBold size={12} />
        <Text style={styles.tagText}>Checked</Text>
      </View>
      <Text style={[styles.headline, compare && styles.headlineCompare]}>{headline}</Text>
      <Text style={styles.detail}>{detail}</Text>
      <Touchable accessibilityRole="button" onPress={onPressEvidence} style={styles.evidenceBtn}>
        <Text style={styles.evidenceText}>See how we checked this</Text>
        <IconArrowRight />
      </Touchable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: 22, paddingTop: 22, marginBottom: 12, overflow: 'hidden' },
  ringsTopRight: { position: 'absolute', right: -96, top: -100 },
  badgeBottomRight: { position: 'absolute', right: -24, bottom: -20 },
  compareTopRight: { position: 'absolute', right: 8, top: 9 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: '#C6FFDD', borderRadius: radius.pill, paddingVertical: 4, paddingLeft: 8, paddingRight: 10, marginBottom: 18 },
  tagText: { color: '#29764C', fontSize: fontSize.xs, fontWeight: '700' },
  headline: { color: colors.white, fontFamily: 'Merriweather_700Bold', fontSize: 24, lineHeight: 31, marginBottom: 12, maxWidth: 240 },
  headlineCompare: { fontSize: 26, lineHeight: 33, maxWidth: 200 },
  detail: { color: 'rgba(255,255,255,0.78)', fontSize: fontSize.sm, lineHeight: 22 },
  evidenceBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48, borderRadius: radius.md, backgroundColor: colors.white, marginTop: 20 },
  evidenceText: { color: colors.brandBlue, fontSize: fontSize.sm, fontWeight: '500' },
});
