import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { forwardRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Touchable } from '@/components/Touchable';
import { IconCheckThick } from '@/components/icons';
import { formatRupees } from '@/lib/content';
import { RIDERS, ridersTotal, termPrice, type Term } from '@/lib/pricing';
import { Sheet } from '@/components/Sheet';
import { colors, fontSize, radius } from '@/theme';

interface Props {
  planName: string;
  oneYear: number;
  term: Term;
  riderIds: string[];
  onConfirm: (ids: string[]) => void;
}

export const RiderSheet = forwardRef<BottomSheetModal, Props>(function RiderSheet({ planName, oneYear, term, riderIds, onConfirm }, ref) {
  const [selected, setSelected] = useState(riderIds);
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const base = termPrice(oneYear, term);
  const ridersSum = ridersTotal(selected, term);
  const total = base + ridersSum;

  return (
    <Sheet
      ref={ref}
      header={
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headTitle}>Add riders</Text>
            <Text style={styles.headSub}>Optional covers you can add to {planName}. Pick any that suit you.</Text>
          </View>
        </View>
      }
      footer={
        <View>
          <View style={styles.breakupTop}>
            <Text style={styles.breakupLabel}>Price breakup</Text>
            <View style={styles.breakupPill}><Text style={styles.breakupPillText}>+{formatRupees(ridersSum)} / year</Text></View>
          </View>
          <View style={{ marginTop: 8, gap: 4 }}>
            <View style={styles.lineRow}>
              <Text style={styles.lineLabel}>Base premium ({term === 3 ? '3 years' : '1 year'})</Text>
              <Text style={styles.lineValue}>{formatRupees(base)}</Text>
            </View>
            {selected.map((id) => {
              const r = RIDERS.find((x) => x.id === id)!;
              return (
                <View key={id} style={styles.lineRow}>
                  <Text style={styles.lineLabel}>{r.name}</Text>
                  <Text style={styles.lineValue}>+{formatRupees(r.perYear * term)}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.divider} />
          <View style={styles.lineRow}>
            <Text style={styles.newTotalLabel}>New total <Text style={styles.wasText}>(was {formatRupees(base)})</Text></Text>
            <Text style={styles.newTotalPrice}>{formatRupees(total)} <Text style={styles.newTotalUnit}>/ year</Text></Text>
          </View>
          <Touchable
            accessibilityRole="button"
            onPress={() => onConfirm(selected)}
            style={styles.confirmBtn}>
            <Text style={styles.confirmBtnText}>Confirm riders · {formatRupees(total)} / year</Text>
          </Touchable>
        </View>
      }>
      {RIDERS.map((r) => {
        const on = selected.includes(r.id);
        return (
          <Touchable
            key={r.id}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            onPress={() => toggle(r.id)}
            style={[styles.riderRow, on ? styles.riderRowOn : styles.riderRowOff]}>
            <View style={[styles.checkbox, on && styles.checkboxOn]}>
              {on && <IconCheckThick size={12} color={colors.white} strokeWidth={3.2} />}
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.riderTop}>
                <Text style={styles.riderName}>{r.name}</Text>
                <Text style={[styles.riderPrice, on && { color: colors.brandBlue }]}>+{formatRupees(r.perYear)}</Text>
              </View>
              <Text style={styles.riderDetail}>{r.detail}</Text>
            </View>
          </Touchable>
        );
      })}
    </Sheet>
  );
});

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row' },
  headTitle: { fontFamily: 'Merriweather_700Bold', fontSize: fontSize.lg, lineHeight: 26, color: colors.ink },
  headSub: { fontSize: fontSize.sm, color: colors.body, marginTop: 2, lineHeight: 20 },

  riderRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', borderRadius: radius.lg, padding: 13, marginBottom: 8 },
  riderRowOn: { borderWidth: 1.5, borderColor: colors.brandBlue, backgroundColor: colors.band, padding: 12.5 },
  riderRowOff: { borderWidth: 1, borderColor: colors.line2, backgroundColor: colors.white },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: colors.pendingBorder, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  checkboxOn: { backgroundColor: colors.brandBlue, borderColor: colors.brandBlue },
  riderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  riderName: { fontSize: fontSize.sm, fontWeight: '700', color: colors.ink, flexShrink: 1 },
  riderPrice: { fontSize: fontSize.sm, fontWeight: '500', color: colors.ink },
  riderDetail: { fontSize: fontSize.xs, color: colors.body, marginTop: 2, lineHeight: 18 },

  breakupTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  breakupLabel: { fontSize: fontSize.sm, fontWeight: '500', color: colors.ink },
  breakupPill: { backgroundColor: colors.band, borderWidth: 1, borderColor: colors.line2, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  breakupPillText: { fontSize: fontSize.xs, fontWeight: '500', color: colors.brandBlue },
  lineRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  lineLabel: { fontSize: fontSize.sm, color: colors.body },
  lineValue: { fontSize: fontSize.sm, fontWeight: '500', color: colors.ink },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 8 },
  newTotalLabel: { fontSize: fontSize.sm, fontWeight: '500', color: colors.ink },
  wasText: { fontWeight: '400', color: colors.body },
  newTotalPrice: { fontFamily: 'Merriweather_700Bold', fontSize: fontSize.lg, color: colors.ink },
  newTotalUnit: { fontFamily: 'Roboto', fontSize: fontSize.sm, fontWeight: '400', color: colors.body },
  confirmBtn: { minHeight: 48, borderRadius: 8, backgroundColor: colors.brandBlue, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  confirmBtnText: { fontSize: fontSize.sm, fontWeight: '500', color: colors.white },
});
