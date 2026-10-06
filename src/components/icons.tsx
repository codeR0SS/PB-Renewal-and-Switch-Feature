import { Defs, Ellipse, LinearGradient, Path, RadialGradient, Rect, Stop, Svg } from 'react-native-svg';

/** Small line/fill icons transcribed from the Design canvas exports (Home, Intro, Loading). */

type IconProps = { size?: number; color?: string };

export function IconClose({ size = 18, color = '#253858' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d="M18 6 6 18M6 6l12 12" />
    </Svg>
  );
}

export function IconBack({ size = 20, color = '#253858' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 12H5M12 19l-7-7 7-7" />
    </Svg>
  );
}

export function IconPhone({ size = 22, color = '#29764C' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  );
}

export function IconPerson({ size = 20, color = '#fff' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 8m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
      <Path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5" />
    </Svg>
  );
}

export function IconBell({ size = 22, color = '#fff' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <Path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
    </Svg>
  );
}

export function IconHeadset({ size = 22, color = '#253858' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 13a9 9 0 0 1 18 0" />
      <Path d="M21 13v4a2 2 0 0 1-2 2h-1" />
      <Rect x="3" y="13" width="4" height="6" rx="1" />
      <Rect x="17" y="13" width="4" height="6" rx="1" />
    </Svg>
  );
}

export function IconClock({ size = 12, color = '#F6C945' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <Path d="M12 7v5l3 2" />
    </Svg>
  );
}

export function IconChevronRight({ size = 18, color = '#fff' }: IconProps) {
  return (
    <Svg width={size} height={size * 12 / 18} viewBox="0 0 18 12" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M1 6h15M11 1l5 5-5 5" />
    </Svg>
  );
}

export function IconShieldCheck({ size = 50, color = '#253858' }: IconProps) {
  return (
    <Svg width={size} height={size * 54 / 50} viewBox="3 1 26 30" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M16 3.5 6 7v8.5c0 6 4.2 10.2 10 13 5.8-2.8 10-7 10-13V7L16 3.5Z" />
      <Path d="M11 15.5l3.5 3.5 6.5-7" stroke="#0065FF" strokeWidth={2.2} />
    </Svg>
  );
}

export function IconDocument({ size = 22, color = '#253858' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 3h9l4 4v14H6z" />
      <Path d="M15 3v4h4M9 12h7M9 16h5" />
    </Svg>
  );
}

export function IconDecide({ size = 22, color = '#253858' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 21v-8" />
      <Path d="M12 13 6 7M12 13l6-6" />
      <Path d="M3 9l3-2-2 3M21 9l-3-2 2 3" />
    </Svg>
  );
}

