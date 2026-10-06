import { Pressable, type PressableProps } from 'react-native';

/** Opacity feedback applied uniformly to every pressable in the app, incl. PrimaryButton. */
export const PRESS_OPACITY = 0.7;

/**
 * Drop-in replacement for RN's Pressable that always gives visual press feedback.
 * Plain `Pressable` has none by default, which made every secondary tap in the app feel
 * unresponsive next to PrimaryButton (the only place that had its own opacity state).
 */
export function Touchable({ style, ...props }: PressableProps) {
  return (
    <Pressable
      {...props}
      style={(state) => {
        const resolved = typeof style === 'function' ? style(state) : style;
        return [resolved, state.pressed && { opacity: PRESS_OPACITY }];
      }}
    />
  );
}
