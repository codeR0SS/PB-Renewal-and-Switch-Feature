import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Spinner } from '@/components/Spinner';
import { Touchable } from '@/components/Touchable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path, Rect, Svg } from 'react-native-svg';
import { IconBack } from '@/components/icons';
import { PrimaryButton } from '@/components/PrimaryButton';
import { StickyFooter } from '@/components/StickyFooter';
import { planToBuy } from '@/lib/checkout';
import { formatRupees } from '@/lib/content';
import { checkoutTotal, ridersTotal, termPrice } from '@/lib/pricing';
import { useFlow, useSelectedAlt } from '@/store/flow';
import { colors, fontSize, MIN_TOUCH, radius } from '@/theme';

type Phase = 'form' | 'processing' | 'error';
const PROCESSING_MS = 1200;

const METHODS = [
  { id: 'upi', name: 'UPI', detail: 'Google Pay, PhonePe, Paytm, BHIM', icon: 'upi' },
  { id: 'card', name: 'Credit / Debit card', detail: 'Visa, Mastercard, RuPay', icon: 'card' },
  { id: 'netbanking', name: 'Netbanking', detail: 'HDFC, SBI, ICICI, Axis and more', icon: 'bank' },
  { id: 'wallet', name: 'Wallets', detail: 'Paytm, PhonePe, Amazon Pay', icon: 'wallet' },
  { id: 'emi', name: 'EMI', detail: 'Credit card and debit card EMI', icon: 'emi' },
] as const;

export default function Payment() {
  const router = useRouter();
  const alt = useSelectedAlt();
  const { action, term, riderIds, confirmedUpgrade, completePayment, setDev } = useFlow();
  const [phase, setPhase] = useState<Phase>('form');
  const [method, setMethod] = useState<(typeof METHODS)[number]['id']>('upi');
  const [upiId, setUpiId] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const plan = planToBuy(action, alt, confirmedUpgrade);
  const base = termPrice(plan.oneYear, term);
  const ridersSum = ridersTotal(riderIds, term);
  const total = checkoutTotal({ oneYear: plan.oneYear, term, riderIds });

  const pay = () => {
    setPhase('processing');
    timer.current = setTimeout(() => {
      if (useFlow.getState().devPaymentFailsNext) {
        setDev({ devPaymentFailsNext: false });
        setPhase('error');
        return;
      }
      // Only now, with payment complete, does a receipt exist and the declaration get issued.
      completePayment({ action, planName: plan.name, term, riderIds, total, issuedOn: new Date().toISOString() });
      router.replace('/success');
    }, PROCESSING_MS);
  };

  if (phase === 'processing') {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.center}>
          <Spinner />
          <Text style={styles.centerText}>Processing your payment.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (phase === 'error') {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.body}>
          <Text accessibilityRole="header" style={styles.title}>Payment</Text>
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>This didn't go through.</Text>
            <Text style={styles.errorText}>Nothing was charged. Try again, or go back {'—'} the verdict you saw is still valid.</Text>
          </View>
          <PrimaryButton label="Try again" onPress={() => setPhase('form')} />
          <PrimaryButton variant="text" label="Go back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Touchable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}>
          <IconBack size={20} />
        </Touchable>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.secure}>
          <MethodIcon icon="lock" />
          <Text style={styles.secureText}>Secure payment</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount to pay</Text>
          <Text style={styles.amountPrice}>
            {formatRupees(total)} <Text style={styles.amountUnit}>{term === 3 ? '/ 3 years' : '/ year'}</Text>
          </Text>
          <View style={styles.divider} />
          <View style={styles.lineRow}>
            <Text style={styles.lineLabel}>{plan.name} · {term === 3 ? '3 years' : '1 year'}</Text>
            <Text style={styles.lineValue}>{formatRupees(base)}</Text>
          </View>
          {riderIds.length > 0 && (
            <View style={[styles.lineRow, { marginTop: 4 }]}>
              <Text style={styles.lineLabel}>{riderIds.length} rider{riderIds.length === 1 ? '' : 's'}</Text>
              <Text style={styles.lineValue}>+{formatRupees(ridersSum)}</Text>
            </View>
          )}
        </View>

        <Text style={styles.methodsLabel}>Choose a payment method</Text>
        <View style={{ gap: 12 }}>
          {METHODS.map((m) => {
            const on = method === m.id;
            return (
              <Touchable
                key={m.id}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                onPress={() => setMethod(m.id)}
                style={[styles.methodRow, on ? styles.methodRowOn : styles.methodRowOff]}>
                <View style={styles.methodTop}>
                  <View style={styles.methodIconBox}><MethodIcon icon={m.icon} /></View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.methodName}>{m.name}</Text>
                    <Text style={styles.methodDetail}>{m.detail}</Text>
                  </View>
                  <View style={[styles.radio, on && styles.radioOn]}>{on && <View style={styles.radioDot} />}</View>
                </View>

                {on && m.id === 'upi' && (
                  <>
                    <View style={styles.orRow}>
                      <View style={styles.orLine} /><Text style={styles.orText}>or</Text><View style={styles.orLine} />
                    </View>
                    <Text style={styles.upiLabel}>Pay with UPI ID</Text>
                    <View style={styles.upiField}>
                      <TextInput
                        value={upiId}
                        onChangeText={setUpiId}
                        placeholder="yourname@bank"
                        placeholderTextColor={colors.muted}
                        autoCapitalize="none"
                        style={styles.upiInput}
                      />
                      <Touchable accessibilityRole="button" style={styles.verifyBtn}>
                        <Text style={styles.verifyText}>Verify</Text>
                      </Touchable>
                    </View>
                  </>
                )}
              </Touchable>
            );
          })}
        </View>

        <Text style={styles.terms}>
          By paying, you agree to the <Text style={styles.termsLink}>Terms</Text> and the declaration shown on the previous screen.
        </Text>
      </ScrollView>

      <StickyFooter>
        <Touchable accessibilityRole="button" onPress={pay} style={styles.payBtn}>
          <MethodIcon icon="lock" color={colors.white} />
          <Text style={styles.payBtnText}>Pay {formatRupees(total)}</Text>
        </Touchable>
      </StickyFooter>
    </SafeAreaView>
  );
}

