import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { colors } from '@/theme';

/**
 * The one loading indicator the app uses — a brand-blue ring, matching the Loading canvas export.
 * Never the platform ActivityIndicator: that renders differently per OS and isn't on-brand.
 */
export function Spinner({ size = 32 }: { size?: number }) {
  const [spin] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View
      accessibilityLabel="Loading"
      style={[styles.spinner, { width: size, height: size, borderRadius: size / 2 }, { transform: [{ rotate }] }]}
    />
  );
}

const styles = StyleSheet.create({
  spinner: { borderWidth: 3, borderColor: colors.line2, borderTopColor: colors.brandBlue },
});
