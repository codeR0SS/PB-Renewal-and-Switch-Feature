// Stand-in for the real backend check. Each loading step should advance when its real
// call completes; until a backend exists this is paced on a fixed clock (see LOG.md).
export const STEP_MS = 1500;
export const TIMEOUT_MS = 6000;
