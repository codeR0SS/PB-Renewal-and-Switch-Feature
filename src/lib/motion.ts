import { AccessibilityInfo, Platform } from 'react-native';

// react-native-web's AccessibilityInfo.isReduceMotionEnabled() captures `window.matchMedia`
// at module-eval time; under Expo Router's static web output that capture can end up null,
// which makes it permanently resolve `true` regardless of the real OS setting. Read the media
// query directly on web instead of trusting that shim; native platforms are unaffected.
export function checkReduceMotion(): Promise<boolean> {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return Promise.resolve(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  return AccessibilityInfo.isReduceMotionEnabled();
}
