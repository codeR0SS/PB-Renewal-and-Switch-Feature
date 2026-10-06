import { StyleSheet, Text } from 'react-native';
import { Touchable } from '@/components/Touchable';
import { colors, fontSize, MIN_TOUCH, radius } from '@/theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'text';
}

// Every primary CTA in the canvas exports is the brand-blue pill — there is no dark/ink variant.
export function PrimaryButton({ label, onPress, variant = 'solid' }: Props) {
  const solid = variant === 'solid';
  return (
    <Touchable accessibilityRole="button" onPress={onPress} style={[styles.base, solid ? styles.solid : styles.text]}>
      <Text style={[styles.label, solid ? styles.solidLabel : styles.textLabel]}>{label}</Text>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md },
  solid: { backgroundColor: colors.brandBlue, paddingVertical: 12 },
  text: { paddingVertical: 8 },
  label: { fontSize: fontSize.sm },
  solidLabel: { color: colors.white, fontWeight: '600', fontSize: fontSize.sm },
  textLabel: { color: colors.brandBlue, fontWeight: '500' },
});