function MethodIcon({ icon, color = colors.brandBlue }: { icon: string; color?: string }) {
  const common = { fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (icon === 'upi') return <Svg width={20} height={20} viewBox="0 0 24 24" {...common}><Path d="M7 4l5 8-5 8" /><Path d="M13 4l5 8-5 8" /></Svg>;
  if (icon === 'card') return <Svg width={20} height={20} viewBox="0 0 24 24" {...common}><Rect x={3} y={5} width={18} height={14} rx={2.5} /><Path d="M3 10h18M7 15h4" /></Svg>;
  if (icon === 'bank') return <Svg width={20} height={20} viewBox="0 0 24 24" {...common}><Path d="M3 10l9-6 9 6" /><Path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" /></Svg>;
  if (icon === 'wallet') return <Svg width={20} height={20} viewBox="0 0 24 24" {...common}><Path d="M4 7a2 2 0 0 1 2-2h11v4" /><Rect x={4} y={7} width={16} height={12} rx={2.5} /><Path d="M16 13h.01" /></Svg>;
  if (icon === 'emi') return <Svg width={20} height={20} viewBox="0 0 24 24" {...common}><Rect x={3.5} y={5} width={17} height={15} rx={3} /><Path d="M3.5 10h17M8 3v4M16 3v4M9 15h6" /></Svg>;
  return <Svg width={16} height={16} viewBox="0 0 24 24" {...common} stroke={color}><Rect x={5} y={11} width={14} height={9} rx={2} /><Path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.line },
  back: { width: 48, height: 48, marginLeft: -8, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: fontSize.sm, fontWeight: '500', color: colors.ink },
  secure: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  secureText: { fontSize: fontSize.xs, fontWeight: '500', color: colors.green },

  body: { padding: 16, gap: 12, flexGrow: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 16 },
  centerText: { fontSize: fontSize.sm, color: colors.body },
  title: { fontFamily: 'Merriweather_700Bold', fontSize: fontSize.xl, lineHeight: 30, color: colors.ink, marginBottom: 16 },
  errorBox: { borderWidth: 1, borderColor: colors.red + '40', backgroundColor: colors.red + '1A', borderRadius: radius.md, padding: 16, marginBottom: 24 },
  errorTitle: { fontSize: fontSize.sm, fontWeight: '600', color: colors.red, marginBottom: 4 },
  errorText: { fontSize: fontSize.xs, color: colors.red, lineHeight: 18 },

  amountCard: { backgroundColor: colors.band, borderWidth: 1, borderColor: colors.line2, borderRadius: radius.lg, padding: 16 },
  amountLabel: { fontSize: fontSize.xs, color: colors.body },
  amountPrice: { fontFamily: 'Merriweather_700Bold', fontSize: fontSize.xl, color: colors.ink, marginTop: 2 },
  amountUnit: { fontFamily: 'Roboto', fontSize: fontSize.sm, fontWeight: '400', color: colors.body },
  divider: { height: 1, backgroundColor: colors.line2, marginVertical: 12 },
  lineRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  lineLabel: { fontSize: fontSize.sm, color: colors.body, flexShrink: 1 },
  lineValue: { fontSize: fontSize.sm, fontWeight: '500', color: colors.ink },

  methodsLabel: { fontSize: fontSize.lg, fontWeight: '500', color: colors.ink, marginTop: 4 },
  methodRow: { borderRadius: radius.lg, padding: 12 },
  methodRowOn: { borderWidth: 1.5, borderColor: colors.brandBlue, backgroundColor: colors.band, padding: 11.5, paddingTop: 14 },
  methodRowOff: { borderWidth: 1, borderColor: colors.line2, backgroundColor: colors.white },
  methodTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  methodIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line2, alignItems: 'center', justifyContent: 'center' },
  methodName: { fontSize: fontSize.sm, fontWeight: '500', color: colors.ink },
  methodDetail: { fontSize: fontSize.xs, color: colors.body, marginTop: 1 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.pendingBorder, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.brandBlue },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.brandBlue },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14, marginBottom: 10 },
  orLine: { flex: 1, height: 1, backgroundColor: colors.line2 },
  orText: { fontSize: fontSize.xs, color: colors.body },
  upiLabel: { fontSize: fontSize.xs, fontWeight: '500', color: colors.body, marginBottom: 6 },
  upiField: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.pendingBorder, borderRadius: 8, height: 48, paddingLeft: 12, paddingRight: 4 },
  upiInput: { flex: 1, fontSize: fontSize.sm, color: colors.ink },
  verifyBtn: { minHeight: 44, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  verifyText: { fontSize: fontSize.sm, fontWeight: '500', color: colors.brandBlue },

  terms: { fontSize: fontSize.xs, color: colors.body, textAlign: 'center', lineHeight: 18, marginTop: 12 },
  termsLink: { color: colors.brandBlue, fontWeight: '500' },
  payBtn: { flexDirection: 'row', gap: 8, minHeight: MIN_TOUCH, borderRadius: radius.md, backgroundColor: colors.brandBlue, alignItems: 'center', justifyContent: 'center' },
  payBtnText: { fontSize: fontSize.sm, fontWeight: '500', color: colors.white },
});
