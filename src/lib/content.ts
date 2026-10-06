// Exact copy and numbers from renewal-check-flow-upgrades-flat.html.
export const POLICY = {
  insurer: 'STAR Health',
  planName: 'Young Star Silver Plan',
  renewsOn: '30 Sep 2026',
  premium: 6181,
  cover: '₹5 Lakhs',
  insuredShort: 'Binay Sethi',
  insuredFull: 'Binay Kumar Sethi',
} as const;

export const LOADING_STEPS = [
  'Reading your current policy.',
  'Comparing against IRDAI claim-settlement data.',
  'Checking coverage equivalence.',
] as const;

export const formatRupees = (n: number) => '₹' + n.toLocaleString('en-IN');
