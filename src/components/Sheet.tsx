import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme';

interface Props {
  children: React.ReactNode;
  /** Pinned above the content and never scrolls. Implies a tall, scrollable sheet. */
  header?: React.ReactNode;
  /** Pinned below the content and never scrolls (e.g. a price breakup + CTA). Implies a tall sheet. */
  footer?: React.ReactNode;
}

/**
 * Shared bottom sheet. The evidence, marketplace, upgrade-comparison and rider sheets all reuse this,
 * so open/close, backdrop and handle behave identically. Control it through the ref:
 * `ref.current?.present()` / `ref.current?.dismiss()`.
 * Without `header`/`footer` it sizes to its content; with either it opens to 82% and scrolls the body.
 */
export const Sheet = forwardRef<BottomSheetModal, Props>(function Sheet({ children, header, footer }, ref) {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 16) + 4;
  const backdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.4} pressBehavior="close" />
    ),
    [],
  );
  const tall = header !== undefined || footer !== undefined;
  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing={!tall}
      snapPoints={tall ? ['82%'] : undefined}
      backdropComponent={backdrop}
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.bg}>
      {tall ? (
        <>
          {header && <View style={styles.header}>{header}</View>}
          <BottomSheetScrollView contentContainerStyle={{ padding: 20, paddingTop: 16, paddingBottom: footer ? 16 : bottom }}>
            {children}
          </BottomSheetScrollView>
          {footer && <View style={[styles.footer, { paddingBottom: bottom }]}>{footer}</View>}
        </>
      ) : (
        <BottomSheetView style={{ paddingHorizontal: 20, paddingBottom: bottom }}>{children}</BottomSheetView>
      )}
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  bg: { backgroundColor: colors.white, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  handle: { backgroundColor: colors.borderStrong, width: 40 },
  header: { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.band },
  footer: { paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line },
});
