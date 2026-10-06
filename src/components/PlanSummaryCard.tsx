import { StyleSheet, Text, View } from 'react-native';
import { IconAlertCircle, IconCalendar } from '@/components/icons';
import { formatRupees, POLICY } from '@/lib/content';
import { colors, fontSize, radius } from '@/theme';

/** The "current plan" facts every Renewal Check result ends on, regardless of outcome. */
export function PlanSummaryCard({ urgent }: { urgent: boolean }) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={{ minWidth: 0, flex: 1 }}>
          <Text style={styles.label}>Current plan</Text>
          <Text style={styles.planName}>{POLICY.planName}</Text>
        </View>
        <View style={[styles.pill, urgent && styles.pillUrgent]}>
          {urgent && <IconAlertCircle />}
          <Text style={[styles.pillText, urgent && styles.pillTextUrgent]}>{urgent ? '3 days left' : '52 days left'}</Text>
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.bottomLeft}>
          <View style={styles.calIcon}>
            <IconCalendar size={18} />
          </View>
          <View>
            <Text style={styles.label}>Renews on</Text>
            <Text style={styles.renewsOn}>{POLICY.renewsOn}</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.label}>Premium</Text>
          <Text style={styles.premium}>
            {formatRupees(POLICY.premium)}<Text style={styles.premiumUnit}> / year</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line2, borderRadius: radius.lg, padding: 16, marginBottom: 12 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  label: { fontSize: fontSize.xs, fontWeight: '500', color: colors.body },
  planName: { fontSize: fontSize.sm, fontWeight: '700', color: colors.ink },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.band, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  pillUrgent: { backgroundColor: colors.amberBg, paddingLeft: 8 },
  pillText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.brandBlue },
  pillTextUrgent: { color: colors.ink },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.line },
  bottomLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  calIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.band, alignItems: 'center', justifyContent: 'center' },
  renewsOn: { fontFamily: 'Merriweather_700Bold', fontSize: fontSize.lg, color: colors.ink },
  premium: { fontSize: fontSize.lg, fontWeight: '700', color: colors.ink },
  premiumUnit: { fontSize: fontSize.xs, fontWeight: '400', color: colors.body },
});
