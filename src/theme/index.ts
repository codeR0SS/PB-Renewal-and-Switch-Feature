// Tokens extracted from Policybazaar.apk v5.5.4 (design-tokens.json), same values the
// design canvas mockups use. Four type sizes only (CLAUDE.md product rule).
export const colors = {
  ink: '#253858', // text.primary
  body: '#253858CC', // text.primary80
  muted: '#75859E', // text.muted
  line: '#2538580F', // border.hairline — internal dividers
  line2: '#D6E0FF', // brand.primaryBorderTint — emphasis card borders
  band: '#F2F7FF', // background.canvas
  white: '#FFFFFF',
  black: '#000000',
  brandBlue: '#0065FF', // brand.primary
  green: '#29764C', // status.successDeep
  red: '#DD454B', // status.error
  amberText: '#8A4B00', // derived for contrast on warningTint
  amberBg: '#FFFAE0', // status.warningTint
  warningBorder: '#E37D0333', // status.warning at 20% — border on amber-tinted notice boxes
  borderStrong: '#CCCCCC', // border.neutral
  pendingBorder: '#B9C1D9', // step-tracker / radio / checkbox pending state
  pendingLabel: '#8A94A8', // step-tracker / notice label pending state
} as const;

export const fontSize = { xs: 12, sm: 14, lg: 18, xl: 22 } as const;
export const space = { one: 4, two: 8, three: 12, four: 16, five: 24, six: 32, seven: 48 } as const;
export const radius = { md: 8, lg: 16, pill: 100 } as const;
export const MIN_TOUCH = 48;
