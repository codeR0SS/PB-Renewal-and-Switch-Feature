import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Touchable } from '@/components/Touchable';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  GiftBoxIllustration, IconBell, IconCar, IconChevronRight, IconClock, IconHeadset, IconHomeFilled,
  IconInvestmentPlant, IconPersonalLoan, IconPerson, IconSavings, IconTravelPlane, IconTwoWheeler,
  IconUmbrellaShield, IconHealthHeart,
} from '@/components/icons';
import { POLICY } from '@/lib/content';
import { useFlow } from '@/store/flow';
import { colors, fontSize, radius } from '@/theme';

const HERO = ['#280C3B', '#5B1A52', '#8E2A68'] as const;
const GOLD = '#F6C945';

const CATEGORIES = [
  { label: 'Term Life\nInsurance', icon: <IconUmbrellaShield fill="#FF8A1F" /> },
  { label: 'Health\nInsurance', icon: <IconHealthHeart /> },
  { label: 'Investment\nPlans', icon: <IconInvestmentPlant /> },
  { label: 'Travel\nInsurance', icon: <IconTravelPlane /> },
  { label: 'Car\nInsurance', icon: <IconCar /> },
  { label: 'Two Wheeler\nInsurance', icon: <IconTwoWheeler /> },
  { label: 'Personal\nLoan', icon: <IconPersonalLoan /> },
  { label: 'Savings\nPlans', icon: <IconSavings /> },
] as const;

// Faithful port of the final Home design from the design canvas (dark promo hero + category grid).
export default function Home() {
  const router = useRouter();
  const timing = useFlow((s) => s.homeTiming);
  const today = timing === 'today';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 92 }}>
        <LinearGradient colors={HERO} start={{ x: 0.15, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.hero}>
          <Bunting />
          <View style={styles.heroTop}>
            <View style={styles.heroTopLeft}>
              <Touchable
                accessibilityLabel="Profile"
                onLongPress={__DEV__ ? () => router.push('/dev') : undefined}
                style={styles.avatar}>
                <IconPerson size={20} />
              </Touchable>
              <View>
                <Text style={styles.name}>{POLICY.insuredShort}</Text>
                <Text style={styles.welcome}>Welcome back.</Text>
              </View>
            </View>
            <View style={styles.heroTopRight}>
              <Touchable accessibilityLabel="Notifications" style={styles.iconBtn}>
                <IconBell />
              </Touchable>
              <Touchable accessibilityRole="button" style={styles.helpBtn}>
                <IconHeadset size={18} color={colors.ink} />
                <Text style={styles.helpText}>Help Center</Text>
              </Touchable>
            </View>
          </View>

          <View style={styles.heroCenter}>
            <View style={[styles.promoChip, today && styles.promoChipToday]}>
              <View style={[styles.promoChipInner, today && styles.promoChipInnerToday]}>
                <IconClock color={today ? colors.white : GOLD} />
                <Text style={[styles.promoChipInnerText, today && { color: colors.white }]}>
                  {today ? 'Expires today' : '52 days left'}
                </Text>
              </View>
              <Text style={styles.promoChipText}>GST Bachat Utsav*</Text>
            </View>
            <Text style={styles.heroEyebrow}>Best time to buy</Text>
            <Text style={styles.heroHeadline}>Health Insurance is now</Text>
            <GiftBoxIllustration />
            <Touchable accessibilityRole="button" onPress={() => router.push('/renewal-check')} style={styles.cta}>
              <Text style={styles.ctaText}>Change & Renew</Text>
            </Touchable>
            <Text style={styles.heroFine}>*T&Cs apply.</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.promoCard}>
            <View style={styles.promoCardIcon}>
              <IconUmbrellaShield fill="#5B3FE0" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.promoCardKicker}>Term Life Insurance</Text>
              <Text style={styles.promoCardTitle}>
                <Text style={{ fontWeight: '700' }}>Get ₹1 crore life cover</Text>{'\n'}starting @ ₹400/month*
              </Text>
            </View>
            <Touchable accessibilityLabel="View Term Life Insurance" style={styles.promoCardArrow}>
              <IconChevronRight />
            </Touchable>
          </View>

          <View style={styles.grid}>
            {CATEGORIES.map((c) => (
              <View key={c.label} style={styles.category}>
                <View style={styles.categoryIcon}>{c.icon}</View>
                <Text style={styles.categoryLabel}>{c.label}</Text>
              </View>
            ))}
          </View>

          {__DEV__ && (
            <Touchable accessibilityRole="button" onPress={() => router.push('/dev')} style={styles.devLink}>
              <Text style={styles.devLinkText}>Prototype controls (dev only)</Text>
            </Touchable>
          )}
        </View>
      </ScrollView>

      <View style={styles.tabBar}>
        <View style={styles.tabActive}><IconHomeFilled size={22} /></View>
        <Text style={styles.tabLabel}>Claims</Text>
        <Text style={styles.tabLabel}>Policies</Text>
        <Text style={styles.tabLabel}>Benefits</Text>
      </View>
    </SafeAreaView>
  );
}

