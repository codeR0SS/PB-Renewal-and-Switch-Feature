import { Redirect, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Circle, G, Path, Rect, Svg, Text as SvgText } from 'react-native-svg';
import { DeclarationIssued } from '@/components/DeclarationCard';
import { IconEnvelope } from '@/components/icons';
import { PrimaryButton } from '@/components/PrimaryButton';
import { StickyFooter } from '@/components/StickyFooter';
import { formatRupees } from '@/lib/content';
import { useFlow } from '@/store/flow';
import { colors, fontSize, radius } from '@/theme';

export default function Success() {
  const router = useRouter();
  const receipt = useFlow((s) => s.receipt);
  const startOver = useFlow((s) => s.startOver);

  const done = () => {
    startOver();
    if (router.canDismiss()) router.dismissAll();
    router.replace('/');
  };

  // Payment is complete: Android's back button must not drop the user back into Confirm.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      done();
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // No receipt means no completed payment, so there is nothing to show and no declaration to claim.
  if (!receipt) return <Redirect href="/" />;

  const detail =
    receipt.action === 'switch'
      ? `Switched to ${receipt.planName}${receipt.term === 3 ? ' for 3 years' : ''}.`
      : `Renewed ${receipt.term === 3 ? 'for 3 years' : 'for another year'}.`;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.hero}>
          <SuccessIllustration />
          <Text accessibilityRole="header" style={styles.headline}>Payment successful for {formatRupees(receipt.total)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.kicker}>{receipt.planName}</Text>
          <Text style={styles.detail}>{detail}</Text>
          {receipt.riderIds.length > 0 && (
            <Text style={[styles.detail, { marginTop: 4 }]}>
              {receipt.riderIds.length} rider{receipt.riderIds.length === 1 ? '' : 's'} added.
            </Text>
          )}
        </View>
        <View style={[styles.card, styles.notifyCard]}>
          <View style={styles.notifyIcon}><IconEnvelope /></View>
          <Text style={styles.notifyText}>
            Your policy documents, invoice, and declaration have been sent to your email and WhatsApp.
          </Text>
        </View>

        <DeclarationIssued />
      </ScrollView>
      <StickyFooter>
        <PrimaryButton label="Done" onPress={done} />
      </StickyFooter>
    </SafeAreaView>
  );
}

/** Purely decorative: a tilted receipt card with a rupee mark, plus a green success badge. */
function SuccessIllustration() {
  return (
    <Svg width={240} height={180} viewBox="0 0 240 180">
      <Circle cx={120} cy={90} r={84} fill={colors.band} />
      <Circle cx={120} cy={90} r={62} fill="#fff" fillOpacity={0.7} />
      <G transform="translate(118 84) rotate(7)">
        <Rect x={-62} y={-40} width={124} height={80} rx={12} fill={colors.line2} />
      </G>
      <G transform="translate(112 80) rotate(-8)">
        <Rect x={-62} y={-40} width={124} height={80} rx={12} fill={colors.brandBlue} />
        <Rect x={-46} y={-24} width={24} height={18} rx={4} fill="#fff" fillOpacity={0.92} />
        <Rect x={-46} y={14} width={52} height={4} rx={2} fill="#fff" fillOpacity={0.6} />
        <Rect x={-46} y={24} width={30} height={4} rx={2} fill="#fff" fillOpacity={0.4} />
        <SvgText x={34} y={-6} textAnchor="middle" fontFamily="Roboto" fontSize={26} fontWeight="700" fill="#fff">₹</SvgText>
      </G>
      <Circle cx={158} cy={118} r={36} fill="#C6FFDD" fillOpacity={0.75} />
      <Circle cx={158} cy={118} r={27} fill={colors.green} stroke="#fff" strokeWidth={4} />
      <Path d="M146.5 118.5l8 8 15-16" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M30 46l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill={colors.brandBlue} />
      <Path d="M206 40l2.4 5.6 5.6 2.4-5.6 2.4-2.4 5.6-2.4-5.6-5.6-2.4 5.6-2.4z" fill="#E37D03" />
      <Circle cx={40} cy={134} r={3.5} fill={colors.brandBlue} fillOpacity={0.35} />
      <Circle cx={208} cy={150} r={4} fill={colors.green} fillOpacity={0.5} />
      <Circle cx={190} cy={22} r={3} fill={colors.brandBlue} fillOpacity={0.35} />
      <Circle cx={64} cy={158} r={2.5} fill="#E37D03" fillOpacity={0.6} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  body: { padding: 16, flexGrow: 1, gap: 16 },
  hero: { alignItems: 'center', gap: 8, paddingTop: 8 },
  headline: { fontFamily: 'Merriweather_700Bold', fontSize: fontSize.xl, lineHeight: 30, textAlign: 'center', color: colors.ink },
  card: { borderWidth: 1, borderColor: colors.line2, borderRadius: radius.lg, padding: 16 },
  notifyCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  notifyIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.band, alignItems: 'center', justifyContent: 'center' },
  notifyText: { flex: 1, fontSize: fontSize.sm, color: colors.body, lineHeight: 20 },
  kicker: { fontSize: fontSize.xs, color: colors.body, lineHeight: 16 },
  detail: { fontSize: fontSize.sm, color: colors.ink, fontWeight: '500', marginTop: 4 },
});
