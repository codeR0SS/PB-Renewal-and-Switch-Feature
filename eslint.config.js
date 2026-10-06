// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // React Native <Text> has no HTML entity parsing, so unescaped quotes/apostrophes are fine.
    rules: { "react/no-unescaped-entities": "off" },
  }
]);