function Bunting() {
  const dots = Array.from({ length: 14 }, (_, i) => ({
    cx: 18 + i * 28,
    cy: i % 2 ? 18 : 6,
    color: i % 3 === 0 ? GOLD : i % 3 === 1 ? '#fff' : '#F2A6CE',
  }));
  return (
    <View style={styles.bunting} pointerEvents="none">
      {dots.map((d, i) => (
        <View key={i} style={[styles.buntingDot, { left: d.cx - 3, top: d.cy - 3, backgroundColor: d.color }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  hero: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 26, position: 'relative', overflow: 'hidden' },
  bunting: { position: 'absolute', top: 0, left: 0, right: 0, height: 28 },
  buntingDot: { position: 'absolute', width: 6, height: 6, borderRadius: 3, opacity: 0.55 },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingTop: 6 },
  heroTopLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: fontSize.sm, fontWeight: '600', color: colors.white },
  welcome: { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.75)' },
  heroTopRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  helpBtn: { minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, borderRadius: 18, backgroundColor: colors.white },
  helpText: { fontSize: fontSize.xs, fontWeight: '600', color: colors.ink },
  heroCenter: { alignItems: 'center' },
  promoChip: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.pill, backgroundColor: GOLD, padding: 3, marginBottom: 14 },
  promoChipToday: { backgroundColor: colors.red + '33' },
  promoChipInner: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingLeft: 8, paddingRight: 10, borderRadius: radius.pill, backgroundColor: HERO[0] },
  promoChipInnerToday: { backgroundColor: colors.red },
  promoChipInnerText: { fontSize: fontSize.xs, fontWeight: '700', color: GOLD },
  promoChipText: { fontSize: fontSize.xs, fontWeight: '700', color: '#6B3A00', paddingHorizontal: 10 },
  heroEyebrow: { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.88)', marginBottom: 2 },
  heroHeadline: { fontSize: fontSize.xl, fontWeight: '700', color: colors.white, marginBottom: 4 },
  cta: { minHeight: 48, width: '100%', borderRadius: radius.md, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  ctaText: { fontSize: fontSize.lg, fontWeight: '500', color: colors.ink },
  heroFine: { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.55)', marginTop: 10 },
  content: { padding: 16, gap: 20 },
  promoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: '#CFC4FF', borderBottomWidth: 4, borderRadius: radius.lg, padding: 14, backgroundColor: colors.white },
  promoCardIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FAF9FF', borderWidth: 1, borderColor: '#EFEBFF', alignItems: 'center', justifyContent: 'center' },
  promoCardKicker: { fontSize: fontSize.xs, fontWeight: '500', color: '#8B6CFF', marginBottom: 4 },
  promoCardTitle: { fontSize: fontSize.sm, color: colors.ink, lineHeight: 20 },
  promoCardArrow: { width: 40, height: 26, borderRadius: 13, backgroundColor: '#7B61FF', alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 16 },
  category: { width: '25%', alignItems: 'center', gap: 8 },
  categoryIcon: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.band, alignItems: 'center', justifyContent: 'center' },
  categoryLabel: { fontSize: fontSize.xs, color: colors.ink, textAlign: 'center' },
  devLink: { minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, backgroundColor: colors.amberBg },
  devLinkText: { fontSize: fontSize.xs, fontWeight: '600', color: colors.amberText },
  tabBar: { position: 'absolute', left: 16, right: 16, bottom: 16, height: 56, borderRadius: 18, backgroundColor: '#111114', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 8 },
  tabActive: { width: 36, height: 36, borderRadius: 10, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.85)', alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: fontSize.sm, color: colors.pendingLabel },
});
