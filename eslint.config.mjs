import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const forbiddenPackages = [
  { name: "framer-motion", message: "No motion package; see docs/decisions/0011 and 0014." },
  { name: "motion", message: "No motion package; see docs/decisions/0011 and 0014." },
  { name: "gsap", message: "No animation library; see docs/decisions/0014." },
  { name: "lenis", message: "Native scrolling only; see docs/decisions/0008." },
  { name: "aos", message: "No scroll entrance animations." },
  { name: "locomotive-scroll", message: "Native scrolling only." },
  { name: "axios", message: "Use fetch with AbortSignal.timeout." },
  { name: "lodash", message: "Write the helper; see spec section 0." },
  { name: "moment", message: "Use Intl and src/lib/dates.ts." },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
    "docs/prototype/**",
    "src/server/db/migrations/**",
  ]),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "no-restricted-imports": [
        "error",
        {
          paths: forbiddenPackages,
          patterns: [
            { group: ["../../*"], message: "Use the @/ alias instead of climbing directories." },
            {
              group: ["motion/*", "gsap/*", "@gsap/*"],
              message: "No animation library; see docs/decisions/0014.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-console": "error",
      "no-restricted-properties": [
        "error",
        { object: "process", property: "env", message: "Read configuration from @/config/env." },
      ],
    },
  },
  {
    files: ["src/config/env.ts", "src/config/public-env.ts"],
    rules: { "no-restricted-properties": "off" },
  },
  {
    files: ["src/lib/logger.ts"],
    rules: { "no-console": "off" },
  },
  {
    files: ["src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: forbiddenPackages,
          patterns: [
            { group: ["../../*"], message: "Use the @/ alias instead of climbing directories." },
            {
              group: ["motion/*", "gsap/*", "@gsap/*"],
              message: "No animation library; see docs/decisions/0014.",
            },
            { group: ["@/server/*", "@/server"], message: "Components never import server code." },
            {
              group: ["@/features/*/repository"],
              message: "Components never import repositories.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
