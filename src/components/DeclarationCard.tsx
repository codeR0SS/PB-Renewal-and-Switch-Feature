import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Touchable } from '@/components/Touchable';
import { IconCertificate, IconCheckBold, IconDownload, IconUpload } from '@/components/icons';
import { DECLARATION_ISSUER, DECLARATION_REF, formatDate } from '@/lib/checkout';
import { colors, fontSize, MIN_TOUCH, radius } from '@/theme';

const mono = Platform.select({ ios: 'Menlo', default: 'monospace' });

/**
 * Shown on Carryover. A PREVIEW: nothing has been issued or saved yet. The reference is only reserved.
 * It becomes a real record on the Success screen, after payment completes (see DeclarationIssued).
 */
export function DeclarationPreview() {
  return (
    <View style={styles.previewCard}>
      <View style={styles.previewHead}>
        <View style={styles.previewBadge}>
          <IconCertificate />
        </View>
        <Text style={styles.previewHeadText}>DECLARATION PREVIEW {'—'} NOT YET ISSUED</Text>
      </View>
      <Text style={styles.previewBody}>
        Once your payment is confirmed, PolicyBazaar will issue a declaration recording the carryover terms shown on this screen, as of{' '}
        <Text style={styles.strong}>{formatDate(new Date())}</Text>.
      </Text>
      <View style={styles.stub}>
        <View style={[styles.notch, { left: -1, borderLeftWidth: 0, borderTopRightRadius: 8, borderBottomRightRadius: 8 }]} />
        <View style={styles.dashedLine} />
        <View style={[styles.notch, { right: -1, borderRightWidth: 0, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }]} />
      </View>
      <View style={styles.refRow}>
        <View>
          <Text style={styles.label}>Reference (reserved)</Text>
          <Text style={styles.ref}>{DECLARATION_REF}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.label}>Will be issued by</Text>
          <Text style={[styles.issuer, { textAlign: 'right' }]}>{DECLARATION_ISSUER}</Text>
        </View>
      </View>
      <Text style={styles.previewDisclaimer}>
        This will be a record of what PolicyBazaar communicated, not a guarantee. Under IRDAI's portability rules, the new insurer can still accept or reject carryover terms within 15 days of review. You'll be able to view or share it from the Renewal Check history in your PolicyBazaar account once it's issued.
      </Text>
    </View>
  );
}

/** Shown on Success only, once payment has actually completed and a receipt exists. */
export function DeclarationIssued() {
  const [note, setNote] = useState(false);
  return (
    <View style={styles.issuedCard}>
      <View style={styles.issuedHead}>
        <View style={styles.issuedBadge}><IconCheckBold size={12} color={colors.white} /></View>
        <Text style={styles.issuedHeadText}>DECLARATION SAVED</Text>
      </View>
      <Text style={styles.issuedBody}>
        The carryover terms you saw are now on record {'—'} Ref{' '}
        <Text style={styles.refChip}>{DECLARATION_REF.replace('-', '‑')}</Text>, kept under{' '}
        <Text style={styles.strong}>Policies {'→'} Renewal History</Text>.
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Touchable accessibilityRole="button" onPress={() => setNote(true)} style={styles.outlineAction}>
          <IconUpload />
          <Text style={styles.outlineActionText}>Share</Text>
        </Touchable>
        <Touchable accessibilityRole="button" onPress={() => setNote(true)} style={styles.outlineAction}>
          <IconDownload />
          <Text style={styles.outlineActionText}>Download</Text>
        </Touchable>
      </View>
      {note && (
        <Text style={styles.noteText}>
          Not wired up in this prototype {'—'} a real build would generate a PDF or shareable link here.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  strong: { fontWeight: '500', color: colors.ink },
  noteText: { fontSize: fontSize.xs, color: colors.muted, textAlign: 'center', marginTop: 12 },

  // DeclarationIssued (Success screen).
  issuedCard: { borderWidth: 1, borderColor: colors.line2, borderRadius: radius.lg, padding: 16, backgroundColor: colors.band },
  issuedHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  issuedBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  issuedHeadText: { fontSize: fontSize.xs, fontWeight: '500', color: colors.green, letterSpacing: 0.4 },
  issuedBody: { fontSize: fontSize.sm, color: colors.body, lineHeight: 20, marginBottom: 16 },
  refChip: { fontFamily: mono, fontSize: fontSize.xs, fontWeight: '500', color: colors.ink, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line2, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1 },
  outlineAction: { flex: 1, flexDirection: 'row', gap: 8, minHeight: MIN_TOUCH, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.brandBlue, backgroundColor: colors.white, borderRadius: 8 },
  outlineActionText: { fontSize: fontSize.sm, fontWeight: '500', color: colors.brandBlue },

  // DeclarationPreview (Carryover screen).
  previewCard: { borderWidth: 1, borderColor: colors.line2, borderRadius: radius.lg, backgroundColor: colors.white, overflow: 'hidden' },
  previewHead: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.band, borderBottomWidth: 1, borderBottomColor: colors.line2 },
  previewBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line2, alignItems: 'center', justifyContent: 'center' },
  previewHeadText: { flex: 1, fontSize: fontSize.xs, fontWeight: '700', color: colors.brandBlue, letterSpacing: 0.4 },
  previewBody: { fontSize: fontSize.sm, color: colors.ink, lineHeight: 22, paddingHorizontal: 16, paddingTop: 16 },
  stub: { flexDirection: 'row', alignItems: 'center', height: 16, marginVertical: 16 },
  notch: { position: 'absolute', top: 0, width: 9, height: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line2 },
  dashedLine: { flex: 1, borderTopWidth: 1.5, borderStyle: 'dashed', borderTopColor: colors.line2, marginHorizontal: 16 },
  refRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16 },
  label: { fontSize: fontSize.xs, color: colors.body },
  ref: { fontSize: fontSize.sm, fontWeight: '500', color: colors.ink, fontFamily: mono, marginTop: 2, letterSpacing: 0.4 },
  issuer: { fontSize: fontSize.xs, fontWeight: '500', color: colors.ink, marginTop: 2 },
  previewDisclaimer: { fontSize: fontSize.xs, color: colors.body, lineHeight: 18, marginTop: 16, paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 14, borderTopWidth: 1, borderTopColor: colors.line },
});
