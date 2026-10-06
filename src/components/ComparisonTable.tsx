import { StyleSheet, Text, View } from 'react-native';
import type { DiffRow } from '@/lib/alternatives';
import { colors, fontSize, radius } from '@/theme';

interface Props {
  yoursLabel: string;
  altLabel: string;
  rows: DiffRow[];
  /** Hide the "(yours)" tag when the left column is not the user's current plan (e.g. "Your pick"). */
  hideYoursTag?: boolean;
  /** Colour for the right column header, e.g. the blue used for the Gold upgrade tier. */
  altAccent?: string;
}

/** Plain flat comparison table. Used by the upgrade-comparison sheet. */
export function ComparisonTable({ yoursLabel, altLabel, rows, hideYoursTag, altAccent }: Props) {
  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.head]}>
        <View style={styles.label} />
        <Text style={[styles.cell, styles.headText]}>
          {yoursLabel}{hideYoursTag ? null : <Text style={{ color: colors.body }}> (yours)</Text>}
        </Text>
        <Text style={[styles.cell, styles.headText, altAccent ? { color: altAccent, fontWeight: '700' } : null]}>{altLabel}</Text>
      </View>
      {rows.map((r, i) => (
        <View key={r.label} style={[styles.row, i < rows.length - 1 && styles.rowBorder]}>
          <Text style={[styles.label, styles.labelText]}>{r.label}</Text>
          <Value text={r.yours} sub={r.yoursSub} />
          <Value text={r.alt} sub={r.altSub} bold={r.altBetter} />
        </View>
      ))}
    </View>
  );
}

function Value({ text, sub, bold }: { text: string; sub?: string; bold?: boolean }) {
  return (
    <View style={styles.cell}>
      <Text style={[styles.value, bold && styles.valueBold]}>{text}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  table: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 12, paddingVertical: 12, gap: 8 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  head: { backgroundColor: colors.band, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.line },
  // Label column a little narrower than the two value columns.
  label: { flex: 0.95 },
  labelText: { fontSize: fontSize.sm, color: colors.ink },
  cell: { flex: 1.05 },
  headText: { fontSize: fontSize.xs, fontWeight: '500', color: colors.body },
  value: { fontSize: fontSize.sm, color: colors.ink },
  valueBold: { fontWeight: '700' },
  sub: { fontSize: fontSize.xs, color: colors.body },
});
