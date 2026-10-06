import { StyleSheet, Text, View } from 'react-native';
import { Touchable } from '@/components/Touchable';
import { IconBack, IconPhone, IconRenewalMark } from '@/components/icons';
import { colors, fontSize } from '@/theme';

export function ScreenHeader({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Touchable accessibilityLabel="Go back" onPress={onBack} style={styles.touch}>
          <IconBack size={20} color={colors.ink} />
        </Touchable>
        <View style={styles.logo}>
          <IconRenewalMark />
        </View>
        <Text style={styles.title}>Renewal Check</Text>
      </View>
      <View accessibilityLabel="Call PolicyBazaar" style={styles.call}>
        <IconPhone size={16} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  touch: { width: 48, height: 48, marginLeft: -8, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.brandBlue, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: fontSize.sm, fontWeight: '500', color: colors.ink },
  call: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.band },
});
