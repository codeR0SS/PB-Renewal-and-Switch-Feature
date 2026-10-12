import { Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme';

interface Props {
  children: React.ReactNode;
  /** Optional style override, e.g. an animated opacity so the whole footer (background,
   * border and content together) fades in rather than reserving space unconditionally. */
  style?: Animated.WithAnimatedValue<{ opacity?: number | Animated.AnimatedInterpolation<number> }>;
  /** When true, floats over content instead of reserving its own flex space — for screens
   * (like a full-bleed splash) where the footer must not claim screen height until revealed. */
  overlay?: boolean;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
}

/** Action area pinned to the bottom of a screen, outside the scrolling content. */
export function StickyFooter({ children, style, overlay, pointerEvents }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Animated.View
      pointerEvents={pointerEvents}
      style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }, overlay && styles.overlay, style]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  footer: { paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.white, gap: 4 },
  overlay: { position: 'absolute', left: 0, right: 0, bottom: 0 },
});