export function IconCheckSmall({ size = 12, color = '#0065FF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Path d="M2.5 6.4l2.3 2.3 4.7-5" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconCheckThick({ size = 14, color = '#1F8A93', strokeWidth = 3 }: IconProps & { strokeWidth?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

export function IconCheckBold({ size = 12, color = '#29764C' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12.5l4.5 4.5L19 7.5" />
    </Svg>
  );
}

export function IconArrowRight({ size = 16, color = '#0065FF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12h14M12 5l7 7-7 7" />
    </Svg>
  );
}

export function IconCalendar({ size = 18, color = '#0065FF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3.5 5h17v15h-17z" />
      <Path d="M3.5 10h17M8 3v4M16 3v4" />
    </Svg>
  );
}

export function IconThumbsBox({ size = 20, color = '#fff' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M7 10v12" />
      <Path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </Svg>
  );
}

export function IconEnvelope({ size = 16, color = '#0065FF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 5h18v14H3z" />
      <Path d="m3 7 9 6 9-6" />
    </Svg>
  );
}

export function IconUpload({ size = 18, color = '#0065FF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <Path d="M16 6l-4-4-4 4" />
      <Path d="M12 2v13" />
    </Svg>
  );
}

export function IconDownload({ size = 18, color = '#0065FF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <Path d="M7 10l5 5 5-5" />
      <Path d="M12 15V3" />
    </Svg>
  );
}

export function IconCertificate({ size = 16, color = '#0065FF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 9m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" />
      <Path d="M8.5 14 7 22l5-3 5 3-1.5-8" />
      <Path d="M9.5 9l1.8 1.8L14.7 7.4" />
    </Svg>
  );
}

export function IconAlertCircle({ size = 12 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Z" fill="#E37D03" />
      <Path d="M12 7v6M12 16.5v.5" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

export function IconHomeFilled({ size = 22, color = '#fff' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round">
      <Path d="M5 11 12 4l7 7v9H5v-9Z" />
      <Path d="M10 20v-6h4v6" />
    </Svg>
  );
}

// ---- Home category icons (hand-drawn, two-tone) ----

export function IconUmbrellaShield({ size = 30, fill = '#5B3FE0' }: IconProps & { fill?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path d="M5 20C5 11 12 6 20 6s15 5 15 14c-2-2-4-3-6-3s-4 1-5 3c-1-2-3-3-4-3s-3 1-4 3c-1-2-3-3-5-3s-4 1-6 3Z" fill={fill} />
      <Path d="M20 6c-3 3-5 7-5 11 2 0 3 1 5 3 0-4 0-9 0-14Z M20 6c3 3 5 7 5 11-2 0-3 1-5 3Z" fill="#fff" opacity={0.9} />
      <Path d="M20 20v12c0 3-4 3-4 0" fill="none" stroke="#7B7F8A" strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function IconHealthHeart({ size = 34 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path d="M20 35 6 21C2 17 3 9 10 8c4-.5 8 2 10 5 2-3 6-5.5 10-5 7 1 8 9 4 13L20 35Z" fill="#fff" stroke="#E5422B" strokeWidth={3} strokeLinejoin="round" />
      <Path d="M10 21h5l3-6 4 10 3-6h5" fill="none" stroke="#253858" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconInvestmentPlant({ size = 34 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Rect x="19" y="4" width="2.5" height="26" fill="#9AA3B2" />
      <Path d="M20 12c-5 0-8-2-8-7 5 0 8 3 8 7Zm0 0c5 0 8-2 8-7-5 0-8 3-8 7Z" fill="#2FB36D" />
      <Ellipse cx="12" cy="26" rx="8" ry="3.5" fill="#fff" stroke="#1FA35E" strokeWidth={2} />
      <Ellipse cx="12" cy="31" rx="8" ry="3.5" fill="#fff" stroke="#1FA35E" strokeWidth={2} />
      <Ellipse cx="28" cy="22" rx="8" ry="3.5" fill="#fff" stroke="#1FA35E" strokeWidth={2} />
      <Ellipse cx="28" cy="27" rx="8" ry="3.5" fill="#fff" stroke="#1FA35E" strokeWidth={2} />
    </Svg>
  );
}

export function IconTravelPlane({ size = 36 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path d="M4 22c0-2 3-3 6-3l12-1-7-11h4l11 10 7 0c2 0 3 1 3 2s-1 2-3 2l-7 0-9 9h-4l4-9-10 1c-4 0-7-1-7-0Z" fill="#F6C21A" stroke="#9A7A00" strokeWidth={1} strokeLinejoin="round" />
    </Svg>
  );
}

export function IconCar({ size = 36 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path d="M6 24l4-8c1-2 3-3 5-3h9c2 0 4 1 5 3l5 6c2 .5 3 2 3 4v2H6v-4Z" fill="#fff" stroke="#6B7280" strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M6 26h30v4H6z" fill="#5B3FE0" />
      <Path d="M13 31m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0" fill="#3A3F4A" stroke="#fff" strokeWidth={1} />
      <Path d="M29 31m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0" fill="#3A3F4A" stroke="#fff" strokeWidth={1} />
    </Svg>
  );
}

export function IconTwoWheeler({ size = 36 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path d="M24 6h6l-2 14" fill="none" stroke="#6B7280" strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 22c0-4 4-6 8-6h6l3 8h-8c-2 0-3 2-3 4H8v-6Z" fill="#5B3FE0" />
      <Path d="M14 16c0-3 2-5 5-5l3 5Z" fill="#fff" stroke="#6B7280" strokeWidth={1.2} />
      <Path d="M11 32m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" fill="#fff" stroke="#6B7280" strokeWidth={2} />
      <Path d="M31 32m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" fill="#fff" stroke="#6B7280" strokeWidth={2} />
    </Svg>
  );
}

export function IconPersonalLoan({ size = 36 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path d="M4 28l7-3c3-1 6-1 9 0l8 2c2 1 1 3-1 3h-8" fill="#fff" stroke="#6B7280" strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M11 31l9 3 14-8" fill="none" stroke="#6B7280" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Ellipse cx="24" cy="14" rx="8" ry="3.5" fill="#fff" stroke="#1FA35E" strokeWidth={2} />
      <Path d="M16 14v5c0 2 3.5 3.5 8 3.5s8-1.5 8-3.5v-5" fill="#fff" stroke="#1FA35E" strokeWidth={2} />
    </Svg>
  );
}

export function IconSavings({ size = 36 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Rect x="9" y="12" width="22" height="22" rx="4" fill="#fff" stroke="#6B7280" strokeWidth={1.8} />
      <Rect x="11" y="8" width="18" height="5" rx="2" fill="#E5422B" />
      <Ellipse cx="20" cy="8" rx="9" ry="2.5" fill="#fff" stroke="#E5422B" strokeWidth={2} />
      <Ellipse cx="20" cy="26" rx="6" ry="2.5" fill="#fff" stroke="#E5422B" strokeWidth={2} />
    </Svg>
  );
}

/** Home hero gift-box illustration (static; the canvas version floats/twinkles). */
export function GiftBoxIllustration({ size = 120 }: { size?: number }) {
  const h = size * 100 / 120;
  return (
    <Svg width={size} height={h} viewBox="0 0 120 100">
      <Defs>
        <LinearGradient id="shF" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#A592FF" />
          <Stop offset="1" stopColor="#5A3BE0" />
        </LinearGradient>
        <LinearGradient id="arG" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFE48A" />
          <Stop offset="1" stopColor="#F0B21B" />
        </LinearGradient>
        <RadialGradient id="shadow">
          <Stop offset="0" stopColor="#000" stopOpacity={0.35} />
          <Stop offset="1" stopColor="#000" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx="62" cy="96" rx="34" ry="5" fill="url(#shadow)" />
      <Path d="M60 8 L100 20 V50 C100 74 82 90 60 98 C38 90 20 74 20 50 V20 Z" fill="#2A1480" transform="translate(3,3)" />
      <Path d="M60 6 L100 18 V48 C100 72 82 88 60 96 C38 88 20 72 20 48 V18 Z" fill="url(#shF)" />
      <Path d="M60 6 L20 18 V48 C20 72 38 88 60 96 Z" fill="#fff" opacity={0.14} />
      <Path d="M60 6 L100 18 V48 C100 72 82 88 60 96 C38 88 20 72 20 48 V18 Z" fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={1.5} />
      <Path d="M38 48 A22 22 0 0 1 74 37" fill="none" stroke="#B07A00" strokeWidth={7} strokeLinecap="round" transform="translate(0,3)" />
      <Path d="M82 56 A22 22 0 0 1 46 67" fill="none" stroke="#B07A00" strokeWidth={7} strokeLinecap="round" transform="translate(0,3)" />
      <Path d="M79.9 42.5 L70.8 41.1 L79.8 33.3Z" fill="#B07A00" transform="translate(0,3)" />
      <Path d="M40.1 61.5 L49.2 62.9 L40.2 70.7Z" fill="#B07A00" transform="translate(0,3)" />
      <Path d="M38 48 A22 22 0 0 1 74 37" fill="none" stroke="url(#arG)" strokeWidth={7} strokeLinecap="round" />
      <Path d="M82 56 A22 22 0 0 1 46 67" fill="none" stroke="url(#arG)" strokeWidth={7} strokeLinecap="round" />
      <Path d="M79.9 42.5 L70.8 41.1 L79.8 33.3Z" fill="url(#arG)" />
      <Path d="M40.1 61.5 L49.2 62.9 L40.2 70.7Z" fill="url(#arG)" />
      <Path d="M52 52 L58 58 L69 45" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M104 8l1.8 4.2L110 14l-4.2 1.8L104 20l-1.8-4.2L98 14l4.2-1.8Z" fill="#FFE48A" />
      <Path d="M12 30l1.2 2.8L16 34l-2.8 1.2L12 38l-1.2-2.8L8 34l2.8-1.2Z" fill="#fff" />
    </Svg>
  );
}
