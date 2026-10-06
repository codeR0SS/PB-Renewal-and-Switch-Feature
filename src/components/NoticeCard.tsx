import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius } from '@/theme';

type Props =
  | { variant: 'unavailable'; headline: string; detail: string }
  | { variant: 'too-late'; headline: string; bullets: string[] };

/**
 * For results that carry NO verdict: nothing was verified, so there is no "Checked" tag, no dark
 * verdict card and no evidence link. Deliberately light and quiet, never an alarm.
 */
export function NoticeCard(props: Props) {
  const body =
    props.variant === 'unavailable' ? (
      <>
        <Text style={styles.headline}>{props.headline}</Text>
        <View style={styles.divider} />
        <Text style={styles.detail}>{props.detail}</Text>
      </>
    ) : (
      <>
        <Text style={[styles.headline, { marginBottom: 12 }]}>{props.headline}</Text>
        <View style={{ gap: 8 }}>
          {props.bullets.map((b) => (
            <View key={b} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.detail}>{b}</Text>
            </View>
          ))}
        </View>
      </>
    );

  if (props.variant === 'unavailable') {
    return (
      <LinearGradient colors={['#EAF1FF', '#F7FAFF', '#FFFFFF']} style={styles.card}>
        {body}
      </LinearGradient>
    );
  }
  return <View style={[styles.card, styles.cardFlat]}>{body}</View>;
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: colors.line2, borderRadius: radius.lg, padding: 20, marginBottom: 12 },
  cardFlat: { backgroundColor: colors.band, borderColor: colors.line },
  headline: { fontFamily: 'Merriweather_700Bold', fontSize: fontSize.lg, lineHeight: 26, color: colors.ink },
  divider: { height: 1, backgroundColor: colors.line2, marginTop: 16, marginBottom: 14 },
  detail: { fontSize: fontSize.sm, color: colors.body, lineHeight: 20, flex: 1 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  bulletDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.pendingLabel, marginTop: 8 },
});
