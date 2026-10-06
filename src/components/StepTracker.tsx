import { StyleSheet, Text, View } from 'react-native';
import { IconCheckSmall } from '@/components/icons';
import { colors, fontSize } from '@/theme';

export type StepKey = 'verdict' | 'compare' | 'carryover' | 'confirm';
const LABEL: Record<StepKey, string> = {
  verdict: 'Verdict', compare: 'Compare', carryover: 'Carryover', confirm: 'Confirm',
};
const PENDING_BORDER = colors.pendingBorder;
const PENDING_LABEL = colors.pendingLabel;

/** 4 steps when a Compare step is part of the path, otherwise 3 (no Compare). */
export const stepsFor = (withCompare: boolean): StepKey[] =>
  withCompare ? ['verdict', 'compare', 'carryover', 'confirm'] : ['verdict', 'carryover', 'confirm'];

export function StepTracker({ withCompare, current }: { withCompare: boolean; current: StepKey }) {
  const steps = stepsFor(withCompare);
  const currentIdx = steps.indexOf(current);
  // The track line runs between the first and last dot centers; progress covers completed steps only.
  const progressPct = currentIdx <= 0 ? 0 : (currentIdx / (steps.length - 1)) * 100;

  return (
    <View style={styles.row}>
      <View style={styles.track} />
      {currentIdx > 0 && <View style={[styles.progress, { width: `${progressPct}%` }]} />}
      {steps.map((key, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const on = done || active;
        return (
          <View key={key} style={styles.item}>
            <View style={[styles.dot, on && styles.dotOn]}>
              {done ? <IconCheckSmall /> : active ? <View style={styles.dotFill} /> : null}
            </View>
            <Text style={[styles.label, on && styles.labelOn, active && styles.labelActive]}>{LABEL[key]}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.line },
  track: { position: 'absolute', top: 25.5, left: 30, right: 30, height: 1, backgroundColor: PENDING_BORDER },
  progress: { position: 'absolute', top: 25.5, left: 30, height: 1, backgroundColor: colors.brandBlue },
  item: { alignItems: 'center', gap: 8 },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: PENDING_BORDER, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  dotOn: { borderColor: colors.brandBlue },
  dotFill: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brandBlue },
  label: { fontSize: fontSize.xs, fontWeight: '400', color: PENDING_LABEL },
  labelOn: { color: colors.ink },
  labelActive: { fontWeight: '500' },
});
